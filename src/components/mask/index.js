import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import * as permission from '../../lib/permission';

import './style/index.less';

class Mask extends React.Component{
  getChildContext(){
    return {
      permission: permission.getCurrentPermission(),
    };
  }
  _onClick = (event) => {
    const { clickCancel, onClose } = this.props;
    if (event) {
      const target = event.target;
      if (clickCancel && target && target.getAttribute('class') === 'ro-mask') {
        onClose && onClose();
      }
    } else {
      onClose && onClose();
    }
  };
  render() {
    const { children, prefix = 'ro', showCloseIcon = true, closeStyle = {} } = this.props;
    return (<div className={`${prefix}-mask`} onClick={this._onClick}>
      {children}
      {showCloseIcon && <span style={closeStyle} className={`${prefix}-mask-close`} onClick={() => this._onClick()}>X</span>}
    </div>);
  }
}
Mask.childContextTypes = {
  permission: PropTypes.object,
};

let maskDiv = null;

const openMask = (com, param = {}) => {
  let onresize = null;
  let refDom = null;
  const setDomWidthAndHeight = () => {
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    if (refDom) {
      // 如果是tab则需要特殊处理
      Array.from(refDom.querySelectorAll('.compose-containerv3')).forEach((tab) => {
        // eslint-disable-next-line no-param-reassign
        tab.style.height = `${height}px`;
        // eslint-disable-next-line no-param-reassign
        tab.style.width = `${width}px`;
      });
      refDom.style.height = `${height}px`;
      refDom.style.width = `${width}px`;
    }
  };
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  };
  const checkFull = () => {
    return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen;
  };
  const _close = () => {
    if (maskDiv) {
      const unmountResult = ReactDOM.unmountComponentAtNode(maskDiv);
      if (unmountResult) {
        maskDiv.parentNode.removeChild(maskDiv);
        maskDiv = null;
      }
    }
    if (checkFull()) {
      exitFullscreen();
    }
    if (onresize) {
      window.onresize = onresize;
    }
  };
  const fullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
    onresize = window.onresize;
    window.onresize = () => {
      if (!checkFull()) {
        //要执行的动作
        _close();
      } else {
        setDomWidthAndHeight(); // 浏览器全屏操作
      }
    };
  };
  const _confirmClose = () => {
    // 需要进行确认操作
    const { onClose } = param;
    if (onClose) {
      const result = onClose();
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
  };
  if (maskDiv && param.needClose) {
    _close(); // 每次打开前先执行一遍关闭操作
  } else {
    maskDiv = document.createElement('div');
    document.body.appendChild(maskDiv);
    const { clickCancel, showCloseIcon, closeStyle, isFullScreen, needSetWidth } = param;
    if (isFullScreen) {
      closeStyle.top = 40;
      closeStyle.right = 40;
    }
    ReactDOM.render(
      <Mask
        clickCancel={clickCancel}
        showCloseIcon={showCloseIcon}
        onClose={_confirmClose}
        closeStyle={closeStyle}
      >
        {
          React.cloneElement(com, {
            ref: (dom) => {
              refDom = dom;
              if (needSetWidth) {
                setDomWidthAndHeight();
              }
            },
          })
        }
      </Mask>,
      maskDiv,
      () => {
        if (isFullScreen) {
          fullScreen();
        }
      },
    );
  }
  // 方便后续删除清空该节点
  return {
    dom: maskDiv,
    close: _close,
  };
};

export default openMask;
