import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, View } from 'react-native';

//Redux
import { connect } from 'react-redux'; // 5.0.6

import Grid from 'react-native-grid-component'; // Version can be specified in package.json

class Board extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    timer: null
  }

  _renderItem = (data, i) => {
    let board = this.props.board
    let totalColumns = board[0].length
    let index = data.index

    let row = (Math.floor(data.index / totalColumns))
    let column = i
    let value = board[row][column].value
    let touched = board[row][column].touched
    let revealed = board[row][column].revealed

    let valueColor = !revealed ? '#D3D3D3' : data.colors[value]

    let visability = { backgroundColor: valueColor }

    let cell = {
      row: row,
      column: column,
      index: index,
      value: value,
      touched: touched,
      revealed: revealed
    }

    //navigator passed from parent all that way down to press handler
    let navigate = this.props.navigate

    return (
      <TouchableOpacity
        style={[visability, styles.item]}
        key={i}
        onPress={this._handlePress.bind(this, data, cell, navigate)}>

        <Text>
          x:{board[row][column].coord.x}y:{board[row][column].coord.y}
          {'\n'}
          v:{board[row][column].value}
        </Text>

      </TouchableOpacity>
    )
  }

  render() {
    // let totalColumns = this.props.data.board[0].length
    let totalColumns = this.props.board[0].length

    return (

      <Grid
        navigate={this.props.navigate}
        board={this.props.board}
        style={styles.list}
        renderItem={this._renderItem}
        data={this.props.cells}
        itemsPerRow={totalColumns}
        itemHasChanged={(d1, d2) => { return true }} //TODO: Assess how to use itemHasChanged to potentially address the this.forceUpdate() issue
        onEndReached={() => {
          console.log('end of board reached')
          //this.setState({ data: [...this.state.data, ...generateDataArray(21)] })
        }
        }
      />

    );
  }

  _handlePress(data, cell, navigate) {

    this.props.update(data, cell)

    //Stop clock on mine
    if (cell.value === -1) {
      this.props.resetTime()
      this.props.setInactive()
      clearTimeout(this.state.timer)
      alert(`Oh no, you hit a mine during your sweep! Try again! Game over!`);
      navigate('Home', { name: 'Jane' })
      // this.props.navigation.navigate('Home', { name: 'Jane' })

      return
    }

    //TODO:Refactor into timer handler. Also refactor to remove .bind
    if (!this.props.active) {
      this.props.setActive()

      var interval = 1000; // ms
      var expected = Date.now() + interval;
      this.state.timer = setTimeout(step.bind(this), interval);

      function step() {

        //Stop clock if all non-mines are revealed
        if (this.props.totalRevealed === (this.props.gridDimension.length * this.props.gridDimension.width) - this.props.mines) {
          this.props.setInactive()
          clearTimeout(this.state.timer)
          return
        }


        //Otherwise continue updating time.
        var dt = Date.now() - expected; // the drift (positive for overshooting)
        if (dt > interval) {
          // handle any bad clock issues
        }
        this.props.updateTime()
        expected += interval;
        this.state.timer = setTimeout(step.bind(this), Math.max(0, interval - dt)); // take into account drift
      }
    }

    this.forceUpdate() //TODO: Seems to be required because of the Grid component we're using. Find a better solution than forceUpdate

  }

}

const mapStateToProps = state => {
  return {
    cells: state.cells,
    board: state.board,
    time: state.time,
    active: state.active,
    totalRevealed: state.totalRevealed,
    gridDimension: state.gridDimension,
    mines: state.mines
  }
}

const mapDispatchToProps = dispatch => {
  return {
    update: (data, cell) => {
      dispatch({ type: 'UPDATE', data: data, cell: cell })
    },
    updateTime: () => {
      dispatch({ type: 'UPDATE_TIME' })
    },
    setActive: () => {
      dispatch({ type: 'SET_ACTIVE' })
    },
    setInactive: () => {
      dispatch({ type: 'SET_INACTIVE' })
    },
    resetTime: () => {
      dispatch({ type: 'RESET_TIME' })
    },
  }
}

const ConnectedBoard = connect(mapStateToProps, mapDispatchToProps)(Board);

class Timer extends React.Component {
  render() {
    return <Text>{this.props.time}</Text>
  }

}

const ConnectedTimer = connect(mapStateToProps, mapDispatchToProps)(Timer);

export default class BoardScreen extends React.Component {

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <ConnectedTimer />
        <ConnectedBoard
          navigate={navigate}
        />
      </View>
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
