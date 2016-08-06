import { arrayRemove } from './common/ArrayUtils';

export default class RTCDataChannelBufferedListener {
  constructor(channel) {
    this.channel = channel;
    this.buffer = [];

    this.$$listeners = [];

    this.channel.addMessageListener(message => {
      this.buffer.push(message);
      this.$$listeners.forEach(listener => listener());
    });
  }

  receiveMessage(selector) {
    const findMessages = () => {
      const messages = this.buffer.filter(selector);
      messages.forEach(message => {
        arrayRemove(this.buffer, message);
      });
      return messages;
    };

    return new Promise(resolve => {
      const messages = findMessages();

      if (messages.length) {
        resolve(messages);
      } else {
        const listener = () => {
          const messages = findMessages();
          if (messages.length) {
            arrayRemove(this.$$listeners, listener);
            resolve(messages);
          }
        };
        this.$$listeners.push(listener);
      }
    });
  }
}