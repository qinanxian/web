import React from 'react';
import ReactDOM from 'react-dom';

import './style/index.less';


export const scrollbarDecorate = (Com) => {
  class Decorate extends React.Component {

    constructor(props) {
      super(props);
      this.instance = null;
      this.timer = null;
      this.position = 0;
      this.ticking = false;
      this.hiddenHeight = 25;
      this.hiddenWidth = 17;
      this.coefficientX = 1;
      this.coefficientY = 1;
      this.lastScrollTop = 0;
      this.offsetHeight = 0;
      this.nodeOffsetHeight = 0;
      // this.parentNodeStyle = null;
    }

    getInstance = (instance) => {
      let tempInstance = instance;
      if (tempInstance) {
        /*eslint-disable */
        const node = instance && ReactDOM.findDOMNode(instance);
        this.nodeOffsetHeight = node.parentNode.offsetHeight - node.offsetHeight;
        this.instance = tempInstance;
      } else {
        tempInstance = this.instance;
      }
      this._initScrollBarHandler(tempInstance, true);
    };

    _initScrollBarHandler = (instance, flag) => {
      const node = instance && ReactDOM.findDOMNode(instance);
      if (node) {
        node.style.position = 'relative';
        // node.parentElement.style.height = window.getComputedStyle(node.parentElement.parentElement).height;
        // node.parentElement.style.width = window.getComputedStyle(node.parentElement.parentElement).width;
        // 监听滚动的事件
        this._addEventListener(node, 'scroll', this._scrollFunc);
        // 初始化水平滚动条
        if (node.offsetWidth < node.scrollWidth) {
          // 如果内容的宽度大于显示的宽度
          // 隐藏默认滚动条
          // 设置组件溢出是可以滚动的
          node.style.overflowX = 'scroll';
          node.style.paddingBottom = this.hiddenHeight + 'px';
          this._hiddenDefaultScrollBar(node, flag, 'height', this.hiddenHeight);
          this._initScrollBarX(node);

        } else {
          this._hiddenScrollBarX(node);
        }

        if (node.offsetHeight < node.scrollHeight) {
          // 隐藏默认滚动条
          node.style.overflowY = 'scroll';
          node.style.paddingRight = this.hiddenWidth + 'px';
          this._hiddenDefaultScrollBar(node, flag, 'width', this.hiddenWidth);
          this._initScrollBarY(node);
        }
      }
    };

    _hiddenDefaultScrollBar = (node, flag, field, fieldValue) => {
      if (flag) {
        const nodeHeight = node.getBoundingClientRect()[field];
        node.style[field] = nodeHeight + fieldValue + 'px';
      }
    };

    _initScrollBarX = node => {
      const scrollBarXNode = node.parentNode.children[2];
      scrollBarXNode.style.height = '10px';
      const scrollBarX = scrollBarXNode.children[0];
      const scrollBarXNodeWidth = node.offsetWidth;
      const coefficientX = scrollBarXNodeWidth / node.scrollWidth;
      scrollBarX.style.width = (coefficientX * scrollBarXNodeWidth) + 'px';
      const _startScrollMoveHandler = (downEvent) => {
        downEvent.stopPropagation();
        const marginLeft = this._rmPX(scrollBarX.style.marginLeft);
        const scrollBarXNodeRect = scrollBarXNode.getBoundingClientRect();
        const scrollBarXWidth = this._rmPX(scrollBarX.style.width);
        // 鼠标点击水平滚动条的时候开始监听
        const _startScrollMove = e => {
          window.requestAnimationFrame(() => {
            // 计算水平移动的距离
            const moveX = e.clientX - downEvent.clientX;
            // 计算边界
            if (marginLeft < 0) {
              node.scrollLeft = 0;
            } else if (marginLeft >= scrollBarXNodeRect.width - scrollBarXWidth) {
              node.scrollLeft = (node.scrollWidth - node.offsetWidth) / this.coefficientX;
            } else {
              node.scrollLeft = (marginLeft + moveX) / this.coefficientX;
            }
          });
        };
        const _startScrollMoveUp = () => {
          window.removeEventListener('mousemove', _startScrollMove);
          window.removeEventListener('mouseup', _startScrollMoveUp);
        };
        window.addEventListener('mousemove', _startScrollMove);
        window.addEventListener('mouseup', _startScrollMoveUp);
      };
      // 增加拖动事件
      this._addEventListener(scrollBarX, 'mousedown', e => _startScrollMoveHandler(e));
      this.coefficientX = coefficientX;
    };

    _hiddenScrollBarX = node => {
      const scrollBarXNode = node.parentNode.children[2];
      scrollBarXNode.style.height = '0px';
    };

    _showScrollBarY = node => {
      const scrollBarYNode = node.parentNode.children[0];
      const scrollBarYNodeBar = scrollBarYNode.children[0];
      scrollBarYNodeBar.style.display = 'block';
    };

    _initScrollBarY = node => {
      const scrollBarYNode = node.parentNode.children[0];
      const scrollBarYNodeHeight = node.parentNode.offsetHeight - this.nodeOffsetHeight;
      scrollBarYNode.style.height = scrollBarYNodeHeight + 'px';
      scrollBarYNode.style.top = 'auto';
      const scrollBarYNodeBar = scrollBarYNode.children[0];
      scrollBarYNodeBar.style.zIndex = 4;
      const coefficientY = scrollBarYNodeHeight / node.scrollHeight;
      const scrollBarYNodeBarHeight = scrollBarYNodeHeight * coefficientY;
      scrollBarYNodeBar.style.height = scrollBarYNodeBarHeight + 'px';
      this.coefficientY = coefficientY;
    };

    _hiddenScrollBarY = node => {
      const scrollBarYNode = node.parentNode.children[0];
      const scrollBarYNodeBar = scrollBarYNode.children[0];
      scrollBarYNodeBar.style.display = '';
    };

    _rmPX = str => {
      if (str && str.length > 2 && str.endsWith('px')) {
        return parseInt(str.substring(0, str.length - 2), 10);
      }
      return 0;
    };

    _scrollFunc = e => {
      const currentTarget = e.currentTarget;
      this.position = window.scrollY;
      if (!this.ticking) {
        // 使用window自带的方法，优化性能，防止滚动的过程中频繁操作影响性能
        window.requestAnimationFrame(() => {
          const scrollBarYNode = currentTarget.parentNode.children[0];
          const scrollBarYNodeBar = scrollBarYNode.children[0];
          const scrollBarXNode = currentTarget.parentNode.children[2];
          const scrollBarXNodeBar = scrollBarXNode.children[0];
          // 判断是水平滚动还是垂直滚动
          if (currentTarget.scrollTop === this.lastScrollTop) {
            // 水平滚动
            const margin = currentTarget.scrollLeft * this.coefficientX;
            scrollBarXNodeBar.style.marginLeft = margin + 'px'
          } else {
            this.lastScrollTop = currentTarget.scrollTop;
            // 垂直滚动
            // 初始化滚动条
            this._showScrollBarY(currentTarget);
            // 500毫秒内没有滚动的话，就隐藏垂直滚动条
            if (this.timer) {
              clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
              this._hiddenScrollBarY(currentTarget);
            }, 500);
            const margin = currentTarget.scrollTop * this.coefficientY;
            scrollBarYNodeBar.style.marginTop = margin + 'px';
          }
          this.ticking = false;
        });
      }
      this.ticking = true;
    };

    _renderXScrollBar = () => {
      const { prefixCls = 'ro' } = this.props;
      return (
        <div className={prefixCls + '-scroller-x-wrapper'} style={{ marginTop: -this.hiddenHeight }}>
          <div className={prefixCls + '-scroller-x-bar'}>{}</div>
        </div>
      );
    };

    _renderYScrollBar = () => {
      const { prefixCls = 'ro' } = this.props;
      const scrollYWrapperStyle = {};
      return (
        <div className={prefixCls + '-scroller-y-wrapper'} style={scrollYWrapperStyle}>
          <div className={prefixCls + '-scroller-y-bar'}>{}</div>
        </div>
      );
    };

    _addEventListener = (node, fucName, fuc) => {
      if (node.addEventListener) {
        node.addEventListener(fucName, fuc, false);
      }
    };

    _removeEventListener = (node, fucName, fuc) => {
      if (node.addEventListener) {
        node.removeEventListener(fucName, fuc, false);
      }
    };

    // 数据发生变化或者页面重新渲染的时候需要更新滚动条
    componentDidUpdate() {
      this._initScrollBarHandler(this.instance);
    }

    // 清除所有的监听和定时器
    componentWillUnmount() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.instance) {
        const node = ReactDOM.findDOMNode(this.instance);
        this._removeEventListener(node, 'scroll', this._scrollFunc);
      }
    }

    render() {
      return (<div style={{ height: '100%', width: '100%', position: 'relative' }}>
        {this._renderYScrollBar()}
        {
          typeof Com === 'function' ?
            <Com {...this.props} ref={this.getInstance} /> : React.cloneElement(Com, { ref: this.getInstance })
        }
        {this._renderXScrollBar()}
      </div>);
    }
  }
  return Decorate;
};

export class Scrollbar extends React.Component {
  render() {
    const { children } = this.props;
    const Com = scrollbarDecorate(children);
    return <Com />;
  }
}
