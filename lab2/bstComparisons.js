import fs from "fs"

class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

export class BST {
  constructor() {
    this.root = null
  }

  insert(value) {
    if (this.root === null) {
      this.root = new Node(value)

      return {
        comparisons: 0,
        height: 0,
      }
    }

    let current = this.root
    let comparisons = 0

    while (true) {
      comparisons++

      if (value < current.value) {
        if (current.left === null) {
          current.left = new Node(value)
          break
        }

        current = current.left
      } else {
        if (current.right === null) {
          current.right = new Node(value)
          break
        }

        current = current.right
      }
    }

    return {
      comparisons: comparisons,
      height: this.getHeight(),
    }
  }

  getHeight() {
    return this.calculateHeight(this.root)
  }

  calculateHeight(node) {
    if (node === null) {
      return -1
    }

    const leftHeight = this.calculateHeight(node.left)
    const rightHeight = this.calculateHeight(node.right)

    return 1 + Math.max(leftHeight, rightHeight)
  }

  search(value) {
    let current = this.root
    let comparisons = 0

    while (current !== null) {
      comparisons++

      if (value === current.value) {
        return comparisons
      }

      if (value < current.value) {
        current = current.left
      } else {
        current = current.right
      }
    }

    return comparisons
  }

  delete(value) {
    let current = this.root
    let parent = null
    let comparisons = 0

    while (current !== null && current.value !== value) {
      comparisons++

      parent = current

      if (value < current.value) {
        current = current.left
      } else {
        current = current.right
      }
    }

    if (current === null) {
      return comparisons
    }

    comparisons++

    if (current.left === null && current.right === null) {
      if (parent === null) {
        this.root = null
      } else if (parent.left === current) {
        parent.left = null
      } else {
        parent.right = null
      }
    } else if (current.left === null) {
      if (parent === null) {
        this.root = current.right
      } else if (parent.left === current) {
        parent.left = current.right
      } else {
        parent.right = current.right
      }
    } else if (current.right === null) {
      if (parent === null) {
        this.root = current.left
      } else if (parent.left === current) {
        parent.left = current.left
      } else {
        parent.right = current.left
      }
    } else {
      let successorParent = current
      let successor = current.right

      while (successor.left !== null) {
        comparisons++
        successorParent = successor
        successor = successor.left
      }

      comparisons++
      current.value = successor.value

      if (successorParent.left === successor) {
        successorParent.left = successor.right
      } else {
        successorParent.right = successor.right
      }
    }

    return comparisons
  }
}

function generateRandomNumbers(n) {
  const numbers = []

  for (let i = 1; i <= n; i++) {
    numbers.push(i)
  }

  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
  }

  return numbers
}

function generateDeletionValues(n) {
  const values = []

  for (let i = 1; i <= n; i++) {
    values.push(i)
  }
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[values[i], values[j]] = [values[j], values[i]]
  }
  return values.slice(0, 500)
}

const n = 1000

const input = generateRandomNumbers(n)

console.log("Random input generated.")
console.log("First 20 elements:", input.slice(0, 20))

const sortedInput = [...input].sort((a, b) => a - b)

const bst = new BST()
const sortedBST = new BST()

const results = []
console.log(sortedInput.slice(0, 20))

for (let i = 0; i < n; i++) {
  const value = input[i]

  const result = bst.insert(value)

  const currentElements = input.slice(0, i + 1)

  let searchComparisons = 0

  for (let j = 0; j < 1000; j++) {
    const randomIndex = Math.floor(Math.random() * currentElements.length)

    const searchValue = currentElements[randomIndex]

    searchComparisons += bst.search(searchValue)
  }

  results.push({
    elements: i + 1,
    value: value,
    comparisons: result.comparisons,
    height: result.height,
    searchComparisons: searchComparisons,
  })
}

const sortedResults = []

for (let i = 0; i < n; i++) {
  const value = sortedInput[i]

  const result = sortedBST.insert(value)

  const currentElements = sortedInput.slice(0, i + 1)

  let searchComparisons = 0

  for (let j = 0; j < 1000; j++) {
    const randomIndex = Math.floor(Math.random() * currentElements.length)

    const searchValue = currentElements[randomIndex]

    searchComparisons += sortedBST.search(searchValue)
  }

  sortedResults.push({
    elements: i + 1,
    value: value,
    comparisons: result.comparisons,
    height: result.height,
    searchComparisons: searchComparisons,
  })
}

const deletionValues = generateDeletionValues(n)

let randomDeletionComparisons = []
let sortedDeletionComparisons = []

for (let i = 0; i < 500; i++) {
  const value = deletionValues[i]
  const randomComparisons = bst.delete(value)
  randomDeletionComparisons.push(randomComparisons)
  const sortedComparisons = sortedBST.delete(value)
  sortedDeletionComparisons.push(sortedComparisons)
}

let csv =
  "elements,randomComparisons,sortedComparisons,randomHeight,sortedHeight,randomSearchComparisons,sortedSearchComparisons,randomDeletionComparisons,sortedDeletionComparisons\n"

for (let i = 0; i < n; i++) {
  const randomDeletion = i < 500 ? randomDeletionComparisons[i] : ""

  const sortedDeletion = i < 500 ? sortedDeletionComparisons[i] : ""

  csv +=
    `${i + 1},` +
    `${results[i].comparisons},` +
    `${sortedResults[i].comparisons},` +
    `${results[i].height},` +
    `${sortedResults[i].height},` +
    `${results[i].searchComparisons},` +
    `${sortedResults[i].searchComparisons},` +
    `${randomDeletion},` +
    `${sortedDeletion}\n`
}

fs.writeFileSync("bst_comparison_data.csv", csv)
