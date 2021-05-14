import React from 'react';

import './index.less';

export default class AutoTooltip extends React.Component {
  /* eslint-disable */
  constructor(props) {
    super(props);
    this.status = true;
  }

  _onMouseOver = e => {
    const { title } = this.props;
    const currentTarget = e.currentTarget;
    setTimeout(() => {
      this._showToolTips(currentTarget, title);
    }, 250);
    // this._showToolTips(currentTarget, title);
  };

  _onMouseLeave = e => {
    const toolTip = document.getElementById('tooltip-toolTips');
    if (toolTip) {
      toolTip.style.visibility = 'hidden';
      setTimeout(() => {
        toolTip.style.visibility = 'hidden';
      }, 250);
    } else {
      this.status = false;
    }
  };

  componentWillUnmount() {
    this._onMouseLeave();
  }

  _calculateLeft = (tipInnerRect, clientRect) => {
    // 计算left的值
    const centerLeft = clientRect.left + (clientRect.width / 2);
    return centerLeft - (tipInnerRect.width / 2);
  };

  _showToolTips = (e, title) => {
    const { position = 'top' } = this.props;
    if (e && (e.offsetWidth < e.scrollWidth)) {
      const clientRect = e.getBoundingClientRect();
      let toolTips = document.querySelector('#tooltip-toolTips');
      let arrow = document.querySelector('#tooltip-toolTips-arrow');
      let tipInner = document.querySelector('#tooltip-toolTips-inner');
      if (!toolTips) {
        toolTips = document.createElement('div');
        toolTips.className = 'tooltip-toolTips';
        toolTips.id = 'tooltip-toolTips';
        const content = document.createElement('div');
        arrow = document.createElement('div');
        arrow.id = 'tooltip-toolTips-arrow';
        toolTips.appendChild(arrow);
        tipInner = document.createElement('div');
        tipInner.className = 'tooltip-toolTips-inner';
        tipInner.id = 'tooltip-toolTips-inner';
        content.appendChild(arrow);
        content.appendChild(tipInner);
        toolTips.appendChild(content);
        document.getElementsByTagName('body')[0].appendChild(toolTips);
      }
      if (!this.status) {
        toolTips.style.visibility = 'hidden';
        this.status = true;
      } else {
        toolTips.style.visibility = 'visible';
      }
      arrow.className = 'tooltip-toolTips-arrow tooltip-toolTips-arrow-' + position;
      tipInner.innerHTML = title;
      const toolTipRect = toolTips.getBoundingClientRect();
      const tipInnerRect = tipInner.getBoundingClientRect();
      if (position === 'top') {
        toolTips.style.top = (clientRect.top - toolTipRect.height - 10) + 'px';
      } else if (position === 'bottom') {
        toolTips.style.top = (clientRect.top + clientRect.height + 10) + 'px';
      }
      toolTips.style.left = this._calculateLeft(tipInnerRect, clientRect) + 'px';
    }
  };

  render() {
    const { children } = this.props;
    return React.cloneElement(children, { onMouseOver: this._onMouseOver, onMouseLeave: this._onMouseLeave });
  }
}
