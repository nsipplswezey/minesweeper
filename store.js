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

function makeCell(mine,x,y,board,id) {

    let columnLength = board[0].length - 1
    let rowLength = board.length - 1

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
        value: value,
        id: id
    }
}

//we can keep a history object, with progressive touches...
//and we just push the next touched field into the array

function last(collection) {
    let lastIndex = collection.length - 1
    return collection[lastIndex]

}

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

function sumRevealed(board){

    return board.reduce( (boardMemo,row) => {

        let rowSum = row.reduce( (rowMemo,cell) => {
            if(cell.revealed){
                return rowMemo+1
            }
            return rowMemo
        },0)

        return boardMemo+rowSum
    },0)

}

const initialState = {
    cells: null,
    history: [],
    board: null,
    mines: null,
    gridDimension: { length: null, width: null },
    time: 0,
    lost: false,
    active: false,
    totalRevealed: 0
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

            state.totalRevealed = sumRevealed(state.board)

            return { ...state, cells: state.cells, history: state.history, board: state.board, time: state.time, active: state.active, totalRevealed: state.totalRevealed, mines: state.mines };
        }
        case 'GENERATE_BOARD': {

            let length = action.boardPameters.length === "" ? 6 : parseInt(action.boardPameters.length)
            let width = action.boardPameters.width === "" ? 6 : parseInt(action.boardPameters.width)
            let mines = action.boardPameters.mines === "" ? 5 : parseInt(action.boardPameters.mines)
            let dimensions = length * width
            let cells = generateDataArray(dimensions)

            let newBoard = new Array(length).fill(0).map( (row)=> {
                return new Array(width).fill(0)
            })

            function shuffle(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                return a;
            }

            let mineIds = Array.from(Array(dimensions).keys())
            shuffle(mineIds)
            
            mineIds = mineIds.filter( (ids,index) => {
                if(index < mines){
                    return true
                }
            })
            .reduce( (memo,ele) => {
                memo[ele] = ele
                return memo
            },{})

            let counter = 0
            newBoard.forEach( (row,rowId) => {
                row.forEach( (cell,columnId) => {
                    if( mineIds.hasOwnProperty(counter)){
                        newBoard[rowId][columnId] = 1
                    }
                    counter += 1
                })
            })

            let board = newBoard.map((row,x,board) => {
                return row.map((mine,y) => {
                    return makeCell(mine,x,y,board)
                })
            })

            state.length = length
            state.width = width
            state.mines = mines
            state.history = [board]
            state.board = board
            state.cells = cells
            state.gridDimension = {length:length,width:width}

            return { ...state, cells: state.cells, history: state.history, board: state.board, length: state.length, width: state.width, mines:state.mines, gridDimension: state.gridDimension }
        }
        case 'UPDATE_REVEALED': {
            return { ...state, totalRevealed: state.totalRevealed }
        }
        case 'UPDATE_TIME': {
            return { ...state, time: state.time + 1, active: state.active }
        }
        case 'SET_ACTIVE': {
            return { ...state, active: true }
        }
        case 'SET_INACTIVE': {
            state.totalRevealed = 0
            return { ...state, active: false, totalRevealed : state.totalRevealed }
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