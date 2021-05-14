import React from 'react';
import {DataTablePicker, DetailInfo, Message} from '../../../src/components';

export default class ChaseCreationInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setItemSuffix('objectId', () => {
            return (
                <DataTablePicker
                    dataFormId="obiz-ChaseContractPickerList"
                    pageSize={5}
                    title='请选择业务合同'
                    onOk={(e, row) => {
                        if (!row) return;
                        voInfo.setValue('objectType', 'BIZ_CONTRACT');
                        voInfo.setValue('objectId', row['contractId']);
                        voInfo.setValue('loanAmt', row['contractBalance']);
                        voInfo.setValue('custId', row['custId']);
                        voInfo.setValue('custName', row['custName']);
                    }}
                />
            );
        })
    };

    saveInfo = (callback, btn) => {
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
                    dataFormId="obiz-ChaseCreationInfo"
                    formReady={this.dataReady}
                />
            </div>

        );
    }
}

