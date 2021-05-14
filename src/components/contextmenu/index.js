import React from 'react';
import ReactDom from 'react-dom';

import './style/index.less';

class Context extends React.Component {
  static defaultProps = {
    menus: [],
  };
  componentDidMount() {
    this.dom = ReactDom.findDOMNode(this.instance); // eslint-disable-line
    const { didMount } = this.props;
    didMount && didMount(this);
    window.addEventListener('click', this._calcClick);
  }
  componentWillUnmount() {
    window.removeEventListener('click', this._calcClick);
  }
  _calcClick = (e) => {
    if (this.dom.compareDocumentPosition(e.target) !== 20) {
      this._hidden();
    }
  };
  _checkHeight = (top, left) => {
    this.dom.focus();
    this.dom.style.display = 'block';
    this.dom.style.left = `${left}px`;
    this.dom.style.top = `${top}px`;
    const position = this.dom.getBoundingClientRect();
    const clientHeight = document.body.clientHeight;
    if ((position.height + top) >= clientHeight) {
      // 向下溢出了
      // 1.将其移动到节点的上方
      if (top - position.height >= 0) {
        this.dom.style.top = `${top - position.height}px`;
      } else {
        this.dom.style.top = '0px';
      }
    }
  };

  _onClick = (e, key, item) => {
    e.stopPropagation();
    const { onClick } = this.props;
    onClick && onClick(e, key, item);
    this._hidden();
  };
  _onBlur = () => {
    this._hidden();
  };
  _hidden = () => {
    this.dom.style.display = 'none';
  };
  display = (e) => {
    const { clientX, clientY } = e;
    this._checkHeight(clientY, clientX);
  };
  render() {
    const { menus, prefix = 'ro' } = this.props;
    return (<div
      className={`${prefix}-context-menu-container`}
      tabIndex="0" // eslint-disable-line
      onBlur={this._onBlur}
      id="contextmenu"
      ref={instance => this.instance = instance}
    >
      <ul>
        {
          menus.map((item) => {
            return (<li
              key={item.key}
              onClick={e => this._onClick(e, item.key, item)}
            >
              {item.name}
            </li>);
          })
        }
      </ul>
    </div>);
  }
}

export default Context;
