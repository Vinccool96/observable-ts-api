import { ObservableStringValue, ObservableValueBase } from "observable-ts-api"

export class ObservableStringValueStub extends ObservableValueBase<string | null> implements ObservableStringValue {
  private valueState: string | null

  constructor()
  constructor(initialValue: string | null)
  constructor(initialValue: string | null = null) {
    super()
    this.valueState = initialValue
  }

  set(value: string | null) {
    this.valueState = value
    this.fireValueChangedEvent()
  }

  get(): string | null {
    return this.valueState
  }

  get value(): string | null {
    return this.valueState
  }
}
