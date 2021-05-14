import React from "react";
import "./style/style.css"

import { Steps, Message, Button } from '../../../src/components';

const Step = Steps.Step;

const steps = [{
    title: '01填写你的账号',
    content:"Input Your Email!" ,
}, {
    title: '02重新设置密码',
    content: 'Reset Your Password!',
}, {
    title: '03完成',
    content: 'Complete!',
}];

export default class ModifyPassword extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            current: 0,
        };
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }
    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    TransmitVerificationCode = () => {
        message.success("动态密码为:123456")
    }

    formReady = (voList) => {
        this.voList = voList;

    };

    dataReady = (voList) => {
    };



    render() {
        const { current } = this.state;

        return (
            <div>
                <div id="steps-title">
                    <Steps current={current}>
                        {steps.map(item => <Step key={item.title} title={item.title} />)}
                    </Steps>
                </div>
                <div id="steps-content">{steps[this.state.current].content}</div>
                <div id="steps-action">
                    {
                        this.state.current < steps.length - 1
                        &&
                        <Button type="primary" onClick={() => this.next()}>Next</Button>
                    }
                    {
                        this.state.current === steps.length - 1
                        &&
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                    }
                    {
                        this.state.current > 0
                        &&
                        <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                            Previous
                        </Button>
                    }
                </div>
            </div>
        );
    }

}