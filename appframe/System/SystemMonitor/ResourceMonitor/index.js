import React from "react";
import {Row, Col, Tabs, Collapse,rest,Iframe} from '../../../../src/components';
import Actuator from '../Actuator'

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

export default class ResourceMonitor extends React.Component {
    render() {
        return (
            <Tabs defaultActiveKey="actuator">
                <TabPane tab="Actuator监控" key="actuator"><Actuator/></TabPane>
                <TabPane tab="Metrics监控" key="metrics">Content of Tab Pane 2</TabPane>
                <TabPane tab="数据库连接池" key="dbpool">
                    <Iframe url={rest.getRequestURL('/druid/index.html')}></Iframe>
                </TabPane>
            </Tabs>
        );
    }
}