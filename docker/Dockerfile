FROM jshimko/meteor-launchpad:latest

COPY custom_entrypoint.sh custom_entrypoint.sh
RUN chmod +x custom_entrypoint.sh

ENTRYPOINT ["./custom_entrypoint.sh"]

#CMD ["node", "main.js"]
