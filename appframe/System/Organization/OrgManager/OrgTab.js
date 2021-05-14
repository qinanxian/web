import React from 'react';
import {Row, Col, Tabs} from '../../../../src/components';
import OrgInfo from './OrgInfo';
import OrgRoleList from './OrgRoleList';

export default class OrgTab extends React.Component {
    constructor(props) {
        super();

        const {param} = props;
        this.tabsOptions = [
            {
                tab: '基本信息',
                key: "orgInfo",
                content: <OrgInfo orgId={param.orgId} parentId={param.parentId}/>
            },
            {
                tab: '机构下用户',
                key: "orgRoleList",
                content: <OrgRoleList {...props} orgId={param.orgId}/>
            }
        ]

    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Tabs options={this.tabsOptions}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

