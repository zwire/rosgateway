import { Subject, Observable } from 'rxjs';

export type TopicInfo = {
  name: string;
  type: string;
};

export type Topic = {
  info: TopicInfo;
  msg: object;
}

export enum TopicMode {
  PUB,
  SUB
};

export type AppConfig = {
  skyway: {
    channel: string,
    id: string
    secret: string
  },
  rosbridge: {
    address: string,
    port: string
  },
  topics: {
    pub: TopicInfo[],
    sub: TopicInfo[]
  }
};

export type RemoteCommunication = {
  sender: Subject<Topic>;
  receiver: Observable<Topic>;
};
