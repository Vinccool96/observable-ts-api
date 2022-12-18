import { ObservableBooleanValue, ObservableValueBase } from "observable-ts-api"

export class ObservableBooleanValueStub extends ObservableValueBase<boolean | null> implements ObservableBooleanValue {
  private valueState: boolean

  constructor()
  constructor(initialValue: boolean)
  constructor(initialValue = false) {
    super()
    this.valueState = initialValue
  }

  set(value: boolean) {
    this.valueState = value
    this.fireValueChangedEvent()
  }

  get(): boolean {
    return this.valueState
  }

  get value(): boolean {
    return this.valueState
  }
}
