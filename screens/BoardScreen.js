import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';

//Redux
import { connect } from 'react-redux'; // 5.0.6

import Grid from 'react-native-grid-component'; // Version can be specified in package.json

class Board extends React.Component {
  static navigationOptions = {
    title: 'Board',
  };

  constructor(props) {
    super(props);

  }

  _renderItem = (data, i) =>
    {
      let board = this.props.board
      let totalColumns = board[0].length
      let index = data.index

      let row = (Math.floor(data.index/totalColumns))
      let column = i
      let value = board[row][column].value
      let touched = board[row][column].touched

      let valueColor = !touched ? '#D3D3D3' : data.colors[value]

      let visability = { backgroundColor: valueColor }

      return (
        <TouchableOpacity
          style={[visability, styles.item]}
          key={i}
          onPress={() => {

            let cell = {
              row:row,
              column:column,
              index:index,
              value:value,
              touched:touched
            }

            this.props.update(data,cell)
            this.forceUpdate() //TODO: Seems to be required because of the Grid component we're using. Find a better solution that forceUpdate
            }
          }>

          <Text>
            id:{index}
            {"\n"}
            state:{board[row][column].value}
          </Text>

        </TouchableOpacity>
      )
    }


  render() {
    // let totalColumns = this.props.data.board[0].length
    let totalColumns = this.props.board[0].length

    return (
      <Grid
        board={this.props.board}
        style={styles.list}
        renderItem={this._renderItem}
        data={this.props.cells}
        itemsPerRow={totalColumns}
        itemHasChanged={(d1, d2) => {return true}} //TODO: Assess how to use itemHasChanged to potentially address the this.forceUpdate() issue
        onEndReached={() => {
          console.log('end reached')
          //this.setState({ data: [...this.state.data, ...generateDataArray(21)] })
          }
        }
      />
    );
  }

}

const mapStateToProps = state => {
  return {
    cells: state.cells,
    board: state.board
  }
}

const mapDispatchToProps = dispatch => {
  return {
    update : (data, cell) => {
      dispatch({type:'UPDATE', data:data, cell:cell })
    }
  }
}

const ConnectedBoard = connect(mapStateToProps, mapDispatchToProps)(Board);

export default class BoardScreen extends React.Component {
  render() {
    return (
      <ConnectedBoard />
    )
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
