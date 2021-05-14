import React from "react";
import {Row, Col, Tabs, Collapse} from '../../../../src/components';
import HelloWord from "../../Guide/HelloWord";
import AnnotationCase from "../../Guide/AnnotationCase";
import Simple from "../../DetailInfo/Simple";

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

export default class TabsCase extends React.Component {
    constructor(props) {
        super(props);

        const {param} = props;
        this.tabsOptions = [
            {
                tab: '你好',
                key: 'roleInfo',
                content: <HelloWord/>
            },
            {
                tab: '全局对象注入',
                key: 'roleToPrivilegeList',
                content: <AnnotationCase/>
            },
            {
                tab: '简单详情',
                key: 'roleToUserList',
                content: <Simple/>
            }
        ]

    }
    render() {
        return (
            <div>
                <Row gutter={10}>
                    <Col span={12}>
                        <Collapse defaultActiveKey={['codeTabCase']}>
                            <Panel header="代码生成标签页" key="codeTabCase">
                                <Tabs options={this.tabsOptions}/>
                            </Panel>
                        </Collapse>
                    </Col>
                    <Col span={12}>
                        <Collapse defaultActiveKey={['paramTabCase']}>
                            <Panel header="直接编码标签页" key="paramTabCase">
                                <Tabs defaultActiveKey="1" onChange={this.tabsChange} type='card'>
                                    <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
                                    <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                                    <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
                                </Tabs>
                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
            </div>
        );
    }
}