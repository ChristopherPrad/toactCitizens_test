import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import SectionScreen from "../screens/SectionScreen";

import HomeScreen from "../screens/HomeScreen";
import TabNavigator from "./TabNavigator";

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Section: SectionScreen
  },
  {
    mode: "modal"
  }
);

export default createAppContainer(TabNavigator);
