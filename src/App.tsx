import { useState } from 'react';
import { Typography } from 'antd';
import { Ros } from 'roslib';
import { TopicPanel } from './TopicPanel';
import { SetupApp } from './SetupApp';
import { SetupSkyWay } from './SetupSkyWay';
import { SetupRos } from './SetupRos';
import { AppConfig, TopicMode, RemoteCommunication } from './Types';

const App = () => {
  const [ config, setConfig ] = useState<AppConfig>();
  const [ remote, setRemote ] = useState<RemoteCommunication>();
  const [ ros, setRos ] = useState<Ros>();

  if (!config) {
    return <SetupApp onUploaded={setConfig} />;
  }
  if (!remote){
    SetupSkyWay(config, setRemote);
    return <></>;
  }
  if (!ros) {
    SetupRos(config, setRos);
    return <></>;
  }

  return (
    <div style={{ margin: 15 }}>
      <Typography.Title level={3}>Publishing Topics</Typography.Title>
      {config.topics.pub.map(i => 
        <TopicPanel remote={remote} ros={ros} info={i} mode={TopicMode.PUB} />
      )}
      <Typography.Title level={3}>Subscribing Topics</Typography.Title>
      {config.topics.sub.map(i => 
        <TopicPanel remote={remote} ros={ros} info={i} mode={TopicMode.SUB} />
      )}
    </div>
  );
}

export default App;
