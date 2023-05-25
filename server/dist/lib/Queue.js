"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    constructor() {
        this.length = 0;
        this.head = this.tail = undefined;
    }
    enqueue(item) {
        const node = { value: item };
        this.length++;
        if (!this.tail) {
            this.tail = this.head = node;
        }
        this.tail.next = this.tail;
        this.tail = node;
    }
    dequeue() {
        if (!this.head)
            return undefined;
        this.length--;
        const head = this.head;
        this.head = this.head.next;
        head.next = undefined;
        if (this.length == 0) {
            this.tail = undefined;
        }
        return head.value;
    }
    peek() {
        var _a;
        return (_a = this.head) === null || _a === void 0 ? void 0 : _a.value;
    }
}
exports.Queue = Queue;
