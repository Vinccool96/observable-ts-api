import { create, get, WeakRef } from "node-weak-ref"

import { ChangeListener } from "./ChangeListener"
import { WeakListener } from "../WeakListener"
import { ObservableValue } from "./ObservableValue"

/**
 * A `WeakChangeListener` can be used, if an {@link ObservableValue} should only maintain a weak reference to the
 * listener. This helps to avoid memory leaks, that can occur if observers are not unregistered from observed objects
 * after use.
 *
 * `WeakChangeListener` are created by passing in the original {@link ChangeListener}. The `WeakChangeListener` should
 * then be registered to listen for changes of the observed object.
 *
 * Note: You have to keep a reference to the `ChangeListener`, that was passed in as long as it is in use, otherwise it
 * will be garbage collected too soon.
 *
 * @param T The type of the observed value
 *
 * @see ChangeListener
 * @see ObservableValue
 *
 * @constructor The constructor of `WeakChangeListener`.
 *
 * @param listener The original listener that should be notified
 */
export class WeakChangeListener<T> implements ChangeListener<T>, WeakListener {

  private readonly ref: WeakRef<ChangeListener<T>>

  /**
   * The constructor of `WeakChangeListener`.
   *
   * @param listener The original listener that should be notified
   */
  constructor(listener: ChangeListener<T>) {
    this.ref = create(listener)
  }

  changed<S extends T>(observable: ObservableValue<S>, oldValue: T, newValue: T) {
    const listener = get(this.ref)
    if (listener !== undefined) {
      listener.changed(observable, oldValue, newValue)
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
