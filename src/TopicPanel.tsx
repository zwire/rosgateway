import { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import { Ros, Topic } from 'roslib';
import {
  TopicInfo,
  TopicMode,
  RemoteCommunication
} from './Types';

interface Props {
  remote: RemoteCommunication;
  ros: Ros;
  info: TopicInfo;
  mode: TopicMode;
}

export const TopicPanel = ({ remote, ros, info, mode }: Props) => {
  const [ text, setText ] = useState('');
  useEffect(() => {
    switch (mode) {
      case TopicMode.PUB:
        {
          const listener = new Topic({
            ros : ros,
            name : info.name,
            messageType : info.type
          });
          listener.subscribe(x => {
            remote.sender.next({ info, msg: x });
            setText(JSON.stringify(x, null, 2));
          });
        }
        break;
      case TopicMode.SUB:
        {
          const topic = new Topic({
            ros : ros,
            name : info.name,
            messageType : info.type
          });
          remote.receiver.subscribe(x => {
            if (x.info.name === info.name) {
              topic.publish(x.msg);
              setText(JSON.stringify(x.msg, null, 2));
            }
          });
        }
        break;
    }
  }, []);
  return (
    <Collapse
      style={{ margin: 5 }}
      items={[{
        key: '1',
        label: info.name,
        children: 
          <>
            <p>{info.type}</p>
            <pre>{text}</pre>
          </>
      }]}
    />
  );
};
