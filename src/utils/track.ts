// src/utils/track.ts
import { debounce } from 'lodash';
import { pushTrackLogs } from '@/api/fetchInterface';

interface TrackEvent {
  module: string;
  message: object;
  logTime: Date;
}

const eventQueue: TrackEvent[] = [];
const QUEUE_KEY = 'eventQueue';

// 从本地存储加载队列
const storedEvents = localStorage.getItem(QUEUE_KEY);
if (storedEvents) {
  eventQueue.push(...JSON.parse(storedEvents));
}

function saveQueue() {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(eventQueue));
}

function trackEvent(module: string, message: object) {
  const event: TrackEvent = { module, message, logTime: new Date() };
  eventQueue.push(event);
  saveQueue();
  //sendEvents();
}

// 批量发送事件
const sendEvents = debounce(async () => {
  if (eventQueue.length === 0) return;

  const eventsToSend = [...eventQueue];
  eventQueue.length = 0; // 清空队列
  saveQueue();

  await pushTrackLogs(eventsToSend).then((response) => {
      console.log('Events sent successfully:', eventsToSend);
    })
    .catch((error) => {
      console.error('Failed to send events:', error);
      // 将未发送的事件重新加入队列
      eventQueue.push(...eventsToSend);
      saveQueue();
    });
}, 10000); // 每10秒发送一次

export { trackEvent };