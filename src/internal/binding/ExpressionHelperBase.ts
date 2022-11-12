import { WeakListener } from "../../observable"

function isWeakListener(obj: WeakListener | Record<string, unknown> | null): obj is WeakListener {
  if (obj === null) {
    return false
  }

  return "wasGarbageCollected" in obj && typeof (obj.wasGarbageCollected) === "boolean"
}

export class ExpressionHelperBase {

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  protected trim(size: number, listeners: Array<Record<string, unknown> | null>) {
    let realSize = size
    let index = 0
    while (index < realSize) {
      const listener = listeners[index]
      if (isWeakListener(listener)) {
        if (listener.wasGarbageCollected) {
          if (realSize - index - 1 > 0) {
            listeners.copyWithin(index, index + 1, realSize)
          }
          listeners[--realSize] = null // Let gc do its work
          index--
        }
      }
      index++
    }
    return size
  }

}
