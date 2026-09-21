import fs from "fs"

// ==================================================
// Node
// ==================================================

class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.height = 1
  }
}

// ==================================================
// AVL Tree
// ==================================================

class AVLTree {
  // ------------------------------------------------
  // Get height of a node
  // ------------------------------------------------

  getHeight(node) {
    if (node === null) {
      return 0
    }

    return node.height
  }

  // ------------------------------------------------
  // Get balance factor
  // ------------------------------------------------

  getBalance(node) {
    if (node === null) {
      return 0
    }

    return this.getHeight(node.left) - this.getHeight(node.right)
  }

  // ------------------------------------------------
  // Update height
  // ------------------------------------------------

  updateHeight(node) {
    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
  }

  // ------------------------------------------------
  // Right Rotation
  // LL Case
  // ------------------------------------------------

  rightRotate(y) {
    const x = y.left
    const T2 = x.right

    // Rotation
    x.right = y
    y.left = T2

    // Update heights
    this.updateHeight(y)
    this.updateHeight(x)

    console.log(`LL Rotation at ${y.value}`)

    return x
  }

  // ------------------------------------------------
  // Left Rotation
  // RR Case
  // ------------------------------------------------

  leftRotate(x) {
    const y = x.right
    const T2 = y.left

    // Rotation
    y.left = x
    x.right = T2

    // Update heights
    this.updateHeight(x)
    this.updateHeight(y)

    console.log(`RR Rotation at ${x.value}`)

    return y
  }

  // ------------------------------------------------
  // Insert
  // ------------------------------------------------

  insert(root, value) {
    if (root === null) {
      return new Node(value)
    }

    if (value < root.value) {
      root.left = this.insert(root.left, value)
    } else if (value > root.value) {
      root.right = this.insert(root.right, value)
    } else {
      return root
    }

    this.updateHeight(root)

    const balance = this.getBalance(root)

    if (balance > 1 && value < root.left.value) {
      return this.rightRotate(root)
    }

    if (balance < -1 && value > root.right.value) {
      return this.leftRotate(root)
    }

    if (balance > 1 && value > root.left.value) {
      console.log(`LR Rotation at ${root.value}`)

      root.left = this.leftRotate(root.left)

      return this.rightRotate(root)
    }

    if (balance < -1 && value < root.right.value) {
      console.log(`RL Rotation at ${root.value}`)

      root.right = this.rightRotate(root.right)

      return this.leftRotate(root)
    }

    return root
  }

  inorder(root) {
    if (root === null) {
      return
    }

    this.inorder(root.left)

    console.log(
      `Value: ${root.value}, ` +
        `Height: ${root.height}, ` +
        `Balance: ${this.getBalance(root)}`,
    )

    this.inorder(root.right)
  }

  inorderToArray(root, result = []) {
    if (root === null) {
      return result
    }

    this.inorderToArray(root.left, result)

    result.push(
      `Value: ${root.value}, ` +
        `Height: ${root.height}, ` +
        `Balance: ${this.getBalance(root)}`,
    )

    this.inorderToArray(root.right, result)

    return result
  }
}

const data = fs.readFileSync("input.txt", "utf8")

const elements = data
  .split(/[\s,]+/)
  .filter(Boolean)
  .map(Number)

const tree = new AVLTree()

let root = null

for (const value of elements) {
  console.log(`\n========================================`)

  console.log(`Inserting: ${value}`)

  console.log(`========================================`)

  if (root === null) {
    console.log("Tree is empty")
  } else {
    console.log("\nTree before insertion:")

    tree.inorder(root)
  }

  root = tree.insert(root, value)

  console.log("\nTree after insertion:")

  tree.inorder(root)
}

console.log("\n\n========================================")

console.log("FINAL AVL TREE")

console.log("========================================\n")

tree.inorder(root)

const result = tree.inorderToArray(root)

fs.writeFileSync("output.txt", result.join("\n"))

console.log("\nIn-order traversal written to output.txt")
