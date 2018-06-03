# minesweeper

## Development

Clone the repo

Open project in Expo XDE

`npm install`

Click share and either scan the QR code on Android, or text yourself a link on iOS

Or email me at nsippl[remove]swezey[me]@gmail.com and I'll send you a text message with a link to get it up and running.

## Architecture
This is a React Native mobile application created using Expo.

We have tab navigation between Home and Board screens using `react-navigation`.

We're using redux stores for the timer, the board and the game state.

We're using `react-native-grid-component` for the `<TouchableOpacity>` grid squares.

We're using the Expo XDE, and sharing the implementation via Snack available here: https://snack.expo.io/@minesweeper/github.com-nsipplswezey-minesweeper.

Board generation: generate an empty board as a 2d array of 0s. We generate a unique id for each cell, and Fisher-Yates shuffle the ids, and use the first n shuffled ids to place mines randomly. We then derive each cell value based on the mine placement.

Revealing: upon tapping a cell, we reveal the tapped cell, and if the tapped cell has 0 mines as neighbors, we add all neighboring cells to a queue, and then procede to dequeue each neighbor, check it's neighbor-mine value and if it's 0 we queue its neighbors. We do not queue any neighbors of cells with a non-zero neighbor-mine value, but instead just reveal that cell.

Timer: clock operates on a setTimeout loop that corrects for most drift.

Board state: each touch generates a new board, which is stored in a history array. The idea initially was to dump that board history into a simple analytics server, and do a cursory analysis of user play history. Still could be done pretty quickly.

Game: game resets on tapping a mine. Game doesn't reset on a win, but creating a new game will reset the timer and board state.

UI: we use color to indicate number of neighboring mines. After a couple rounds you get a sense of the color-mine mapping

Known issues: 
- board sizes above 20x20 aren't visually practical. Mine number is limited to a single digit integer.
- there's a subtle bug that you're not likely to detect upon winning the game on pressing a zero-value cell.

## Priority TODO
- [x] A user should be able to generate a new board with input dimensions and mines, with mines placed randomly
- [x] A user should see square values resolved according to the specc when they click on a cell
- [x] A developer zipped up the repo and emailed it to Ulf
- [ ] A user should be able to flag a mine
- [ ] A developer should be able to test the store
- [ ] A developer should be able to lint the code using reasonable standard
- [ ] A developer should be able to say that the application is dry and well factored(do a tech debt cleanup pass)

## Roadmap
- [x] Move application into a Snack for easier portability and review
- [ ] Refactor into typescript
- [ ] Add sounds... like an explosion. And maybe a ticking/chirping clock for the timer
- [ ] Take another pass at animations if necessary... like an explosion. And maybe a cooler looking clock for the timer
- [ ] Great UX

