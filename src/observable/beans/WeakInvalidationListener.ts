import { InvalidationListener } from "./InvalidationListener"
import { WeakListener } from "./WeakListener"
import { create, get, WeakRef } from "node-weak-ref"
import { Observable } from "./Observable"

/**
 * A `WeakInvalidationListener` can be used, if an [Observable] should only maintain a weak reference to the listener.
 * This helps to avoid memory leaks, that can occur if observers are not unregistered from observed objects after use.
 *
 * `WeakInvalidationListener` are created by passing in the original [InvalidationListener]. The
 * `WeakInvalidationListener` should then be registered to listen for changes of the observed object.
 *
 * Note: You have to keep a reference to the `InvalidationListener`, that was passed in as long as it is in use,
 * otherwise it will be garbage collected too soon.
 *
 * @see InvalidationListener
 * @see Observable
 */
export class WeakInvalidationListener implements InvalidationListener, WeakListener {
  private readonly ref: WeakRef<InvalidationListener>

  /**
   * The constructor of `WeakInvalidationListener`.
   *
   * @param listener The original listener that should be notified
   */
  constructor(listener: InvalidationListener) {
    this.ref = create(listener)
  }

  invalidated(observable: Observable): void {
    const listener = get(this.ref)
    if (listener !== undefined) {
      listener.invalidated(observable)
    } else {
      // The weakly reference listener has been garbage collected, so this WeakListener will now unhook itself from the
      // source bean
      observable.removeListener(this)
    }
  }

  get wasGarbageCollected(): boolean {
    return get(this.ref) === undefined
  }

}
