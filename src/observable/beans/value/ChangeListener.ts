import { ObservableValue } from "./ObservableValue"
import { Out } from "../../../useful"

/**
 * A `ChangeListener` is notified whenever the value of an {@link ObservableValue} changes. It can be registered and
 * unregistered with {@link ObservableValue#addListener:CHANGE_LISTENER} and
 * {@link ObservableValue#removeListener:CHANGE_LISTENER} respectively.
 *
 * For an in-depth explanation of change events and how they differ from invalidation events, see the documentation of
 * `ObservableValue`.
 *
 * The same instance of `ChangeListener` can be registered to listen to multiple `ObservableValues`.
 *
 * @see ObservableValue
 */
export interface ChangeListener<T> {

  /**
   * This method needs to be provided by an implementation of `ChangeListener`. It is called if the value of an
   * {@link ObservableValue} changes.
   *
   * In general, it is considered bad practice to modify the observed value in this method.
   *
   * @param observable The `ObservableValue` which value changed
   * @param oldValue The old value
   * @param newValue The new value
   */
  changed(observable: ObservableValue<Out<T>>, oldValue: T, newValue: T)

}
