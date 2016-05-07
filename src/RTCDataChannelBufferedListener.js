import arrayRemove from './common/arrayRemove';

class RTCDataChannelBufferedListener {
  constructor(channel) {
    this.channel = channel;
    this.buffer = [];

    this.$$listeners = [];

    this.channel.addMessageListener(message => {
      this.buffer.push(message);
      this.$$listeners.forEach(listener => listener());
    });
  }

  receiveMessage(selector = () => return true) {
    let findMessages = () => {
      let messages = this.buffer.filter(selector);
      messages.forEach(message => {
        arrayRemove(this.buffer, message);
      });
      return messages;
    };
    
    let resolve;
    let promise = new Promise((res) => {
      resolve = res;
    });

    let messages = findMessages();

    if (messages.length) {
      resolve(messages);
    } else {
      let listener = () => {
        let messages = findMessages();
        if (messages.length) {
          arrayRemove(this.$$listeners, listener);
          resolve(messages);
        }
      };
      this.$$listeners.push(listener);
    }

    return promise;
  }
}