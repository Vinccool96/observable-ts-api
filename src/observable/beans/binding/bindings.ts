import { create, get, WeakRef } from "node-weak-ref"

import { ObservableBooleanValue } from "../value"
import { BooleanBinding } from "./BooleanBinding"
import { InvalidationListener } from "../InvalidationListener"
import { Observable } from "../Observable"

// boolean
// =====================================================================================================================

class BooleanAndBinding extends BooleanBinding {
  private readonly bindingObserver: InvalidationListener

  constructor(public op1: ObservableBooleanValue, private op2: ObservableBooleanValue) {
    super()

    this.bindingObserver = new ShortCircuitAndInvalidator(this)

    this.op1.addListener(this.bindingObserver)
    this.op2.addListener(this.bindingObserver)
  }

  override dispose() {
    this.op1.removeListener(this.bindingObserver)
    this.op2.removeListener(this.bindingObserver)
  }

  computeValue(): boolean {
    return this.op1.get() && this.op2.get()
  }

  // TODO: ObservableList
  override get dependencies(): Array<Observable> {
    // TODO: ImmutableObservableList
    return [this.op1, this.op2]
  }
}

class ShortCircuitAndInvalidator implements InvalidationListener {
  private readonly ref: WeakRef<BooleanAndBinding>

  constructor(binding: BooleanAndBinding) {
    this.ref = create(binding)
  }

  invalidated(observable: Observable) {
    const binding = get(this.ref)
    if (binding == null) {
      observable.removeListener(this)
    } else {
      // short-circuit invalidation. This BooleanBinding becomes only invalid if the first operator changes or the first
      // parameter is true.
      if (binding.op1 == observable || (binding.valid && binding.op1.get())) {
        binding.invalidate()
      }
    }
  }
}

/**
 * Creates a {@link BooleanBinding} that calculates the conditional-AND operation on the value of two instance of
 * {@link ObservableBooleanValue}.
 *
 * @param op1 first `ObservableBooleanValue`
 * @param op2 second `ObservableBooleanValue`
 *
 * @return the new `BooleanBinding`
 */
export function and(op1: ObservableBooleanValue, op2: ObservableBooleanValue): BooleanBinding {
  return new BooleanAndBinding(op1, op2)
}

class BooleanOrBinding extends BooleanBinding {
  private readonly bindingObserver: InvalidationListener

  constructor(public op1: ObservableBooleanValue, private op2: ObservableBooleanValue) {
    super()

    this.bindingObserver = new ShortCircuitOrInvalidator(this)

    this.op1.addListener(this.bindingObserver)
    this.op2.addListener(this.bindingObserver)
  }

  override dispose() {
    this.op1.removeListener(this.bindingObserver)
    this.op2.removeListener(this.bindingObserver)
  }

  computeValue(): boolean {
    return this.op1.get() || this.op2.get()
  }

  // TODO: ObservableList
  override get dependencies(): Array<Observable> {
    // TODO: ImmutableObservableList
    return [this.op1, this.op2]
  }
}

class ShortCircuitOrInvalidator implements InvalidationListener {
  private readonly ref: WeakRef<BooleanOrBinding>

  constructor(binding: BooleanOrBinding) {
    this.ref = create(binding)
  }

  invalidated(observable: Observable) {
    const binding = get(this.ref)
    if (binding == null) {
      observable.removeListener(this)
    } else {
      // short circuit invalidation. This BooleanBinding becomes only invalid if the first operator changes or the first
      // parameter is false.
      if (binding.op1 == observable || (binding.valid && !binding.op1.get())) {
        binding.invalidate()
      }
    }
  }
}

/**
 * Creates a {@link BooleanBinding} that calculates the conditional-OR operation on the value of two instance of
 * {@link ObservableBooleanValue}.
 *
 * @param op1 first `ObservableBooleanValue`
 * @param op2 second `ObservableBooleanValue`
 *
 * @return the new `BooleanBinding`
 */
export function or(op1: ObservableBooleanValue, op2: ObservableBooleanValue): BooleanBinding {
  return new BooleanOrBinding(op1, op2)
}

class BooleanNotBinding extends BooleanBinding {
  constructor(private readonly op: ObservableBooleanValue) {
    super()
    super.bind(this.op)
  }

  override dispose() {
    super.unbind(this.op)
  }

  computeValue(): boolean {
    return !this.op.get()
  }

  // TODO: ObservableList
  override get dependencies(): Array<Observable> {
    // TODO: singletonObservableList
    return [this.op]
  }
}

/**
 * Creates a {@link BooleanBinding} that calculates the inverse of the value of a {@link ObservableBooleanValue}.
 *
 * @param op the `ObservableBooleanValue`
 *
 * @return the new `BooleanBinding`
 */
export function not(op: ObservableBooleanValue): BooleanBinding {
  return new BooleanNotBinding(op)
}
