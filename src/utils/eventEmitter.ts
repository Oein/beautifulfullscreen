class Emitter {
  events: any;

  constructor() {
    this.events = {};
  }

  on(type: string, listener: any) {
    if (!this.events[type]) {
      this.events[type] = [];
    }

    this.events[type].push(listener);
  }

  off(type: string, listener: any) {
    if (!this.events[type]) {
      return;
    }

    this.events[type] = this.events[type].filter((l: any) => l !== listener);
  }

  emit(type: string, ...args: any) {
    if (!this.events[type]) {
      return;
    }

    this.events[type].forEach((l: any) => l(...args));
  }
}

const eventEmitter = new Emitter();
export default eventEmitter;
