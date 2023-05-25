export declare class Queue<T> {
    private head?;
    private tail?;
    length: number;
    constructor();
    enqueue(item: T): void;
    dequeue(): T | undefined;
    peek(): T | undefined;
}
