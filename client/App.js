import React from "React";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import HomeScreen from "./screens/HomeScreen";
import AppNavigator from "./navigator/AppNavigator";
import thunk from "redux-thunk";
import rootReducer from "./components/reducers";

const initialState = {
  action: "",
  name: ""
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "OPEN_REGLE":
      return { ...state, action: "openRegle" };
    case "CLOSE_REGLE":
      return { ...state, action: "closeRegle" };
    case "OPEN_MENU":
      return { ...state, action: "openMenu" };
    case "CLOSE_MENU":
      return { ...state, action: "closeMenu" };

    case "UPDATE_NAME":
      return { ...state, name: action.name };
    case "UPDATE_EURO":
      return { ...state, tmpPas: action.tmpPas };
    case "OPEN_REGISTER":
      return { ...state, action: "openRegister" };
    case "CLOSE_REGISTER":
      return { ...state, action: "closeRegister" };
    case "OPEN_LOGIN":
      return { ...state, action: "openLogin" };
    case "CLOSE_LOGIN":
      return { ...state, action: "closeLogin" };
    case "GET_ERRORS":

    default:
      return state;
  }
  // switch (action.type) {
  //   case "OPEN_LOGIN":
  //     return { action: "openLogin" };
  //   case "CLOSE_LOGIN":
  //     return { action: "closeLogin" };
  //   default:
  //     return state;
  // }
};

const store = createStore(reducer);

const App = () => (
  <Provider store={store}>
    <AppNavigator />
  </Provider>
);

export default App;
