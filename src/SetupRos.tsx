import { Ros } from 'roslib';
import { AppConfig } from './Types';

let guard = false;

export const SetupRos = (config: AppConfig, onSetup: (ros: Ros) => void) => {
  if (guard) return;
  guard = true;
  const ros = new Ros({
    url: `ws://${config.rosbridge.address}:${config.rosbridge.port}`
  });
  ros.on('connection', () => {
    console.log('Connected to rosbridge.');
    onSetup(ros);
  });
  ros.on('error', e => {
    console.log(`Error connecting to rosbridge: ${e}`);
  });
  ros.on('close', () => {
    console.log('Connection to rosbridge closed.');
  });
}
