import { ChangeListener, ObservableBooleanValue } from "../value"
import { InvalidationListener } from "../InvalidationListener"

import { In } from "../../../useful"

/**
 * A `BooleanExpression` is an {@link ObservableBooleanValue} plus additional convenience methods to generate
 * bindings in a fluent style.
 *
 * A concrete subclass of `BooleanExpression` has to implement the method {@link ObservableBooleanValue.get},
 * which provides the actual value of this expression.
 */
export abstract class BooleanExpression implements ObservableBooleanValue {
  /**
   * Sole constructor
   */
  protected constructor() {}

  abstract get(): boolean

  abstract addListener(listener: InvalidationListener)
  abstract addListener(listener: ChangeListener<In<boolean | null>>)

  abstract removeListener(listener: InvalidationListener)
  abstract removeListener(listener: ChangeListener<In<boolean | null>>)

  abstract hasListener(listener: InvalidationListener)
  abstract hasListener(listener: ChangeListener<In<boolean | null>>)

  get value(): boolean | null {
    return this.get()
  }
}
