import { In } from "../../../useful"

import { ChangeListener, ObservableValue } from "."
import { InvalidationListener } from "../InvalidationListener"

import { ExpressionHelper } from "../../../internal/binding/ExpressionHelper"
import { isInvalidationListener } from "../../../internal/utils/typeChecks"

/**
 * A convenience class for creating implementations of {@link ObservableValue}. It contains all the infrastructure
 * support for value invalidation- and change event notification.
 *
 * This implementation can handle adding and removing listeners while the observers are being notified, but it is not
 * thread-safe.
 *
 * @typeParam T The type of the wrapped value.
 */
export abstract class ObservableValueBase<T> implements ObservableValue<T> {
  abstract get value(): T

  private helper: ExpressionHelper<T> | null = null

  addListener(listener: InvalidationListener): void
  addListener(listener: ChangeListener<In<T>>): void
  addListener(listener: InvalidationListener | ChangeListener<In<T>>): void {
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

  removeListener(listener: InvalidationListener): void
  removeListener(listener: ChangeListener<In<T>>): void
  removeListener(listener: InvalidationListener | ChangeListener<In<T>>): void {
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

  hasListener(listener: InvalidationListener): boolean
  hasListener(listener: ChangeListener<In<T>>): boolean
  hasListener(listener: InvalidationListener | ChangeListener<In<T>>): boolean {
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
   * Notify the currently registered observers of a value change.
   *
   * This implementation will ignore all adds and removes of observers that are done while a notification is
   * processed. The changes take effect in the following call to fireValueChangedEvent.
   */
  protected fireValueChangedEvent() {
    ExpressionHelper.fireValueChangedEvent(this.helper)
  }
}
