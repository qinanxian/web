import React from 'react';
import {Row, Col, Tabs} from '../../../../src/components';
import UserInfo from './UserInfo';
import UserRoleList from './UserRoleList';

export default class UserTab extends React.Component {
    constructor(props) {
        super();
        const {param} = props;
        this.tabsOptions = [
            {
                tab: '基本信息',
                key: "userInfo",
                content: <UserInfo userId={param.userId}/>
            },
            {
                tab: '用户所属角色',
                key: "userRoleList",
                content: <UserRoleList {...props} userId={param.userId}/>
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

