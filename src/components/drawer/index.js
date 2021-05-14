import React from 'react';
import ReactDOM from 'react-dom';
import { Drawer } from 'antd';
import PropTypes from 'prop-types';

import * as permission from '../../lib/permission';

const openDrawer = (com, param = {}) => {
  class Com extends React.Component{
    getChildContext(){
      return {
        permission: permission.getCurrentPermission(),
      };
    }
    render() {
      return com;
    }
  }
  Com.childContextTypes = {
    permission: PropTypes.object,
  };
  const maskDiv = document.createElement('div');
  document.body.appendChild(maskDiv);
  const _close = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(maskDiv);
    if (unmountResult) {
      maskDiv.parentNode.removeChild(maskDiv);
    }
  };
  const _confirmClose = (event) => {
    const target = event.target;
    const name = target.getAttribute('class') === 'ant-drawer-mask' ? 'maskClosable' : 'onClose';
    // 需要进行确认操作
    const opt = param[name];
    if (opt) {
      if (typeof opt === 'function') {
        const result = opt();
        if (result === undefined) {
          // 如果没有返回值则直接关闭
          _close();
        } else if (result){
          // 如果返回值存在
          if (result.then){
            // 如果返回的是一个promise
            result.then(() => {
              _close();
            });
          } else {
            _close();
          }
        }
      } else {
        _close();
      }
    } else if (opt === undefined){
      _close();
    }
  };
  const { title, width = 256, placement = 'right', closable, keyboard = false } = param;
  ReactDOM.render(<Drawer
    closable={closable}
    maskClosable
    title={title}
    width={width}
    onClose={_confirmClose}
    placement={placement}
    visible
    keyboard={keyboard}
  >
    <Com/>
  </Drawer>, maskDiv);
  return {
    close: _close,
  };
};

export default openDrawer;

