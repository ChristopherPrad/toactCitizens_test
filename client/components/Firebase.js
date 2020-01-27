import * as firebase from "firebase";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCNkl-ozbLLfmqMXSEZcgZiS9Iz_jJTLDU",
  authDomain: "toact-citizens.firebaseapp.com",
  databaseURL: "http://toact-citizens.firebaseio.com",
  storageBucket: "toact-citizens.appspot.com"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
