// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Observable, ObservableValue, WeakInvalidationListener } from ".."

/**
 * A `Binding` calculates a value that depends on one or more sources. The sources are usually called the dependency of
 * a binding. A binding observes its dependencies for changes and updates its value automatically.
 *
 * While a dependency of a binding can be anything, it is almost always an implementation of {@link ObservableValue}.
 * `Binding` implements `ObservableValue` allowing to use it in another binding. With that one can assemble very complex
 * bindings from simple bindings.
 *
 * All bindings in the `observable-ts-api` runtime are calculated lazily. That means, if a dependency changes, the
 * result of a binding is not immediately recalculated, but it is marked as invalid. Next time the value of an invalid
 * binding is requested, it is recalculated.
 *
 * It is recommended to use one of the base classes defined in this package (e.g. {@link NumberBinding}) to define a
 * custom binding, because these classes already provide most of the needed functionality. See {@link NumberBinding} for
 * an example.
 *
 * @see NumberBinding
 */
export interface Binding<T> extends ObservableValue<T> {
  /**
   * Checks if a binding is valid.
   *
   * @return `true` if the `Binding` is valid, `false` otherwise
   */
  get valid(): boolean

  /**
   * Mark a binding as invalid. This forces the recalculation of the value of the `Binding` next time it is requested.
   */
  invalidate()

  // TODO: ObservableList
  /**
   * Returns the dependencies of a binding in an unmodifiable {@link ObservableList}. The implementation is optional.
   * The main purpose of this method is to support developers during development. It allows exploring and monitoring
   * dependencies of a binding during runtime.
   *
   * Because this method should not be used in production code, it is recommended to implement this functionality as
   * sparse as possible. For example if the dependencies do not change, each call can generate a new `ObservableList`,
   * avoiding the necessity to store the result.
   *
   * @return an unmodifiable `ObservableList` of the dependencies
   */
  readonly dependencies: Array<Observable>

  /**
   * Signals to the `Binding` that it will not be used anymore and any references can be removed. A call of this
   * method usually results in the binding stopping to observe its dependencies by unregistering its listener(s). The
   * implementation is optional.
   *
   * All bindings in our implementation use instances of {@link WeakInvalidationListener}, which means usually a binding
   * does not need to be disposed. But if you plan to use your application in environments that do not support
   * `WeakRefs` you have to dispose unused `Bindings` to avoid memory leaks.
   */
  dispose()
}
