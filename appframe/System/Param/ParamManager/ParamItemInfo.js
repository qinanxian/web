import React from 'react';
import {Row, Col, DetailInfo, Button, Message} from '../../../../src/components';

export default class ParamItemInfo extends React.Component {
    constructor(props) {
        super(props);
        const {paramCode, paramItemCode} = this.props;
        this.paramCode = paramCode;
        this.paramItemCode = paramItemCode;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if (this.paramItemCode) {
            this.voInfo.setValueReadonly('code', true);
        } else {
            this.voInfo.setValue('enable', 'Y');
        }
        this.voInfo.setValue('paramCode', this.paramCode);
    };

    paramItemInfoSave = (cb) => {
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
                    dataFormId="system-ParamItemInfo"
                    dataReady={this.dataReady}
                    params={{paramCode: this.paramCode, paramItemCode: this.paramItemCode}}
                />
            </div>
        );
    }
}

