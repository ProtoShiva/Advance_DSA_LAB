export function linearSearch(arr, target) {
  let comparisons = 0
  for (let i = 0; i < arr.length; i++) {
    comparisons++
    if (arr[i] === target) return comparisons
  }
  return comparisons
}

export function binarySearch(arr, target) {
  let left = 0
  let right = arr.length - 1
  let comparisons = 0

  while (left <= right) {
    comparisons++
    let mid = Math.floor((left + right) / 2)

    if (arr[mid] === target) {
      return comparisons
    } else if (arr[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return comparisons
}
