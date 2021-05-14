/**
 * Created by jkwu on 17-12-22.
 */
import React from 'react';
import { Icon, Tooltip } from '../index';
import config from '../../lib/config';
import './style/index.less';

const pageStyle = config.surface.defaultOptions.pageStyle;

class TabPanel extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return ((nextProps.tabItem.id === this.props.tabItem.id) &&
  //   (nextProps.activeTabId !== this.props.activeTabId)) || (
  //     (nextProps.isCollapse) &&
  //     (nextProps.activeTabId !== this.props.activeTabId));
  // }
    render() {
    const { tabItem, className, clickTab, deleteTab, themeColor = '#3078d7' } = this.props;
    const ps = pageStyle ? '#ffffff' : themeColor;
    return (
      <li
        className={`list-item${pageStyle} ${className}`}
        onClick={() => clickTab(tabItem)}
        key={tabItem.__id}
        style={{ background: className !== `li-active${pageStyle}` ? '' : ps }}
      >
        <Tooltip title={tabItem.name}>
          <span
            style={{ cursor: 'pointer' }}
            key={`span ${tabItem.__id}`}
          >
            {tabItem.name}
          </span>
        </Tooltip>
        <Icon type="close" className="close" onClick={e => deleteTab(e, tabItem)} />
      </li>);
  }
}

export default TabPanel;
