import { Observable } from "../Observable"

/**
 * An `ObservableValue` is an entity that wraps a value and allows to observe the value for changes. In general this
 * interface should not be implemented directly but one of its sub-interfaces (`ObservableBooleanValue`, etc.).
 *
 * The value of the `ObservableValue` can be requested with [value].
 *
 * An implementation of `ObservableValue` may support lazy evaluation, which means that the value is not immediately
 * recomputed after changes, but lazily the next time the value is requested. All binding and properties in this
 * library support lazy evaluation.
 *
 * An `ObservableValue` generates two types of events: change events and invalidation events. A change event indicates
 * that the value has changed. An invalidation event is generated, if the current value is not valid anymore. This
 * distinction becomes important, if the `ObservableValue` supports lazy evaluation, because for a lazily evaluated
 * value one does not know if an invalid value really has changed until it is recomputed. For this reason, generating
 * change events requires eager evaluation while invalidation events can be generated for eager and lazy
 * implementations.
 *
 * Implementations of this class should strive to generate as few events as possible to avoid wasting too much time in
 * event handlers. Implementations in this library mark themselves as invalid when the first invalidation event occurs.
 * They do not generate any more invalidation events until their value is recomputed and valid again.
 *
 * Two types of listeners can be attached to an `ObservableValue`: [InvalidationListener] to listen to invalidation events
 * and [ChangeListener] to listen to change events.
 *
 * Important note: attaching a `ChangeListener` enforces eager computation even if the implementation of the
 * `ObservableValue` supports lazy evaluation.
 *
 * @typeParam T The type of the wrapped value.
 *
 * @see ObservableBooleanValue
 * @see ObservableDoubleValue
 * @see ObservableFloatValue
 * @see ObservableIntValue
 * @see ObservableLongValue
 * @see ObservableNumberValue
 * @see ObservableObjectValue
 * @see ObservableStringValue
 */
export interface ObservableValue<T> extends Observable {

  /**
   * Returns the current value of this `ObservableValue`
   *
   * @return The current value
   */
  value: T

}
