import React from 'react';
// import ReactDom from 'react-dom';

import Link from './Link';
import './style/index.less';
import { addEventListener, removeEventListener } from '../../../src/lib/listener';

export default class Anchor extends React.Component {
  static Link = Link;
  constructor(props) {
    super(props);
    this.id = Math.uuid();
    this.linkids = [];
    this.domids = [];
    this.doms = [];
    this.links = [];
  }
  componentDidMount() {
    // console.log(this.links);
    /* eslint-disable */
    // const node = ReactDom.findDOMNode(this);
    addEventListener(document, 'mousewheel', this._scrollFunc);
  }
  componentDidUpdate() {
    // 获取表单dom的位置
    this.doms = this.domids.map((dom) => {
      const tempDom = document.getElementById(dom);
      return ({id: dom, dom: tempDom});
    });
    // 获取导航条的位置
    this.links = this.linkids.map((link) => {
      const dom = document.getElementById(link);
      return ({id: link, dom});
    });
  }
  componentWillUnmount() {
    removeEventListener(document, 'mousewheel', this._scrollFunc);
  }
  _scrollFunc = (e) => {
    console.log(this.doms);
    this.doms.forEach((item, index) => {
      if (index === 0) {
        console.log(item.dom.getBoundingClientRect().top);
      }
    })
    //console.log(e.deltaY);
  };
  render() {
    const { children, prefix = 'ro' } = this.props;
    return (<div className={`${prefix}-anchor`}>
      <div className={`${prefix}-anchor-line`}>
        <span className={`${prefix}-anchor-line-ball`}>{}</span>
      </div>
      <div className={`${prefix}-anchor-links`}>{
        (children || []).map((child) => {
          const linkId = `${this.id}-${child.props.id}`;
          if (!this.domids.includes(child.props.id)) {
            this.domids.push(child.props.id);
          }
          if (!this.linkids.includes(linkId)) {
            this.linkids.push(linkId);
          }
          return React.cloneElement(child, { id: linkId });
        })
      }</div>
    </div>);
  }
}
