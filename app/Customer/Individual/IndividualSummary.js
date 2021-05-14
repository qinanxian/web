import React from 'react';
import {DetailInfo, Button, Message} from '../../../src/components/index';

export default class IndividualSummary extends React.Component {
    constructor(props) {
        super(props);
        this.custId = null;
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
        if (this.custId) {
            this.voInfo.setValueReadonly('custId', true);
        } };

    individualSummarySave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                if (this.custId) {
                    this.voInfo.refresh({custId: this.custId});
                } else {
                    const {refresh} = this.props;
                    refresh && refresh();
                }
            }
            cb(err, values);
        });
    };

    render() {
        const {custId} = this.props;
        this.custId = custId;

        return (
            <div>
                <DetailInfo
                    dataFormId="customer-IndividualCustomerSummary"
                    formReady={this.formReady}
                />
            </div>
        );
    }
}

