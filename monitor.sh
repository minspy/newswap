#!/bin/sh
. /etc/profile
. ~/.profile
. ~/.bashrc

while :
do
    pro=`ps -ef | grep yarn | grep -v grep`
    if [ "$pro" = "" ]
    then
	    cd /data/pancake-frontend && nohup yarn dev >/dev/null 2>&1 &
        echo "重启swap脚本"
    else
        echo "$pro"
    fi
    sleep 10
done
