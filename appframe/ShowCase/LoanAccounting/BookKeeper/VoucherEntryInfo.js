import React from 'react';
import {DetailInfo, Notify, Message, Modal} from '../../../../src/components';

export default class VoucherEntryInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (formInfo) => {
        this.formInfo = formInfo;
    };

    voucherEntryInfoSave = (cb) => {
        this.formInfo.saveData((err, values) => {
            if (err) {
                cb && cb('凭证保存成功');
            } else {
                cb && cb();
            }
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="demo-VoucherEntryInfo"
                    formReady={this.formReady}
                    params={{voucherEntryId:this.props.voucherEntryId}}
                    reading
                />
            </div>

        );
    }
}
