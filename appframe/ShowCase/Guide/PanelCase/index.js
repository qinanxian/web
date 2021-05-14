import React from 'react';
import {Button, Icon, Collapse, Divider, Menu, Row, Col, Form} from '../../../../src/components/index';
import {CustomizedForm} from '../FormWithData'

const Panel = Collapse.Panel;


export default class PanelCase extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {
                email: 'Alan@amarsoft.com',
                code:'P1001',
                name:'艾伦',
                engName:'Alan',
                birth:'1990-02-02',
                height:182,
                weight:160,
                hobby:['HOB6','HOB7','HOB2']
            },
        }
        this.MyForm = Form.create({
            onValuesChange: (props, values) => {
                let stateData = Object.assign(this.state.data, values);
                this.setState({data: stateData});
            }
        })(CustomizedForm);
    }
    render() {
        return (
            <div>
                <Row gutter={10}>
                    <Col span={15} offset={1}>
                        <Collapse defaultActiveKey={['formData']}>
                            <Panel header="个人基本信息" key="formData">
                                <this.MyForm data={this.state.data}/>
                            </Panel>
                        </Collapse>
                    </Col>
                    <Col span={7}>
                        <Collapse defaultActiveKey={['dataCode']}>
                            <Panel header="数据展示" key="dataCode">
                                <pre className="language-bash">
                                    {JSON.stringify(this.state.data, null, 2)}
                                </pre>
                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
            </div>

        );
    }
}

