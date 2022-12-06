import { Out } from "../../useful"

/**
 * Returns an array of objects of the given type with the given {@link length}, initialized with null values.
 *
 * @param length the length of the array
 *
 * @return the array filled with `null`
 */
export function arrayOfNulls<T>(length: number): Array<T | null> {
  const array: Array<T | null> = []

  while (array.length < length) {
    array.push(null)
  }

  return array
}

/**
 * Copies this array or its subrange into the {@link destination} array and returns that array.
 *
 * It's allowed to pass the same array in the {@link destination} and even specify the subrange so that it overlaps with
 * the destination range.
 *
 * @param src the array to copy from
 * @param destination the array to copy to.
 * @param destinationOffset the position in the {@link destination} array to copy to, 0 by default.
 * @param startIndex the beginning (inclusive) of the subrange to copy, 0 by default.
 * @param endIndex the end (exclusive) of the subrange to copy, size of this array by default.
 *
 * @return the {@link destination} array.
*/
export function copyInto<T>(src: Array<Out<T>>, destination: Array<T>, destinationOffset = 0, startIndex = 0,
  endIndex = src.length): Array<T> {
  const copy: Array<Out<T>> = copyOfRange(src, startIndex, endIndex)

  for (let i = 0; i < copy.length; i++) {
    destination[destinationOffset + i] = copy[i]
  }

  return destination
}

/**
 * Returns new array which is a copy of the original array, resized to the given {@link newLength}.
 * The copy is either truncated or padded at the end with `null` values if necessary.
 *
 * - If {@link newLength} is less than the size of the original array, the copy array is truncated to the
 * {@link newLength}.
 * - If {@link newLength} is greater than the size of the original array, the extra elements in the copy array are
 * filled with `null` values.
 *
 * @param array the array to copy
 * @param newLength the length of the new array
 *
 * @return the copied array
 */
export function copyOf<T>(array: Array<T>, newLength: number): Array<T | null> {
  const newArray: Array<T | null> = []

  for (let i = 1; i <= array.length && i <= newLength; i++) {
    newArray.push(array[i - 1])
  }

  while (newArray.length < newLength) {
    newArray.push(null)
  }

  return newArray
}

export function copyOfNotNulls<T>(array: Array<T>): Array<NonNullable<T>> {
  const withoutNullables: Array<NonNullable<T>> = []

  for (const e of array) {
    if (e !== undefined && e !== null) {
      withoutNullables.push(e)
    }
  }

  return withoutNullables
}

/**
 * Returns a new array which is a copy of the specified range of the original array.
 *
 * @param array the array to copy
 * @param fromIndex the start of the range (inclusive) to copy.
 * @param toIndex the end of the range (exclusive) to copy.
 *
 * @return the copy of the specified range
 */
export function copyOfRange<T>(array: Array<T>, fromIndex = 0, toIndex = array.length): Array<T> {
  const newArray: Array<T> = []

  for (let i = fromIndex; i < toIndex; i++) {
    const e = array[i]
    newArray.push(e)
  }

  return newArray
}
