import { InvalidationListener, Observable, WeakListener } from "observable-ts-api"

export class WeakInvalidationListenerMock implements InvalidationListener, WeakListener {
  invalidated(_observable: Observable): void {
    return
  }

  get wasGarbageCollected(): boolean {
    return true
  }
}
