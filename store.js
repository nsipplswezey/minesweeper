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
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
]

//mine or no mine
//revealed or not revealed

let columnLength = input[0].length - 1
let rowLength = input.length - 1

function makeCell(mine,x,y,board) {

    let upY = y - 1
    let downY = y + 1
    let rightX = x + 1
    let leftX = x - 1

    //TODO: Refactor into something better
    let top = y > 0 ? { x: x, y: upY } : null
    let topRight = y > 0 & x < rowLength ? { x: rightX, y: upY } : null
    let right = x < rowLength ? { x: rightX, y: y } : null
    let bottomRight = x < rowLength & y < columnLength ? { x: rightX, y: downY } : null
    let bottom = y < columnLength ? { x: x, y: downY } : null
    let bottomLeft = x > 0 & y < columnLength ? { x: leftX, y: downY } : null
    let left = x > 0 ? { x: leftX, y: y } : null
    let topLeft = x > 0 & y > 0 ? { x: leftX, y: upY } : null

    let neighbors = [top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft] 
    let value = -1

    //generate the derived value from neighbor coordinates
    if (!mine){
        value = neighbors.map( (neighbor) => {
            //filter out nulls
            if(neighbor){
                return board[neighbor.x][neighbor.y]
            }
        })
        .reduce((sum, mine) => {
            if (mine) {
                sum += mine
            }
            return sum
        }, 0)
    }
    
    return {
        touched: false,
        revealed: false,
        mine: mine,
        coord: {x:x,y:y},
        neighbors: neighbors,
        value: value
    }
}

//Generate our base field
let field = input.map((row,x,board) => {
    return row.map((mine,y) => {
        return makeCell(mine,x,y,board)
    })
})

//we can keep a history object, with progressive touches...
//and we just push the next touched field into the array

function last(collection) {
    let lastIndex = collection.length - 1
    return collection[lastIndex]

}


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

function reveal(x, y, history) {
    let queue = []

    let currentBoard = last(history)
    let rowLength = currentBoard[0].length - 1
    let columnLength = currentBoard.length - 1

    queue.push(currentBoard[x][y])

    //while there are cells to reveal
    
    while (queue.length) {

        let currentCell = queue.shift()
        let revealX = currentCell.coord.x
        let revealY = currentCell.coord.y

        if (revealX >= 0 && revealX <= rowLength+1 &&
            revealY >= 0 && revealY <= columnLength+1) {

            //if has no bomb neighbor
            if (currentBoard[revealX][revealY].value === 0) {
                currentBoard[revealX][revealY].revealed = true

                //get neighboring cells
                //remove nulls, and ignore revealed cells
                currentCell.neighbors
                .filter( (neighbor)=> {
                    if (neighbor && !currentBoard[neighbor.x][neighbor.y].revealed) {
                        return true
                    }
                })
                .map( (neighbor) => {
                    return currentBoard[neighbor.x][neighbor.y]
                })
                //push neighbor elements into queue
                .forEach((ele) => {
                    queue.unshift(ele)
                })

            }

            //if has bomb neighbor, just reveal
            if (currentBoard[revealX][revealY].value > 0) {
                currentBoard[revealX][revealY].revealed = true
            }

        }

    }
    history.push(currentBoard)
    return history
}


//Helper function for rough testing
// function touch(x, y, history) {
//     let currentBoard = last(history)

//     if (currentBoard[x][y].mine === 1) {
//         console.warn("Game over")
//         return history
//     }

//     currentBoard[x][y].revealed = true

//     history.push(currentBoard)
//     return history
// }

// let history = []
// history.push(field)

// //The beginning of some basic tests... essentially 4 touches
// //TODO: Refactor these into their own test file, test against expected result
// let touch1 = touch(0, 0, last(history))
// // console.log(last(touch1))
// let touch2 = touch(1, 1, last(history))
// // console.log(last(touch2))
// let touch3 = touch(2, 2, last(history))
// // console.log(last(touch3))
// let touch4 = touch(3, 3, last(history))
// // console.log(history.length)
// // console.log(last(history))

// // TESTS
// // History should have length 4 after 4 touches
// // console.log(`History should have length 4 after 4 touches`) //doesn't match expectations
// // console.log(history.length === 3)
// // console.log(history)

// reveal(0, 0, history)
// reveal(1, 1, history)
// console.log(last(history))

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


const board = field
let dimensions = board.length * board[0].length

const initialState = {
    cells: generateDataArray(dimensions),
    history: [board],
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

            state.history = reveal(row,column,state.history)
            state.board = last(state.history)

            return { ...state, cells: state.cells, history: state.history, board: board, time: state.time, active: state.active };
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