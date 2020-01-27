import React from "react";
import { Pedometer } from "expo-sensors";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import styled from "styled-components";

import { Button, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import Axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { material } from "react-native-typography";
import { robotoWeights } from "react-native-typography";
import { iOSUIKit } from "react-native-typography";

function mapStateToProps(state) {
  return { action: state.action, euro: state.tmpPas };
}

class Podometre extends React.Component {
  state = {
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    pastStateCount: 0,
    currentStepCount: 0,
    tmpPas: 0,
    euro: 0,
    categorie: []
  };

  componentDidMount() {
    this._subscribe();
    this.getDataPodometre();
    this.load();
    console.log(this.props.navigation);
    this.props.navigation.addListener("willFocus", this.load);
  }

  load = () => {
    this.getDataCategorie();
  };

  componentWillUnmount() {
    this._unsubscribe();
  }

  getDataCategorie = () => {
    AsyncStorage.getItem("x-auth-token").then(token => {
      setAuthToken(token);
      Axios.get("http://192.168.1.33:3000/user/api/image")
        .then(res => {
          this.setState({
            categorie: res.data
          });
        })
        .catch(err => console.log(err));
    });
  };

  getDataPodometre = () => {
    AsyncStorage.getItem("x-auth-token").then(token => {
      setAuthToken(token);
      Axios.get("http://192.168.1.33:3000/step/me")
        .then(res => {
          this.setState({
            pastStepCount: res.data.numberstep,
            euro: res.data.money
          });
        })
        .catch(err => console.log(err));
    });
  };

  postDataPodometre = () => {
    let data = {
      numberstep: this.state.pastStepCount + this.state.currentStepCount,
      money: this.state.euro
    };

    AsyncStorage.getItem("x-auth-token").then(token => {
      setAuthToken(token);
      Axios.post("http://192.168.1.33:3000/step/info", data)
        .then(res => {
          this.setState({
            pastStepCount: res.data.numberstep,
            euro: res.data.money
          });
        })
        .catch(err => console.log(err));
    });
  };

  _subscribe = () => {
    // Analyse le nombre de pas en temps réel
    this._subscription = Pedometer.watchStepCount(result => {
      // Convertir en euro
      if (result.steps && result.steps / 10 > this.state.tmpPas) {
        // console.log(this.state.tmpPas);
        this.setState({ euro: this.state.pastStepCount / 10 });
      }
      console.log("function watchStepCount", this.state);
      this.setState(
        {
          pastStateCount: result.steps,
          currentStepCount: result.steps - this.state.pastStateCount
        },
        () => {
          this.postDataPodometre();
        }
      );
    });

    // Si podometre activé
    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result)
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: "Could not get isPedometerAvailable: " + error
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  filterCategorie = categorie => {
    return this.state.categorie.filter(cat => {
      return categorie === cat.categorie;
    }).length;
  };

  render() {
    return (
      <RootView>
        <Number>{this.state.pastStepCount}</Number>
        <Pas style={styles.logo}>pas effectués</Pas>

        <Number>{this.filterCategorie("Planter arbre")}</Number>
        <Pas style={styles.logo}>arbres plantés</Pas>

        <Number>{this.filterCategorie("Ramasser dechet")}</Number>
        <Pas style={styles.logo}>dêchets ramassés</Pas>

        <Number>{this.filterCategorie("Tri sélectif")}</Number>
        <Pas style={styles.logo}>tri sélectif effectués</Pas>

        <Number>{this.filterCategorie("SOS animaux")}</Number>
        <Pas style={styles.logo}>animaux aidés</Pas>

        <Number>{this.filterCategorie("Recycler")}</Number>
        <Pas style={styles.logo}>Recyclages effectués</Pas>

        <Number>{this.filterCategorie("A++")}</Number>
        <Pas style={styles.logo}>appareils basses consommations</Pas>

        {/* completer les section */}
        {/* <Number>{this.filterCategorie("Ramasser dechet")}</Number>
        <Pas>Ramasser dechet</Pas> */}

        <Number> {this.state.euro} </Number>
        <Pas style={styles.euro}>euros récoltés</Pas>
      </RootView>
    );
  }
}

export default connect(mapStateToProps)(Podometre);

const RootView = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 26px;
  color: #b8bece;
  font-weight: 500;
  text-transform: uppercase;
  padding-left: 20px;
  padding-top: 100px;
`;

const Pas = styled.Text`
  font-size: 16px;
  color: black;
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 160px;
`;

const Number = styled.Text`
  width: 30%;
  font-size: 40px;
  color: #adff2f;
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 50px;
  margin-top: 10px;
`;

var styles = StyleSheet.create({
  logo: {
    transform: [{ translateY: -20 }]
  },
  euro: { fontSize: 30, transform: [{ translateY: -20 }] }
});
