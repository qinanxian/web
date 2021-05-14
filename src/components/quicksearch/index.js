import React from 'react';
import ReactDom from 'react-dom';
import { Input } from 'antd';
import { Icon } from '@ant-design/compatible';
import config from '../../lib/config';

import './style/index.less';

const pageStyle = config.surface.defaultOptions.pageStyle;

/* eslint-disable */
export default class QuickSearch extends React.Component {
  constructor(props) {
    super(props);
    this.flag = false;
    this.value = '';
    this.state = {
      adBtnState: props.adBtnState,
    };
  }
  componentDidMount(){
    this.dom = ReactDom.findDOMNode(this);
    if (this.dom) {
      //this.dom.setAttribute('tabindex', '0');
      this.dom.onkeydown = (e) => {
        if(e.keyCode === 13 && this.flag) {
          this._quickSearch();
        }
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.adBtnState !== this.props.adBtnState) {
      this.setState({ adBtnState: nextProps.adBtnState });
    }
  }
  _onValueChange = (e) => {
    this.value = e.target.value;
  }
  _quickSearch = () => {
    this.props.quickSearch && this.props.quickSearch(this.value);
  };
  _onFocus = () => {
    this.flag = true;
  };
  _onBlur = () => {
    this.flag = false;
  };
  _renderQuickSearch = (filters, size, prefix) => {
    const quickTerm = filters && filters.filter(ob => ob.quick);
    if (!quickTerm || quickTerm.length === 0) return;
    const placeholder = quickTerm.map(item => item.name);
    if (!placeholder || placeholder.length === 0) return;
    return (
      <Input
        placeholder={`${placeholder.join('/')}`}
        // enterButton
        size={size}
        suffix={<Icon onClick={this._quickSearch} type='search' className={`${prefix}-quick-container-box-icon`}/>}
        onBlur={this._onBlur}
        onFocus={this._onFocus}
        onChange={this._onValueChange}
      />
    );
  };
  _switchAdBtnState = () => {
    this.setState({
      adBtnState: !this.state.adBtnState
    }, () => this.props.adBtnOnChange && this.props.adBtnOnChange(this.state.adBtnState));
  };
  _renderAdSearchBtn = (filters, prefix) => {
    const { hideAdBtn } = this.props;
    if (filters && filters.length > 0) {
      return (
        <div
          style={ hideAdBtn && { display: 'none' }}
          className={`${prefix}-quick-container-adText ${prefix}-quick-container-adText${pageStyle}`}
          onClick={this._switchAdBtnState}
        >
          <span>高级搜索</span>
          <Icon type={this.state.adBtnState ? 'up' : 'down'}/>
        </div>
      );
    }
    return null;
  };
  render() {
    const { prefix = 'ro', filters, size } = this.props;
    return (
      <div className={`${prefix}-quick`} style={{height: filters && filters.length > 0 ? 31 : 0}}>
        <div className={`${prefix}-quick-container`} style={{height: filters && filters.length > 0 ? 31 : 0}}>
          <div className={`${prefix}-quick-container-box ${prefix}-quick-container-box${pageStyle}`}>{this._renderQuickSearch(filters, size, prefix)}</div>
          {this._renderAdSearchBtn(filters, prefix)}
        </div>
      </div>
    );
  }
}
