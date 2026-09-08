/**using Chart.js library to implement graphs */

import {
  sizes,
  linBestData,
  linAvgData,
  linWorstData,
  binBestData,
  binAvgData,
  binWorstData,
} from "./searching.js"

const linearCtx = document.getElementById("linearChart").getContext("2d")

new Chart(linearCtx, {
  type: "line",
  data: {
    labels: sizes,
    datasets: [
      {
        label: "Best Case",
        data: linBestData,
        borderColor: "green",
        fill: false,
      },
      {
        label: "Average Case",
        data: linAvgData,
        borderColor: "orange",
        fill: false,
      },
      {
        label: "Worst Case",
        data: linWorstData,
        borderColor: "red",
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      x: {
        type: "linear",
        title: { display: true, text: "Input Size (n)" },
      },
      y: {
        type: "linear",
        title: { display: true, text: "Number of Comparisons" },
      },
    },
    plugins: {
      title: { display: true, text: "Linear Search: Comparison Growth" },
    },
  },
})

const binaryCtx = document.getElementById("binaryChart").getContext("2d")

new Chart(binaryCtx, {
  type: "line",
  data: {
    labels: sizes,
    datasets: [
      {
        label: "Best Case",
        data: binBestData,
        borderColor: "lightblue",
        fill: false,
      },
      {
        label: "Average Case",
        data: binAvgData,
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Worst Case",
        data: binWorstData,
        borderColor: "purple",
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      x: {
        type: "linear",
        title: { display: true, text: "Input Size (n)" },
      },
      y: {
        type: "linear",
        title: { display: true, text: "Number of Comparisons" },
      },
    },
    plugins: {
      title: { display: true, text: "Binary Search: Comparison Growth" },
    },
  },
})

console.table(binBestData)
