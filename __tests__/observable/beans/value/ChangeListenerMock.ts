import { expect } from "@jest/globals"

import { isInteger } from "int-or-float"

import { ChangeListener, ObservableValue } from "../../../../src"

const EPSILON = 1e-12

export class ChangeListenerMock<T> implements ChangeListener<T> {
  private valueModel?: ObservableValue<T>

  private readonly undef: T

  private oldValue: T

  private newValue: T

  private counter = 0

  constructor(undef: T) {
    this.undef = undef
    this.oldValue = this.undef
    this.newValue = this.undef
  }

  changed<S extends T>(observable: ObservableValue<S>, oldValue: T, newValue: T) {
    this.valueModel = observable
    this.oldValue = oldValue
    this.newValue = newValue
    this.counter++
  }

  reset() {
    this.valueModel = undefined
    this.oldValue = this.undef
    this.newValue = this.undef
    this.counter = 0
  }

  check(observable: ObservableValue<T> | undefined, oldValue: T, newValue: T, counter: number) {
    expect(this.valueModel).toBe(observable)
    if (typeof oldValue === "number" && typeof this.oldValue === "number") {
      if (isInteger(oldValue) && isInteger(this.oldValue)) {
        expect(this.oldValue).toEqual(oldValue)
      } else {
        expect(this.oldValue).toBeCloseTo(oldValue, EPSILON)
      }
    } else {
      expect(this.oldValue).toEqual(oldValue)
    }
    if (typeof newValue === "number" && typeof this.newValue === "number") {
      if (isInteger(newValue) && isInteger(this.newValue)) {
        expect(this.newValue).toEqual(newValue)
      } else {
        expect(this.newValue).toBeCloseTo(newValue, EPSILON)
      }
    } else {
      expect(this.newValue).toEqual(newValue)
    }

    expect(this.counter).toEqual(counter)
    this.reset()
  }
}
