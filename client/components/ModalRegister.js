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

import axios from "axios";
import Success from "./Success";
import Loading from "./Loading";
import ModalLogin from "./ModalLogin";
import { connect } from "react-redux";
import RegisterButton from "./RegisterButton";

const screenHeight = Dimensions.get("window").height;

function mapStateToProps(state) {
  return { action: state.action };
}

function mapDispatchToProps(dispatch) {
  return {
    closeRegister: () =>
      dispatch({
        type: "CLOSE_REGISTER"
      })
  };
}

class ModalRegister extends React.Component {
  state = {
    email: "",
    username: "",
    password: "",
    isSuccessful: false,
    IconEmail: require("../assets/mail.png"),
    IconPassword: require("../assets/cadena.png"),
    IconUsername: require("../assets/name.png"),
    top: new Animated.Value(screenHeight),
    scale: new Animated.Value(1.3),
    translateY: new Animated.Value(0)

    // top: new Animated.Value(screenHeight)
  };

  componentDidUpdate() {
    if (this.props.action === "openRegister") {
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

    if (this.props.action === "closeRegister") {
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
    this.props.closeRegister();
  };

  handleRegister = () => {
    console.log("handleRegister");
    let data = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password
    };

    axios
      .post("http://192.168.1.33:3000/user/register", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      .then(response => {
        this.setState({ isSuccessful: true });
        console.log(response.data);
        setTimeout(() => {
          Alert.alert("Féliciation", "Votre compte a été créé avec succès");
          this.props.closeRegister();
          this.setState({ isSuccessful: false });
        }, 2000);

        // this.setState({ isLoading: true });
        // set.Timeout(() => {
        //   this.setState({ isLoading: false });
        // }, 2000);
      })
      .catch(err => {
        console.log("Wrong username or password");
      });
  };

  handlePushScreen = () => {
    this.props.navigator;
  };

  focusEmail = () => {
    this.setState({
      IconEmail: require("../assets/mail.png"),
      IconPassword: require("../assets/cadena.png")
    });
  };

  focusPassword = () => {
    this.setState({
      IconEmail: require("../assets/mail.png"),
      IconPassword: require("../assets/cadena.gif")
    });
  };

  focusUsername = () => {
    this.setState({
      IconUsername: require("../assets/name.png")
    });
  };

  tapBackground = () => {
    Keyboard.dismiss();
    this.props.closeRegister();
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
          <Text>Enregistre toi !</Text>
          <TextInput
            onChangeText={email => this.setState({ email })}
            placeholder="Email"
            keyboardType="email-address"
            onFocus={this.focusEmail}
          />
          <TextInput
            onChangeText={username => this.setState({ username })}
            placeholder="Username"
            keyboardType="email-address"
            onFocus={this.focusUsername}
          />
          <TextInput
            onChangeText={password => this.setState({ password })}
            placeholder="Password"
            secureTextEntry={true}
            onFocus={this.focusPassword}
          />

          <IconEmail source={this.state.IconEmail} />
          <IconPassword source={this.state.IconPassword} />
          <IconUsername source={this.state.IconUsername} />
          <TouchableOpacity onPress={this.handleRegister}>
            <Button>
              <ButtonText>M'enregistrer</ButtonText>
            </Button>
          </TouchableOpacity>
        </AnimatedModal>
        {/* <Success isActive={false} /> */}
        {/* <Loading isActive={this.state.isLoading} /> */}
      </AnimatedContainer>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ModalRegister);

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
  font-size: 13px;
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

const IconEmail = styled.Image`
  width: 24px;
  height: 16px;
  position: absolute;
  top: 145px;
  left: 31px;
`;

const IconPassword = styled.Image`
  width: 18px;
  height: 24px;
  position: absolute;
  top: 265px;
  left: 30px;
`;

const IconUsername = styled.Image`
  width: 24px;
  height: 24px;
  position: absolute;
  top: 203px;
  left: 30px;
`;
