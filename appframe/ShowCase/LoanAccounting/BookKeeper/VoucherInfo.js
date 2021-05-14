import React from 'react';
import {DetailInfo, Notify, Message, Modal} from '../../../../src/components';

export default class VoucherInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (formInfo) => {
        this.formInfo = formInfo;
    };

    voucherInfoSave = (cb) => {
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
                    dataFormId="demo-VoucherInfo"
                    formReady={this.formReady}
                    params={{voucherId:this.props.voucherId}}
                    reading={true}
                />
            </div>

        );
    }
}
