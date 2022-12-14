import { Observable } from "../Observable"
import { InvalidationListener } from "../InvalidationListener"
import { ChangeListener } from "./ChangeListener"
import { In } from "../../../useful"

/**
 * An `ObservableValue` is an entity that wraps a value and allows to observe the value for changes. In general this
 * interface should not be implemented directly but one of its sub-interfaces (`ObservableBooleanValue`, etc.).
 *
 * The value of the `ObservableValue` can be requested with {@link value}.
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
 * Two types of listeners can be attached to an `ObservableValue`: {@link InvalidationListener} to listen to
 * invalidation events and {@link ChangeListener} to listen to change events.
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
  readonly value: T

  /**
   * Adds a {@link ChangeListener} which will be notified whenever the value of the `ObservableValue` changes. If the
   * same listener is added more than once, then it will be notified more than once. That is, no check is made to ensure
   * uniqueness.
   *
   * Note that the same actual `ChangeListener` instance may be safely registered for different `ObservableValues`.
   *
   * The `ObservableValue` stores a strong reference to the listener which will prevent the listener from being
   * garbage collected and may result in a memory leak. It is recommended to either unregister a listener by calling
   * {@link removeListener} after use or to use an instance of {@link WeakChangeListener} avoid this situation.
   *
   * @param listener The listener to register
   *
   * @see removeListener
   *
   * {@label CHANGE_LISTENER}
   */
  addListener(listener: ChangeListener<In<T>>): void
  addListener(listener: InvalidationListener): void

  /**
   * Removes the given listener from the list of listeners, that are notified whenever the value of the
   * `ObservableValue` changes.
   *
   * If the given listener has not been previously registered (i.e. it was never added) then this method call is a
   * no-op. If it had been previously added then it will be removed. If it had been added more than once, then only
   * the first occurrence will be removed.
   *
   * @param listener The listener to remove
   *
   * @see addListener
   */
  removeListener(listener: ChangeListener<In<T>>): void
  removeListener(listener: InvalidationListener): void

  /**
   * Verify if the specified `ChangeListener` already exists for this `ObservableValue`.
   *
   * @param listener the `ChangeListener` to verify
   *
   * @return `true`, if the listener already listens, `false` otherwise.
   */
  hasListener(listener: ChangeListener<In<T>>): boolean
  hasListener(listener: InvalidationListener): boolean
}
