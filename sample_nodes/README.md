## sample_nodes

サンプルROS2 Nodeを動かすためのdocker/docker-composeです。

#### Nodes

* 'play' ... いくつかのTopicが無限にPublishされます。
* 'echo' ... /dummy_in (std_msgs/msg/String)  TopicをSubscribeし、受けたらそのまま /dummy_out としてPublishします。

## Build & Run

コンテナ起動
```
docker-compose up --build
(if you need to run it background, add '-d' option)
```

コンテナの存在確認
```
docker ps
```
--- output ---
```
CONTAINER ID  IMAGE                   ... NAMES
xxxxxxxxxxx   ros2_test_nodes-service ... p ros2_test_nodes-service-1
```

シャットダウン
```
docker-compose down
```

### Test Communication

以下の操作は動作確認です。やらなくてもいいです。

実行中のコンテナに入る。
```
docker exec -it <container_name> bash
```

Topic情報を確認する。

#### play
```
ros2 topic echo /fix
```
--- output ---
```
header:
  stamp:
    sec: 1676866973
    nanosec: 658113241
  frame_id: gps
status:
  status: 4
  service: 1
latitude: 33.480824393333336
longitude: 134.04486743333334
altitude: 329.39
.
.
```

#### echo
```
ros2 topic echo /dummy_out &
ros2 topic pub /dummy_in std_msgs/msg/String "data: 'Hello, ROS2'"
```
--- output ---
```
publishing #1: std_msgs.msg.String(data='Hello, ROS2')

data: Hello, ROS2
---
publishing #2: std_msgs.msg.String(data='Hello, ROS2')

data: Hello, ROS2
---

.
.
```
