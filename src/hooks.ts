import { createHooks } from "sync-hookable"

type HookResult = Promise<void> | void

export interface ObservableTsAPIHooks {
  "observable:error": (err: Error) => HookResult
}

export const hooks = createHooks<ObservableTsAPIHooks>()
