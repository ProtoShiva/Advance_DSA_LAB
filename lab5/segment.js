import fs from "fs"

class SegmentTree {
  constructor(arr) {
    if (!arr.length) {
      throw new Error("Array cannot be empty.")
    }

    this.arr = [...arr]
    this.n = arr.length
    this.tree = new Array(4 * this.n)

    this.comparisons = {
      build: 0,
      query: 0,
      update: 0,
    }

    this.build(0, 0, this.n - 1)
  }

  merge(left, right, operation) {
    if (left === null) return right
    if (right === null) return left

    this.comparisons[operation]++

    const minimum = Math.min(left.minimum, right.minimum)

    this.comparisons[operation]++

    const maximum = Math.max(left.maximum, right.maximum)

    return { minimum, maximum }
  }

  build(node, start, end) {
    if (start === end) {
      this.tree[node] = {
        minimum: this.arr[start],
        maximum: this.arr[start],
      }
      return
    }

    const mid = Math.floor((start + end) / 2)

    this.build(2 * node + 1, start, mid)
    this.build(2 * node + 2, mid + 1, end)

    this.tree[node] = this.merge(
      this.tree[2 * node + 1],
      this.tree[2 * node + 2],
      "build",
    )
  }

  query(node, start, end, L, R) {
    if (R < start || L > end) {
      return null
    }
    if (L <= start && end <= R) {
      return this.tree[node]
    }

    const mid = Math.floor((start + end) / 2)

    const leftResult = this.query(2 * node + 1, start, mid, L, R)

    const rightResult = this.query(2 * node + 2, mid + 1, end, L, R)

    return this.merge(leftResult, rightResult, "query")
  }
  getQuery(L, R) {
    if (
      !Number.isInteger(L) ||
      !Number.isInteger(R) ||
      L < 0 ||
      R >= this.n ||
      L > R
    ) {
      throw new Error(`Invalid range [${L}, ${R}]`)
    }

    return this.query(0, 0, this.n - 1, L, R)
  }
  update(node, start, end, index, value) {
    if (start === end) {
      this.arr[index] = value

      this.tree[node] = {
        minimum: value,
        maximum: value,
      }

      return
    }

    const mid = Math.floor((start + end) / 2)

    if (index <= mid) {
      this.update(2 * node + 1, start, mid, index, value)
    } else {
      this.update(2 * node + 2, mid + 1, end, index, value)
    }
    this.tree[node] = this.merge(
      this.tree[2 * node + 1],
      this.tree[2 * node + 2],
      "update",
    )
  }
  updateValue(index, value) {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= this.n ||
      !Number.isInteger(value)
    ) {
      throw new Error("Invalid update index or value.")
    }

    this.update(0, 0, this.n - 1, index, value)
  }

  displayTree(node, start, end) {
    const current = this.tree[node]

    console.log(
      `Node ${node} | Range [${start}, ${end}] | ` +
        `Minimum = ${current.minimum} | ` +
        `Maximum = ${current.maximum}`,
    )

    if (start === end) return

    const mid = Math.floor((start + end) / 2)

    this.displayTree(2 * node + 1, start, mid)

    this.displayTree(2 * node + 2, mid + 1, end)
  }

  display() {
    this.displayTree(0, 0, this.n - 1)
  }
  getHeight() {
    return Math.ceil(Math.log2(this.n))
  }
}

function runAssignment() {
  const input = fs.readFileSync("input.txt", "utf8").trim()

  if (!input) {
    throw new Error("input.txt is empty.")
  }

  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  let lineIndex = 0

  const arr = lines[lineIndex++].split(/[\s,]+/).map(Number)

  if (!arr.length || arr.some((x) => !Number.isInteger(x))) {
    throw new Error("Invalid input array.")
  }

  const segmentTree = new SegmentTree(arr)

  console.log("\n========== SEGMENT TREE ==========")

  console.log("\nOriginal Array:")
  console.log(segmentTree.arr)

  console.log("\nSegment Tree Representation:")
  segmentTree.display()

  const queryCount = Number(lines[lineIndex++])

  if (!Number.isInteger(queryCount) || queryCount < 0) {
    throw new Error("Invalid query count.")
  }

  console.log("\n========== RANGE QUERIES ==========")

  for (let i = 0; i < queryCount; i++) {
    if (lineIndex >= lines.length) {
      throw new Error("Missing query ranges.")
    }

    const [L, R] = lines[lineIndex++].split(/[\s,]+/).map(Number)

    const result = segmentTree.getQuery(L, R)

    console.log(`\nQuery [${L}, ${R}]`)
    console.log("Minimum =", result.minimum)
    console.log("Maximum =", result.maximum)
  }

  if (lineIndex < lines.length) {
    const updateCount = Number(lines[lineIndex++])

    if (!Number.isInteger(updateCount) || updateCount < 0) {
      throw new Error("Invalid update count.")
    }

    console.log("\n========== POINT UPDATES ==========")

    for (let i = 0; i < updateCount; i++) {
      if (lineIndex >= lines.length) {
        throw new Error("Missing update information.")
      }

      const [index, newValue, L, R] = lines[lineIndex++]
        .split(/[\s,]+/)
        .map(Number)

      console.log("\nUpdate:")
      console.log("Index =", index)
      console.log("New Value =", newValue)

      segmentTree.updateValue(index, newValue)

      console.log("\nUpdated Array:")
      console.log(segmentTree.arr)

      const result = segmentTree.getQuery(L, R)

      console.log(`\nQuery [${L}, ${R}]`)
      console.log("Minimum =", result.minimum)
      console.log("Maximum =", result.maximum)
    }
  }
}

const sizes = [100, 500, 1000, 5000, 10000, 50000]

const inputTypes = ["random", "sorted", "reverse-sorted"]

const QUERY_COUNT = 100

function randomGenerator(seed) {
  let state = seed >>> 0

  return function () {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5

    return (state >>> 0) / 4294967296
  }
}

function generateArray(n, type) {
  if (type === "sorted") {
    return Array.from({ length: n }, (_, i) => i + 1)
  }

  if (type === "reverse-sorted") {
    return Array.from({ length: n }, (_, i) => n - i)
  }

  const random = randomGenerator(n * 12345)

  return Array.from({ length: n }, () => Math.floor(random() * 1000000000) + 1)
}

function linearQuery(arr, L, R) {
  let minimum = arr[L]
  let maximum = arr[L]

  let comparisons = 0

  for (let i = L + 1; i <= R; i++) {
    comparisons++

    if (arr[i] < minimum) {
      minimum = arr[i]
    }

    comparisons++

    if (arr[i] > maximum) {
      maximum = arr[i]
    }
  }

  return {
    minimum,
    maximum,
    comparisons,
  }
}

function generateQueries(n) {
  const queries = []

  const maxOffset = Math.max(1, Math.floor(n * 0.1))

  for (let i = 0; i < QUERY_COUNT; i++) {
    const L = (i * 7) % maxOffset

    const R = n - 1 - ((i * 11) % maxOffset)

    queries.push([L, R])
  }

  return queries
}

function runExperiment(n, type) {
  const arr = generateArray(n, type)

  const segmentTree = new SegmentTree(arr)

  const buildComparisons = segmentTree.comparisons.build

  const queries = generateQueries(n)

  let segmentQueryComparisons = 0
  let linearQueryComparisons = 0

  for (const [L, R] of queries) {
    const segmentResult = segmentTree.getQuery(L, R)

    segmentQueryComparisons += segmentTree.comparisons.query

    segmentTree.comparisons.query = 0
    const linearResult = linearQuery(arr, L, R)

    linearQueryComparisons += linearResult.comparisons

    if (
      segmentResult.minimum !== linearResult.minimum ||
      segmentResult.maximum !== linearResult.maximum
    ) {
      throw new Error("Query verification failed.")
    }
  }

  const avgSegmentQuery = segmentQueryComparisons / QUERY_COUNT

  const avgLinearQuery = linearQueryComparisons / QUERY_COUNT

  const updateIndex = Math.floor(n / 2)

  const newValue = -1000000001

  segmentTree.updateValue(updateIndex, newValue)

  const updateComparisons = segmentTree.comparisons.update

  const updatedResult = segmentTree.getQuery(0, n - 1)

  let expectedMin = Infinity
  let expectedMax = -Infinity

  for (const value of segmentTree.arr) {
    expectedMin = Math.min(expectedMin, value)
    expectedMax = Math.max(expectedMax, value)
  }

  if (
    updatedResult.minimum !== expectedMin ||
    updatedResult.maximum !== expectedMax
  ) {
    throw new Error("Update verification failed.")
  }

  return {
    input_type: type,
    n: n,
    build_comparisons: buildComparisons,
    segment_query_comparisons: avgSegmentQuery.toFixed(2),
    linear_query_comparisons: avgLinearQuery.toFixed(2),
    update_comparisons: updateComparisons,
    height: segmentTree.getHeight(),
  }
}

function runBenchmark() {
  const results = []

  for (const type of inputTypes) {
    for (const n of sizes) {
      const result = runExperiment(n, type)

      results.push(result)
    }
  }

  const headers = [
    "input_type",
    "n",
    "build_comparisons",
    "segment_query_comparisons",
    "linear_query_comparisons",
    "update_comparisons",
    "height",
  ]

  const csvRows = results.map((row) =>
    headers.map((header) => row[header]).join(","),
  )

  const csvContent = [headers.join(","), ...csvRows].join("\n")

  fs.writeFileSync("segment_comparison.csv", csvContent)
}

const mode = process.argv[2]

if (mode === "benchmark") {
  runBenchmark()
} else if (!mode) {
  runAssignment()
} else {
  console.log("Invalid mode.")
  console.log("Use:")
  console.log("node segment.js")
  console.log("node segment.js benchmark")
}
