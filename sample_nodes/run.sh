#!/bin/bash

. /opt/ros/humble/setup.sh
. /root/ws/install/setup.sh

echo ">> Running echo_node..."
ros2 run echo_pkg echo_node &

echo ">> Running play_node..."
trap 'break' INT; \
  while true; do \
    ros2 bag play /root/ws/bag; \
  done &

echo ">> Running rosbridge..."
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
