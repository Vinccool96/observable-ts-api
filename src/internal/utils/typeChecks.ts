import { ChangeListener, InvalidationListener } from "../../observable"
import { In } from "../../useful"

export function isInvalidationListener<T>(
  obj: InvalidationListener | ChangeListener<In<T>> | Record<string, unknown>
): obj is InvalidationListener {
  return "invalidated" in obj && typeof obj.invalidated === "function"
}

export function isChangeListener<T>(
  obj: ChangeListener<In<T>> | InvalidationListener | Record<string, unknown>
): obj is ChangeListener<In<T>> {
  return "changed" in obj && typeof obj.changed === "function"
}
