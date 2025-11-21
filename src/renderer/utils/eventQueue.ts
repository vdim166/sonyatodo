class EventQueue {
  private events: { event: string; options: any }[] = [];

  addEvent(event: string, options: any) {
    this.events.push({ event, options });
  }

  getEvents() {
    return this.events;
  }

  removeEvent(event: string) {
    this.events = this.events.filter((e) => e.event !== event);
  }
}

export const eventQueue = new EventQueue();
