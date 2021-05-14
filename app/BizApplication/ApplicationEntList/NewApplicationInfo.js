import React from 'react';
import {DataTablePicker, DetailInfo, Message} from '../../../src/components';

export default class NewApplicationInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setItemSuffix('custName', () => {
            return (
                <DataTablePicker
                    dataFormId="obiz-Picker4EntCustomer"
                    pageSize={5}
                    title='请选择客户'
                    onOk={(e, row) => {
                        if(!row)return;

                        voInfo.setValue('custId', row['custId']);
                        voInfo.setValue('custName', row['custName']);
                        voInfo.setValue('custCertType', row['certType']);
                        voInfo.setValue('custCertId', row['certId']);
                    }}
                />
            );
        })
    };

    newApplicationSave = (callback,btn) => {
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
                    dataFormId="obiz-NewApplicationEntInfo"
                    formReady={this.formReady}
                />
            </div>

        );
    }
}

