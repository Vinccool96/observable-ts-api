import { BitSet } from "mnemonist"

import { ChangeListener, InvalidationListener, Observable, ObservableValue, Out } from "observable-ts-api"

import { ExpressionHelper } from "observable-ts-api/internal/binding/ExpressionHelper"

import { hooks } from "observable-ts-api"

import { Any } from "../../utils/Any"
import { InvalidationListenerMock } from "../../observable/beans/InvalidationListenerMock"
import { ChangeListenerMock } from "../../observable/beans/value/ChangeListenerMock"
import { ObservableObjectValueStub } from "../../observable/beans/value/ObservableObjectValueStub"
import { WeakInvalidationListenerMock } from "../../observable/beans/WeakInvalidationListenerMock"
import { WeakChangeListenerMock } from "../../observable/beans/value/WeakChangeListenerMock"

const UNDEFINED: Any = new Any()

const DATA_1: Any = new Any()

const DATA_2: Any = new Any()

let helper: ExpressionHelper<Any> | null = null

let observable: ObservableObjectValueStub<Any>

let invalidationListeners: Array<InvalidationListenerMock>

let changeListeners: Array<ChangeListenerMock<Any>>

describe("ExpressionHelper", function () {
  beforeEach(function () {
    helper = null
    observable = new ObservableObjectValueStub(DATA_1)
    invalidationListeners = [
      new InvalidationListenerMock(),
      new InvalidationListenerMock(),
      new InvalidationListenerMock(),
      new InvalidationListenerMock(),
    ]
    changeListeners = [
      new ChangeListenerMock(UNDEFINED),
      new ChangeListenerMock(UNDEFINED),
      new ChangeListenerMock(UNDEFINED),
      new ChangeListenerMock(UNDEFINED),
    ]
  })

  it("should work with empty helper", async function () {
    ExpressionHelper.removeListener(helper, invalidationListeners[0])
    ExpressionHelper.removeListener(helper, changeListeners[0])
    await ExpressionHelper.fireValueChangedEvent(helper)
  })

  describe("single event", function () {
    it("should work for invalidation", async function () {
      helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[0])
      await ExpressionHelper.fireValueChangedEvent(helper)
      invalidationListeners[0].check(observable, 1)

      helper = ExpressionHelper.removeListener(helper, invalidationListeners[1])
      await ExpressionHelper.fireValueChangedEvent(helper)
      invalidationListeners[0].check(observable, 1)
      invalidationListeners[1].check(null, 0)

      helper = ExpressionHelper.removeListener(helper, changeListeners[1])
      await ExpressionHelper.fireValueChangedEvent(helper)
      invalidationListeners[0].check(observable, 1)
      changeListeners[1].check(undefined, UNDEFINED, UNDEFINED, 0)

      helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[1])
      await ExpressionHelper.fireValueChangedEvent(helper)
      invalidationListeners[0].check(observable, 1)
      invalidationListeners[1].check(observable, 1)

      helper = ExpressionHelper.removeListener(helper, invalidationListeners[1])
      await ExpressionHelper.fireValueChangedEvent(helper)
      invalidationListeners[0].check(observable, 1)
      invalidationListeners[1].check(null, 0)

      helper = ExpressionHelper.addListener(helper, observable, changeListeners[1])
      observable.set(DATA_2)
      await ExpressionHelper.fireValueChangedEvent(helper)
      invalidationListeners[0].check(observable, 1)
      changeListeners[1].check(observable, DATA_1, DATA_2, 1)

      helper = ExpressionHelper.removeListener(helper, changeListeners[1])
      observable.set(DATA_1)
      await ExpressionHelper.fireValueChangedEvent(helper)
      invalidationListeners[0].check(observable, 1)
      changeListeners[1].check(undefined, UNDEFINED, UNDEFINED, 0)

      helper = ExpressionHelper.removeListener(helper, invalidationListeners[0])
      await ExpressionHelper.fireValueChangedEvent(helper)
      invalidationListeners[0].check(null, 0)
    })

    it("should work for change", async function () {
      helper = ExpressionHelper.addListener(helper, observable, changeListeners[0])
      observable.set(DATA_2)
      await ExpressionHelper.fireValueChangedEvent(helper)
      changeListeners[0].check(observable, DATA_1, DATA_2, 1)

      helper = ExpressionHelper.removeListener(helper, invalidationListeners[1])
      observable.set(DATA_1)
      await ExpressionHelper.fireValueChangedEvent(helper)
      changeListeners[0].check(observable, DATA_2, DATA_1, 1)
      invalidationListeners[1].check(null, 0)

      helper = ExpressionHelper.removeListener(helper, changeListeners[1])
      observable.set(DATA_2)
      await ExpressionHelper.fireValueChangedEvent(helper)
      changeListeners[0].check(observable, DATA_1, DATA_2, 1)
      changeListeners[1].check(undefined, UNDEFINED, UNDEFINED, 0)

      helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[1])
      observable.set(DATA_1)
      await ExpressionHelper.fireValueChangedEvent(helper)
      changeListeners[0].check(observable, DATA_2, DATA_1, 1)
      invalidationListeners[1].check(observable, 1)

      helper = ExpressionHelper.removeListener(helper, invalidationListeners[1])
      observable.set(DATA_2)
      await ExpressionHelper.fireValueChangedEvent(helper)
      changeListeners[0].check(observable, DATA_1, DATA_2, 1)
      invalidationListeners[1].check(null, 0)

      helper = ExpressionHelper.addListener(helper, observable, changeListeners[1])
      observable.set(DATA_1)
      await ExpressionHelper.fireValueChangedEvent(helper)
      changeListeners[0].check(observable, DATA_2, DATA_1, 1)
      changeListeners[1].check(observable, DATA_2, DATA_1, 1)

      helper = ExpressionHelper.removeListener(helper, changeListeners[1])
      observable.set(DATA_2)
      await ExpressionHelper.fireValueChangedEvent(helper)
      changeListeners[0].check(observable, DATA_1, DATA_2, 1)
      changeListeners[1].check(undefined, UNDEFINED, UNDEFINED, 0)

      helper = ExpressionHelper.removeListener(helper, changeListeners[0])
      await ExpressionHelper.fireValueChangedEvent(helper)
      changeListeners[0].check(undefined, UNDEFINED, UNDEFINED, 0)
    })
  })

  describe("adding and removing listeners", function () {
    describe("invalidation listener", function () {
      it("should add invalidation listener", async function () {
        const weakListener: InvalidationListener = new WeakInvalidationListenerMock()

        helper = ExpressionHelper.addListener(helper, observable, changeListeners[0])
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[1])

        helper = ExpressionHelper.addListener(helper, observable, weakListener)
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[0])
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(observable, 1)

        helper = ExpressionHelper.addListener(helper, observable, weakListener)
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[1])
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(observable, 1)
        invalidationListeners[1].check(observable, 1)

        helper = ExpressionHelper.addListener(helper, observable, weakListener)
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[2])
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(observable, 1)
        invalidationListeners[1].check(observable, 1)
        invalidationListeners[2].check(observable, 1)
      })

      it("should remove invalidation listener", async function () {
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[0])
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[1])

        helper = ExpressionHelper.removeListener(helper, invalidationListeners[1])

        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[0])

        helper = ExpressionHelper.removeListener(helper, invalidationListeners[1])

        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[1])
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[2])

        helper = ExpressionHelper.removeListener(helper, invalidationListeners[0])
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(null, 0)
        invalidationListeners[1].check(observable, 1)
        invalidationListeners[2].check(observable, 1)

        helper = ExpressionHelper.removeListener(helper, invalidationListeners[1])
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(null, 0)
        invalidationListeners[1].check(null, 0)
        invalidationListeners[2].check(observable, 1)

        helper = ExpressionHelper.removeListener(helper, invalidationListeners[2])
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(null, 0)
        invalidationListeners[1].check(null, 0)
        invalidationListeners[2].check(null, 0)
      })

      it("should add invalidation listener while locked", async function () {
        class InvAdder implements ChangeListener<Any> {
          index = 0

          changed(observable: ObservableValue<Out<Any>>, _oldValue: Any, _newValue: Any) {
            if (this.index < invalidationListeners.length) {
              helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[this.index++])
            }
          }
        }

        const addingListener: ChangeListener<Any> = new InvAdder()

        helper = ExpressionHelper.addListener(helper, observable, addingListener)
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[0])

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].reset()

        observable.set(DATA_1)
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(observable, 1)
        invalidationListeners[1].reset()

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(observable, 1)
        invalidationListeners[1].check(observable, 1)
        invalidationListeners[2].reset()

        observable.set(DATA_1)
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(observable, 1)
        invalidationListeners[1].check(observable, 1)
        invalidationListeners[2].check(observable, 1)
        invalidationListeners[3].reset()

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(observable, 1)
        invalidationListeners[1].check(observable, 1)
        invalidationListeners[2].check(observable, 1)
        invalidationListeners[3].check(observable, 1)
      })

      it("should remove invalidation listener while locked", async function () {
        class InvRemover implements ChangeListener<Any> {
          index = 0

          changed(_observable: ObservableValue<Out<Any>>, _oldValue: Any, _newValue: Any) {
            if (this.index < invalidationListeners.length) {
              helper = ExpressionHelper.removeListener(helper, invalidationListeners[this.index++])
            }
          }
        }

        const removingListener: ChangeListener<Any> = new InvRemover()
        helper = ExpressionHelper.addListener(helper, observable, removingListener)
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[0])
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[0])
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[1])
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[2])

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].reset()
        invalidationListeners[1].check(observable, 1)
        invalidationListeners[2].check(observable, 1)

        observable.set(DATA_1)
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(null, 0)
        invalidationListeners[1].reset()
        invalidationListeners[2].check(observable, 1)

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(null, 0)
        invalidationListeners[1].check(null, 0)
        invalidationListeners[2].reset()

        observable.set(DATA_1)
        await ExpressionHelper.fireValueChangedEvent(helper)
        invalidationListeners[0].check(null, 0)
        invalidationListeners[1].check(null, 0)
        invalidationListeners[2].check(null, 0)
      })
    })

    describe("change listener", function () {
      it("should add change listener", async function () {
        const weakListener: ChangeListener<Any> = new WeakChangeListenerMock()

        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[0])
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[1])

        helper = ExpressionHelper.addListener(helper, observable, weakListener)
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[0])
        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(observable, DATA_1, DATA_2, 1)

        helper = ExpressionHelper.addListener(helper, observable, weakListener)
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[1])
        observable.set(DATA_1)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(observable, DATA_2, DATA_1, 1)
        changeListeners[1].check(observable, DATA_2, DATA_1, 1)

        helper = ExpressionHelper.addListener(helper, observable, weakListener)
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[2])
        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(observable, DATA_1, DATA_2, 1)
        changeListeners[1].check(observable, DATA_1, DATA_2, 1)
        changeListeners[2].check(observable, DATA_1, DATA_2, 1)
      })

      it("should remove change listener", async function () {
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[0])
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[1])

        helper = ExpressionHelper.removeListener(helper, changeListeners[1])

        helper = ExpressionHelper.addListener(helper, observable, changeListeners[0])

        helper = ExpressionHelper.removeListener(helper, changeListeners[1])

        helper = ExpressionHelper.addListener(helper, observable, changeListeners[1])
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[2])

        helper = ExpressionHelper.removeListener(helper, changeListeners[0])
        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(undefined, UNDEFINED, UNDEFINED, 0)
        changeListeners[1].check(observable, DATA_1, DATA_2, 1)
        changeListeners[2].check(observable, DATA_1, DATA_2, 1)

        helper = ExpressionHelper.removeListener(helper, changeListeners[1])
        observable.set(DATA_1)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(undefined, UNDEFINED, UNDEFINED, 0)
        changeListeners[1].check(undefined, UNDEFINED, UNDEFINED, 0)
        changeListeners[2].check(observable, DATA_2, DATA_1, 1)

        helper = ExpressionHelper.removeListener(helper, changeListeners[2])
        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(undefined, UNDEFINED, UNDEFINED, 0)
        changeListeners[1].check(undefined, UNDEFINED, UNDEFINED, 0)
        changeListeners[2].check(undefined, UNDEFINED, UNDEFINED, 0)
      })

      it("should add change listener while locked", async function () {
        class ChanAdder implements ChangeListener<Any> {
          index = 0

          changed(observable: ObservableValue<Out<Any>>, _oldValue: Any, _newValue: Any) {
            if (this.index < changeListeners.length) {
              helper = ExpressionHelper.addListener(helper, observable, changeListeners[this.index++])
            }
          }
        }

        const addingListener: ChangeListener<Any> = new ChanAdder()
        helper = ExpressionHelper.addListener(helper, observable, addingListener)
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[0])

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].reset()

        observable.set(DATA_1)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(observable, DATA_2, DATA_1, 1)
        changeListeners[1].reset()

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(observable, DATA_1, DATA_2, 1)
        changeListeners[1].check(observable, DATA_1, DATA_2, 1)
        changeListeners[2].reset()

        observable.set(DATA_1)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(observable, DATA_2, DATA_1, 1)
        changeListeners[1].check(observable, DATA_2, DATA_1, 1)
        changeListeners[2].check(observable, DATA_2, DATA_1, 1)
        changeListeners[3].reset()

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(observable, DATA_1, DATA_2, 1)
        changeListeners[1].check(observable, DATA_1, DATA_2, 1)
        changeListeners[2].check(observable, DATA_1, DATA_2, 1)
        changeListeners[3].check(observable, DATA_1, DATA_2, 1)
      })

      it("should remove change listener while locked", async function () {
        class ChanRemover implements ChangeListener<Any> {
          index = 0

          changed(_observable: ObservableValue<Out<Any>>, _oldValue: Any, _newValue: Any) {
            if (this.index < changeListeners.length) {
              helper = ExpressionHelper.removeListener(helper, changeListeners[this.index++])
            }
          }
        }

        const removingListener: ChangeListener<Any> = new ChanRemover()
        helper = ExpressionHelper.addListener(helper, observable, removingListener)
        helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[0])
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[0])
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[1])
        helper = ExpressionHelper.addListener(helper, observable, changeListeners[2])

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].reset()
        changeListeners[1].check(observable, DATA_1, DATA_2, 1)
        changeListeners[2].check(observable, DATA_1, DATA_2, 1)

        observable.set(DATA_1)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(undefined, UNDEFINED, UNDEFINED, 0)
        changeListeners[1].reset()
        changeListeners[2].check(observable, DATA_2, DATA_1, 1)

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(undefined, UNDEFINED, UNDEFINED, 0)
        changeListeners[1].check(undefined, UNDEFINED, UNDEFINED, 0)
        changeListeners[2].reset()

        observable.set(DATA_1)
        await ExpressionHelper.fireValueChangedEvent(helper)
        changeListeners[0].check(undefined, UNDEFINED, UNDEFINED, 0)
        changeListeners[1].check(undefined, UNDEFINED, UNDEFINED, 0)
        changeListeners[2].check(undefined, UNDEFINED, UNDEFINED, 0)
      })
    })
  })

  it("should fire value change", async function () {
    helper = ExpressionHelper.addListener(helper, observable, invalidationListeners[0])
    helper = ExpressionHelper.addListener(helper, observable, changeListeners[0])

    await ExpressionHelper.fireValueChangedEvent(helper)
    invalidationListeners[0].check(observable, 1)
    changeListeners[0].check(undefined, UNDEFINED, UNDEFINED, 0)

    observable.set(DATA_2)
    await ExpressionHelper.fireValueChangedEvent(helper)
    invalidationListeners[0].check(observable, 1)
    changeListeners[0].check(observable, DATA_1, DATA_2, 1)

    await ExpressionHelper.fireValueChangedEvent(helper)
    invalidationListeners[0].check(observable, 1)
    changeListeners[0].check(undefined, UNDEFINED, UNDEFINED, 0)

    observable.set(DATA_1)
    await ExpressionHelper.fireValueChangedEvent(helper)
    invalidationListeners[0].check(observable, 1)
    changeListeners[0].check(observable, DATA_2, DATA_1, 1)

    await ExpressionHelper.fireValueChangedEvent(helper)
    invalidationListeners[0].check(observable, 1)
    changeListeners[0].check(undefined, UNDEFINED, UNDEFINED, 0)
  })

  describe("exception", function () {
    describe("when single invalidation", function () {
      it("should not propagate", async function () {
        helper = ExpressionHelper.addListener(helper, observable, {
          invalidated(_observable: Observable) {
            throw new Error()
          },
        })

        await ExpressionHelper.fireValueChangedEvent(helper)
      })

      it("should be handled by hook", async function () {
        let called = false

        hooks.hook("observable:error", (_err) => {
          called = true
        })

        helper = ExpressionHelper.addListener(helper, observable, {
          invalidated(_observable: Observable) {
            throw new Error()
          },
        })

        await ExpressionHelper.fireValueChangedEvent(helper)
        expect(called).toEqual(true)
      })
    })

    describe("when multiple invalidation", function () {
      it("should not propagate", async function () {
        const called = new BitSet(1)
        helper = ExpressionHelper.addListener(helper, observable, {
          invalidated(_observable: Observable) {
            called.set(0)
            throw new Error()
          },
        })
        helper = ExpressionHelper.addListener(helper, observable, {
          invalidated(_observable: Observable) {
            called.set(1)
            throw new Error()
          },
        })

        await ExpressionHelper.fireValueChangedEvent(helper)
        expect(called.get(0)).toEqual(1)
        expect(called.get(1)).toEqual(1)
      })

      it("should be handled by hook", async function () {
        let called = 0

        hooks.hook("observable:error", (_err) => {
          called++
        })

        helper = ExpressionHelper.addListener(helper, observable, {
          invalidated(_observable: Observable) {
            throw new Error()
          },
        })
        helper = ExpressionHelper.addListener(helper, observable, {
          invalidated(_observable: Observable) {
            throw new Error()
          },
        })

        await ExpressionHelper.fireValueChangedEvent(helper)
        expect(called).toEqual(2)
      })
    })

    describe("when single change", function () {
      it("should not propagate", async function () {
        helper = ExpressionHelper.addListener(helper, observable, {
          changed(_a, _b, _c) {
            throw new Error()
          },
        })

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
      })

      it("should be handled by hook", async function () {
        let called = false

        hooks.hook("observable:error", (_err) => {
          called = true
        })

        helper = ExpressionHelper.addListener(helper, observable, {
          changed(_a, _b, _c) {
            throw new Error()
          },
        })

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        expect(called).toEqual(true)
      })
    })

    describe("when multiple invalidation", function () {
      it("should not propagate", async function () {
        const called = new BitSet(1)
        helper = ExpressionHelper.addListener(helper, observable, {
          changed(_a, _b, _c) {
            called.set(0)
            throw new Error()
          },
        })
        helper = ExpressionHelper.addListener(helper, observable, {
          changed(_a, _b, _c) {
            called.set(1)
            throw new Error()
          },
        })

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        expect(called.get(0)).toEqual(1)
        expect(called.get(1)).toEqual(1)
      })

      it("should be handled by hook", async function () {
        let called = 0

        hooks.hook("observable:error", (_err) => {
          called++
        })

        helper = ExpressionHelper.addListener(helper, observable, {
          changed(_a, _b, _c) {
            throw new Error()
          },
        })
        helper = ExpressionHelper.addListener(helper, observable, {
          changed(_a, _b, _c) {
            throw new Error()
          },
        })

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        expect(called).toEqual(2)
      })
    })

    describe("when multiple change and invalidation", function () {
      it("should not propagate", async function () {
        const called = new BitSet(1)
        helper = ExpressionHelper.addListener(helper, observable, {
          changed(_a, _b, _c) {
            called.set(0)
            throw new Error()
          },
        })
        helper = ExpressionHelper.addListener(helper, observable, {
          changed(_a, _b, _c) {
            called.set(1)
            throw new Error()
          },
        })
        helper = ExpressionHelper.addListener(helper, observable, {
          invalidated(_observable: Observable) {
            called.set(2)
            throw new Error()
          },
        })
        helper = ExpressionHelper.addListener(helper, observable, {
          invalidated(_observable: Observable) {
            called.set(3)
            throw new Error()
          },
        })

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        expect(called.get(0)).toEqual(1)
        expect(called.get(1)).toEqual(1)
        expect(called.get(2)).toEqual(1)
        expect(called.get(3)).toEqual(1)
      })

      it("should be handled by hook", async function () {
        let called = 0

        hooks.hook("observable:error", (_err) => {
          called++
        })

        helper = ExpressionHelper.addListener(helper, observable, {
          changed(_a, _b, _c) {
            throw new Error()
          },
        })
        helper = ExpressionHelper.addListener(helper, observable, {
          changed(_a, _b, _c) {
            throw new Error()
          },
        })
        helper = ExpressionHelper.addListener(helper, observable, {
          invalidated(_observable: Observable) {
            throw new Error()
          },
        })
        helper = ExpressionHelper.addListener(helper, observable, {
          invalidated(_observable: Observable) {
            throw new Error()
          },
        })

        observable.set(DATA_2)
        await ExpressionHelper.fireValueChangedEvent(helper)
        expect(called).toEqual(4)
      })
    })
  })
})
