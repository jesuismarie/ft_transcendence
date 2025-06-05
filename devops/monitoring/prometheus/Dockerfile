FROM prom/prometheus:latest

USER root

COPY global/prometheus.yml /etc/prometheus/prometheus.yml
COPY rules/alert.rules.yml /etc/prometheus/alert.rules.yml
COPY tools/start-prometheus.sh /prometheus/tools/start-prometheus.sh

ENTRYPOINT ["/prometheus/tools/start-prometheus.sh"]