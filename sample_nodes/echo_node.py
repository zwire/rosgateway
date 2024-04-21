import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class EchoNode(Node):
  def __init__(self):
    super().__init__('echo_node')
    self.subscription = self.create_subscription(
      String,
      'dummy_in',
      self.listener_callback,
      10)
    self.publisher_ = self.create_publisher(String, 'dummy_out', 10)
    self.subscription

  def listener_callback(self, msg):
    self.publisher_.publish(msg)
    self.get_logger().info(msg.data)

def main(args=None):
  rclpy.init(args=args)
  echo_pkg = EchoNode()
  rclpy.spin(echo_pkg)
  echo_pkg.destroy_node()
  rclpy.shutdown()

if __name__ == '__main__':
  main()
