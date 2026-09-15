import { BST } from "./binarySearchTree.js"

const tree = new BST()
const keys = [50, 30, 70, 20, 40, 60, 80, 10]

keys.forEach((key) => tree.insert(key))

console.log("Inorder Traversal:  ", tree.inorder())
console.log("Preorder Traversal: ", tree.preorder())
console.log("Postorder Traversal:", tree.postorder())

const presentKey = 40
const absentKey = 100

console.log(
  `Search ${presentKey}:`,
  tree.search(presentKey) ? "Found" : "Not Found",
)
console.log(
  `Search ${absentKey}:`,
  tree.search(absentKey) ? "Found" : "Not Found",
)

tree.delete(10)
console.log("After deleting leaf (10):", tree.inorder())
console.log("Is valid BST?", tree.isValidBST())

tree.delete(20)
console.log("After deleting one-child node (20):", tree.inorder())
console.log("Is valid BST?", tree.isValidBST())

tree.delete(30)
console.log("After deleting two-children node (30):", tree.inorder())
console.log("Is valid BST?", tree.isValidBST())
