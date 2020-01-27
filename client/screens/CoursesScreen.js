import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import styled from "styled-components";
import Podometre from "../components/Podometre";

class CoursesScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    image: null
  };

  render() {
    return (
      <Container>
        <Text>Impact</Text>
        <Podometre navigation={this.props.navigation} />
      </Container>
    );
  }
}
export default CoursesScreen;

const Container = styled.View`
  margin-top: 10px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
