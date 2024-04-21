import { Subject } from 'rxjs';
import {
  SkyWayContext,
  SkyWayRoom,
  LocalStream,
  RoomPublication,
  SkyWayStreamFactory,
  nowInSec,
  SkyWayAuthToken,
  uuidV4,
} from '@skyway-sdk/room';
import {
  AppConfig,
  Topic,
  RemoteCommunication
} from './Types';

const generateToken = (id: string, secret: string) => {
  return new SkyWayAuthToken({
    jti: uuidV4(),
    iat: nowInSec(),
    exp: nowInSec() + 60 * 60 * 24,
    scope: {
      app: {
        id: id,
        turn: true,
        actions: ['read'],
        channels: [
          {
            id: '*',
            name: '*',
            actions: ['write'],
            members: [
              {
                id: '*',
                name: '*',
                actions: ['write'],
                publication: {
                  actions: ['write'],
                },
                subscription: {
                  actions: ['write'],
                },
              },
            ],
          },
        ],
      },
    },
  }).encode(secret);
};

let guard = false;

export const SetupSkyWay = async (config: AppConfig, onSetup: (remote: RemoteCommunication) => void) => {
  if (guard) return;
  guard = true;
  const token = generateToken(config.skyway.id, config.skyway.secret);
  const context = await SkyWayContext.Create(token);
  const room = await SkyWayRoom.FindOrCreate(context, {
    type: 'p2p',
    name: config.skyway.channel,
  });
  const self = await room.join();
  room.onMemberJoined.add(e => {
    console.log(`Joined: ${e.member}`);
  });
  room.onMemberLeft.add(e => {
    console.log(`Left: ${e.member}`);
  });
  const dataPublisher = await SkyWayStreamFactory.createDataStream();
  await self.publish(dataPublisher);
  const sender = new Subject<Topic>();
  sender.subscribe(x => {
    if (dataPublisher.isEnabled) {
      dataPublisher.write(x);
    }
  });
  const receiver = new Subject<Topic>();
  const subscribe = async (publication: RoomPublication<LocalStream>) => {
    if (publication.publisher.id === self.id) return;
    const { stream } = await self.subscribe(publication.id);
    switch (stream.contentType) {
      case 'data':
        {
          stream.onData.add(x => receiver.next(x as any));
          console.log(`Started subscription: ${publication.publisher.id}`);
        }
        break;
    }
  };
  room.publications.forEach(subscribe);
  room.onStreamPublished.add((e) => subscribe(e.publication));
  onSetup({ sender, receiver });
  console.log('Joined remote session.');
};
