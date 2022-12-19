import { create, get, WeakRef } from "node-weak-ref"

import { Binding, InvalidationListener, Observable } from "../../observable"

export class BindingHelperObserver<T> implements InvalidationListener {
  private readonly ref: WeakRef<Binding<T>>

  constructor(binding: Binding<T>) {
    this.ref = create(binding)
  }

  invalidated(observable: Observable) {
    const binding = get(this.ref)
    if (binding === undefined) {
      observable.removeListener(this)
    } else {
      binding.invalidate()
    }
  }
}
