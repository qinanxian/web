import React from 'react';
import ReactDOM from 'react-dom';

let borderLeft = '';
let borderRight = '';
class MoveCom extends React.Component {
  static defaultProps = {
    position: 'right',
    cursor: 'e-resize',
  };

  _onMouseDown = (e) => {
    e.stopPropagation();
    const target = e.target;
    const body = document.getElementsByTagName('body')[0];
    if (body) {
      // 将全局的鼠标样式设置成移动样式，防止鼠标移动时闪烁
      body.style.cursor = 'e-resize';
    }
    /* eslint-disable */
    const data = ReactDOM.findDOMNode(this).children[0];
    // log('left:' + target.style.left);
    data.style.width = data.style.width || (data.clientWidth + 'px');
    if (!borderLeft) {
      // 首次点击时计算左边边界
      borderLeft = e.clientX - data.clientWidth;
      borderRight = e.clientX + data.parentNode.parentNode.clientWidth - 25;
    }
    // const target = window.event.target;
    document.onmousemove = (evt) => {
      if (target) {
        // 判断移动越界
        /* eslint-disable */
        if ((evt.clientX - borderLeft > 1) && (evt.clientX - borderRight < 0)) {
          // 计算移动的距离
          data.style.width = (parseInt(data.style.width.split('px')[0])
            + (evt.clientX - parseInt(target.style.left.split('px')[0]))) + 'px';
          //log('width' + data.style.width);
          target.style.left = evt.clientX + 'px';
        } else {
          this._onMouseUp(evt);
        }
      }
    };
  };

  _onMouseUp = (e) => {
    e.stopPropagation();
    //log('up:' + e.target);
    const body = document.getElementsByTagName('body')[0];
    if (body) {
      // 将全局的鼠标样式设置成移动样式，防止鼠标移动时闪烁
      body.style.cursor = '';
    }
    document.onmousemove = null;
  };

  render() {
    const { children, style } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'row', ...style }}>
        <div
          style={{
            overflow: 'auto',
          }}
        >
          {children}
        </div>
        <div>
        <div
          onMouseDown={this._onMouseDown}
          onMouseUp={this._onMouseUp}
          style={{
            height: 'calc(100vh - 55px)',
            width: 1.5,
            backgroundColor: '#CDCDCD',
            cursor: 'e-resize',
            position: 'absolute',
          }}
        >
          {}
        </div>
      </div>
      </div>
    );
  }
}

export default MoveCom;
