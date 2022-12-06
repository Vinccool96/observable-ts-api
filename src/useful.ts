export type In<T> = T | Partial<T>

type Child<T> = T & { [key: string]: unknown }

export type Out<T> = T | Child<T>
