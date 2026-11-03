import fs from "fs"
import { performance } from "perf_hooks"

const SIZES = [1000, 5000, 10000, 50000, 100000]

const INPUT_TYPES = ["random", "ascending", "descending"]

const RANDOM_TRIALS = 30
const SEARCH_QUERIES = 1000
const TIMING_REPEATS = 5

const OUTPUT_FILE = "min_heap_results.csv"

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)

    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generateInput(n, type, seed = 12345) {
  const arr = Array.from({ length: n }, (_, i) => i + 1)

  if (type === "ascending") {
    return arr
  }

  if (type === "descending") {
    return arr.reverse()
  }

  // Random permutation of distinct integers.
  const random = mulberry32(seed)

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))

    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

// ==========================================
// MIN HEAP: BOTTOM-UP CONSTRUCTION
// ==========================================

function bottomUpHeap(input) {
  const heap = input.slice()

  const stats = {
    comparisons: 0,
    swaps: 0,
  }

  const start = performance.now()

  // Start from the last non-leaf node.
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
    siftDown(heap, i, heap.length, stats)
  }

  const end = performance.now()

  return {
    heap,
    comparisons: stats.comparisons,
    swaps: stats.swaps,
    time: end - start,
  }
}

// ==========================================
// SIFT DOWN
// ==========================================

function siftDown(heap, index, size, stats) {
  while (true) {
    let smallest = index

    const left = 2 * index + 1
    const right = 2 * index + 2

    // Compare left child with current smallest.
    if (left < size) {
      stats.comparisons++

      if (heap[left] < heap[smallest]) {
        smallest = left
      }
    }

    // Compare right child with current smallest.
    if (right < size) {
      stats.comparisons++

      if (heap[right] < heap[smallest]) {
        smallest = right
      }
    }

    // Heap property is satisfied.
    if (smallest === index) {
      break
    }

    // Swap.
    ;[heap[index], heap[smallest]] = [heap[smallest], heap[index]]

    stats.swaps++

    index = smallest
  }
}

// ==========================================
// MIN HEAP: TOP-DOWN CONSTRUCTION
// ==========================================

function topDownHeap(input) {
  const heap = []

  const stats = {
    comparisons: 0,
    swaps: 0,
  }

  const start = performance.now()

  for (const value of input) {
    insert(heap, value, stats)
  }

  const end = performance.now()

  return {
    heap,
    comparisons: stats.comparisons,
    swaps: stats.swaps,
    time: end - start,
  }
}

// ==========================================
// INSERT OPERATION
// ==========================================

function insert(heap, value, stats) {
  heap.push(value)

  let index = heap.length - 1

  // Move element upward until heap property is restored.
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2)

    stats.comparisons++

    if (heap[index] >= heap[parent]) {
      break
    }

    ;[heap[index], heap[parent]] = [heap[parent], heap[index]]

    stats.swaps++

    index = parent
  }
}

// ==========================================
// REPEATED EXTRACT-MIN
// ==========================================

function repeatedExtractMin(input) {
  // Create a fresh heap before measuring extraction.
  const built = bottomUpHeap(input)

  const heap = built.heap

  const stats = {
    comparisons: 0,
    swaps: 0,
  }

  const start = performance.now()

  while (heap.length > 0) {
    extractMin(heap, stats)
  }

  const end = performance.now()

  return {
    comparisons: stats.comparisons,
    swaps: stats.swaps,
    time: end - start,
  }
}

// ==========================================
// EXTRACT-MIN OPERATION
// ==========================================

function extractMin(heap, stats) {
  if (heap.length === 0) {
    return null
  }

  const minimum = heap[0]

  // Only one element remains.
  if (heap.length === 1) {
    heap.pop()
    return minimum
  }

  // Move last element to root.
  heap[0] = heap.pop()

  // Count the root replacement as one swap.
  stats.swaps++

  // Restore min heap property.
  siftDown(heap, 0, heap.length, stats)

  return minimum
}

// ==========================================
// LINEAR SEARCH
// ==========================================

function linearSearch(heap, target, stats) {
  for (let i = 0; i < heap.length; i++) {
    stats.comparisons++

    if (heap[i] === target) {
      return true
    }
  }

  return false
}

// ==========================================
// SEARCH WORKLOAD
// ==========================================

function searchExperiment(input, queries, seed) {
  // Build heap outside search timing.
  const heap = bottomUpHeap(input).heap

  const random = mulberry32(seed)

  const existingStats = {
    comparisons: 0,
    swaps: 0,
  }

  const missingStats = {
    comparisons: 0,
    swaps: 0,
  }

  // Prepare existing search targets.
  const existingTargets = []

  for (let i = 0; i < queries; i++) {
    const index = Math.floor(random() * input.length)

    existingTargets.push(input[index])
  }

  // N+1 is guaranteed not to exist because values are 1...N.
  const missingTarget = input.length + 1

  // Existing element searches.
  const existingStart = performance.now()

  for (const target of existingTargets) {
    linearSearch(heap, target, existingStats)
  }

  const existingEnd = performance.now()

  // Non-existing element searches.
  const missingStart = performance.now()

  for (let i = 0; i < queries; i++) {
    linearSearch(heap, missingTarget, missingStats)
  }

  const missingEnd = performance.now()

  return {
    existing: {
      comparisons: existingStats.comparisons,
      swaps: 0,
      time: existingEnd - existingStart,
    },

    nonExisting: {
      comparisons: missingStats.comparisons,
      swaps: 0,
      time: missingEnd - missingStart,
    },
  }
}

// ==========================================
// MEASUREMENT HELPER
// ==========================================

// Random inputs get 30 independent trials.
// Deterministic inputs get 5 timing repetitions.

function measure(factory, repeats) {
  let firstResult = null
  let totalTime = 0

  for (let i = 0; i < repeats; i++) {
    const result = factory()

    if (i === 0) {
      firstResult = result
    }

    totalTime += result.time
  }

  return {
    ...firstResult,
    time: totalTime / repeats,
  }
}

// ==========================================
// RESULT STORAGE
// ==========================================

const results = []

function addResult(
  inputType,
  n,
  operation,
  trials,
  queries,
  comparisons,
  swaps,
  time,
  basis,
) {
  results.push({
    input_type: inputType,
    n,
    operation,
    trials,
    queries,
    comparisons,
    swaps,
    time_ms: time,
    measurement_basis: basis,
  })
}

// ==========================================
// RUN ONE EXPERIMENT CONFIGURATION
// ==========================================

function runExperiment(n, inputType) {
  console.log(`\nRunning N=${n}, Input=${inputType}`)

  const trials = inputType === "random" ? RANDOM_TRIALS : 1

  const timingRepeats = inputType === "random" ? 1 : TIMING_REPEATS

  const totals = {
    bottom_up: { comparisons: 0, swaps: 0, time: 0 },

    top_down: { comparisons: 0, swaps: 0, time: 0 },

    extract_min: { comparisons: 0, swaps: 0, time: 0 },
  }

  const searchTotals = {
    existing: {
      comparisons: 0,
      time: 0,
    },

    nonExisting: {
      comparisons: 0,
      time: 0,
    },
  }

  let totalSearchQueries = 0

  // Distribute exactly 1000 queries across trials.
  const queriesPerTrial = Math.floor(SEARCH_QUERIES / trials)
  const extraQueries = SEARCH_QUERIES % trials

  // ======================================
  // RUN TRIALS
  // ======================================

  for (let trial = 0; trial < trials; trial++) {
    const seed = 1000 + n * 31 + trial

    const input = generateInput(n, inputType, seed)

    // ------------------------------
    // 1. Bottom-up construction
    // ------------------------------

    const bottomResult = measure(() => bottomUpHeap(input), timingRepeats)

    totals.bottom_up.comparisons += bottomResult.comparisons

    totals.bottom_up.swaps += bottomResult.swaps

    totals.bottom_up.time += bottomResult.time

    // ------------------------------
    // 2. Top-down construction
    // ------------------------------

    const topResult = measure(() => topDownHeap(input), timingRepeats)

    totals.top_down.comparisons += topResult.comparisons

    totals.top_down.swaps += topResult.swaps

    totals.top_down.time += topResult.time

    // ------------------------------
    // 3. Repeated Extract-Min
    // ------------------------------

    const extractResult = measure(
      () => repeatedExtractMin(input),
      timingRepeats,
    )

    totals.extract_min.comparisons += extractResult.comparisons

    totals.extract_min.swaps += extractResult.swaps

    totals.extract_min.time += extractResult.time

    // ------------------------------
    // 4 and 5. Searching
    // ------------------------------

    const queries = queriesPerTrial + (trial < extraQueries ? 1 : 0)

    if (queries > 0) {
      const searchResult = measure(
        () => searchExperiment(input, queries, seed + 999),
        timingRepeats,
      )

      searchTotals.existing.comparisons += searchResult.existing.comparisons

      searchTotals.existing.time += searchResult.existing.time

      searchTotals.nonExisting.comparisons +=
        searchResult.nonExisting.comparisons

      searchTotals.nonExisting.time += searchResult.nonExisting.time

      totalSearchQueries += queries
    }

    if ((trial + 1) % 5 === 0 || trial === trials - 1) {
      console.log(`Completed trial ${trial + 1}/${trials}`)
    }
  }

  // ======================================
  // SAVE AGGREGATED RESULTS
  // ======================================

  const average = trials

  // Bottom-up construction.
  addResult(
    inputType,
    n,
    "bottom_up",
    trials,
    0,
    totals.bottom_up.comparisons / average,
    totals.bottom_up.swaps / average,
    totals.bottom_up.time / average,
    "average_total_per_trial",
  )

  // Top-down construction.
  addResult(
    inputType,
    n,
    "top_down",
    trials,
    0,
    totals.top_down.comparisons / average,
    totals.top_down.swaps / average,
    totals.top_down.time / average,
    "average_total_per_trial",
  )

  // Insertion of N elements.
  // This is the same algorithm as top-down construction.
  addResult(
    inputType,
    n,
    "insertion_N",
    trials,
    0,
    totals.top_down.comparisons / average,
    totals.top_down.swaps / average,
    totals.top_down.time / average,
    "average_total_per_trial",
  )

  // Repeated Extract-Min.
  addResult(
    inputType,
    n,
    "extract_min",
    trials,
    0,
    totals.extract_min.comparisons / average,
    totals.extract_min.swaps / average,
    totals.extract_min.time / average,
    "average_total_per_trial",
  )

  // Existing element search.
  addResult(
    inputType,
    n,
    "search_existing",
    trials,
    totalSearchQueries,
    searchTotals.existing.comparisons / totalSearchQueries,
    0,
    searchTotals.existing.time / totalSearchQueries,
    "average_per_query",
  )

  // Non-existing element search.
  addResult(
    inputType,
    n,
    "search_non_existing",
    trials,
    totalSearchQueries,
    searchTotals.nonExisting.comparisons / totalSearchQueries,
    0,
    searchTotals.nonExisting.time / totalSearchQueries,
    "average_per_query",
  )
}

// ==========================================
// MAIN EXPERIMENT
// ==========================================

console.log("====================================")
console.log("MIN HEAP PERFORMANCE EXPERIMENT")
console.log("====================================")

console.log("Input sizes:", SIZES)
console.log("Input types:", INPUT_TYPES)
console.log("Random trials:", RANDOM_TRIALS)
console.log("Search queries:", SEARCH_QUERIES)

// Run all combinations.

for (const n of SIZES) {
  for (const inputType of INPUT_TYPES) {
    runExperiment(n, inputType)
  }
}

// ==========================================
// EXPORT RESULTS TO CSV
// ==========================================

const headers = [
  "input_type",
  "n",
  "operation",
  "trials",
  "queries",
  "comparisons",
  "swaps",
  "time_ms",
  "measurement_basis",
]

const csvRows = results.map((row) => {
  return headers.map((header) => row[header]).join(",")
})

const csvContent = [headers.join(","), ...csvRows].join("\n")

fs.writeFileSync(OUTPUT_FILE, csvContent, "utf8")

console.log("\n====================================")
console.log("EXPERIMENT COMPLETED")
console.log("====================================")

console.log(`Results saved to ${OUTPUT_FILE}`)

console.log(`Total CSV rows: ${results.length}`)
