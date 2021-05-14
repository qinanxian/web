import React from 'react';

import { Icon } from '../index';

import './style/index.less';

import config from '../../lib/config';

const showBreadcrumb = config.showBreadcrumb;
// 暂时只支持包含流程资源界面的两层显示
// 后续如果有需要再进行补充
export default class AdditionalNavigation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      hover: false,
      data: [],
      position: 'right',
      offsetTop: 0,
      offsetLeft: 0,
    };
  }
  update = (type, groups, blockId, dom, tabId, position, offsetTop, offsetLeft) => {
    this.tabId = tabId;
    if (type === 'workflow') {
      this.workflow = true;
    }
    // 过滤无效的数据
    if (Array.isArray(groups)) {
      this.dom = dom;
      if (groups.length > 0) {
        // 渲染流程数据块
        this.setState({
          data: groups.map(g => ({id: g.id, name: g.name, dom})),
        });
      }
    } else if(typeof groups === 'object') {
      const keys = Object.keys(groups);
      if (keys.length > 0) {
        const { data } = this.state;
        const tempGroups = !groups.noGroup ?
          Object.keys(groups).sort((a, b) => {
            return a.split(':')[0] - b.split(':')[0];
          })
            .filter(g => groups[g].some(item => item.elementUIHint.visible))
            .map(g => ({id: g, name: g.split(':')[1] || g})) : [];
        if (blockId) {
          // 流程资源中的info
          this.setState({
            data: data.map((d) => {
              if (d.id === blockId) {
                return {
                  ...d,
                  children: tempGroups.map(c => ({...c, dom})),
                };
              }
              return d;
            }),
          });
        } else {
          this.dom = dom;
          // 普通的info
          this.setState({
            data: tempGroups.map(g => ({...g, dom})),
          });
        }
      }
    }
    this.setState({
      position,
      offsetTop: offsetTop || this.state.offsetTop,
      offsetLeft: offsetLeft || this.state.offsetLeft,
    });
  };
  _titleEnter = () => {
    this.setState({
      hover: true,
    });
  };
  _titleLeave = () => {
    this.setState({
      hover: false,
    });
  };
  _addStyle = (dom) => {
    const tempDom = dom;
    // 增加点击之后闪烁的动画
    // 1.增加动画
    // 2.两秒后清除动画
    // ro-additional-navigation-flicker
    const { prefix = 'ro' } = this.props;
    const tempDomLastClass = tempDom.getAttribute('class') || '';
    const children = Array.from(tempDom.children).map(c => ({dom: c, lastClass: c.getAttribute('class') || ''}));
    children.forEach((c) => {
      c.dom.setAttribute('class', `${c.lastClass} ${prefix}-additional-navigation-flicker`);
    });
    tempDom.setAttribute('class', `${tempDomLastClass} ${prefix}-additional-navigation-flicker`);
    const id = setInterval(() => {
      children.forEach((c) => {
        c.dom.setAttribute('class', c.lastClass.replace(`${prefix}-additional-navigation-flicker`, ''));
      });
      tempDom.setAttribute('class', tempDomLastClass.replace(`${prefix}-additional-navigation-flicker`, ''));
      clearInterval(id);
    }, 3000);
  };
  _scrollTop = (dom) => {
    this._addStyle(dom);
    const rect = dom.getBoundingClientRect();
    const tab = document.getElementById(this.tabId);
    const workflowDom = tab.querySelector('.ro-workflow-proc-collapse')
        || tab.querySelector('.areaworkflow-container-content-body');
    const scrollDom = workflowDom || tab;
    const scrollHeight = scrollDom.scrollHeight;
    const showBreadcrumbHeight = showBreadcrumb ? 0 : 32;
    let top = rect.top - 100 - showBreadcrumbHeight;
    if (workflowDom) {
      top -= 105 - showBreadcrumbHeight;
    }
    let currentTop = scrollDom.scrollTop + top;
    if (currentTop < 0) {
      currentTop = 0;
    } else if (currentTop > scrollHeight) {
      currentTop = scrollHeight;
    }
    scrollDom.scrollTop = currentTop;
  };
  _navClick = (e, index, cIndex) => {
    // 获取点击的fieldSet
    e.stopPropagation();
    const { data } = this.state;
    const dom = data[index].dom;
    let groups = (dom && dom.querySelectorAll('.ant-collapse-item')) || [];
    if (groups.length === 0) {
      groups = ((dom && dom.querySelectorAll('.fieldset')) || []);
    }
    const scrollDom = Array.from(groups)
        .filter(g => !(g.style && g.style.display === 'none'))[index];
    if (scrollDom) {
      let tempScrollDom = scrollDom;
      if (cIndex >= 0) {
        tempScrollDom = Array.from(scrollDom.querySelectorAll('.fieldset'))
            .filter(d => (d.className && !d.className.includes('infoParent'))
                && !(d.style && d.style.display === 'none'))[cIndex];
      }
      tempScrollDom && this._scrollTop(tempScrollDom);
    }
  };
  navigationOffset = (offset = 0, defaultOffset) => {
    if (typeof offset === 'string') {
      return `calc(${offset} + ${defaultOffset}px)`;
    }
    return offset + defaultOffset;
  };
  render() {
    const { hover, data, position, offsetTop, offsetLeft } = this.state;
    const { prefix = 'ro' } = this.props;
    const style = {};
    if (position === 'left') {
      style.left = this.navigationOffset(offsetLeft, 25);
      style.top = this.navigationOffset(offsetTop, 180);
    } else {
      style.right = 50;
      style.bottom = 40;
    }
    return (
      <div
        style={{display: data.length > 0 ? '' : 'none', ...style }}
        className={`${prefix}-additional-navigation`}
        onMouseEnter={this._titleEnter}
        onMouseLeave={this._titleLeave}
      >
        <span
          className={`${prefix}-additional-navigation-title ${prefix}-additional-navigation-title-${hover ? 'hidden' : 'show'}`}
        >
          <Icon type='bars'/>
        </span>
        <div
          className={`${prefix}-additional-navigation-context ${prefix}-additional-navigation-context-${position || 'right'}-${hover ? 'show' : 'hidden'}`}
        >
          {
            data.map((d, index) => (
              <div key={d.id} onClick={e => this._navClick(e, index)}>
                <span
                  className={`${prefix}-additional-navigation-context-label`}
                >
                  <span className={`${prefix}-additional-navigation-context-label-pointer`}>{}</span>{d.name}
                </span>
                {
                  d.children ? (
                    <div className={`${prefix}-additional-navigation-sub-context`}>
                      {
                        d.children.map((c, cIndex) => (<span
                          className={`${prefix}-additional-navigation-sub-context-label`}
                          onClick={e => this._navClick(e, index, cIndex)}
                          key={c.id}
                        ><span
                          className={`${prefix}-additional-navigation-context-label-pointer`}>{}
                        </span>
                          {c.name}
                        </span>))
                      }
                    </div>
                  ) : null
                }
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

