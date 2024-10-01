#!/bin/bash

# openssl req -x509 -nodes -newkey rsa:2048 \
# -keyout $KEY -out $CRT -subj '/CN='$DOMAIN_NAME''

# sed -i -e "s@Default_crt@'$CRT'@" \
# -e "s@Default_key@'$KEY'@" \
# -e "s@Default_name@'$DOMAIN_NAME'@" \
# /etc/nginx/sites-available/default

exec nginx -g "daemon off;"
