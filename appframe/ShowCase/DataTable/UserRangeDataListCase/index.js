import React from 'react';
import {DataTable, Row, Col,Divider} from '../../../../src/components';


export default class RofaceStarter extends React.Component {
    render() {
        return (
            <Row gutter={8}>
                <Col span={7}>
                    <br/>
                    请使用用户:<code>syang</code>或<code>ccwu</code>登录，查看效果
                    <Divider/>
                    <code>
                    <pre style={{fontSize:'9px'}}>
                        当前用户ID<br/>
                        TABLE.COLUMN=:CUR_USER <br/>
                         <br/>
                        当前用户所在机构ID<br/>
                        TABLE.COLUMN=:CUR_USER_ORG<br/>
                         <br/>
                        当前用户所有任职机构ID列表<br/>
                        TABLE.COLUMN in(:CUR_USER_OFFICE_ORG_LIST)<br/>
                         <br/>
                        当前用户所机构及其子机构ID列表<br/>
                        TABLE.COLUMN in(:CUR_USER_SUBORG_LIST)<br/>
                         <br/>
                        当前用户所有任职机构ID列表<br/>
                        TABLE.COLUMN in(:CUR_USER_OFFICE_SUBORG_LIST)<br/>
                    </pre>
                    </code>
                </Col>
                <Col span={16}>
                    <DataTable
                        dataFormId="demo-WithUserBeanPersonList"
                    />
                </Col>
            </Row>

        );
    }
}

