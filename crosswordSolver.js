const Same_Length = (puzzle) => {
  let lines = puzzle.split('\n');
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].length !== lines[0].length) return false
  }
  return true
}

const Valid_Puzzle_Format = (puzzle) => {
  // Check input type and format
  if (typeof puzzle !== "string" || puzzle === "" || new RegExp(!/^[.\n012]+$/).test(puzzle) || !Same_Length(puzzle)) return false
  else return true
}

const Valid_Words_Format = (words, puzzle) => {
  // Ensure words are in a valid format
  if (!(Array.isArray(words)) || new Set(words).size !== words.length) return false
  else return true
}

// Check if a word can be inserted horizontally in a specific position
function Check_Row(puzzle, word, i, j) {

  // Verify word fits in row starting from column j
  if (word.length > puzzle[i].length - j) return false

  // Check if the word matches the characters in the row starting from column j
  let substr = puzzle[i].substring(j, j + word.length)
  for (let k = 0; k < substr.length; k++) {
    if ((/[a-z]/.test(substr[k]) && substr[k] != word[k]) || substr[k] == ".")
      return false
  }
  // Check if the row has enough space to accommodate the word
  substr = puzzle[i].substring(j, puzzle[i].length)
  if (substr.length > word.length) {
    for (let k = word.length; k < substr.length; k++) {
      if (substr[k] == ".") break
      else return false
    }
  }

  return true
}

// Check if a word can be inserted vertically in a specific position
function Check_Column(puzzle, word, i, j) {

  // Build string from column starting at row i
  let substr = ""
  for (let k = i; k < puzzle.length; k++) {
    substr += puzzle[k][j]
  }

  // Verify word fits in column starting from row i
  if (word.length > substr.length) return false

  // Check if the word matches the characters in the column starting from row i
  for (let k = 0; k < word.length; k++) {
    if ((/[a-z]/.test(substr[k]) && substr[k] != word[k]) || substr[k] == ".")
      return false
  }

  //Check if the column has enough space to accommodate the word
  if (substr.length > word.length) {
    for (let k = word.length; k < substr.length; k++) {
      if (substr[k] == ".") break
      else return false
    }
  }

  return true
}

// Insert a word horizontally in a specific row
function Insert_Row(puzzle, words, x, j) {

  // Loop through each word to insert
  for (let k = 0; k < words.length; k++) {

    // Insert word if it fits horizontally
    if (Check_Row(puzzle, words[k], x, j)) {
      puzzle[x] =
        puzzle[x].substring(0, j) +
        words[k] +
        puzzle[x].substring(j + words[k].length, puzzle[x].length)
      //Remove the inserted word from the list of words to insert
      words.splice(k, 1)
      k -= 1
      break
    }
  }
}

// Insert a word vertically in a specific column
function Insert_Column(puzzle, words, x, j) {

  // Loop through each word to insert
  for (let k = 0; k < words.length; k++) {
    if (Check_Column(puzzle, words[k], x, j)) {

      // Insert word if it fits vertically
      for (let l = x; l - x < words[k].length; l++) {
        puzzle[l] =
          puzzle[l].substr(0, j) +
          words[k][l - x] +
          puzzle[l].substr(j + 1, puzzle[l].length);
      }

      words.splice(k, 1)
      k -= 1
      break
    }
  }
}

function Solve_puzzle(puzzle, words) {

  // Validate and set up puzzle
  if (words == [] || (0 == puzzle.length - 1 && 0 == puzzle[0].length))
  return puzzle

  let lenwords = words.length
  // Create a copy of the empty puzzle.
  let temppuzzle = [...puzzle]
  let count = 0

  // Traverse the puzzle grid
  for (let x = 0; x < puzzle.length; x++) {
    for (let y = 0; y < puzzle[0].length; y++) {

      // Insert words where applicable eg cell numbered
      if (/\d/.test(puzzle[x][y]) && puzzle[x][y] > "0") {
        if (puzzle[x][y] === "1"){
          count += 1
        } else if (puzzle[x][y] === "2"){
          count += 2
        } 
        if (count > lenwords){
          return ['Error']
        }
        Insert_Row(temppuzzle, words, x, y)
        Insert_Column(temppuzzle, words, x, y)
      }
    }
  }

  // Return filled puzzle or error if not solvable
  if (words.length === 0) {
    return temppuzzle
  } else {
    return ["Error"]
  }
}

function crosswordSolver(puzzle, words) {
  if (puzzle === '' || typeof puzzle != 'string' || typeof words != 'object'){
    return 'Error'
  }
  let canBeSolved = true

  function err() {
    canBeSolved = false
    return "Error"
  }

  // Validate inputs and solve puzzle
  if (!Valid_Puzzle_Format || !Valid_Words_Format || words.length < 3) err()
  // If all input parameters are valid, solve the puzzle
  if ((canBeSolved) && Valid_Words_Format(words)) {
    wordsCopy = [...words].reverse()
    let output = Solve_puzzle(puzzle.split("\n"), words).join("\n")

    if (output === "Error") {
      return Solve_puzzle(puzzle.split("\n"), wordsCopy).join("\n")
    } else {
      return output
    }
  } else {
    return "Error"
  }
}  