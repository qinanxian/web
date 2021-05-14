import React from 'react';
import ReactDom from 'react-dom';
import {addOnResize} from '../../lib/listener';

const actionsType = ['datascope', 'action'];

export default class MenuChildren extends React.Component {
  constructor(props){
    super(props);
    this.flag = true;
  }
  componentDidMount(){
    /* eslint-disable */
    this.dom = ReactDom.findDOMNode(this);
    this._setComHeight();
    addOnResize(() => {
      if (this.flag) {
        this.flag = false;
        setTimeout(() => {
          this._setComHeight();
          this.flag = true;
        }, 100)
      }
    })
  };
  _setComHeight = () => {
    this.dom.style.maxHeight = (document.documentElement.clientHeight * 4 / 5) + 'px';
  };
  handleMouseE = (e) => {
      e.target.style.backgroundColor = this.props.themeColor;
      e.target.style.opacity = "0.65";
      e.target.style.color = "#ffffff";
  };
  handleMouseL = (e) => {
    e.target.style = {};
  };
  renderForthChildrenMenu = (children = []) => {
    const { menuClick } = this.props;
    const ret = children.map(item => {
      if (item && actionsType.includes(item.type)) return null;
      return (
        <li key={item.path} onClick={e => menuClick(e, item)}>
          {
            item.url ? (
              <span onMouseEnter={this.handleMouseE} onMouseLeave={this.handleMouseL}>{item.topic}</span>
            ) : (
              <span className='nav-item-disabled'>{item.topic}</span>
            )
          }
        </li>
        );
      }
    );
    return ret;
  };
  renderThirdChildrenMenu = (children = [], prefix) => {
    const { menuClick } = this.props;
    return (
      <ul className={`${prefix}-child`}>
        {
          children.map((item) => {
            if (item.children && item.children.length) {
              // 过滤掉权限项
              const tempMenuChildren = item.children.filter(childItem => !actionsType.includes(childItem.type));
              if (tempMenuChildren.length) {
                return (
                  this.renderForthChildrenMenu(tempMenuChildren)
                );
              }
            }
            return (
              <li
                key={item.path}
                onClick={e => menuClick(e, item)}
              >
                {
                  item.url ? (
                    <span onMouseEnter={this.handleMouseE} onMouseLeave={this.handleMouseL}>{item.topic}</span>
                  ) : (
                    <span className='nav-item-disabled'>{item.topic}</span>
                  )
                }
              </li>);
          })
        }
      </ul>
    );
  };
  renderSecondChildrenMenu = (children = [], prefix) => {
    const { menuClick,themeColor } = this.props;
    return (
      <div className={`${prefix}-container`}>
        <div className={`${prefix}-container-wrapper`}>
          {
            children.map((child) => {
              if (actionsType.includes(child.type)) return null;
              // 过滤掉权限项
              const tempMenuChildren = child.children && child.children.filter(childItem => !actionsType.includes(childItem.type)) || [];
              return (
                <div key={child.path} >
                  <div className={`${prefix}-container-wrapper-item`}>
                    <div className={`${prefix}-container-wrapper-item-menu`} onClick={e => menuClick(e, child)}>
                      <span style={{color:themeColor}} className={`${prefix}-container-wrapper-item-menu-name`}>{child.topic}</span>
                    </div>
                  </div>
                  <div>
                    {
                      this.renderThirdChildrenMenu(tempMenuChildren, `${prefix}-container-wrapper-item`)
                    }
                  </div>
                </div>);
            })
          }
        </div>
      </div>
    );
  };
  render() {
    const { prefix, menu } = this.props;
    // 过滤掉权限项
    const tempMenuChildren = menu.children &&
      menu.children.filter(childItem => !actionsType.includes(childItem.type)) || [];
    return (
      this.renderSecondChildrenMenu(tempMenuChildren, `${prefix}-menu-children`)
    );
  }
}
