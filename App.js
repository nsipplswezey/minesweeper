import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';

//Redux
import { Provider, connect } from 'react-redux'; // 5.0.6
import { createStore } from 'redux'; // 3.7.2

//Store
function generateDataArray(length) {

  return Array.from(Array(length)).map((value,index) => {
    return {colors:colors, index:index}
  });

}

const colors = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
  '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722', '#795548', '#9E9E9E', '#607D8B',
];

const boardSeed = [
  [0,  0,  0,  0,  0],
  [0,  0,  0,  0,  0],
  [1,  1,  1,  0,  0],
  [1,  NaN,  1,  1,  0],
  [1,  2,  2,  1,  0],
  [0,  1,  NaN,  2,  1],
  [0,  1,  1,  1,  NaN]
]

function generateBoard(board){
  let newBoard = []

  for (var i = 0; i < board.length; i++){
    let newRow = []

    for (var j = 0; j < board[i].length; j++){
      newRow.push({value:board[i][j], touched:false} ) //[{},{},{},{},{}]
    }

    newBoard.push(newRow) // [[],[],[]]

  }

  return newBoard

}

const board = generateBoard(boardSeed)

let dimensions = board.length * board[0].length

const initialState = {
  cells: generateDataArray(dimensions),
  board: board,
  mines: 5,
  gridDimension: {length: 6, width: 6},
  time: 0,
  lost: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE': {

      let row = action.cell.row
      let column = action.cell.column
      let index = action.cell.index

      state.board[row][column].touched = true

      return { ...state, cells: state.cells, board: state.board };
    }
    default: {
      return state;
    }
  }
};

const store = createStore(reducer);


//App component
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Provider store={store}>
            <RootNavigation />
          </Provider>
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
