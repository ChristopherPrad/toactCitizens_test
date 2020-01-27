import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { ImagePicker, Permissions } from "expo";
import styled from "styled-components";

class SectionScreen extends React.Component {
  state = {
    image: null
  };

  render() {
    return (
      <Container>
        <Text>Projects Screen</Text>
        <Podometre />
      </Container>
    );
  }
}

export default SectionScreen;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
