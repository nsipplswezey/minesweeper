//Redux
import { Provider } from 'react-redux'; // 5.0.6
import { createStore } from 'redux'; // 3.7.2

//Store
function generateDataArray(length) {

    return Array.from(Array(length)).map((value, index) => {
        return { colors: colors, index: index }
    });

}

const colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548', '#9E9E9E', '#607D8B',
];

const input = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1]
]

//mine or no mine
//revealed or not revealed

function makeCell(value) {

    let mine = value

    return {
        touched: false,
        revealed: false,
        mine: mine
    }
}

let field = input.map((row) => {

    return row.map((cellValue) => {

        return makeCell(cellValue)

    })


})

function getNeighbors(x, y, board) {
    let columnLength = board[0].length - 1
    let rowLength = board.length - 1

    let upY = y - 1
    let downY = y + 1
    // console.log(upY)
    // console.log(downY)
    let rightX = x + 1
    let leftX = y - 1
    // console.log(rightX)
    // console.log(leftX)    

    let top = y > 0 ? board[x][y - 1] : null
    let topRight = y > 0 & x < rowLength ? board[x + 1][y - 1] : null
    let right = x < rowLength ? board[x + 1][y] : null
    let bottomRight = x < rowLength & y < columnLength ? board[x + 1][y + 1] : null
    let bottom = y < columnLength ? board[x][y + 1] : null
    let bottomLeft = x > 0 & y < columnLength ? board[x - 1][y + 1] : null
    let left = x > 0 ? board[x - 1][y] : null
    let topLeft = x > 0 & y > 0 ? board[x - 1][y - 1] : null

    top === null ? null : top.coord = { x: x, y: upY }
    topRight === null ? null : topRight.coord = { x: rightX, y: upY }
    right === null ? null : right.coord = { x: rightX, y: y }
    bottomRight === null ? null : bottomRight.coord = { x: rightX, y: downY }
    bottom === null ? null : bottom.coord = { x: x, y: downY }
    bottomLeft === null ? null : bottomLeft.coord = { x: leftX, y: downY }
    left === null ? null : left.coord = { x: leftX, y: y }
    topLeft === null ? null : topLeft.coord = { x: leftX, y: upY }

    let neighbors = [top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft]

    return neighbors


}

//Go through all cells of the field
//Look at their neighbors
//Set value equal to number of neighbors that are mine
field.forEach((row, x, board) => {

    row.forEach((cell, y) => {

        let neighbors = getNeighbors(x, y, board)

        if (!cell.mine) {

            cell.value = neighbors.reduce((sum, ele) => {

                if (ele) {
                    sum += ele.mine
                }
                return sum
            }, 0)

        } else {
            cell.value = -1
        }

        // console.log(cell)
        // console.log(x,y)
        // console.log('cell.value')
        // console.log(cell.value)

    })

})

//we can keep a history object, with progressive touches...
//and we just push the next touched field into the array

let history = []
history.push(field)

// console.log(history)

function last(collection) {
    let lastIndex = collection.length - 1
    return collection[lastIndex]

}

//Now we need a touched function...
//We can make it a pure function, or a method of an object. Let's start pure

//Touch Also contains some other things
//If it's a mine, we need to game over
//If it's not a mine, we need to touch all neighboring cells
//What do those touches look like?
//If they have a number, then we reveal them, but not any further
//Is the number fixed? Or generated?
//If generated, then we need to create a generator...
//But has the upside of building a board just by mine placement...
//So let's make a generator.

//Alright. From here we need to start revealing neighbors.

//Put a neighbor into the queue
//Dequeue, and check the value
//If the value is 0, then we reveal, and queue up all neighbors
//If the value is !== 0, then we reveal, but we don't queue up any neighbors

//Dope... I've got a getNeighbors method that seems to work...
//And upon first testing it does work...

//So now... this is looking pretttttty clean.


function reveal(x, y, history) {
    let queue = []

    let currentBoard = last(history)
    let rowLength = currentBoard[0].length - 1
    let columnLength = currentBoard.length - 1

    queue.push(currentBoard[x][y])

    //while there are cells to reveal
    while (queue.length) {

        let currentCell = queue.shift()
        // console.log(currentCell)
        let revealX = currentCell.coord.x
        let revealY = currentCell.coord.y


        if (revealX >= 0 && revealX <= rowLength &&
            revealY >= 0 && revealY <= columnLength) {

            //if has no bomb neighbor
            if (currentBoard[revealX][revealY].value === 0) {
                currentBoard[revealX][revealY].revealed = true

                getNeighbors(revealX, revealY, currentBoard)
                    //filter out nulls
                    //filter out revealed cells
                    .filter((ele) => {

                        if (ele && !ele.revealed) {
                            return ele
                        }

                    })
                    //push remaining elements
                    .forEach((ele) => {

                        queue.unshift(ele)
                        // console.log(queue.length)

                    })

            }

            //if has bomb neighbor, just reveal
            if (currentBoard[revealX][revealY].value > 0) {
                currentBoard[revealX][revealY].revealed = true
            }

        }

    }
}


function touch(x, y, history) {
    let currentBoard = last(history)

    if (currentBoard[x][y].mine === 1) {
        console.warn("Game over")
        return history
    }

    currentBoard[x][y].revealed = true

    history.push(currentBoard)
    return history
}


//The beginning of some basic tests... essentially 4 touches
//TODO: Refactor these into their own test file, test against expected result
let touch1 = touch(0, 0, history)
// console.log(last(touch1))
let touch2 = touch(1, 1, history)
// console.log(last(touch2))
let touch3 = touch(2, 2, history)
// console.log(last(touch3))
let touch4 = touch(3, 3, history)
// console.log(history.length)
// console.log(last(history))

//TESTS
//History should have length 4 after 4 touches
// console.log(`History should have length 4 after 4 touches`) //doesn't match expectations
// console.log(history.length === 3)
// console.log(history)

reveal(0, 0, history)
// reveal(1,1,history)
// console.log(last(history))

const board = field

// Object {
//     "touched": false,
//     "coord": Object {
//       "x": 2,
//       "y": 1,
//     },
//     "mine": 0,
//     "revealed": true,
//     "value": 1,
//   }

// console.log(board)

let dimensions = board.length * board[0].length

const initialState = {
    cells: generateDataArray(dimensions),
    board: board,
    mines: 5,
    gridDimension: { length: 6, width: 6 },
    time: 0,
    lost: false,
    active: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE': {

            let row = action.cell.row
            let column = action.cell.column
            let index = action.cell.index

            state.board[row][column].touched = true

            return { ...state, cells: state.cells, board: state.board, time: state.time, active: state.active };
        }
        case 'UPDATE_TIME': {
            return { ...state, time: state.time + 1, active: state.active }
        }
        case 'SET_ACTIVE': {
            return { ...state, active: true }
        }
        case 'SET_INACTIVE': {
            return { ...state, active: false }
        }
        case 'RESET_TIME': {
            return { ...state, time: 0, active: state.active }
        }


        default: {
            return state;
        }
    }
};

export default createStore(reducer);