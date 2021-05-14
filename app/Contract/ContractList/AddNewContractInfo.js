import React from 'react';
import {DataTablePicker, DetailInfo, Message} from '../../../src/components';

export default class AddNewContractInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setItemSuffix('applicationId', () => {
            return (
                <DataTablePicker
                    dataFormId="obiz-ApplicationPickerApprovalList"
                    pageSize={5}
                    title='选择业务进件'
                    onOk={(e, row) => {
                        if (!row) return;
                        voInfo.setData({...row});
                        voInfo.setValue('contractAmt', row['applyAmt']);
                        voInfo.setValue('termMonth', row['termMonth']);
                        voInfo.setValue('paymentMode', row['paymentMode']);
                        voInfo.setValue('paymentPeriod', row['paymentPeriod']);
                        voInfo.setValue('interestRate', row['interestRate']);
                    }}
                />
            );
        })
    };

    summarySave = (callback, btn) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
                btn.setLoading(false);
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            callback(err, values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    disabledContainer={this.props.disabledContainer}
                    dataFormId="obiz-AddNewContractInfo"
                    formReady={this.formReady}
                />
            </div>

        );
    }
}

