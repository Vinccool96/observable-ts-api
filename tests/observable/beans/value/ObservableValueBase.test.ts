import { gc } from "expose-ts-gc"

import { Observable } from "observable-ts-api"

import { ObservableObjectValueStub } from "./ObservableObjectValueStub"
import { Any } from "../../../utils/Any"
import { InvalidationListenerMock } from "../InvalidationListenerMock"
import { ChangeListenerMock } from "./ChangeListenerMock"

const UNDEFINED_VALUE: Any = new Any()

const DEFAULT_VALUE: Any = new Any()

const V1: Any = new Any()

const V2: Any = new Any()

let valueModel: ObservableObjectValueStub<Any | null>
let invalidationListener: InvalidationListenerMock
let changeListener: ChangeListenerMock<Any | null>

class AddingListenerMock extends InvalidationListenerMock {
  override invalidated(observable: Observable) {
    super.invalidated(observable)
    observable.addListener(invalidationListener)
  }
}

class RemovingListenerMock extends InvalidationListenerMock {
  override invalidated(observable: Observable) {
    super.invalidated(observable)
    observable.removeListener(invalidationListener)
  }
}

describe("ObservableValueBase", function () {
  beforeEach(function () {
    valueModel = new ObservableObjectValueStub(DEFAULT_VALUE)
    invalidationListener = new InvalidationListenerMock()
    changeListener = new ChangeListenerMock(UNDEFINED_VALUE)
  })

  it("should have no exception in initial state", function () {
    valueModel.fireChange()
  })

  it("should work with one invalidation listener", function () {
    // adding one observer
    valueModel.addListener(invalidationListener)
    gc() // making sure we did not overdo weak references
    valueModel.set(V1)
    invalidationListener.check(valueModel, 1)

    // remove observer
    valueModel.removeListener(invalidationListener)
    valueModel.set(V2)
    invalidationListener.check(null, 0)

    // remove observer again
    valueModel.removeListener(invalidationListener)
    valueModel.set(V1)
    invalidationListener.check(null, 0)
  })

  it("should work with one change listener", function () {
    // adding one observer
    valueModel.addListener(changeListener)
    gc() // making sure we did not overdo weak references
    valueModel.set(V1)
    changeListener.check(valueModel, DEFAULT_VALUE, V1, 1)

    // set same value again
    valueModel.set(V1)
    changeListener.check(undefined, UNDEFINED_VALUE, UNDEFINED_VALUE, 0)

    // set null
    valueModel.set(null)
    changeListener.check(valueModel, V1, null, 1)
    valueModel.set(null)
    changeListener.check(undefined, UNDEFINED_VALUE, UNDEFINED_VALUE, 0)

    // remove observer
    valueModel.removeListener(changeListener)
    valueModel.set(V2)
    changeListener.check(undefined, UNDEFINED_VALUE, UNDEFINED_VALUE, 0)

    // remove observer again
    valueModel.removeListener(changeListener)
    valueModel.set(V1)
    changeListener.check(undefined, UNDEFINED_VALUE, UNDEFINED_VALUE, 0)
  })

  it("should work with two observers", function () {
    const observer2 = new InvalidationListenerMock()

    // adding two observers
    valueModel.addListener(invalidationListener)
    valueModel.addListener(observer2)
    gc() // making sure we did not overdo weak references
    valueModel.fireChange()
    invalidationListener.check(valueModel, 1)
    observer2.check(valueModel, 1)

    // remove first observer
    valueModel.removeListener(invalidationListener)
    valueModel.fireChange()
    invalidationListener.check(null, 0)
    observer2.check(valueModel, 1)

    // remove second observer
    valueModel.removeListener(observer2)
    valueModel.fireChange()
    invalidationListener.check(null, 0)
    observer2.check(null, 0)

    // remove observers in reverse order
    valueModel.removeListener(observer2)
    valueModel.removeListener(invalidationListener)
    valueModel.fireChange()
    invalidationListener.check(null, 0)
    observer2.check(null, 0)
  })

  it("should work with concurrent add", function () {
    const observer2: InvalidationListenerMock = new AddingListenerMock()
    valueModel.addListener(observer2)

    // fire event that adds a second observer
    // Note: there is no assumption if observer that is being added is notified
    valueModel.fireChange()
    observer2.check(valueModel, 1)

    // fire event again, this time both observers need to be notified
    invalidationListener.reset()
    valueModel.fireChange()
    invalidationListener.check(valueModel, 1)
    observer2.check(valueModel, 1)
  })

  it("should work with concurrent remove", function () {
    const observer2: InvalidationListenerMock = new RemovingListenerMock()
    valueModel.addListener(observer2)
    valueModel.addListener(invalidationListener)

    // fire event that adds a second observer
    // Note: there is no assumption if observer that is being removed is notified
    valueModel.fireChange()
    observer2.check(valueModel, 1)

    // fire event again, this time only non-removed observer is notified
    invalidationListener.reset()
    valueModel.fireChange()
    invalidationListener.check(null, 0)
    observer2.check(valueModel, 1)
  })
})
