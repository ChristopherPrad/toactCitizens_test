import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import Podometre from "../components/Podometre";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

import {
  StyleSheet,
  TouchableOpacity,
  View,
  AsyncStorage,
  Image,
  ScrollView
} from "react-native";
import Axios from "axios";
import setAuthToken from "../utils/setAuthToken";

function mapStateToProps(state) {
  return { action: state.action, tmpPas: state.tmpPas, name: state.name };
}

class ProjectsScreen extends React.Component {
  state = {
    image: []
  };

  componentWillMount = () => {
    this.load();
    this.props.navigation.addListener("willFocus", this.load);
  };

  load = () => {
    AsyncStorage.getItem("x-auth-token").then(token => {
      // console.log("token : ", token);
      setAuthToken(token);
      Axios.get("http://192.168.1.33:3000/user/api/image")
        .then(result => {
          console.log("projectScreen", result.data);
          this.setState({ image: result.data });
        })
        .catch(err => console.log(err));
    });
  };

  selectPicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      aspect: 1,
      allowsEditing: true
    });
    if (!cancelled) this.setState({ image: uri });
  };

  takePicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    const { cancelled, uri } = await ImagePicker.launchCameraAsync({
      allowsEditing: false
    });
    console.log(uri);
    this.setState({ image: uri });
  };
  render() {
    return (
      <Container style={styles.logo}>
        <Text>Photos en cours de validaton</Text>
        <ScrollView style={{ height: "100%" }}>
          <ContainerImage>
            {this.state.image.map((img, index) => {
              return (
                <ImageContainer
                  key={index}
                  source={{ uri: `http://192.168.1.33:3000/${img.path}` }}
                />
              );
            })}
          </ContainerImage>
        </ScrollView>
      </Container>
    );
  }
}
export default connect(mapStateToProps)(ProjectsScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    marginTop: 0
  },
  logo: {
    transform: [{ translateY: -30 }]
  }
});

const Name = styled.Text`
  font-size: 12px;
  color: #3c4560;
  font-weight: bold;
  text-transform: uppercase;
  padding-left: 50px;
`;

const Text = styled.Text``;

const ImageContainer = styled.Image`
  width: 30%;
  height: 200px;
  margin: 5px;
`;

const ContainerImage = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  padding-top: 20px;
`;

const Container = styled.View`
  margin-top: 10px;
  flex: 1;
`;
