import React from 'react';
import {Row, Col, DetailInfo, Button, Message} from '../../../../src/components/index';

export default class FiscalGaapSummary extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
    }

    paramInfoSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {onCancel, refresh} = this.props;
                onCancel && onCancel();
                refresh && refresh();
            }
            cb(err, values);
        });
    };

    render() {
        const {gaapCode} = this.props;
        this.gaapCode = gaapCode;

        return (
            <div>
                {/*<Button onClick={this.paramInfoSave}>保存</Button>*/}
                <DetailInfo
                    dataFormId="configuration-FiscalGaapSummary"
                    formReady={this.formReady}
                />
            </div>
        );
    }
}

