import { ChangeListener, ObservableValue, WeakListener } from "../../../../src"

export class WeakChangeListenerMock<T> implements ChangeListener<T>, WeakListener {

  changed<S extends T>(_observable: ObservableValue<S>, _oldValue: T, _newValue: T) {
    return
  }

  get wasGarbageCollected(): boolean {
    return true
  }

}
