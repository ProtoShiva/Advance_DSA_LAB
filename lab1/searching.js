function linearSearch(arr, target) {
  let comparisons = 0
  for (let i = 0; i < arr.length; i++) {
    comparisons++
    if (arr[i] === target) return comparisons
  }
  return comparisons
}

function binarySearch(arr, target) {
  let left = 0
  let right = arr.length - 1
  let comparisons = 0
  while (left <= right) {
    comparisons++
    let mid = Math.floor((left + right) / 2)
    if (arr[mid] === target) return comparisons
    else if (arr[mid] < target) left = mid + 1
    else right = mid - 1
  }
  return comparisons
}

function averageComparisons(searchFn, arr, trials = 50) {
  let total = 0
  const n = arr.length
  for (let i = 0; i < trials; i++) {
    const randomIndex = Math.floor(Math.random() * n)
    const target = arr[randomIndex]
    total += searchFn(arr, target)
  }
  return total / trials
}

export const sizes = [
  10, 20, 100, 250, 500, 1000, 1500, 2000, 3000, 4000, 5000, 6000, 7000, 8000,
  9000, 10000,
]

export const linBestData = []
export const linAvgData = []
export const linWorstData = []
export const binBestData = []
export const binAvgData = []
export const binWorstData = []

for (let n of sizes) {
  const arr = Array.from({ length: n }, (_, index) => index * 2)
  const missingTarget = -999

  linBestData.push(linearSearch(arr, arr[0]))
  linAvgData.push(averageComparisons(linearSearch, arr, 50))
  linWorstData.push(linearSearch(arr, missingTarget))

  const midVal = arr[Math.floor((n - 1) / 2)]
  binBestData.push(binarySearch(arr, midVal))
  binAvgData.push(averageComparisons(binarySearch, arr, 50))
  binWorstData.push(binarySearch(arr, missingTarget))
}

const tableData = sizes.map((size, i) => ({
  "No. of Inputs": size,
  "Linear Best": linBestData[i],
  "Linear Average": linAvgData[i],
  "Linear Worst": linWorstData[i],
  "Binary Best": binBestData[i],
  "Binary Average": binAvgData[i],
  "Binary Worst": binWorstData[i],
}))

console.table(tableData)
