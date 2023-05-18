type ListNode<T> = {
  value: T;
  next?: ListNode<T> | undefined;
};
export class Queue<T> {
  private head?: ListNode<T> | undefined;
  private tail?: ListNode<T> | undefined;
  public length: number = 0;

  constructor() {
    this.head = this.tail = undefined;
  }
  enqueue(item: T) {
    const node = { value: item } as ListNode<T>;
    this.length++;
    if (!this.tail) {
      this.tail = this.head = node;
    }
    this.tail.next = this.tail;
    this.tail = node;
  }
  dequeue(): T | undefined {
    if (!this.head) return undefined;
    this.length--;
    const head = this.head;
    this.head = this.head.next;
    head.next = undefined;
    if (this.length == 0) {
      this.tail = undefined;
    }
    return head.value;
  }
  peek(): T | undefined {
    return this.head?.value;
  }
}
