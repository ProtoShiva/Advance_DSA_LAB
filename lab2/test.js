import {
  createRandomGenerator,
  generateInputs,
  generateSearchValues,
  generateDeletionValues,
} from "./inputGenerate.js"
import { BST } from "./binarySearchTree.js"

function runExperiment(input, type, random) {
  const bst = new BST()

  let buildComparisons = 0

  for (const value of input) {
    buildComparisons += bst.insert(value)
  }

  const height = bst.height()

  const searchValues = generateSearchValues(input, 1000, random)

  let searchComparisons = 0

  for (const value of searchValues) {
    searchComparisons += bst.search(value)
  }

  const deletionValues = generateDeletionValues(input, 500, random)

  let deleteComparisons = 0

  for (const value of deletionValues) {
    deleteComparisons += bst.delete(value)
  }

  return {
    n: input.length,

    type: type,

    buildComparisons: buildComparisons,

    height: height,

    searchComparisons: searchComparisons,

    deleteComparisons: deleteComparisons,
  }
}

function main() {
  const sizes = [1000, 5000, 10000]

  const results = []

  const random = createRandomGenerator(12345)

  for (const n of sizes) {
    console.log(`Running experiments for n = ${n}...`)

    const inputs = generateInputs(n, random)

    results.push(runExperiment(inputs.random, "Random", random))

    results.push(runExperiment(inputs.sorted, "Sorted", random))

    results.push(runExperiment(inputs.reverseSorted, "Reverse Sorted", random))
  }

  return results
}

const results = main()

console.table(results)
