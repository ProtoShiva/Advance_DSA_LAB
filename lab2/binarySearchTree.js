export class Node {
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
    const newNode = new Node(value)

    if (this.root === null) {
      this.root = newNode
      return
    }

    let current = this.root
    while (true) {
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode
          return
        }
        current = current.left
      } else if (value > current.value) {
        if (current.right === null) {
          current.right = newNode
          return
        }
        current = current.right
      } else {
        return
      }
    }
  }

  inorder(node = this.root, result = []) {
    if (node !== null) {
      this.inorder(node.left, result)
      result.push(node.value)
      this.inorder(node.right, result)
    }
    return result
  }

  preorder(node = this.root, result = []) {
    if (node !== null) {
      result.push(node.value)
      this.preorder(node.left, result)
      this.preorder(node.right, result)
    }
    return result
  }

  postorder(node = this.root, result = []) {
    if (node !== null) {
      this.postorder(node.left, result)
      this.postorder(node.right, result)
      result.push(node.value)
    }
    return result
  }

  search(value, node = this.root) {
    if (node === null) {
      return false
    }
    if (value === node.value) {
      return true
    } else if (value < node.value) {
      return this.search(value, node.left)
    } else {
      return this.search(value, node.right)
    }
  }

  delete(value, node = this.root) {
    if (node === null) {
      return null
    }

    if (value < node.value) {
      node.left = this.delete(value, node.left)
    } else if (value > node.value) {
      node.right = this.delete(value, node.right)
    } else {
      if (node.left === null && node.right === null) {
        return null
      }

      if (node.left === null) {
        return node.right
      }

      if (node.right === null) {
        return node.left
      }

      let successor = node.right
      while (successor.left !== null) {
        successor = successor.left
      }

      node.value = successor.value

      node.right = this.delete(successor.value, node.right)
    }

    return node
  }

  /**Validating that the tree still satisfies the BST property */

  isValidBST(node = this.root, min = -Infinity, max = Infinity) {
    if (node === null) {
      return true
    }

    if (node.value <= min || node.value >= max) {
      return false
    }

    return (
      this.isValidBST(node.left, min, node.value) &&
      this.isValidBST(node.right, node.value, max)
    )
  }
}
