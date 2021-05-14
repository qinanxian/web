/**
 * Created by apachechen on 2018/2/8.
 */
import React from 'react';

import { DataTable, Row, Col,Tabs} from '../../../../src/components';
import ParamsList from './ParamsList';
import ResourceList from './ResourceList';


export default class WorkflowParamsList extends React.Component {

    static ParamsList = ParamsList;
    static ResourceList = ResourceList;

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'resourceList',
            procDefKey: null,
            bomId: null,
        };
    }

    formReady = (voList) =>{
        this.voList = voList;
    };

    dataReady = (voList) =>{
        this.voList = voList;
    };

    selectOneRow = (key, rows) =>{
        if (rows[0]) {
            this.setState({
                procDefKey: rows[0].modelKey,
                bomId: rows[0].bomId,
            });
        }
    }

    render() {

        const tabsOptions = [
            {
                tab: '流程资源',
                key: "resourceList",
                content: <ResourceList
                    procDefKey={this.state.procDefKey}
                    activeTab={this.state.activeTab}
                />
            },
            {
                tab: '流程参数',
                key: "paramList",
                content: <ParamsList
                    procDefKey={this.state.procDefKey}
                />

            }
        ];
        return (
            <div>
                <Row >
                    <Col span={10}>
                        <DataTable
                            dataFormId="workflow-DesignerModelListForParam"
                            dataReady={this.dataReady}
                            formReady={this.formReady}
                            onSelectRow={this.selectOneRow}
                        />
                    </Col>
                    <Col span={14}>
                        <div>
                            <Tabs
                                options={tabsOptions}
                                type='line'
                                onChange={(key) => this.setState({ activeTab: key })}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}