import React from 'react';
import {Row, Col, Tabs} from '../../../../src/components';
import RoleInfo from './RoleInfo';
import RoleToUserList from './RoleToUserList';
import RoleAndPermit from './RoleAndPermit';
import RolePermitTree from './RolePermitTree';

export default class RoleTab extends React.Component {

    constructor(props) {
        super();

        const {param} = props;
        this.tabsOptions = [
            {
                tab: '角色权限',
                key: 'roleAndPermit',
                content: <RoleAndPermit roleId={param.roleId}/>
            }, {
                tab: '角色下用户',
                key: 'roleToUserList',
                content: <RoleToUserList roleId={param.roleId}/>
            },
            // {
            //     tab: '基本信息',
            //     key: 'roleInfo',
            //     content: <RoleInfo roleId={param.roleId}/>
            // }, {
            //     tab: '权限',
            //     key: 'rolePermit',
            //     content: <RolePermitTree roleId={param.roleId}/>
            // }
        ]

    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Tabs defaultActiveKey="roleAndPermit" options={this.tabsOptions}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

