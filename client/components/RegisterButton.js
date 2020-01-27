import { TouchableOpacity, Text, Animated, Dimensions } from "react-native";
import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const screenHeight = Dimensions.get("window").height;

function mapStateToProps(state) {
  return { action: state.action, name: state.name };
}

function mapDispatchToProps(dispatch) {
  return {
    openRegister: () =>
      dispatch({
        type: "OPEN_REGISTER"
      })
  };
}

class RegisterButton extends React.Component {
  state = {
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1),
    top: new Animated.Value(screenHeight)
  };
  componentDidUpdate() {
    if (this.props.action === "openRegister") {
      Animated.timing(this.state.top, {
        toValue: 0,
        duration: 0
      }).start();
    }

    if (this.props.action === "closeRegister") {
      Animated.timing(this.state.top, {
        toValue: screenHeight,
        duration: 0
      }).start();
    }
  }
  render() {
    return (
      <TouchableOpacity onPress={this.props.openRegister}>
        <TextRegister>Tu n'as pas de compte? Viens ici !</TextRegister>
      </TouchableOpacity>
    );
  }
}

const TextRegister = styled.Text`
  color: #5263ff;
  font-size: 12px;
  margin-top: 10px;
  text-transform: uppercase;
  font-weight: 600;
`;

export default connect(mapStateToProps, mapDispatchToProps)(RegisterButton);
