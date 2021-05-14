import React from 'react';
import {DetailInfo, Message} from '../../../src/components';

export default class CreditDemoSummary extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    summarySave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="demo-PolicyDemoAdd"
                    formReady={this.formReady}
                />
            </div>

        );
    }
}

