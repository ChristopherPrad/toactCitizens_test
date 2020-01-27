import React from "react";
import jwt_decode from "jwt-decode";
import styled from "styled-components";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Dimensions,
  Alert,
  AsyncStorage
} from "react-native";
import { BlurView } from "expo-blur";
import RegisterButton from "../components/RegisterButton";
import axios from "axios";
import Success from "./Success";

import { connect } from "react-redux";
import Loading from "./Loading";
import { saveState } from "./AsyncStorage";

const screenHeight = Dimensions.get("window").height;

const queryString = require("query-string");

function mapStateToProps(state) {
  return { action: state.action, name: state.name };
}

function mapDispatchToProps(dispatch) {
  return {
    closeLogin: () =>
      dispatch({
        type: "CLOSE_LOGIN"
      }),
    updateName: name =>
      dispatch({
        type: "UPDATE_NAME",
        name
      })
  };
}

class ModalLogin extends React.Component {
  state = {
    email: "",
    password: "",
    IconEmail: require("../assets/mail.png"),
    IconPassword: require("../assets/cadena.png"),
    top: new Animated.Value(screenHeight),
    isSuccessful: false,
    isLoading: false,
    scale: new Animated.Value(1.3),
    translateY: new Animated.Value(0),
    token: ""
  };

  componentDidMount() {
    this.retrieveName();
    // let yourJWTToken = this.state.token;

    // let axiosConfig = {
    //   headers: {
    //     "Content-Type": "application/json;charset=UTF-8",
    //     Authorization: "Bearer " + yourJWTToken
    //   }
    // };

    // axios
    //   .get("http://192.168.1.78:3000/user/profil", axiosConfig)
    //   .then(response => {});
  }

  componentDidUpdate() {
    if (this.props.action === "openLogin") {
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

    if (this.props.action === "closeLogin") {
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

  storeName = async name => {
    try {
      await AsyncStorage.setItem("name", name);
    } catch (error) {}
  };

  retrieveName = async () => {
    try {
      const name = await AsyncStorage.getItem("name");
      if (name !== null) {
        console.log(name);
        this.props.updateName(name);
      }
    } catch (error) {}
  };

  handleLogin = () => {
    this.setState({ isLoading: true });
    var postData = {
      email: this.state.email,
      password: this.state.password
    };

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    };

    axios
      .post(`http://192.168.1.33:3000/user/login`, postData, axiosConfig)
      .then(response => {
        console.log("response :", response);
        try {
          const token = response.headers["x-auth-token"];
          console.log("token : ", token);
          AsyncStorage.setItem("x-auth-token", token)
            .then(() => {
              this.setState({ isLoading: false });
              if (response.status == 200) {
                this.setState({ isSuccessful: true });
                this.storeName(this.state.email);
                this.props.updateName(this.state.email);

                setTimeout(() => {
                  Alert.alert("Bravo", "Tu es bien sur ton compte à présent!");
                  Keyboard.dismiss();

                  this.props.closeLogin();
                  this.setState({ isSuccessful: false });
                }, 1000);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } catch (err) {
          console.log(err);
        }
      });

    // const { email, password } = this.state;
    // if (email && password) {
    //   axios
    //     .post(
    //       "http://192.168.1.78:3000/user/login",
    //       { email, password },
    //       {
    //         headers: {
    //           "Content-Type": "application/json"
    //         }
    //       }
    //     )

    //     .then(response => {
    //       console.log("success");
    //       // setTimeout(() => {
    //       //   Alert.alert("Congrats", "You've successfully!");
    //       // }, 2000);
    //     })
    //     .catch(() => {
    //       console.log("Wrong username or password");
    //     });
    // } else {
    //   alert("Username and password fields are both required");
    // }
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

  tapBackground = () => {
    Keyboard.dismiss();
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
          <Text>Enregistre ou connecte toi pour aider ta planète</Text>
          <TextInput
            onChangeText={email => this.setState({ email })}
            placeholder="Email"
            keyboardType="email-address"
            onFocus={this.focusEmail}
          />
          <TextInput
            onChangeText={password => this.setState({ password })}
            placeholder="Password"
            secureTextEntry={true}
            onFocus={this.focusPassword}
          />
          <IconEmail source={this.state.IconEmail} />
          <IconPassword source={this.state.IconPassword} />
          <TouchableOpacity onPress={this.handleLogin}>
            <Button>
              <ButtonText>Se connecter</ButtonText>
            </Button>
          </TouchableOpacity>
          <RegisterButton />
        </AnimatedModal>
        <Success isActive={this.state.isSuccessful} />
        <Loading isActive={this.state.isLoading} />
      </AnimatedContainer>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ModalLogin);

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
  height: 370px;
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
  top: 165px;
  left: 31px;
`;

const IconPassword = styled.Image`
  width: 18px;
  height: 24px;
  position: absolute;
  top: 223px;
  left: 35px;
`;
