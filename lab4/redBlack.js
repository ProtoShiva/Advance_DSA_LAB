import fs from "fs"

const MAX_N = 1000

class Node {
  constructor(value = null, color = "BLACK") {
    this.value = value
    this.color = color

    this.left = null
    this.right = null
    this.parent = null
  }
}

class RedBlackTree {
  constructor() {
    this.NIL = new Node(null, "BLACK")

    this.NIL.left = this.NIL
    this.NIL.right = this.NIL
    this.NIL.parent = this.NIL

    this.root = this.NIL
  }

  leftRotate(x) {
    const y = x.right

    x.right = y.left

    if (y.left !== this.NIL) {
      y.left.parent = x
    }

    y.parent = x.parent

    if (x.parent === this.NIL) {
      this.root = y
    } else if (x === x.parent.left) {
      x.parent.left = y
    } else {
      x.parent.right = y
    }

    y.left = x
    x.parent = y
  }

  rightRotate(y) {
    const x = y.left

    y.left = x.right

    if (x.right !== this.NIL) {
      x.right.parent = y
    }

    x.parent = y.parent

    if (y.parent === this.NIL) {
      this.root = x
    } else if (y === y.parent.left) {
      y.parent.left = x
    } else {
      y.parent.right = x
    }

    x.right = y
    y.parent = x
  }

  insert(value) {
    let newNode = new Node(value, "RED")

    newNode.left = this.NIL
    newNode.right = this.NIL
    newNode.parent = this.NIL

    let parent = this.NIL
    let current = this.root

    let comparisons = 0
    while (current !== this.NIL) {
      parent = current

      comparisons++

      if (value < current.value) {
        current = current.left
      } else {
        current = current.right
      }
    }

    newNode.parent = parent

    if (parent === this.NIL) {
      this.root = newNode
    } else if (value < parent.value) {
      parent.left = newNode
    } else {
      parent.right = newNode
    }
    this.insertFixup(newNode)

    return comparisons
  }
  insertFixup(z) {
    while (z.parent.color === "RED") {
      if (z.parent === z.parent.parent.left) {
        const uncle = z.parent.parent.right

        // Case 1
        if (uncle.color === "RED") {
          z.parent.color = "BLACK"
          uncle.color = "BLACK"
          z.parent.parent.color = "RED"

          z = z.parent.parent
        } else {
          // Case 2
          if (z === z.parent.right) {
            z = z.parent

            this.leftRotate(z)
          }

          // Case 3
          z.parent.color = "BLACK"
          z.parent.parent.color = "RED"

          this.rightRotate(z.parent.parent)
        }
      } else {
        const uncle = z.parent.parent.left

        // Case 1
        if (uncle.color === "RED") {
          z.parent.color = "BLACK"
          uncle.color = "BLACK"
          z.parent.parent.color = "RED"

          z = z.parent.parent
        } else {
          // Case 2
          if (z === z.parent.left) {
            z = z.parent

            this.rightRotate(z)
          }

          // Case 3
          z.parent.color = "BLACK"
          z.parent.parent.color = "RED"

          this.leftRotate(z.parent.parent)
        }
      }
    }

    this.root.color = "BLACK"
  }

  search(value) {
    let current = this.root

    let comparisons = 0

    while (current !== this.NIL) {
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

  minimum(node) {
    let current = node

    while (current.left !== this.NIL) {
      current = current.left
    }

    return current
  }

  transplant(u, v) {
    if (u.parent === this.NIL) {
      this.root = v
    } else if (u === u.parent.left) {
      u.parent.left = v
    } else {
      u.parent.right = v
    }

    v.parent = u.parent
  }

  delete(value) {
    let z = this.root

    let comparisons = 0

    while (z !== this.NIL) {
      comparisons++

      if (value === z.value) {
        break
      }

      if (value < z.value) {
        z = z.left
      } else {
        z = z.right
      }
    }

    if (z === this.NIL) {
      return comparisons
    }

    let y = z

    let originalColor = y.color

    let x

    // Case 1: no left child
    if (z.left === this.NIL) {
      x = z.right

      this.transplant(z, z.right)
    }

    // Case 2: no right child
    else if (z.right === this.NIL) {
      x = z.left

      this.transplant(z, z.left)
    }

    // Case 3: two children
    else {
      y = this.minimum(z.right)

      originalColor = y.color

      x = y.right

      if (y.parent === z) {
        x.parent = y
      } else {
        this.transplant(y, y.right)

        y.right = z.right

        y.right.parent = y
      }

      this.transplant(z, y)

      y.left = z.left
      y.left.parent = y

      y.color = z.color
    }

    if (originalColor === "BLACK") {
      this.deleteFixup(x)
    }

    return comparisons
  }

  deleteFixup(x) {
    while (x !== this.root && x.color === "BLACK") {
      if (x === x.parent.left) {
        let sibling = x.parent.right

        // Case 1
        if (sibling.color === "RED") {
          sibling.color = "BLACK"
          x.parent.color = "RED"

          this.leftRotate(x.parent)

          sibling = x.parent.right
        }

        // Case 2
        if (sibling.left.color === "BLACK" && sibling.right.color === "BLACK") {
          sibling.color = "RED"

          x = x.parent
        } else {
          // Case 3
          if (sibling.right.color === "BLACK") {
            sibling.left.color = "BLACK"
            sibling.color = "RED"

            this.rightRotate(sibling)

            sibling = x.parent.right
          }

          // Case 4
          sibling.color = x.parent.color
          x.parent.color = "BLACK"
          sibling.right.color = "BLACK"

          this.leftRotate(x.parent)

          x = this.root
        }
      } else {
        let sibling = x.parent.left

        // Case 1
        if (sibling.color === "RED") {
          sibling.color = "BLACK"
          x.parent.color = "RED"

          this.rightRotate(x.parent)

          sibling = x.parent.left
        }

        // Case 2
        if (sibling.right.color === "BLACK" && sibling.left.color === "BLACK") {
          sibling.color = "RED"

          x = x.parent
        } else {
          // Case 3
          if (sibling.left.color === "BLACK") {
            sibling.right.color = "BLACK"
            sibling.color = "RED"

            this.leftRotate(sibling)

            sibling = x.parent.left
          }

          // Case 4
          sibling.color = x.parent.color
          x.parent.color = "BLACK"
          sibling.left.color = "BLACK"

          this.rightRotate(x.parent)

          x = this.root
        }
      }
    }

    x.color = "BLACK"
  }

  getHeight(node = this.root) {
    if (node === this.NIL) {
      return 0
    }

    const leftHeight = this.getHeight(node.left)

    const rightHeight = this.getHeight(node.right)

    return 1 + Math.max(leftHeight, rightHeight)
  }

  clone() {
    const newTree = new RedBlackTree()

    if (this.root === this.NIL) {
      return newTree
    }

    function cloneNode(node, parent) {
      if (node === this.NIL) {
        return newTree.NIL
      }

      const newNode = new Node(node.value, node.color)

      newNode.parent = parent

      newNode.left = cloneNode.call(this, node.left, newNode)

      newNode.right = cloneNode.call(this, node.right, newNode)

      return newNode
    }

    newTree.root = cloneNode.call(this, this.root, newTree.NIL)

    return newTree
  }
}

function generateRandomElements(n) {
  const elements = []

  for (let i = 1; i <= n; i++) {
    elements.push(i)
  }

  for (let i = elements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[elements[i], elements[j]] = [elements[j], elements[i]]
  }

  return elements
}

function generateInput(type, n) {
  if (type === "random") {
    return generateRandomElements(n)
  }

  if (type === "sorted") {
    const elements = []

    for (let i = 1; i <= n; i++) {
      elements.push(i)
    }

    return elements
  }

  if (type === "reverse_sorted") {
    const elements = []

    for (let i = n; i >= 1; i--) {
      elements.push(i)
    }

    return elements
  }
}

function runExperiment(inputType) {
  console.log(`\nRunning ${inputType} experiment...`)

  const tree = new RedBlackTree()

  const results = []

  const elements = generateInput(inputType, MAX_N)

  for (let i = 0; i < MAX_N; i++) {
    const value = elements[i]

    const n = i + 1

    const insertionComparisons = tree.insert(value)

    const height = tree.getHeight()

    const searchComparisons = tree.search(value)

    const temporaryTree = tree.clone()

    const deletionComparisons = temporaryTree.delete(value)

    results.push({
      input_type: inputType,

      nodes: n,

      value: value,

      insertion_comparisons: insertionComparisons,

      height: height,

      search_comparisons: searchComparisons,

      deletion_comparisons: deletionComparisons,
    })

    if (n % 100 === 0) {
      console.log(`${inputType}: ${n}/${MAX_N}`)
    }
  }

  return results
}

function main() {
  let allResults = []
  allResults = allResults.concat(runExperiment("random"))
  allResults = allResults.concat(runExperiment("sorted"))
  allResults = allResults.concat(runExperiment("reverse_sorted"))

  let csv =
    "input_type,nodes,value," +
    "insertion_comparisons," +
    "height," +
    "search_comparisons," +
    "deletion_comparisons\n"

  for (const row of allResults) {
    csv +=
      `${row.input_type},` +
      `${row.nodes},` +
      `${row.value},` +
      `${row.insertion_comparisons},` +
      `${row.height},` +
      `${row.search_comparisons},` +
      `${row.deletion_comparisons}\n`
  }

  fs.writeFileSync("rb_1000_comparisons.csv", csv)
}

main()
