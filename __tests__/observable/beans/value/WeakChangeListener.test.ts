import { describe, it, expect } from "@jest/globals"

import { gc } from "expose-ts-gc"

import { ChangeListener, InvalidationListener, ObservableValue, WeakChangeListener } from "../../../../src"

import { Any } from "../../../utils/Any"
import { ChangeListenerMock } from "./ChangeListenerMock"

class ObservableMock implements ObservableValue<Record<string, unknown> | null> {
  removeCounter = 0

  reset() {
    this.removeCounter = 0
  }

  get value(): Record<string, unknown> | null {
    return null
  }

  addListener(_listener: InvalidationListener | ChangeListener<Record<string, unknown>>): void {
    // not used
  }

  removeListener(_listener: InvalidationListener | ChangeListener<Record<string, unknown>>): void {
    this.removeCounter++
  }

  hasListener(_listener: InvalidationListener | ChangeListener<Record<string, unknown>>): boolean {
    // not used
    return false
  }
}

describe("WeakChangeListener", function () {
  it("should handle GC", function () {
    let listener: ChangeListenerMock<Any | null> | null = new ChangeListenerMock(new Any())
    const weakListener: WeakChangeListener<Any | null> = new WeakChangeListener(listener)
    const o = new ObservableMock()
    const obj1 = new Any()
    const obj2 = new Any()

    // regular call
    weakListener.changed(o, obj1, obj2)
    listener.check(o, obj1, obj2, 1)
    expect(weakListener.wasGarbageCollected).toBe(false)
    expect(o.removeCounter).toEqual(0)

    // GC-ed call
    o.reset()
    listener = null
    gc()
    expect(weakListener.wasGarbageCollected).toBe(true)
    weakListener.changed(o, obj2, obj1)
    expect(o.removeCounter).toEqual(1)
  })
})
