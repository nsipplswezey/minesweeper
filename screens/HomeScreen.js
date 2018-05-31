import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StatusBar
} from 'react-native';
import { WebBrowser } from 'expo';
import { Constants } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    length: "",
    width: "",
    mines: "",
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.description}>
            Welcome to Minesweeper! Enter the dimensions of your minefield, and how many mines
            you want to sweep. See how many mines you can handle! Try and see how changing
            the dimensions of your minefield makes it harder or easier to find your mines!
            Good luck! Have fun!
          </Text>
        </View>
        <TextInput
          style={styles.input}
          value={`${this.state.length}`}
          onChangeText={length => this.setState({length})}
          ref={ref => {this._heightInput = ref}}
          placeholder="Length (default 6)"
          autoFocus={true}
          autoCapitalize="words"
          autoCorrect={true}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={this._focusWidth}
          blurOnSubmit={false}
          maxLength={2}
        />
        <TextInput
          style={styles.input}
          value={`${this.state.width}`}
          onChangeText={width => this.setState({width})}
          ref={ref => {this._widthInput = ref}}
          placeholder="Width (default 6)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={this._focusMines}
          blurOnSubmit={true}
          maxLength={2}
        />
        <TextInput
          style={styles.input}
          value={`${this.state.mines}`}
          onChangeText={mines => this.setState({mines})}
          ref={ref => {this._minesInput = ref}}
          placeholder="Mines (default 5)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={this._submit.bind(null,navigate)}
          blurOnSubmit={true}
          maxLength={1}
        />
      </View>
    );
  }

  _focusWidth = () => {
    this._widthInput && this._widthInput.focus();
  };

  _focusMines = () => {
    this._minesInput && this._minesInput.focus();
  };

  _submit = (navigate) => {
    alert(`Welcome, your minesweeper has been set to ${this.state.length}-by-${this.state.width} and ${this.state.mines} mines! Good luck, and have fun!`);

    navigate('Board', { name: 'Jane' })

  };

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    paddingTop: 20 + Constants.statusBarHeight,
    padding: 20,
    backgroundColor: '#336699',
  },
  description: {
    fontSize: 14,
    color: 'white',
  },
  input: {
    margin: 20,
    marginBottom: 0,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
