FROM prom/alertmanager:latest

USER root

COPY config/slack-alertmenager.yml /etc/alertmanager/config/slack-alertmenager.yml
COPY template/alert.tmpl /etc/alertmanager/template/alert.tmpl
COPY tools/start-alertmanager.sh /alertmanager/tools/start-alertmanager.sh

ENTRYPOINT ["/alertmanager/tools/start-alertmanager.sh"]

