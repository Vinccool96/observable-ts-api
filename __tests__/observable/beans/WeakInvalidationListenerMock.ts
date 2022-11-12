import { InvalidationListener, Observable, WeakListener } from "../../../src"

export class WeakInvalidationListenerMock implements InvalidationListener, WeakListener {

  invalidated(_observable: Observable): void {
    return
  }

  get wasGarbageCollected(): boolean {
    return true
  }

}
