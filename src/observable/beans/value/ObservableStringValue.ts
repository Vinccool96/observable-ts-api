import { ObservableValue } from "./ObservableValue"

/**
 * An observable String value.
 *
 * @see ObservableValue
 */
export interface ObservableStringValue extends ObservableValue<string | null> {
  /**
   * Returns the current value of this `ObservableStringValue`.
   *
   * @return The current value
   */
  get(): string | null
}
