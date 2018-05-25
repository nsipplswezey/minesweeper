# minesweeper

## Development

Clone the repo

Open project in Expo XDE

`npm install`

Click share and either scan the QR code on Android, or text yourself a link on iOS

Or email me at nsippl[remove]swezey[me]@gmail.com and I'll send you a text message with a link to get it up and running.

## Architecture
This is a React Native mobile application created using Expo.

We have default tab navigation between Home and Board screens.

We're using redux stores for the timer, the board and the game state.

We're using `react-native-grid-component` for the `<TouchableOpacity>` grid squares.

You can run it using the Expo XDE. It could also likely be implemented as a Snack.

## Priority TODO
- [ ] A user should be able to generate a new board with input dimensions and mines, with mines placed randomly
- [ ] A user should see square values resolved according to the specc when they click on a cell
- [ ] A user should be able to flag a mine
- [ ] A developer should be able to test the store
- [ ] A developer should be able to lint the code using reasonable standard
- [ ] A developer should be able to say that the application is dry and well factored(do a tech debt cleanup pass)
- [ ] A developer zipped up the repo and emailed it to Ulf

## Roadmap
- [ ] Move application into a Snack for easier portability and review
- [ ] Refactor into typescript
- [ ] Add sounds... like an explosion. And maybe a ticking/chirping clock for the timer
- [ ] Take another pass at animations if necessary... like an explosion. And maybe a cooler looking clock for the timer
- [ ] Great UX

