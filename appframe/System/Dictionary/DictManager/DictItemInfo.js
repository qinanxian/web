import React from 'react';
import {Row, Col, DetailInfo, Button, Message} from '../../../../src/components';

export default class DictItemInfo extends React.Component {
    constructor(props) {
        super(props);
        const {dictCode, dictItemCode} = this.props;
        this.dictCode = dictCode;
        this.dictItemCode = dictItemCode;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if (this.dictItemCode) {
            this.voInfo.setValueReadonly('code', true);
        } else {
            this.voInfo.setValue('status', '1');
        }
        this.voInfo.setValue('dictCode', this.dictCode);
    };

    dictItemInfoSave = (cb) => {
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
                    dataFormId="system-DictItemInfo"
                    dataReady={this.dataReady}
                    params={{dictCode: this.dictCode, dictItemCode: this.dictItemCode}}
                />
            </div>

        );
    }
}

