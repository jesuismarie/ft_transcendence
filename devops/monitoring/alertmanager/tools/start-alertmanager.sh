#!/bin/sh

cat "/etc/alertmanager/config/slack-alertmenager.yml" > "/etc/alertmanager/config/slack-alertmenager.tmp"
sed -i "s#\$SLACK_HOOK_API_URL#$SLACK_HOOK_API_URL#g" "/etc/alertmanager/config/slack-alertmenager.tmp"
sed -i "s#\$CHANNEL_NAME#$CHANNEL_NAME#g" "/etc/alertmanager/config/slack-alertmenager.tmp"
cat "/etc/alertmanager/config/slack-alertmenager.tmp" > "/etc/alertmanager/config/slack-alertmenager.yml"
rm -rf "/etc/alertmanager/config/slack-alertmenager.tmp"

exec "/bin/alertmanager" "--config.file=/etc/alertmanager/config/slack-alertmenager.yml"