import fs from "fs"

class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.height = 1
  }
}

class AVLTree {
  constructor() {
    this.root = null
  }

  getHeight(node) {
    return node ? node.height : 0
  }

  updateHeight(node) {
    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
  }

  getBalance(node) {
    if (!node) {
      return 0
    }

    return this.getHeight(node.left) - this.getHeight(node.right)
  }

  rightRotate(y) {
    const x = y.left
    const T2 = x.right

    x.right = y
    y.left = T2

    this.updateHeight(y)
    this.updateHeight(x)

    return x
  }

  leftRotate(x) {
    const y = x.right
    const T2 = y.left

    y.left = x
    x.right = T2

    this.updateHeight(x)
    this.updateHeight(y)

    return y
  }

  insert(value) {
    const insertNode = (node) => {
      if (node === null) {
        return new Node(value)
      }

      if (value < node.value) {
        node.left = insertNode(node.left)
      } else if (value > node.value) {
        node.right = insertNode(node.right)
      } else {
        return node
      }

      this.updateHeight(node)

      const balance = this.getBalance(node)

      if (balance > 1 && value < node.left.value) {
        return this.rightRotate(node)
      }

      if (balance < -1 && value > node.right.value) {
        return this.leftRotate(node)
      }

      if (balance > 1 && value > node.left.value) {
        node.left = this.leftRotate(node.left)

        return this.rightRotate(node)
      }

      if (balance < -1 && value < node.right.value) {
        node.right = this.rightRotate(node.right)

        return this.leftRotate(node)
      }

      return node
    }

    this.root = insertNode(this.root)
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

  getTreeHeight() {
    return this.getHeight(this.root)
  }
}

function generateRandomArray(n) {
  const array = []

  for (let i = 1; i <= n; i++) {
    array.push(i)
  }

  //Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

function generateSortedArray(n) {
  const array = []

  for (let i = 1; i <= n; i++) {
    array.push(i)
  }

  return array
}

function generateReverseSortedArray(n) {
  const array = []

  for (let i = n; i >= 1; i--) {
    array.push(i)
  }

  return array
}

//search experiment starts

function runExperiment(inputArray, order) {
  const tree = new AVLTree()
  const results = []

  for (let i = 0; i < inputArray.length; i++) {
    const value = inputArray[i]
    tree.insert(value)

    const n = i + 1

    let totalComparisons = 0

    for (let j = 0; j < 1000; j++) {
      const randomIndex = Math.floor(Math.random() * n)

      const searchValue = inputArray[randomIndex]

      totalComparisons += tree.search(searchValue)
    }

    const averageComparisons = totalComparisons / 1000

    results.push({
      order: order,
      n: n,
      total_search_comparisons: totalComparisons,
      average_search_comparisons: averageComparisons,
      height: tree.getTreeHeight(),
    })

    if (n % 100 === 0) {
      console.log(`${order}: n = ${n}`)
    }
  }

  return results
}

//making csv file

function convertToCSV(data) {
  const header =
    "order,n,total_search_comparisons,average_search_comparisons,height\n"

  const rows = data.map((row) => {
    return [
      row.order,
      row.n,
      row.total_search_comparisons,
      row.average_search_comparisons.toFixed(2),
      row.height,
    ].join(",")
  })

  return header + rows.join("\n")
}

const N = 1000

console.log("Generating input sequences...\n")

const randomArray = generateRandomArray(N)

const sortedArray = generateSortedArray(N)

const reverseArray = generateReverseSortedArray(N)

const randomResults = runExperiment(randomArray, "random")
const sortedResults = runExperiment(sortedArray, "sorted")
const reverseResults = runExperiment(reverseArray, "reverse")

const allResults = [...randomResults, ...sortedResults, ...reverseResults]

const csv = convertToCSV(allResults)

fs.writeFileSync("avl_search_comparisons.csv", csv)
