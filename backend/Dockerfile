FROM python:3.10

WORKDIR /code

RUN apt-get -y update

RUN apt-get -y install postgresql-client

RUN pip install --upgrade pip 

COPY ./src/. /code/

RUN pip install -r requirements.txt

EXPOSE 8000

ENTRYPOINT ["bash", "script.sh"]