import React from 'react';

import {DetailInfo, Notify} from '../../../src/components';

export default class ContractInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
        // this.voInfo.addButton([{
        //     name: '保存',
        //     type: 'primary',
        //     icon: 'fa-save',
        //     onClick: this.saveInfo
        // }]);
        // this.voInfo.setItemTemplate('repaymentScheduleSlot', <p>还款计划表</p>,true);
        // this.voInfo.setItemTemplate('repaymentScheduleSlot', <p>还款计划表</p>);
    }

    dataReady = () => {

    }

    saveInfo = (callback) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Notify.error({
                    message: '保存失败',
                });
            } else {
                callback && callback();
                // console.log('this.props.saveCallback',this.props.saveCallback);
                // this.props.saveCallback&&this.props.saveCallback();
            }
        });
    }

    render() {
        let contractId = this.props.contractId||this.props.param.contractId
        return (
            <DetailInfo dataFormId="obiz-ContractInfo" formReady={this.formReady} dataReady={this.dataReady} params={{contractId}}/>
        );
    }
}

