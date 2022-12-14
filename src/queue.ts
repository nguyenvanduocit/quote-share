const queue: Array<string> = []
let onQueueAddedFn: () => void | undefined

export const enqueue = (item: string) => {
    queue.push(item)

    if (onQueueAddedFn) {
        onQueueAddedFn()
    }
}

export const dequeue = () => {
    return queue.shift()
}

export const onQueueAdded = (callback: () => void) => {
    onQueueAddedFn = callback
}
