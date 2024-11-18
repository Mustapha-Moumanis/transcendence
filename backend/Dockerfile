FROM python:3.10

WORKDIR /code


# RUN groupadd -r transgroup && useradd -r -g transgroup leader

# RUN chown -R leader:transgroup /code

# USER leader

# ENV HOME=/code 


RUN apt-get -y update

RUN apt-get -y install postgresql-client

RUN pip install --upgrade pip 

COPY ./src/. /code/

RUN pip install -r requirements.txt
# COPY tools/script.sh .

EXPOSE 8000

# CMD ["python", "src/manage.py", "runserver", "0.0.0.0:8000"]
CMD ["bash", "script.sh"]

# TODO: habat copy src