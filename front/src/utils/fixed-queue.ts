export class FixedQueue<T> {
  private storage: T[] = [];
  private size: number = 0;

  constructor(size: number, initialStorage: T[]) {
    this.size = size;
    this.storage = initialStorage;
  }

  enqueue(item: T) {
    this.storage.push(item);
    if (this.storage.length <= this.size) {
      return;
    }
    this.storage.splice(0, this.storage.length - this.size);
  }

  dequeue(item: T) {
    this.storage.unshift(item);
    if (this.storage.length <= this.size) {
      return;
    }
    this.storage.splice(this.size, this.storage.length - this.size);
  }

  getItem(index: number) {
    return this.storage[index];
  }
}
