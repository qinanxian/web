import React, { Fragment } from 'react';
import ReactDom from 'react-dom';

import './style/index.less';

/* eslint-disable */
export default class Resizeable extends React.Component{
  _onMouseDown = (event) => {
    const { onResize } = this.props;
    this.moveUp = false;
    const downX = event.clientX;
    this.instanceDom = ReactDom.findDOMNode(this.instance);
    const react = this.instanceDom.getBoundingClientRect();
    const offWidth = parseFloat(react.width) || 0;
    document.onmousemove = (e) => {
      if (!this.moveUp) {
        onResize && onResize({width: offWidth - (downX - e.clientX)});
        //this.instanceDom.style.width = `${offWidth - (downX - e.clientX)}px`;
      } else {
        document.onmousemove = null;
      }
    };
    document.onmouseup = () => {
      this.moveUp = true;
    };
  };
  render() {
    const { children } = this.props;
    return (
      <Fragment>
        {React.cloneElement(children, {
          className: 'ro-resizeable-container',
          ref: instance => this.instance = instance,
        }, <Fragment>
          {children.props.children}
          {
            React.createElement('span', {
              className: 'ro-resizeable-container-handler',
              onMouseDown: this._onMouseDown,
            })
          }
        </Fragment>)}
      </Fragment>
    );
  }
}
