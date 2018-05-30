FROM jshimko/meteor-launchpad:latest

ARG VCS_REF

LABEL org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url="https://github.com/OsiriX-Foundation/Viewers/tree/kheops-master"

COPY custom_entrypoint.sh custom_entrypoint.sh
RUN chmod +x custom_entrypoint.sh

ENTRYPOINT ["./custom_entrypoint.sh"]
