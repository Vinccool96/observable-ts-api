import { ChangeListener, ObservableBooleanValue } from "../value"
import { InvalidationListener } from "../InvalidationListener"
import { BooleanBinding } from "./BooleanBinding"
import { and, not, or } from "./bindings"

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

  /**
   * Creates a new `BooleanExpression` that performs the conditional AND-operation on this `BooleanExpression` and a
   * {@link ObservableBooleanValue.
   *
   * @param other the other `ObservableBooleanValue`
   *
   * @return the new `BooleanExpression`
   */
  and(other: ObservableBooleanValue): BooleanBinding {
    return and(this, other)
  }

  /**
   * Creates a new `BooleanExpression` that performs the conditional OR-operation on this `BooleanExpression` and a
   * {@link ObservableBooleanValue}.
   *
   * @param other the other `ObservableBooleanValue`
   *
   * @return the new `BooleanExpression`
   */
  or(other: ObservableBooleanValue): BooleanBinding {
    return or(this, other)
  }

  /**
   * Creates a new `BooleanExpression` that calculates the negation of this `BooleanExpression`.
   *
   * @return the new `BooleanExpression`
   */
  not(): BooleanBinding {
    return not(this)
  }
}
