import React from "react";
import "./style/style.css"

import { Steps, Message, Icon, Button } from '../../../src/components';

const Step = Steps.Step;

const steps = [{
    title: '01填写你的账号',
    content:"ssfd" ,
}, {
    title: '02重新设置密码',
    content: 'Reset Your Password!',
}, {
    title: '完成',
    content: 'Complete!',
}];

export default class ModifyPassword extends React.Component {

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
    };

    dataReady = (voList) => {
    };



    render() {

    }

}