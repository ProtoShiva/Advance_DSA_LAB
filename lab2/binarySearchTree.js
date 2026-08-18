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
    const newNode = new Node(value)

    if (this.root === null) {
      this.root = newNode
      return 0
    }

    let current = this.root
    let comparisons = 0

    while (true) {
      comparisons++

      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode
          break
        }

        current = current.left
      } else {
        if (current.right === null) {
          current.right = newNode
          break
        }

        current = current.right
      }
    }

    return comparisons
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
    let comparisons = 0

    let parent = null
    let current = this.root

    while (current !== null) {
      comparisons++

      if (value === current.value) {
        break
      }

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

    if (current.left === null && current.right === null) {
      if (parent === null) {
        this.root = null
      } else if (parent.left === current) {
        parent.left = null
      } else {
        parent.right = null
      }

      return comparisons
    }

    if (current.left === null) {
      if (parent === null) {
        this.root = current.right
      } else if (parent.left === current) {
        parent.left = current.right
      } else {
        parent.right = current.right
      }

      return comparisons
    }

    if (current.right === null) {
      if (parent === null) {
        this.root = current.left
      } else if (parent.left === current) {
        parent.left = current.left
      } else {
        parent.right = current.left
      }

      return comparisons
    }

    let successorParent = current
    let successor = current.right

    while (successor.left !== null) {
      comparisons++

      successorParent = successor
      successor = successor.left
    }

    current.value = successor.value

    if (successorParent.left === successor) {
      successorParent.left = successor.right
    } else {
      successorParent.right = successor.right
    }

    return comparisons
  }

  height() {
    if (this.root === null) {
      return 0
    }

    const queue = [
      {
        node: this.root,
        level: 1,
      },
    ]

    let index = 0
    let maxHeight = 0

    while (index < queue.length) {
      const current = queue[index++]

      maxHeight = Math.max(maxHeight, current.level)

      if (current.node.left !== null) {
        queue.push({
          node: current.node.left,
          level: current.level + 1,
        })
      }

      if (current.node.right !== null) {
        queue.push({
          node: current.node.right,
          level: current.level + 1,
        })
      }
    }

    return maxHeight
  }
}
