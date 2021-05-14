/**
 * Created by jkwu on 17-12-25.
 */
import React from 'react';
import NotFound from '../../../appframe/Container/NotFound';

class TabContent extends React.Component {
  handleDashBtn = (value) => {
    this.props.handleDashButton && this.props.handleDashButton(value);
  };
  resetPageMode = (value,flag) => {
    this.props.resetPageMode && this.props.resetPageMode(value,flag);
  };
  render() {
    const {activeTabId,tabs,refresh,refreshId,refreshStatus,menuWidth,dashButton,
      pageType,themeColor,colorV3,layout} = this.props;
    return (
      <div id="tab-contents">
        {
          tabs && tabs.length
          ?
            tabs.filter((tabItem) => {
              if (pageType !== 'tabs') {
                return activeTabId === tabItem.__id;
              }
              return tabItem;
            }).map((tabItem) => {
            const show = activeTabId === tabItem.__id ? '' : 'none';
            return (
              <div style={{ display: show }} key={tabItem.__id} className="tab-content">
                {React.cloneElement(tabItem.Com || <NotFound />,
                  {activeTabId,
                    tabItem,
                    refresh,
                    refreshId,
                    refreshStatus,
                    menuWidth,
                    dashButton,
                    themeColor,
                    colorV3,
                    layout,
                    resetDashBtn:this.handleDashBtn,
                    resetPageMode:this.resetPageMode,
                  })}
              </div>
            );
          })
            : ''
        }
      </div>
    );
  }
}

export default TabContent;
