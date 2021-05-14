
import React from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import TabPane from './TabPane';
import config from '../../lib/config';
import './style/index.less';

class RoTabs extends React.PureComponent {
  static TabPane = TabPane;
  static defaultProps = {
    tabName: 'tab',
    keyName: 'key',
    compName: 'content',
    offsetTop: 0,
  };
  constructor(props) {
    super(props);
    this.id = Math.uuid();
    this.state = {
      disabledKeys:[],
      height: 'auto',
    };
  }
  componentDidMount(){
    const { didMount } = this.props;
    didMount && didMount({setDisable: this.setDisable});
    const { offsetTop } = this.props;
    if (offsetTop) {
      this.calcHeight();
      this.context.widthChangeAddListen &&
      this.context.widthChangeAddListen(this.id, this.calcHeight);
    }
  }
  componentWillUnmount(){
    const { offsetTop } = this.props;
    if (offsetTop) {
      this.context.widthChangeRemoveListen && this.context.widthChangeRemoveListen(this.id);
    }
  }
  setDisable = (values) => {
    this.setState({disabledKeys:values});
  };
  calcHeight = () => {
    const { offsetTop } = this.props;
    this.setState({
      height: `${document.documentElement.clientHeight - offsetTop}px`,
    });
  };
  _renderTabPane = () => {
    const { height } = this.state;
    const { options, compName, tabName, keyName, forceUpdate } = this.props;
    return options && options.map((item, index) => {
      if (item instanceof Object) {
        const retDisabled = this.state.disabledKeys.includes(item[keyName]);
        return (
          <TabPane
            paneKey={item[keyName]}
            style={{height, overflow: 'auto', ...(item.style || {})}}
            tab={item[tabName]}
            key={item[keyName]}
            forceUpdate={forceUpdate}
            disabled={retDisabled}>
            {item[compName] instanceof Object ?
              {...item[compName],props:{...item[compName].props}} : item[compName]}
          </TabPane>
        );
      }
      return (
        <TabPane tab={index} key={Math.uuid()}>
          {item}
        </TabPane>
      );
    });
  };
  handleChange = (activityKey) => {
    this.props.onTabsChange && this.props.onTabsChange(activityKey);
  };

  /* eslint-disable */
  render() {
    const {type} = this.props;
    const tabType = !type ? config.tabType : type;
    const result = {
      ...this.props,
      type:tabType,
      prefixCls:tabType === 'border-card'?'ro-tabs':'ant-tabs'
    };
    return (
      <Tabs {...result} onChange={this.handleChange}>
        { this.props.children || this._renderTabPane() }
      </Tabs>
    );
  }
}

RoTabs.contextTypes = {
  widthChangeAddListen: PropTypes.func,
  widthChangeRemoveListen: PropTypes.func,
};

export default RoTabs;
