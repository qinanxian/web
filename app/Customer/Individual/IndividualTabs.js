import React from 'react';
import {Tabs, Row, Col, Message, DetailInfo, Button} from '../../../src/components/index';
import IndividualInfo from "./IndividualInfo";
import BizApplicationList from "./BizApplicationList";
import {Iframe, rest} from "../../../src/components";

export default class IndividualTabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            custId: props.param.custId ? props.param.custId : null,
            readonly: props.param ? props.param.readonly : props.readonly,
            tabsOptions: [
                {
                    tab: '客户详情',
                    key: 'one',
                    content: <IndividualInfo {...props} />
                },{
                    tab: '业务信息',
                    key: 'two',
                    content: <BizApplicationList {...props}/>
                }
            ]
        };
    }


    render() {
        return (
            <div>
                <Col span={24}>
                    <Tabs options={this.state.tabsOptions} offsetTop={170}/>
                </Col>
            </div>
        );
    }
}

