from .models import Message, ChatRoom
from friends.models import Friend, BlockedUser
from users.models import User
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.utils.dateformat import DateFormat
from django.core.paginator import Paginator

def getTheLastMessage(user, send):
    send_room = ChatRoom.objects.get(name="room_{}".format(send))
    user_room = ChatRoom.objects.get(name="room_{}".format(user))

    lastMessage = Message.objects.filter(user__in=[user, send], chat_room__in=[send_room, user_room]).last()
    notifications = Message.objects.filter(user=send, chat_room=user_room, seen=False).count()

    if lastMessage:
        time = DateFormat((lastMessage.timestamp)).format('Y-m-d H:i:s')
    else : time = 0

    return lastMessage, time, notifications

def showUsers(user, Friends):

    listUsers = []
    listFriends = []
    for userprofile in Friends:
        # ------> listFriends :
        listFriends.append({"id": userprofile.id, "username": userprofile.username, "avatar": str(userprofile.avatar), "status": userprofile.status})

        message, timesort, notf = getTheLastMessage(user, userprofile)
        if message :
            listUsers.append({
                "id" : userprofile.id,
                "username" : userprofile.username,
                "status" : userprofile.status,
                "avatar":  str(userprofile.avatar),
                "lastMessage": message.content,
                "notifications": notf,
                "timesort": timesort,
            })

    sorted_data = sorted(listUsers, key=lambda x: (x['timesort']), reverse=True)

    return ({"type":"showUsersFriend", "showUsers": {"listUsers" : sorted_data}, "showFriends": {"listFriends" : listFriends}})

def update_seen_message(user, sendto):
    user_room = ChatRoom.objects.get(name="room_{}".format(user.username))
    you = Message.objects.filter(user=sendto, chat_room=user_room)
    for message in you:
        message.seen = True
        message.save()

def loadMoreContent(user, sendto, scrollnb):
    send_room = ChatRoom.objects.get(name="room_{}".format(sendto.username))
    user_room = ChatRoom.objects.get(name="room_{}".format(user.username))

    allMessages = Message.objects.filter(user__in=[user, sendto], chat_room__in=[send_room, user_room]).order_by('-timestamp')

    p = Paginator(allMessages, 15)
    page = p.page(scrollnb + 1)
    Messages = page.object_list

    if page.has_next():
        scrollDisplay = True
    else:
        scrollDisplay = False
    messages_data = [{'id': m.user.id,'username': m.user.username,'message': m.content,'time': DateFormat(m.timestamp).format('Y-m-d H:i')} for m in Messages]

    return {"type" : "loadMoreContent", "avatar" : str(sendto.avatar), "sendto" : sendto.username,'messages' : messages_data, 'scrollDisplay':scrollDisplay}

def get_data(user, sendto):

    send_room = ChatRoom.objects.get(name="room_{}".format(sendto.username))
    user_room = ChatRoom.objects.get(name="room_{}".format(user.username))

    allMessages = Message.objects.filter(user__in=[user, sendto], chat_room__in=[send_room, user_room]).order_by('-timestamp')

    p = Paginator(allMessages, 15)
    page = p.page(1)
    Messages = page.object_list

    if page.has_next():
        scrollDisplay = True
    else:
        scrollDisplay = False

    messages_data = [{'username': m.user.username,'message': m.content,'time': DateFormat(m.timestamp).format('Y-m-d H:i')} for m in Messages]
    
    return {"type": "showConversation", 
    "chat_header": {"id" : sendto.id, "sendto" : sendto.username,"status" : sendto.status,"avatar" : str(sendto.avatar)}, 
    "show_messages": {"id" : sendto.id, "sendto" : sendto.username, "avatar" : str(sendto.avatar), 'messages' : messages_data, 'scrollDisplay':scrollDisplay}}

def getDataHome(user, Friends):

    user_room = ChatRoom.objects.get(name="room_{}".format(user.username))
    
    chatNotification = []
    listFriends = []
    for userprofile in Friends :
        message = Message.objects.filter(chat_room=user_room, user=userprofile, seen=False)
        if (message.count()) != 0 :
            chatNotification.append({
                "id" : userprofile.id,
                "username" : userprofile.username,
                "avatar":  str(userprofile.avatar),
            })

        if userprofile.status != "Online":
            continue
        listFriends.append({
            "id" : userprofile.id,
            "username" : userprofile.username,
            "avatar":  str(userprofile.avatar),
        })

    ReqNotification = []
    reqlist = Friend.objects.filter(followedUser=user, isPending=False)
    for userprofile in reqlist:
        ReqNotification.append({
            "id" : userprofile.user.id,
            "status": userprofile.user.status,
            "username" : userprofile.user.username,
            "avatar":  str(userprofile.user.avatar),
        })
    nbnotif = len(chatNotification) + len(ReqNotification)
    return ({"type": "getDataHome",
            "homeNotification": {"notification" : nbnotif,
                                "chatNotification" : chatNotification, 
                                "ReqNotification": ReqNotification},
            "onlineFriendsHome": {"listFriends" : listFriends}})

def getlistFriends(user):
    user_friends = Friend.objects.filter(user=user, isPending=True)
    followed_friends = Friend.objects.filter(followedUser=user, isPending=True)

    Friends = [friend.followedUser for friend in user_friends] + [friend.user for friend in followed_friends]
    return Friends

def get_Search_Home(user, data):
    blockedList = BlockedUser.objects.filter(blocker=user).values_list('blocked', flat=True)
    blockerList = BlockedUser.objects.filter(blocked=user).values_list('blocker', flat=True)
    
    blockList = list(blockedList) + list(blockerList)
    listsearch = User.objects.filter(username__icontains=data["message"]).exclude(id__in=blockList).exclude(id=user.id)

    search = [{'id': user.id, 'username': user.username,'avatar': str(user.avatar),'exp': "75",} for user in listsearch]
    return {"type": "searchHome", "listsearch": search}

def CreatNotifChat(sender):
    return ({
        "type": "CreatNotifChat", "notificationlist": {
            "id" : sender.id,
            "username": sender.username,
            "avatar": str(sender.avatar),
        }
    })

# ---------------- Psrse Events ---------------
@database_sync_to_async
def parseEvents(data, username):

    user = User.objects.get(username=username)
    Friends = getlistFriends(user)

    if data ["type"] == "showUsersFriend": return showUsers(user, Friends)
    elif data["type"] == "getDataHome": return getDataHome(user, Friends)
    elif data["type"] == "searchHome": return get_Search_Home(user, data)
    else:
        room = User.objects.get(username=data["sendto"])
        if data["type"] == "UpdatSeen": update_seen_message(user, room)
        elif data["type"] == "CreatNotifChat": return CreatNotifChat(room)
        elif data["type"] == "showConversation":
            update_seen_message(user, room)
            return get_data(user, room)
        else: return loadMoreContent(user, room, int(data["message"]))

# ------------- Check Username if exists -------------
@database_sync_to_async
def checkFriend(sendto):
    if sendto != "" :
        if not User.objects.filter(username=sendto).exists():
            return False
        sender = User.objects.get(username=sendto)
        n = Friend.objects.filter(user=sender, isPending=True).exists()
        b = Friend.objects.filter(followedUser=sender, isPending=True).exists()
        if b == False and n == False:
            return False
    return True

@database_sync_to_async
def updateHomeUsers(username):
    profile = User.objects.get(username=username)
    return {"id": profile.id, "username" : profile.username, "status" : profile.status, "avatar" : str(profile.avatar)}

@database_sync_to_async
def updateStatus(username, status):
    profile = User.objects.get(username=username)
    User.objects.filter(username=username).update(status=status)
    return {"id": profile.id, "username" : profile.username, "status" : status, "avatar" : str(profile.avatar)}

@database_sync_to_async
def save_message(username, message, sendto):
    room_name = "room_{}".format(sendto)
    user = User.objects.get(username=username)
    chat_room = ChatRoom.objects.get(name=room_name)
    sendto = User.objects.get(username=sendto)
    Message.objects.create(user=user, reciver=sendto, chat_room=chat_room, content=message)
    last = Message.objects.filter(user__in=[user, sendto], chat_room__in=[chat_room]).order_by('-timestamp').first()
    return last.content


@database_sync_to_async
def getFriendsRooms(username):
    user = User.objects.get(username=username)
    user_friends = Friend.objects.filter(user=user, isPending=True)
    followed_friends = Friend.objects.filter(followedUser=user, isPending=True)

    Friends = [friend.followedUser.username for friend in user_friends] + \
            [friend.user.username for friend in followed_friends]
    return Friends

@database_sync_to_async
def getUsername(user_id):
    user = User.objects.get(id=user_id)
    return user.username

@database_sync_to_async
def addBlockUser(user, friend ,eventType):

    from_user = User.objects.get(username=user)
    to_user = User.objects.get(username=friend)
    if eventType == "blockUser":
        Friend.objects.remove_friend(from_user, to_user)
        BlockedUser.objects.get_or_create(blocker=from_user, blocked=to_user)
        return "Blocked", ""
    else :
        Friend.objects.add_friend(from_user, to_user)
        notificationlist = {"id" : from_user.id, "status": from_user.status, "username": from_user.username, "avatar": str(from_user.avatar)}
        return "friendRequest", notificationlist

@database_sync_to_async
def ConfirmDeletReq(user, friend, eventType):
    from_user = User.objects.get(username=user)
    to_user = User.objects.get(username=friend)
    
    if eventType == "reqDelete":
        Friend.objects.remove_friend(from_user, to_user)
    else :
        state, msg = Friend.objects.accept_friend(from_user, to_user)
    return {"status": from_user.status, "id": from_user.id, "username": from_user.username, "avatar": str(from_user.avatar)}

@database_sync_to_async
def unblocked(user, sendto):
    from_user = User.objects.get(username=user)
    to_user = User.objects.get(username=sendto)
    BlockedUser.objects.filter(blocker=from_user, blocked=to_user).delete()