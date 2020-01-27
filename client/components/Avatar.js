import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    name: state.name
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateName: name =>
      dispatch({
        type: "UPDATE_NAME",
        name: name
      })
  };
}

class Avatar extends React.Component {
  state = {
    photo: "http://www.clipartpanda.com/clipart_images/user-66327738/download"
  };
  componentDidMount() {
    // fetch("https://uinames.com/api/?ext")
    //   .then(response => response.json())
    //   .then(response => {
    //     this.setState({
    //       photo: response.photo
    //     });
    //   });
  }

  render() {
    return <Image source={{ uri: this.state.photo }} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Avatar);

const Image = styled.Image`
  width: 88px;
  height: 88px;
  border-radius: 44px;
`;
