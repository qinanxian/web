import React from 'react';
import {Tabs} from '../index';

const TabPane = Tabs.TabPane;

export default class TabPanes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeKey: props.activeKey,
      panes:props.panes,
    };
  }
  componentWillReceiveProps(nextProps){
    if(this.state.panes !== nextProps.panes){
      this.setState({
        activeKey:nextProps.activeKey,
        panes:nextProps.panes,
      });
    }
  }
  handleTabChange = (activeKey) => {
    this.setState({ activeKey });
  };
  handleOnEdit = (targetKey) => {
    this.props.removeOnTab && this.props.removeOnTab(targetKey);
  };
  render() {
    const {panes,activeKey} = this.state;
    return (
      <Tabs
        hideAdd
        onChange={this.handleTabChange}
        onEdit={this.handleOnEdit}
        activeKey={activeKey}
        type='editable-card'
      >
        {
          panes.map((pane) => {
            return (
              <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                {pane.content}
              </TabPane>
            );
          })}
      </Tabs>
    );
  }
}
