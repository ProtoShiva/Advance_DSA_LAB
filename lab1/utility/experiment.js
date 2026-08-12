import { linearSearch, binarySearch } from "../searching.js"

function runComparisonBenchmark() {
  const sizes = [10, 100, 1000, 10000, 100000, 1000000, 10000000]

  console.log(
    "Input_Size\tLin_Best\tLin_Avg\tLin_Worst\tBin_Best\tBin_Avg\tBin_Worst",
  )

  for (let n of sizes) {
    const arr = Array.from({ length: n }, (_, index) => index * 2)
    const randomTarget = arr[Math.floor(n / 2)]
    const missingTarget = -999

    const linBest = linearSearch(arr, arr[0])
    const linAvg = linearSearch(arr, randomTarget)
    const linWorst = linearSearch(arr, missingTarget)

    const midVal = arr[Math.floor((n - 1) / 2)]
    const binBest = binarySearch(arr, midVal)
    const binAvg = binarySearch(arr, randomTarget)
    const binWorst = binarySearch(arr, missingTarget)

    console.log(
      `${n}\t${linBest}\t${linAvg}\t${linWorst}\t${binBest}\t${binAvg}\t${binWorst}`,
    )
  }
}

runComparisonBenchmark()
