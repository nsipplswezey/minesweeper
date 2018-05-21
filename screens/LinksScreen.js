import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import Grid from 'react-native-grid-component'; // Version can be specified in package.json

function generateRandomColorsArray(length) {
  return Array.from(Array(length)).map(() => colors[Math.floor(Math.random() * colors.length)]);
}

// Helper functions
// thanks materialuicolors.co
const colors = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
  '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722', '#795548', '#9E9E9E', '#607D8B',
];

const board = [
  [0,  0,  0,  0,  0],
  [0,  0,  0,  0,  0],
  [1,  1,  1,  0,  0],
  [1,  NaN,  1,  1,  0],
  [1,  2,  2,  1,  0],
  [0,  1,  NaN,  2,  1],
  [0,  1,  1,  1,  NaN]
]

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Board',
  };

  constructor(props) {
    super(props);

    this.state = {
      data: generateRandomColorsArray(21),
    };
  }


  _renderItem = (data, i) =>
    <View style={[{ backgroundColor: data }, styles.item]} key={i} />

  render() {
    return (
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        data={this.state.data}
        itemsPerRow={board[0].length}
        itemHasChanged={(d1, d2) => d1 !== d2}
        onEndReached={() =>
          this.setState({ data: [...this.state.data, ...generateRandomColorsArray(21)] })}
      />
    );
  }

}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 50,
    margin: 1,
  },
  list: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
