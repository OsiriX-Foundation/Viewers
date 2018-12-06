FROM mhart/alpine-node:11

ENV ROOT_URL=http://localhost:3000

RUN apk add --no-cache python

WORKDIR /app

ADD scripts/redirectingSimpleServer.py /opt/server.py
ADD appCompiled .

CMD ["python", "/opt/server.py"]
