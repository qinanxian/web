import React from 'react';
import { JSMind } from '../../../Components/index';
import { getUserPilot } from "../../../../src/lib/base";
import formatdata from "../../../Components/jsmind/formatdata";
import { Spin } from "../../../../src/components";

export default class MindCase extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
  }

  componentDidMount() {
    getUserPilot()
      .then((ret) => {
        this.setState({data: formatdata});
        // this.setState({ data: formatdata });
      });
  }


  render() {
    if (this.state.data) {
      return (
        <JSMind dataSource={this.state.data}/>
      );
    } else {
      return <Spin tip="数据加载中..."/>
    }
  }
}

