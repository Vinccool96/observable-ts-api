import { ObservableObjectValue, ObservableValueBase } from "observable-ts-api"

export class ObservableObjectValueStub<T> extends ObservableValueBase<T> implements ObservableObjectValue<T> {
  private valueState: T

  constructor(initialValue: T) {
    super()
    this.valueState = initialValue
  }

  set(value: T) {
    this.valueState = value
    this.fireValueChangedEvent()
  }

  get(): T {
    return this.valueState
  }

  get value(): T {
    return this.get()
  }

  fireChange() {
    this.fireValueChangedEvent()
  }
}
