export function createRandomGenerator(seed) {
  let state = seed

  return function () {
    state = (state * 1664525 + 1013904223) >>> 0

    return state / 4294967296
  }
}

function shuffle(array, random) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))

    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

export function generateInputs(n, random) {
  const sorted = Array.from({ length: n }, (_, i) => i + 1)

  const randomInput = [...sorted]

  shuffle(randomInput, random)

  const reverseSorted = [...sorted].reverse()

  return {
    random: randomInput,
    sorted: sorted,
    reverseSorted: reverseSorted,
  }
}

export function generateSearchValues(input, count, random) {
  const values = []

  for (let i = 0; i < count; i++) {
    const index = Math.floor(random() * input.length)

    values.push(input[index])
  }

  return values
}

export function generateDeletionValues(input, count, random) {
  const values = [...input]

  shuffle(values, random)

  return values.slice(0, count)
}
