import React from "react";
import {
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  AsyncStorage,
  Dimensions,
  StyleSheet
} from "react-native";
import styled from "styled-components";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";
import { NotificationIcon } from "../components/Icons";
import Logo from "../components/Logo";
import Course from "../components/Course";
import Menu from "../components/Menu";
import { connect } from "react-redux";
import ModalLogin from "../components/ModalLogin";
import ModalRegister from "../components/ModalRegister";
import ModalRegle from "../components/ModalRegle";
import Conseil from "../components/Conseil";

import Podometre from "../components/Podometre";
import setAuthToken from "../utils/setAuthToken";

import { Button, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import axios from "axios";

const screenHeight = Dimensions.get("window").height;

// REDUX MENU
function mapStateToProps(state) {
  return { action: state.action, name: state.name };
}

function mapDispatchToProps(dispatch) {
  return {
    openMenu: () =>
      dispatch({
        type: "OPEN_MENU"
      }),
    openLogin: () =>
      dispatch({
        type: "OPEN_LOGIN"
      }),
    closeLogin: () =>
      dispatch({
        type: "CLOSE_LOGIN"
      }),

    openRegle: () => dispatch({ type: "OPEN_REGLE" }),

    closeRegle: () => dispatch({ type: "CLOSE_REGLE" })
  };
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1),
    image: null,
    euro: null,
    top: new Animated.Value(screenHeight),
    _item: ["Ramasser ses dêchets", "Chien"]
  };

  componentDidMount() {
    this.handlePushscreen();
    this.getDataMoney();
    this.intervalID = setInterval(() => this.renderTree(), 10000);
    this.interval = setInterval(() => this.getDataMoney(), 10000);

    this.getPermissionAsync();

    this.load();
    this.props.navigation.addListener("willFocus", this.load);
  }

  componentWillUnmount() {
    // Clear the interval right before component unmount
    clearInterval(this.intervalID);
    clearInterval(this.interval);
  }

  load = () => {
    this.getDataMoney();
  };

  componentDidUpdate() {
    this.toggleMenu();
    fetch("http://192.168.1.33:3000/users/all")
      .then(res => res.json())
      .then(users => {
        console.log(users);
        console.log("titi");
      });

    this.handleRegle();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
  _pickImage2 = async () => {
    let resultnext = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!resultnext.cancelled) {
      this.setState({ imagenext: resultnext.uri });
    }
  };

  toggleMenu = () => {
    if (this.props.action == "openMenu") {
      Animated.timing(this.state.scale, {
        toValue: 0.9,
        duration: 300,
        easing: Easing.in()
      }).start();
      Animated.spring(this.state.opacity, {
        toValue: 0.5
      }).start();
    }

    if (this.props.action == "closeMenu") {
      Animated.timing(this.state.scale, {
        toValue: 1,
        duration: 300,
        easing: Easing.in()
      }).start();
      Animated.spring(this.state.opacity, {
        toValue: 1
      }).start();
    }
  };

  handlePushscreen = () => {
    if (this.props.name) {
      this.props.closeLogin();
    } else {
      this.props.openLogin();
    }
  };

  randomColor = () => {
    return console.log(
      _this.item[Math.floor(Math.random() * _this.item.length)]
    );
  };

  handleAvatar = () => {
    if (this.props.name) {
      this.props.openMenu();
    } else {
      this.props.openLogin();
    }
  };

  componentDidUpdate() {
    async function getUser() {
      try {
        const response = await axios.get("/user?ID=12345");
      } catch (error) {
        console.error(error);
      }
    }
  }

  takePicture = async categorie => {
    // console.log(categorie);
    await Permissions.askAsync(Permissions.CAMERA);
    const response = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true
    });

    if (response.cancelled) {
      return;
    }
    this.setState({ image: response }, () => {
      let uri = this.state.image.uri;
      let uriParts = uri.split(".");
      let fileType = uriParts[uriParts.length - 1];

      let formData = new FormData();
      formData.append("photo", {
        uri,
        name: `photo`,
        type: `image/jpeg`,
        categorie
      });
      formData.append("categorie", categorie);

      AsyncStorage.getItem("x-auth-token").then(token => {
        setAuthToken(token);
        let axiosConfig = {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data"
          }
        };

        return axios
          .post(
            `http://192.168.1.33:3000/user/api/upload`,
            formData,
            axiosConfig
          )
          .then(res => {
            console.log("response :", res.data);
          })
          .catch(error => console.log(error));
      });
    });
  };

  getDataMoney = () => {
    console.log("test");
    AsyncStorage.getItem("x-auth-token").then(token => {
      setAuthToken(token);
      axios
        .get("http://192.168.1.33:3000/step/me")
        .then(res => {
          this.setState({
            euro: res.data.money
          });
        })

        .catch(err => console.log(err));
    });
  };

  handleRegle = () => {
    if (this.props.action === "openRegle") {
      Animated.timing(this.state.top, {
        toValue: 0,
        duration: 0
      }).start();
    }

    if (this.props.action === "closeRegle") {
      Animated.timing(this.state.top, {
        toValue: screenHeight,
        duration: 0
      }).start();
    }
  };

  renderTree = () => {
    if (this.state.euro < 2) {
      return (
        <ImageTree style={styles.logo2} source={require("../assets/gra.png")} />
      );
    } else if (this.state.euro < 4) {
      return (
        <ImageTree
          style={styles.logo2}
          source={require("../assets/grai.png")}
        />
      );
    } else if (this.state.euro < 6) {
      return (
        <ImageTree
          style={styles.logo2}
          source={require("../assets/grain.png")}
        />
      );
    } else if (this.state.euro < 8) {
      return (
        <ImageTree
          style={styles.logo2}
          source={require("../assets/grainem.png")}
        />
      );
    } else if (this.state.euro < 10) {
      return (
        <ImageTree
          style={styles.logo2}
          source={require("../assets/grainema.png")}
        />
      );
    } else {
      return (
        <ImageTree
          style={styles.logo2}
          source={require("../assets/grainemax.png")}
        />
      );
    }
  };

  render() {
    return (
      <RootView>
        <Menu />
        <AnimatedContainer
          style={{
            transform: [{ scale: this.state.scale }],
            opacity: this.state.opacity
          }}
        >
          <SafeAreaView>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ height: "100%" }}
            >
              <TouchableOpacity onPress={this.handleAvatar}>
                <Avatar source={require("../assets/terrelogo.png")} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.props.openRegle}>
                <Info
                  style={styles.logo}
                  source={require("../assets/info.png")}
                />
              </TouchableOpacity>

              <TitleBar>
                <Title style={styles.logo1}>Bienvenue, </Title>

                <Name style={styles.logo1}>{this.props.name}</Name>
                {/* <NotificationIcon
                  style={{ position: "absolute", right: 20, top: 5 }}
                /> */}
              </TitleBar>

              {this.renderTree()}

              <Wrapper>
                <ScrollView
                  syle={{
                    flexDirection: "row",
                    padding: 20,
                    paddingLeft: 12
                  }}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {Logos.map((logo, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => this.takePicture(logo.text)}
                    >
                      <Logo key={index} image={logo.image} text={logo.text} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Wrapper>
            </ScrollView>
          </SafeAreaView>
        </AnimatedContainer>
        <ModalLogin />
        <ModalRegister />
        <ModalRegle />
      </RootView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const Container = styled.View`
  background: white;

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;
const AnimatedContainer = Animated.createAnimatedComponent(Container);

const RootView = styled.View`
  background: black;
  flex: 1;
`;

const TitleBar = styled.View`
  width: 100%;

  margin-bottom: 0;
  padding-left: 20px;
`;
const Title = styled.Text`
  font-size: 24px;
  color: black;
  font-weight: 500;
  text-transform: uppercase;
  padding-left: 100px;
  padding-bottom: 10px;
  padding-top: 10px;
`;

const Avatar = styled.Image`
  width: 68px;
  height: 68px;
  border-radius: 34px;
  margin-left: 25px;
`;
const Info = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  margin-left: 300px;
`;

const Name = styled.Text`
  font-size: 12px;
  color: black;
  font-weight: bold;
  text-transform: uppercase;
  padding-left: 140px;
`;

const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 600;
  font-size: 15px;
  margin-left: 20px;
  margin-top: 20px;
  text-transform: uppercase;
`;

var styles = StyleSheet.create({
  logo: {
    transform: [{ translateY: -65 }]
  },
  logo1: {
    transform: [{ translateY: -50 }]
  },
  logo2: {
    transform: [{ translateY: -25 }]
  }
});

const Wrapper = styled.View``;

const ImageTree = styled.Image`
  align-self: center;
  margin-top: 0;
`;

const Logos = [
  {
    image: require("../assets/arbre.png"),
    text: "Planter arbre"
  },
  {
    image: require("../assets/dechet.png"),
    text: "Ramasser dechet"
  },
  {
    image: require("../assets/tri.jpg"),
    text: "Tri sélectif"
  },
  {
    image: require("../assets/a.jpg"),
    text: "A++"
  },
  {
    image: require("../assets/bobo.jpg"),
    text: "SOS animaux"
  },
  {
    image: require("../assets/recycler.png"),
    text: "Recycler"
  }
];

const cards = [
  {
    title: "React Native for Designers",
    image: require("../assets/background11.jpg"),
    subtitle: "React Native",
    caption: "1 of 12 sections",
    logo: require("../assets/logo-react.png")
  },
  {
    title: "Styled Components",
    image: require("../assets/background12.jpg"),
    subtitle: "React Native",
    caption: "2 of 12 sections",
    logo: require("../assets/logo-react.png")
  },
  {
    title: "Props and Icons",
    image: require("../assets/background13.jpg"),
    subtitle: "React Native",
    caption: "3 of 12 sections",
    logo: require("../assets/logo-react.png")
  },
  {
    title: "Static Data and Loop",
    image: require("../assets/background14.jpg"),
    subtitle: "React Native",
    caption: "4 of 12 sections",
    logo: require("../assets/logo-react.png")
  }
];

const courses = [
  {
    title: "Prototype in InVision Studio",
    subtitle: "10 sections",
    image: require("../assets/background13.jpg"),
    logo: require("../assets/logo-studio.png"),
    author: "Meng To",
    avatar: require("../assets/avatar.jpg"),
    caption: "Design an interactive prototype"
  },
  {
    title: "React for Designers",
    subtitle: "12 sections",
    image: require("../assets/background11.jpg"),
    logo: require("../assets/logo-react.png"),
    author: "Meng To",
    avatar: require("../assets/avatar.jpg"),
    caption: "Learn to design and code a React site"
  },
  {
    title: "Design and Code with Framer X",
    subtitle: "10 sections",
    image: require("../assets/background14.jpg"),
    logo: require("../assets/logo-framerx.png"),
    author: "Meng To",
    avatar: require("../assets/avatar.jpg"),
    caption: "Create powerful design and code components for your app"
  },
  {
    title: "Design System in Figma",
    subtitle: "10 sections",
    image: require("../assets/background6.jpg"),
    logo: require("../assets/logo-figma.png"),
    author: "Meng To",
    avatar: require("../assets/avatar.jpg"),
    caption:
      "Complete guide to designing a site using a collaborative design tool"
  }
];

const Conseils = [
  {
    title: "Pense à vider ta boite mail régulièrement"
  },
  {
    title: "Mange moins de viande pour qu'il y est moins de rejet de gaz"
  },
  {
    title: "Si tu vois un animaux en détresse, aide le"
  },
  { title: "Urine sous la douche si tu le peux" },
  {
    title: "Nettoie et dégivre ton congélateur régulièrement"
  },
  {
    title:
      "Pense à prendre tes jambes, le vélo ou les transports en commun pour les petits trajets"
  }
];
