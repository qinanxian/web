import React from 'react';
import {Checkbox} from 'antd';
import {
    Button,
    Icon,
    Message,
    Divider,
    Menu,
    Row,
    Col,
    Form,
    Radio,
    Select,
    DatePicker,
    Input,
    InputNumber,
} from '../../../../src/components/index';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export class CustomizedForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: props.data};
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        return (

            <Form>
                <FormItem {...formItemLayout} label="邮件">
                    <Row gutter={8}>
                        <Col span={16}>
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email', message: '邮件地址格式不正确',
                                }, {
                                    required: true, message: '此项必填',
                                }
                                ]
                                , initialValue: this.state.data.email
                            })(
                                <Input/>
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="用户识别码">
                    <Row gutter={8}>
                        <Col span={10}>
                            {getFieldDecorator('code', {
                                rules: [{required: true, message: '此项必填', whitespace: true}],
                                initialValue: this.state.data.code,
                            })(
                                <Input/>
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="姓名">
                    <Row gutter={8}>
                        <Col span={12}>
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '此项必填', whitespace: true}],
                                initialValue: this.state.data.name,
                            })(
                                <Input/>
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="英文名">
                    <Row gutter={8}>
                        <Col span={12}>
                            {getFieldDecorator('engName',{initialValue: this.state.data.engName,})(
                                <Input/>
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="性别">
                    <Row gutter={8}>
                        <Col span={16}>
                            {getFieldDecorator('gender',{initialValue: this.state.data.gender,})(
                                <RadioGroup>
                                    <Radio value="1">男</Radio>
                                    <Radio value="2">女</Radio>
                                    <Radio value="3">未知性别</Radio>
                                </RadioGroup>
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="出生日期">
                    <Row gutter={8}>
                        <Col span={8}>
                            {getFieldDecorator('birth',{initialValue: this.state.data.birth,})(
                                <DatePicker/>
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="身高">
                    <Row gutter={8}>
                        <Col span={8}>
                            {getFieldDecorator('height',{initialValue: this.state.data.height,})(
                                <Input addonAfter={getFieldDecorator('prefixHeight')(
                                    <span>CM</span>
                                )}/>
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="体重">
                    <Row gutter={8}>
                        <Col span={14}>
                            {getFieldDecorator('weight',{initialValue: this.state.data.weight,})(
                                <InputNumber
                                    formatter={value => `${value} KG`}
                                    parser={value => value.replace(' KG', '')}
                                />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="爱好">
                    {getFieldDecorator('hobby',{initialValue: this.state.data.hobby,})(
                        <Checkbox.Group>
                            <Row>
                                <Col span={6}><Checkbox value="HOB1">游泳</Checkbox></Col>
                                <Col span={6}><Checkbox value="HOB2">足球</Checkbox></Col>
                                <Col span={6}><Checkbox value="HOB3">篮球</Checkbox></Col>
                                <Col span={6}><Checkbox value="HOB4">跑步</Checkbox></Col>
                                <Col span={6}><Checkbox value="HOB5">户外</Checkbox></Col>
                                <Col span={6}><Checkbox value="HOB6">登山</Checkbox></Col>
                                <Col span={6}><Checkbox value="HOB7">攀岩</Checkbox></Col>
                            </Row>
                        </Checkbox.Group>
                    )}
                </FormItem>
            </Form>


        );
    }
}

export default class FormWithData extends React.Component {
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
            <div style={{margin: '15px'}}>
                <Row gutter={10}>
                    <Col span={16}>
                        <this.MyForm data={this.state.data}/>
                    </Col>
                    <Col span={8}>
                <pre className="language-bash">
                    {JSON.stringify(this.state.data, null, 2)}
                </pre>
                    </Col>
                </Row>
            </div>
        );
    }
}

