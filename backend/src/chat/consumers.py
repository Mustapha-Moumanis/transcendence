from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer
from time import gmtime, strftime
from django.conf import settings
import jwt
import json
from .consumersUtils import (
    parseEvents,
    checkFriend,
    save_message,
    updateStatus,
    updateHomeUsers,
    getFriendsRooms,
    getUsername,
    getGamenotification,
    addBlockUser,
    ConfirmDeletReq,
)

async def checkToken(self):
    token = self.scope['cookies'].get('my-token')
    if not token:
        raise DenyConnection("No token provided")
    
    decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

    username = await getUsername(decoded_token.get('user_id'))
    expected_username = str(self.scope['url_route']['kwargs']['channel_name'])
    if username != expected_username:
        raise DenyConnection("Usernames do not match")
    return username

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        try:
            # check token from cookies
            username = await checkToken(self)
          
            self.roomUser = username
            await self.channel_layer.group_add(self.roomUser, self.channel_name)
            await self.accept()

            # Update status and notify friends
            rooms = await getFriendsRooms(username)
            status = await updateStatus(username, "Online")
            home = await updateHomeUsers(username)

            for room in rooms:
                await self.channel_layer.group_send(room, {
                    'data': status,
                    'user': username,
                    'type': 'update_userlist_status',
                })
                await self.channel_layer.group_send(room, {
                    'data': home,
                    'user': username,
                    'type': 'updateHomeUsers',
                })

        except Exception as e:
            print(f"WebSocket error: {e}")
            await self.close()

    async def disconnect(self , close_code):
        try :
            username = await checkToken(self)
            # Send to Friends :
            rooms = await getFriendsRooms(username)
            status = await updateStatus(username, "Offline")
            home = await updateHomeUsers(username)
            for room in rooms:
                await self.channel_layer.group_send(room,{
                    'data' : status,
                    'user': username,
                    'type': 'update_userlist_status',
                })
                await self.channel_layer.group_send(room,{
                    'data' : home,
                    'user': username,
                    'type': 'updateHomeUsers',
                })
            
            await self.channel_layer.group_discard(username,self.channel_name)

        except Exception as e:
            print(f"WebSocket error: {e}")
            await self.close()

    # ------------------ Receive events :
    async def receive(self, text_data):
        try :
            data_json = json.loads(text_data)
            username = await checkToken(self)

            if data_json["type"] == "addFrindship" or data_json["type"] == "blockUser":
                room = data_json["sendto"]
                eventType, notificationlist = await addBlockUser(username, room, data_json["type"])
                await self.channel_layer.group_send(room,{
                    'user': username,
                    'data': notificationlist,
                    'type': eventType,
                })
            elif data_json["type"] == "reqConfirm" or data_json["type"] == "reqDelete":
                room = data_json["sendto"]
                notificationlist = await ConfirmDeletReq(username, room, data_json["type"])
                await self.channel_layer.group_send(room,{
                    'user': username,
                    'list': notificationlist,
                    'type': data_json["type"],
                })
            else :
                if not await checkFriend(data_json["sendto"]):
                    raise DenyConnection("NO Friend matching")

                if data_json["type"] == "message":
                    room = data_json["sendto"]
                    message = await save_message(username, data_json["message"], room)

                    time = strftime("%Y-%m-%d %H:%M", gmtime())
                    await self.channel_layer.group_send(room,{
                        'data' : data_json,
                        'user': username,
                        'time' : time,
                        'message' : message,
                        'type': 'private_message',
                    })
                    await self.send(text_data=json.dumps({
                        "type" : "private_message_sendIt",
                        'user': username,
                        "message" : message,
                        "username" : username,
                        'time' : time,
                        "sendto" : room,
                    }))
                elif data_json["type"] == "startTyping" or data_json["type"] == "stopTyping":
                    room = data_json["sendto"]
                    await self.channel_layer.group_send(room,{
                        'data' : data_json,
                        'user': username,
                        'type': 'typingEvent',
                    })
                else :
                    await self.send(text_data=json.dumps(await parseEvents(data_json, username)))

        except Exception as e:
            print(f"WebSocket error: {e}")
            await self.send(text_data=json.dumps({
                "type" : "Error",
                "error": str(e),
            }))


    async def private_message(self , event):
        data = event["data"]
        send = {
            "message" : event["message"],
            "username" : event["user"],
            "sendto" : data["sendto"],
            'time' : event['time'],
            "type" : "private_message_received",
        }
        await self.send(text_data=json.dumps(send))

    async def update_userlist_status(self , event):
        data = event["data"]
        send = {
            "username" : event["user"],
            "status" : data["status"],
            "type" : "update_userlist_status",
        }
        await self.send(text_data=json.dumps(send))

    async def updateHomeUsers(self , event):
        data = event["data"]
        send = {
            "username" : event["user"],
            "status" : data["status"],
            "listuser" : data,
            "type" : "updateHomeUsers",
        }
        await self.send(text_data=json.dumps(send))
    
    async def typingEvent(self, event):
        data = event["data"]
        send = {
            "username" : event["user"],
            "type" :data["type"],
        }
        await self.send(text_data=json.dumps(send))

    async def Blocked(self, event):
        await self.send(text_data=json.dumps({
            "username" : event["user"],
            "type" : event["type"],
        }))

    async def friendRequest(self, event):
        await self.send(text_data=json.dumps({
            "notificationlist" : event["data"],
            "type" : event["type"],
        }))

    async def reqConfirm(self, event):
        await self.send(text_data=json.dumps({
            "listFriends": event["list"],
            "type" : event["type"],
        }))

    async def reqDelete(self, event):
        await self.send(text_data=json.dumps({
            "username" : event["user"],
            "type" : event["type"],
        }))