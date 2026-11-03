import fs from "fs"

class Node {
  constructor(value, color = "RED") {
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
    } else if (y === y.parent.right) {
      y.parent.right = x
    } else {
      y.parent.left = x
    }

    x.right = y
    y.parent = x
  }

  insert(key) {
    const z = new Node(key)
    z.left = this.NIL
    z.right = this.NIL

    let y = this.NIL
    let x = this.root

    let comparisons = 0

    while (x !== this.NIL) {
      y = x
      comparisons++

      if (z.value < x.value) {
        x = x.left
      } else if (z.value > x.value) {
        x = x.right
      } else {
        return comparisons
      }
    }

    z.parent = y

    if (y === this.NIL) {
      this.root = z
    } else if (z.value < y.value) {
      z.parent.left = z
    } else {
      z.parent.right = z
    }

    z.color = "RED"

    this.insertFixup(z)

    return comparisons
  }

  insertFixup(z) {
    while (z.parent.color === "RED") {
      if (z.parent === z.parent.parent.left) {
        let y = z.parent.parent.right

        // Case 1: Uncle is RED
        if (y.color === "RED") {
          z.parent.color = "BLACK"
          y.color = "BLACK"
          z.parent.parent.color = "RED"

          z = z.parent.parent
        } else {
          // Case 2: Left-Right
          if (z === z.parent.right) {
            z = z.parent
            this.leftRotate(z)
          }

          // Case 3: Left-Left
          z.parent.color = "BLACK"
          z.parent.parent.color = "RED"

          this.rightRotate(z.parent.parent)
        }
      } else {
        let y = z.parent.parent.left

        // Case 1: Uncle is RED
        if (y.color === "RED") {
          z.parent.color = "BLACK"
          y.color = "BLACK"
          z.parent.parent.color = "RED"

          z = z.parent.parent
        } else {
          // Case 2: Right-Left
          if (z === z.parent.left) {
            z = z.parent
            this.rightRotate(z)
          }

          // Case 3: Right-Right
          z.parent.color = "BLACK"
          z.parent.parent.color = "RED"

          this.leftRotate(z.parent.parent)
        }
      }
    }

    this.root.color = "BLACK"
  }

  search(key) {
    let current = this.root
    let comparisons = 0

    while (current !== this.NIL) {
      comparisons++

      if (key === current.value) {
        return {
          node: current,
          comparisons,
        }
      }

      if (key < current.value) {
        current = current.left
      } else {
        current = current.right
      }
    }

    return {
      node: null,
      comparisons,
    }
  }

  minimum(node) {
    while (node.left !== this.NIL) {
      node = node.left
    }

    return node
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

  delete(key) {
    const result = this.search(key)

    if (result.node === null) {
      return result.comparisons
    }

    let z = result.node
    let y = z
    let yOriginalColor = y.color
    let x

    if (z.left === this.NIL) {
      x = z.right
      this.transplant(z, z.right)
    } else if (z.right === this.NIL) {
      x = z.left
      this.transplant(z, z.left)
    } else {
      y = this.minimum(z.right)
      yOriginalColor = y.color
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

    if (yOriginalColor === "BLACK") {
      this.deleteFixup(x)
    }

    return result.comparisons
  }

  deleteFixup(x) {
    while (x !== this.root && x.color === "BLACK") {
      if (x === x.parent.left) {
        let w = x.parent.right

        // Case 1: Sibling is RED
        if (w.color === "RED") {
          w.color = "BLACK"
          x.parent.color = "RED"

          this.leftRotate(x.parent)
          w = x.parent.right
        }

        // Case 2: Both sibling children are BLACK
        if (w.left.color === "BLACK" && w.right.color === "BLACK") {
          w.color = "RED"
          x = x.parent
        } else {
          // Case 3: Far child is BLACK
          if (w.right.color === "BLACK") {
            w.left.color = "BLACK"
            w.color = "RED"

            this.rightRotate(w)
            w = x.parent.right
          }

          // Case 4: Far child is RED
          w.color = x.parent.color
          x.parent.color = "BLACK"
          w.right.color = "BLACK"

          this.leftRotate(x.parent)

          x = this.root
        }
      } else {
        let w = x.parent.left

        // Case 1: Sibling is RED
        if (w.color === "RED") {
          w.color = "BLACK"
          x.parent.color = "RED"

          this.rightRotate(x.parent)
          w = x.parent.left
        }

        // Case 2: Both sibling children are BLACK
        if (w.right.color === "BLACK" && w.left.color === "BLACK") {
          w.color = "RED"
          x = x.parent
        } else {
          // Case 3: Far child is BLACK
          if (w.left.color === "BLACK") {
            w.right.color = "BLACK"
            w.color = "RED"

            this.leftRotate(w)
            w = x.parent.left
          }

          // Case 4: Far child is RED
          w.color = x.parent.color
          x.parent.color = "BLACK"
          w.left.color = "BLACK"

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

    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
  }

  inOrder(node = this.root, result = []) {
    if (node !== this.NIL) {
      this.inOrder(node.left, result)
      result.push(node.value)
      this.inOrder(node.right, result)
    }

    return result
  }

  displayInOrder() {
    const values = this.inOrder()
    console.log(values.join(" "))
  }

  clone() {
    const newTree = new RedBlackTree()

    const copyNode = (node, parent) => {
      if (node === this.NIL) {
        return newTree.NIL
      }

      const newNode = new Node(node.value, node.color)

      newNode.parent = parent
      newNode.left = copyNode(node.left, newNode)
      newNode.right = copyNode(node.right, newNode)

      return newNode
    }

    newTree.root = copyNode(this.root, newTree.NIL)

    return newTree
  }

  validate() {
    if (this.root === this.NIL) {
      return true
    }

    if (this.root.color !== "BLACK") {
      return false
    }

    const check = (node, min, max) => {
      if (node === this.NIL) {
        return 1
      }

      if (
        (min !== null && node.value <= min) ||
        (max !== null && node.value >= max)
      ) {
        return -1
      }

      if (
        node.color === "RED" &&
        (node.left.color === "RED" || node.right.color === "RED")
      ) {
        return -1
      }

      if (node.left !== this.NIL && node.left.parent !== node) {
        return -1
      }

      if (node.right !== this.NIL && node.right.parent !== node) {
        return -1
      }

      const leftHeight = check(node.left, min, node.value)
      const rightHeight = check(node.right, node.value, max)

      if (
        leftHeight === -1 ||
        rightHeight === -1 ||
        leftHeight !== rightHeight
      ) {
        return -1
      }

      return leftHeight + (node.color === "BLACK" ? 1 : 0)
    }

    return check(this.root, null, null) !== -1
  }
}

function runFileMode(deletionArgument) {
  if (!fs.existsSync("input.txt")) {
    console.log("Error: input.txt not found.")
    return
  }

  const input = fs
    .readFileSync("input.txt", "utf8")
    .trim()
    .split(/\s+/)
    .filter((value) => value.length > 0)
    .map(Number)

  if (input.length === 0 || input.some((value) => !Number.isFinite(value))) {
    console.log("Error: Invalid or empty input.txt")
    return
  }

  const insertionValues = input

  const deletionKey =
    deletionArgument !== undefined ? Number(deletionArgument) : null

  if (deletionKey !== null && !Number.isFinite(deletionKey)) {
    console.log("Error: Invalid deletion key.")
    return
  }

  const tree = new RedBlackTree()

  console.log("\n========== RED-BLACK TREE ==========")

  console.log("\nInserting elements...")

  for (const value of insertionValues) {
    tree.insert(value)
  }

  console.log("Total elements inserted:", insertionValues.length)

  console.log("\nIn-order traversal after insertion:")
  tree.displayInOrder()

  console.log("Tree height:", tree.getHeight())
  console.log("Valid Red-Black Tree:", tree.validate())

  if (deletionKey !== null) {
    console.log("\nDeleting:", deletionKey)

    const result = tree.search(deletionKey)

    if (result.node === null) {
      console.log("Element not found. Nothing deleted.")
    } else {
      tree.delete(deletionKey)
      console.log("Element deleted successfully.")
    }

    console.log("\nIn-order traversal after deletion:")
    tree.displayInOrder()

    console.log("Tree height:", tree.getHeight())
    console.log("Valid Red-Black Tree:", tree.validate())
  } else {
    console.log("\nNo deletion key provided. Skipping deletion.")
  }

  const finalValues = tree.inOrder()

  fs.writeFileSync("output.txt", finalValues.join(" ") + "\n")

  console.log("\nFinal traversal written to output.txt")
}

function generateRandomArray(n) {
  const values = []

  for (let i = 1; i <= n; i++) {
    values.push(i)
  }

  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[values[i], values[j]] = [values[j], values[i]]
  }

  return values
}

function generateSortedArray(n) {
  return Array.from({ length: n }, (_, i) => i + 1)
}

function generateReverseSortedArray(n) {
  return Array.from({ length: n }, (_, i) => n - i)
}

function runExperiment() {
  const N = 1000

  const inputTypes = [
    {
      name: "random",
      generate: () => generateRandomArray(N),
    },
    {
      name: "sorted",
      generate: () => generateSortedArray(N),
    },
    {
      name: "reverse_sorted",
      generate: () => generateReverseSortedArray(N),
    },
  ]

  const rows = []

  for (const inputType of inputTypes) {
    console.log("\nRunning experiment:", inputType.name)

    const values = inputType.generate()

    const tree = new RedBlackTree()

    for (let i = 0; i < values.length; i++) {
      const value = values[i]

      const insertionComparisons = tree.insert(value)

      const height = tree.getHeight()
      const searchResult = tree.search(value)
      const searchComparisons = searchResult.comparisons
      const temporaryTree = tree.clone()

      const deletionComparisons = temporaryTree.delete(value)

      rows.push({
        input_type: inputType.name,
        nodes: i + 1,
        value: value,
        insertion_comparisons: insertionComparisons,
        height: height,
        search_comparisons: searchComparisons,
        deletion_comparisons: deletionComparisons,
      })
    }

    console.log("Completed:", inputType.name)
  }

  const header = [
    "input_type",
    "nodes",
    "value",
    "insertion_comparisons",
    "height",
    "search_comparisons",
    "deletion_comparisons",
  ].join(",")

  const csvRows = rows.map((row) =>
    [
      row.input_type,
      row.nodes,
      row.value,
      row.insertion_comparisons,
      row.height,
      row.search_comparisons,
      row.deletion_comparisons,
    ].join(","),
  )

  const csvContent = [header, ...csvRows].join("\n")

  fs.writeFileSync("rb_1000_comparisons.csv", csvContent)

  console.log("\nExperiment completed!")
  console.log("CSV file generated: rb_1000_comparisons.csv")
  console.log("Total data rows:", rows.length)
}

const mode = process.argv[2] || "experiment"

if (mode === "file") {
  const deletionArgument = process.argv[3]

  runFileMode(deletionArgument)
} else if (mode === "experiment") {
  runExperiment()
} else {
  console.log("Invalid mode.")
  console.log("Use:")
  console.log("node red_black_tree.js file")
  console.log("node red_black_tree.js experiment")
}
