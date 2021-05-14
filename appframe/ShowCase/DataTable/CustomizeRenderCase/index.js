import React from "react";
import {Notify, Message, Tabs} from '../../../../src/components';
import CustomizeBodyAsCard from './CustomizeBodyAsCard'
import CustomizeBodyAsList from './CustomizeBodyAsList'
import DataListView from '../DataListView'
const TabPane = Tabs.TabPane;

export default class CustomizeRenderCase extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Tabs defaultActiveKey="2">
                <TabPane tab="标准列表" key="1">
                    <CustomizeBodyAsList/>
                </TabPane>
                <TabPane tab="卡片列表" key="2">
                    <CustomizeBodyAsCard/>
                </TabPane>
                <TabPane tab="自定义表头及内容" key="3">
                    <DataListView/>
                </TabPane>
            </Tabs>
        );
    }

}
