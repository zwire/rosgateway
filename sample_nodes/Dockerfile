FROM ros:humble-ros-base

RUN echo ". /opt/ros/humble/setup.sh" >> ~/.bashrc
RUN mkdir /root/ws
WORKDIR /root/ws

RUN apt-get update
RUN apt-get install -y ros-humble-rosbridge-server

RUN . /opt/ros/humble/setup.sh \
  && ros2 pkg create --build-type ament_python echo_pkg --node-name echo_node
COPY echo_node.py ./echo_pkg/echo_pkg
RUN . /opt/ros/humble/setup.sh \
  && colcon build --packages-select echo_pkg
RUN echo ". /root/ws/install/setup.sh" >> ~/.bashrc

COPY bag ./bag
COPY run.sh .
