import { In } from "../../useful"
import { ChangeListener, InvalidationListener, ObservableValue } from "../../observable"

import { hooks } from "../../hooks"

import { ExpressionHelperBase } from "./ExpressionHelperBase"
import { isInvalidationListener } from "../utils/typeChecks"
import { arrayOfNulls, copyInto, copyOf, copyOfNotNulls } from "../utils/arrayUtils"

export abstract class ExpressionHelper<T> extends ExpressionHelperBase {
  protected readonly observable: ObservableValue<T>

  abstract readonly invalidationListeners: InvalidationListener[]

  abstract readonly changeListeners: ChangeListener<In<T>>[]

  protected constructor(observable: ObservableValue<T>) {
    super()
    this.observable = observable
  }

  protected abstract addListener(listener: InvalidationListener): ExpressionHelper<T>

  protected abstract addListener(listener: ChangeListener<In<T>>): ExpressionHelper<T>

  protected abstract removeListener(listener: InvalidationListener): ExpressionHelper<T> | null

  protected abstract removeListener(listener: ChangeListener<In<T>>): ExpressionHelper<T> | null

  protected abstract fireValueChangedEvent(): Promise<void>

  static addListener<T>(
    helper: ExpressionHelper<T> | null,
    observable: ObservableValue<T>,
    listener: InvalidationListener
  ): ExpressionHelper<T>
  static addListener<T>(
    helper: ExpressionHelper<T> | null,
    observable: ObservableValue<T>,
    listener: ChangeListener<In<T>>
  ): ExpressionHelper<T>
  static addListener<T>(
    helper: ExpressionHelper<T> | null,
    observable: ObservableValue<T>,
    listener: InvalidationListener | ChangeListener<In<T>>
  ): ExpressionHelper<T> {
    if (isInvalidationListener(listener)) {
      observable.value // validate
      return helper?.addListener(listener) || new SingleInvalidation(observable, listener)
    } else {
      return helper?.addListener(listener) || new SingleChange(observable, listener)
    }
  }

  static removeListener<T>(
    helper: ExpressionHelper<T> | null,
    listener: InvalidationListener
  ): ExpressionHelper<T> | null
  static removeListener<T>(
    helper: ExpressionHelper<T> | null,
    listener: ChangeListener<In<T>>
  ): ExpressionHelper<T> | null
  static removeListener<T>(
    helper: ExpressionHelper<T> | null,
    listener: InvalidationListener | ChangeListener<In<T>>
  ): ExpressionHelper<T> | null {
    if (isInvalidationListener(listener)) {
      return helper?.removeListener(listener) || null
    } else {
      return helper?.removeListener(listener) || null
    }
  }

  static async fireValueChangedEvent<T>(helper: ExpressionHelper<T> | null) {
    await helper?.fireValueChangedEvent()
  }
}

class SingleInvalidation<T> extends ExpressionHelper<T> {
  private readonly listener: InvalidationListener

  constructor(observable: ObservableValue<T>, listener: InvalidationListener) {
    super(observable)
    this.listener = listener
  }

  protected addListener(listener: InvalidationListener): ExpressionHelper<T>
  protected addListener(listener: ChangeListener<In<T>>): ExpressionHelper<T>
  protected addListener(listener: InvalidationListener | ChangeListener<In<T>>): ExpressionHelper<T> {
    if (isInvalidationListener(listener)) {
      return new Generic(this.observable, this.listener, listener)
    } else {
      return new Generic(this.observable, this.listener, listener)
    }
  }

  protected removeListener(listener: InvalidationListener): ExpressionHelper<T> | null
  protected removeListener(listener: ChangeListener<In<T>>): ExpressionHelper<T> | null
  protected removeListener(listener: InvalidationListener | ChangeListener<In<T>>): ExpressionHelper<T> | null {
    if (this.listener === listener) {
      return null
    } else {
      return this
    }
  }

  protected async fireValueChangedEvent(): Promise<void> {
    try {
      this.listener.invalidated(this.observable)
    } catch (e) {
      await hooks.callHook("observable:error", e as Error)
    }
  }

  get invalidationListeners(): InvalidationListener[] {
    return [this.listener]
  }

  get changeListeners(): ChangeListener<In<T>>[] {
    return []
  }
}

class SingleChange<T> extends ExpressionHelper<T> {
  private readonly listener: ChangeListener<In<T>>

  private currentValue: T

  constructor(observable: ObservableValue<T>, listener: ChangeListener<In<T>>) {
    super(observable)
    this.listener = listener
    this.currentValue = this.observable.value
  }

  protected addListener(listener: InvalidationListener): ExpressionHelper<T>
  protected addListener(listener: ChangeListener<In<T>>): ExpressionHelper<T>
  protected addListener(listener: InvalidationListener | ChangeListener<In<T>>): ExpressionHelper<T> {
    if (isInvalidationListener(listener)) {
      return new Generic(this.observable, listener, this.listener)
    } else {
      return new Generic(this.observable, this.listener, listener)
    }
  }

  protected removeListener(listener: InvalidationListener): ExpressionHelper<T> | null
  protected removeListener(listener: ChangeListener<In<T>>): ExpressionHelper<T> | null
  protected removeListener(listener: InvalidationListener | ChangeListener<In<T>>): ExpressionHelper<T> | null {
    if (this.listener === listener) {
      return null
    } else {
      return this
    }
  }

  protected async fireValueChangedEvent(): Promise<void> {
    const oldValue = this.currentValue
    this.currentValue = this.observable.value
    const changed = this.currentValue === null ? oldValue !== null : this.currentValue !== oldValue
    if (changed) {
      try {
        this.listener.changed(this.observable, oldValue, this.currentValue)
      } catch (e) {
        await hooks.callHook("observable:error", e as Error)
      }
    }
  }

  get invalidationListeners(): InvalidationListener[] {
    return []
  }

  get changeListeners(): ChangeListener<In<T>>[] {
    return [this.listener]
  }
}

class Generic<T> extends ExpressionHelper<T> {
  private invalidationListenerArray: Array<InvalidationListener | null> = []

  private changeListenerArray: Array<ChangeListener<In<T>> | null> = []

  private invalidationSize = 0

  private changeSize = 0

  private locked = false

  private currentValue: T

  constructor(observable: ObservableValue<T>, listener0: InvalidationListener, listener1: InvalidationListener)
  constructor(observable: ObservableValue<T>, listener0: ChangeListener<In<T>>, listener1: ChangeListener<In<T>>)
  constructor(
    observable: ObservableValue<T>,
    invalidationListener: InvalidationListener,
    changeListener: ChangeListener<In<T>>
  )
  constructor(
    observable: ObservableValue<T>,
    listener0: InvalidationListener | ChangeListener<In<T>>,
    listener1: InvalidationListener | ChangeListener<In<T>>
  ) {
    super(observable)

    this.currentValue = observable.value

    if (isInvalidationListener(listener0)) {
      this.invalidationListenerArray.push(listener0)
      this.invalidationSize++
    } else {
      this.changeListenerArray.push(listener0)
      this.changeSize++
    }

    if (isInvalidationListener(listener1)) {
      this.invalidationListenerArray.push(listener1)
      this.invalidationSize++
    } else {
      this.changeListenerArray.push(listener1)
      this.changeSize++
    }
  }

  protected addListener(listener: InvalidationListener): ExpressionHelper<T>
  protected addListener(listener: ChangeListener<In<T>>): ExpressionHelper<T>
  protected addListener(listener: InvalidationListener | ChangeListener<In<T>>): ExpressionHelper<T> {
    if (isInvalidationListener(listener)) {
      this.addInvalidationListener(listener)
    } else {
      this.addChangeListener(listener)
    }

    return this
  }

  private addInvalidationListener(listener: InvalidationListener) {
    if (this.invalidationListenerArray.length === 0) {
      this.invalidationListenerArray = [listener]
      this.invalidationSize = 1
    } else {
      const oldSize = this.invalidationListenerArray.length
      if (this.locked) {
        const newSize = this.invalidationSize < oldSize ? oldSize : (oldSize * 3) / 2 + 1
        this.invalidationListenerArray = copyOf(this.invalidationListenerArray, newSize)
      } else if (this.invalidationSize == oldSize) {
        this.invalidationSize = this.trim(
          this.invalidationSize,
          this.invalidationListenerArray as Array<Record<string, unknown> | null>
        )
        if (this.invalidationSize == oldSize) {
          const newSize = this.invalidationSize < oldSize ? oldSize : (oldSize * 3) / 2 + 1
          this.invalidationListenerArray = copyOf(this.invalidationListenerArray, newSize)
        }
      }
      this.invalidationListenerArray[this.invalidationSize++] = listener
    }
  }

  private addChangeListener(listener: ChangeListener<In<T>>) {
    if (this.changeListenerArray.length === 0) {
      this.changeListenerArray = [listener]
      this.changeSize = 1
    } else {
      const oldSize = this.changeListenerArray.length
      if (this.locked) {
        const newSize = this.changeSize < oldSize ? oldSize : (oldSize * 3) / 2 + 1
        this.changeListenerArray = copyOf(this.changeListenerArray, newSize)
      } else if (this.changeSize == oldSize) {
        this.changeSize = this.trim(this.changeSize, this.changeListenerArray as Array<Record<string, unknown> | null>)
        if (this.changeSize == oldSize) {
          const newSize = this.changeSize < oldSize ? oldSize : (oldSize * 3) / 2 + 1
          this.changeListenerArray = copyOf(this.changeListenerArray, newSize)
        }
      }
      this.changeListenerArray[this.changeSize++] = listener
    }
  }

  protected removeListener(listener: InvalidationListener): ExpressionHelper<T>
  protected removeListener(listener: ChangeListener<In<T>>): ExpressionHelper<T>
  protected removeListener(listener: InvalidationListener | ChangeListener<In<T>>): ExpressionHelper<T> {
    if (isInvalidationListener(listener)) {
      return this.removeInvalidationListener(listener)
    } else {
      return this.removeChangeListener(listener)
    }
  }

  private removeInvalidationListener(listener: InvalidationListener): ExpressionHelper<T> {
    for (let index = 0; index < this.invalidationSize; index++) {
      if (listener == this.invalidationListenerArray[index]) {
        if (this.invalidationSize == 1) {
          if (this.changeSize == 1) {
            return new SingleChange(this.observable, this.changeListeners[0])
          }
          this.invalidationListenerArray = []
          this.invalidationSize = 0
        } else if (this.invalidationSize == 2 && this.changeSize == 0) {
          return new SingleInvalidation(this.observable, this.invalidationListeners[1 - index])
        } else {
          const numMoved = this.invalidationSize - index - 1
          const oldListeners = this.invalidationListenerArray
          if (this.locked) {
            this.invalidationListenerArray = arrayOfNulls(this.invalidationListenerArray.length)
            copyInto(oldListeners, this.invalidationListenerArray, 0, 0, index + 1)
          }
          if (numMoved > 0) {
            copyInto(oldListeners, this.invalidationListenerArray, index, index + 1, this.invalidationSize)
          }
          this.invalidationSize--
          if (!this.locked) {
            this.invalidationListenerArray[this.invalidationSize] = null // Let gc do its work
          }
        }
        break
      }
    }

    return this
  }

  private removeChangeListener(listener: ChangeListener<In<T>>): ExpressionHelper<T> {
    for (let index = 0; index < this.changeSize; index++) {
      if (listener == this.changeListenerArray[index]) {
        if (this.changeSize == 1) {
          if (this.invalidationSize == 1) {
            return new SingleInvalidation(this.observable, this.invalidationListeners[0])
          }
          this.changeListenerArray = []
          this.changeSize = 0
        } else if (this.changeSize == 2 && this.invalidationSize == 0) {
          return new SingleChange(this.observable, this.changeListeners[1 - index])
        } else {
          const numMoved = this.changeSize - index - 1
          const oldListeners = this.changeListenerArray
          if (this.locked) {
            this.changeListenerArray = arrayOfNulls(this.changeListenerArray.length)
            copyInto(oldListeners, this.changeListenerArray, 0, 0, index + 1)
          }
          if (numMoved > 0) {
            copyInto(oldListeners, this.changeListenerArray, index, index + 1, this.changeSize)
          }
          this.changeSize--
          if (!this.locked) {
            this.changeListenerArray[this.changeSize] = null // Let gc do its work
          }
        }
        break
      }
    }

    return this
  }

  protected async fireValueChangedEvent(): Promise<void> {
    const curInvalidationList = this.invalidationListenerArray
    const curInvalidationSize = this.invalidationSize
    const curChangeList = this.changeListenerArray
    const curChangeSize = this.changeSize

    try {
      this.locked = true
      for (let i = 0; i < curInvalidationSize; i++) {
        try {
          curInvalidationList[i]?.invalidated(this.observable)
        } catch (e) {
          await hooks.callHook("observable:error", e as Error)
        }
      }
      if (curChangeSize > 0) {
        const oldValue = this.currentValue
        this.currentValue = this.observable.value
        const changed = this.currentValue === null ? oldValue !== null : this.currentValue !== oldValue
        if (changed) {
          for (let i = 0; i < curChangeSize; i++) {
            try {
              curChangeList[i]?.changed(this.observable, oldValue, this.currentValue)
            } catch (e) {
              await hooks.callHook("observable:error", e as Error)
            }
          }
        }
      }
    } finally {
      this.locked = false
    }
  }

  get invalidationListeners(): InvalidationListener[] {
    return copyOfNotNulls(this.invalidationListenerArray)
  }

  get changeListeners(): ChangeListener<In<T>>[] {
    return copyOfNotNulls(this.changeListenerArray)
  }
}
