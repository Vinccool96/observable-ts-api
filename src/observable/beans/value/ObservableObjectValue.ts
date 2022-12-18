import { ObservableValue } from "./ObservableValue"

/**
 * An observable typed `Object` value.
 *
 * @typeParam T The type of the wrapped value
 *
 * @see ObservableValue
 */
export interface ObservableObjectValue<T> extends ObservableValue<T> {
  /**
   * Returns the current value of this `ObservableObjectValue<T>`.
   *
   * @return The current value
   */
  get(): T
}
