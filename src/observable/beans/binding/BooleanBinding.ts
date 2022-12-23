import { In } from "../../../useful"
import { Binding, ChangeListener, InvalidationListener, Observable } from ".."
import { BooleanExpression } from "./BooleanExpression"

import { ExpressionHelper } from "../../../internal/binding/ExpressionHelper"
import { BindingHelperObserver } from "../../../internal/binding/BindingHelperObserver"
import { isInvalidationListener } from "../../../internal/utils/typeChecks"

/**
 * Base class that provides most of the functionality needed to implement a {@link Binding} of a `boolean` value.
 *
 * `BooleanBinding` provides a simple invalidation-scheme. An extending class can register dependencies by calling
 * {@link bind}. If one of the registered dependencies becomes invalid, this `BooleanBinding` is marked as invalid. With
 * {@link unbind} listening to dependencies can be stopped.
 *
 * To provide a concrete implementation of this class, the method {@link computeValue} has to be implemented to
 * calculate the value of this binding based on the current state of the dependencies. It is called when {@link get} is
 * called for an invalid binding.
 *
 * See {@link NumberBinding} for an example how this base class can be extended.
 *
 * @see Binding
 * @see BooleanExpression
 */
export abstract class BooleanBinding extends BooleanExpression implements Binding<boolean | null> {
  private valueState = false

  private validState = false

  private observer: BindingHelperObserver<boolean | null> | null = null

  private helper: ExpressionHelper<boolean | null> | null = null

  addListener(listener: InvalidationListener)
  addListener(listener: ChangeListener<In<boolean | null>>)
  addListener(listener: InvalidationListener | ChangeListener<In<boolean | null>>): void {
    if (isInvalidationListener(listener)) {
      if (!this.hasListener(listener)) {
        this.helper = ExpressionHelper.addListener(this.helper, this, listener)
      }
    } else {
      if (!this.hasListener(listener)) {
        this.helper = ExpressionHelper.addListener(this.helper, this, listener)
      }
    }
  }

  removeListener(listener: InvalidationListener)
  removeListener(listener: ChangeListener<In<boolean | null>>)
  removeListener(listener: InvalidationListener | ChangeListener<In<boolean | null>>) {
    if (isInvalidationListener(listener)) {
      if (this.hasListener(listener)) {
        this.helper = ExpressionHelper.removeListener(this.helper, listener)
      }
    } else {
      if (this.hasListener(listener)) {
        this.helper = ExpressionHelper.removeListener(this.helper, listener)
      }
    }
  }

  hasListener(listener: InvalidationListener)
  hasListener(listener: ChangeListener<In<boolean | null>>)
  hasListener(listener: InvalidationListener | ChangeListener<In<boolean | null>>) {
    const curHelper = this.helper

    if (curHelper === null) {
      return false
    }

    if (isInvalidationListener(listener)) {
      return curHelper.invalidationListeners.includes(listener)
    } else {
      return curHelper.changeListeners.includes(listener)
    }
  }

  /**
   * Start observing the dependencies for changes. If the value of one of the dependencies changes, the binding is
   * marked as invalid.
   *
   * @param dependencies the dependencies to observe
   */
  protected bind(...dependencies: Array<Observable>) {
    if (!dependencies.length) {
      if (this.observer === null) {
        this.observer = new BindingHelperObserver(this)
      }
      for (const dep of dependencies) {
        dep.addListener(this.observer)
      }
    }
  }

  /**
   * Stop observing the dependencies for changes.
   *
   * @param dependencies the dependencies to stop observing
   */
  protected unbind(...dependencies: Array<Observable>) {
    if (this.observer != null) {
      for (const dep of dependencies) {
        dep.removeListener(this.observer)
      }
      this.observer = null
    }
  }

  /**
   * A default implementation of `dispose()` that is empty.
   */
  dispose() {}

  // TODO: ObservableList
  /**
   * A default implementation of `dependencies` that returns an empty {@link ObservableList}.
   *
   * @return an empty `ObservableList`
   */
  get dependencies(): Array<Observable> {
    return []
  }

  /**
   * Returns the result of {@link computeValue}. The method `computeValue()` is only called if the binding is invalid.
   * The result is cached and returned if the binding did not become invalid since the last call of `get()`.
   *
   * @return the current value
   */
  override get(): boolean {
    if (!this.validState) {
      this.valueState = this.computeValue()
      this.validState = true
    }
    return this.valueState
  }

  /**
   * The method `onInvalidating()` can be overridden by extending classes to react, if this binding becomes invalid. The
   * default implementation is empty.
   */
  protected onInvalidating() {}

  invalidate() {
    if (this.validState) {
      this.validState = false
      this.onInvalidating()
      ExpressionHelper.fireValueChangedEvent(this.helper)
    }
  }

  get valid(): boolean {
    return this.validState
  }

  /**
   * Calculates the current value of this binding.
   *
   * Classes extending `BooleanBinding` have to provide an implementation of `computeValue`.
   *
   * @return the current value
   */
  protected abstract computeValue(): boolean

  /**
   * Returns a string representation of this `BooleanBinding` object.
   *
   * @return a string representation of this `BooleanBinding` object.
   */
  override toString(): string {
    if (this.validState) {
      return `BooleanBinding [value: ${this.get()}]`
    } else {
      return "BooleanBinding [invalid]"
    }
  }
}
