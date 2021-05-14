import React from 'react';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

const renderCompose = (com) => {
    class Children extends React.Component{
        shouldComponentUpdate(){
            return false;
        }
        render() {
            return <React.Fragment>{com}</React.Fragment>;
        }
    }
    return <Children/>;
};

export default class RoTab extends React.Component{
    constructor(props){
        super(props);
        this.children = renderCompose(props.children);
    }
    shouldComponentUpdate(nextProps) {
        return (nextProps.active !== this.props.active) || !!(nextProps.forceUpdate);
    }
    render(){
        const { forceUpdate, paneKey, ...restProps } = this.props;
        return (<TabPane {...restProps} key={forceUpdate ? Math.uuid() : paneKey}>
          {this.children}
        </TabPane>);
    }
}
