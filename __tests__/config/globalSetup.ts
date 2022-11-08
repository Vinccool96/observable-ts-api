require("ts-node/register")

import { gc } from "expose-ts-gc"

function setup(): void {
  gc()
}

// noinspection JSUnusedGlobalSymbols
export default setup
