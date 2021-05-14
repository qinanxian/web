import React from 'react';
import {DetailInfo, Notify, Message, Modal} from '../../../../src/components';

export default class VoucherAssistInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (formInfo) => {
        this.formInfo = formInfo;
    };

    voucherAssistInfoSave = (cb) => {
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
                    dataFormId="demo-VoucherAssistInfo"
                    formReady={this.formReady}
                    params={{entryAssistId:this.props.entryAssistId}}
                    reading
                />
            </div>

        );
    }
}
