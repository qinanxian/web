import React from 'react';
import ReactDom from 'react-dom';
import * as cache from '../../lib/cache';

/* eslint-disable */
export default class Cron extends React.Component{
  getData = () => {
    return this.data;
  };
  componentDidMount(){
    this._onLoad();
  }
  _onChange = (expr, times) => {
    const { onChange } = this.props;
    this.data = {
      expr,
      times
    };
    onChange && onChange(expr, times);
  };
  _onLoad = () => {
    const { onChange, expr, times = 5 } = this.props;
    const frame = ReactDom.findDOMNode(this.instance);
    frame.contentWindow.onChange = this._onChange;
    frame.contentWindow.defaultValue = {
      expr, times
    }
  };
  render(){
    const tempUrl = `./cron/index.htm?X-SESSION-TOKEN=${cache.getSessionId()}`;
    return <iframe
      ref={instance => this.instance = instance}
      //onLoad={this._onLoad}
      width="100%"
      height="100%"
      scrolling="auto"
      style={{border: 'none'}}
      src={tempUrl}
    >{}</iframe>;
  }
}
