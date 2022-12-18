import { ObservableValue } from "./ObservableValue"

/**
 * An observable boolean value.
 *
 * @see ObservableValue
 */
export interface ObservableBooleanValue extends ObservableValue<boolean | null> {
  /**
   * Returns the current value of this `ObservableBooleanValue`.
   *
   * @return The current value
   */
  get(): boolean
}
