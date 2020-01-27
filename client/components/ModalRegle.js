import React from "react";
import styled from "styled-components";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Animated
} from "react-native";
import { BlurView } from "expo-blur";
import { Alert, Dimensions } from "react-native";
import { connect } from "react-redux";

const screenHeight = Dimensions.get("window").height;

function mapStateToProps(state) {
  return { action: state.action };
}

function mapDispatchToProps(dispatch) {
  return {
    closeRegle: () =>
      dispatch({
        type: "CLOSE_REGLE"
      })
  };
}

class ModalRegle extends React.Component {
  state = {
    top: new Animated.Value(screenHeight),
    scale: new Animated.Value(1.3),
    translateY: new Animated.Value(0)

    // top: new Animated.Value(screenHeight)
  };

  componentDidUpdate() {
    if (this.props.action === "openRegle") {
      Animated.timing(this.state.top, {
        toValue: 0,
        duration: 0
      }).start();
      Animated.spring(this.state.scale, { toValue: 1 }).start();
      Animated.timing(this.state.translateY, {
        toValue: 0,
        duration: 0
      }).start();
    }

    if (this.props.action === "closeRegle") {
      setTimeout(() => {
        Animated.timing(this.state.top, {
          toValue: screenHeight,
          duration: 0
        }).start();
        Animated.spring(this.state.scale, { toValue: 1.3 }).start();
      }, 500);
      Animated.timing(this.state.translateY, {
        toValue: 1000,
        duration: 500
      }).start();
    }
  }

  tapBackground = () => {
    Keyboard.dismiss();
    this.props.closeRegle();
  };

  handlePushScreen = () => {
    this.props.navigator;
  };

  tapBackground = () => {
    Keyboard.dismiss();
    this.props.closeRegle();
  };

  render() {
    return (
      <AnimatedContainer style={{ top: this.state.top }}>
        <TouchableWithoutFeedback onPress={this.tapBackground}>
          <BlurView
            tint="default"
            intensity={100}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
        </TouchableWithoutFeedback>
        <AnimatedModal
          style={{
            transform: [
              { scale: this.state.scale },
              { translateY: this.state.translateY }
            ]
          }}
        >
          <Logo source={require("../assets/terrelogo.png")} />
          <Texttitle>C'est très simple!</Texttitle>

          <Text>
            Chaque pas effectué te fais rapporter de l'argent! C'est le même
            principe pour les boutons bonnes actions en justifiant d'une photo.
            Garde l'argent pour toi ou offre le pour un impact direct sur
            l'environnement!
          </Text>
        </AnimatedModal>
        {/* <Success isActive={false} /> */}
        {/* <Loading isActive={this.state.isLoading} /> */}
      </AnimatedContainer>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ModalRegle);

const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  justify-content: center;
  align-items: center;
`;

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const Modal = styled.View`
  width: 335px;
  height: 420px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  align-items: center;
`;

const AnimatedModal = Animated.createAnimatedComponent(Modal);
const Logo = styled.Image`
  width: 64px;
  height: 64px;
  margin-top: 20px;
`;
const Text = styled.Text`
  margin-top: 10px;
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  color: #b8bece;
`;

const Texttitle = styled.Text`
  margin-top: 20px;

  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  color: #b8bece;
`;
const TextInput = styled.TextInput`
  border: 1px solid #dbdfea;
  width: 295px;
  height: 44px;
  border-radius: 10px;
  font-size: 17px;
  color: #3c4560;
  margin-top: 20px;
  padding-left: 44px;
`;
const Button = styled.View`
  background: #5263ff;
  width: 295px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 10px 20px #c2cbff;
  margin-top: 20px;
`;
const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 20px;
  text-transform: uppercase;
`;
