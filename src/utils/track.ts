// src/utils/track.ts

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
}

export { trackEvent };