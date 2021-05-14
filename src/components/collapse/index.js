import React from 'react';
import ReactDom from 'react-dom';
import { Collapse } from 'antd';
import PropTypes from 'prop-types';

// 针对流程资源界面用到此处的信息，需要对此进行特殊处理
// 对传递过来的属性增加判断是否要生成导航信息
const Panel = Collapse.Panel;
class RoPanel extends React.Component{
  getChildContext(){
    return {
      blockId: this.props.blockId,
    };
  }
  render() {
    return <Panel {...this.props}/>;
  }
}

class RoCollapse extends React.Component{
  static Panel = RoPanel;
  componentDidMount(){
    this._renderAnchor(this.props);
  }
  componentWillReceiveProps(nextProps){
    if (this.props.fieldSets !== nextProps.fieldSets) {
      this._renderAnchor(nextProps);
    }
  }
  _getAnchorType = () => {
    const { navigationRight, navigationLeft } = this.props;
    if (navigationRight || this.context.navigationRight) {
      return 'right';
    } else if (navigationLeft || this.context.navigationLeft) {
      return 'left';
    }
    return '';
  };
  _renderAnchor = (props) => {
    const { fieldSets, isWorkflow, offsetTop, offsetLeft } = props;
    const type = this._getAnchorType();
    if (isWorkflow && type) {
      const { renderAnchor } = this.context;
      /* eslint-disable */
      const dom = ReactDom.findDOMNode(this.instance);
      renderAnchor && renderAnchor('workflow', fieldSets, null, dom, type, offsetTop, offsetLeft);
    }
  };
  render() {
    return <Collapse {...this.props} ref={instance => this.instance = instance}/>;
  }
}

RoCollapse.contextTypes = {
  renderAnchor: PropTypes.func,
};

RoPanel.childContextTypes = {
  blockId: PropTypes.string,
};

export default RoCollapse;
