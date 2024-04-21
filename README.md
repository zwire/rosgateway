# ROS Gateway

SkyWay WebRTC DataStreamとroslib.jsを使い、ROS/ROS2をWAN経由で操作できるようにしようという試みです。

```
                Local | Remote
                      |
                   (SkyWay)
      rosgateway --- WAN --- client
Web       |           |
----------|-----------|
Host      |           |
      rosbridge       |
          |           |
      ROS/ROS2        |
```

## 利用方法

1. ROS Nodeとrosbridgeを立ち上げてください。

sample_nodes/ 以下にdockerで起動する方法を書いてますので、基本的にその通りやっていただければと思います。
dockerを使いたくない場合は、Dockerfileとrun.shに書いてある内容を頼りにNodeとrosbridgeを立ててください。

2. 以下のページにアクセスください。

https://zwire.github.io/rosgateway/

最初にYAMLファイルのアップロードを求めています。
以下のように記載してください。

```yaml
skyway:
  channel: CHANNEL_NAME
  id: SKYWAY_APP_ID
  secret: SKYWAY_SECRET_KEY
rosbridge:
  address: 127.0.0.1
  port: 9090
topics:
  pub:
    - name: /dummy_out
      type: std_msgs/msg/String
    - name: /fix
      type: sensor_msgs/msg/NavSatFix
    - name: /vectornav/IMU
      type: sensor_msgs/msg/Imu
    - name: /tracker
      type: nav_msgs/msg/Odometry
  sub:
    - name: /dummy_in
      type: std_msgs/msg/String
```

'CHANNEL_NAME'は接続先のそれと一致するように、
'SKYWAY_APP_ID'と'SKYWAY_SECRET_KEY'はアカウントに紐づきますので、
[こちら](https://skyway.ntt.com/ja/)から取得してください。

rosbridgeについてはデフォルトの設定であればこのままでよいです。
必要があれば適宜変更してください。

topicsは同梱したsample nodeの場合です。
nodeがpublishしているものは'pub'に、subscribeしているものは'sub'に書いてください。

操作は以上です。
異常があればブラウザのデベロッパーコンソールに何か出ます。

3. リモートからの接続と操作を試みてください。
サンプルは[こちら](https://github.com/zwire/rosgateway_client_sample)にあります。

ちなみに接続は順不同ですし、一旦切って再接続しても復帰できます。
同時に複数アクセスした場合はおかしくなると思います。

## ソースから実行する場合

Node.jsの環境を用意したのち、本リポジトリのルートで以下を実行。

```
# install packages
npm ci

# run
npm run start
```