import React from 'react';
import {Row, Col, DetailInfo, Button, Message} from '../../../../src/components';

export default class DictInfo extends React.Component {
    constructor(props) {
        super(props);
        this.dictCode = null;
        this.dictCategory = 'OTHER';
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if (this.dictCode) {
            this.voInfo.setValueReadonly('code', true);
        } else {
            this.voInfo.setValue('categoryCode', this.dictCategory);
        }
    };

    dictInfoSave = (cb) => {
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
        const {dictCode, dictCategory} = this.props;
        this.dictCode = dictCode;
        if (dictCategory == '_ALL_') {
            this.dictCategory = 'OTHER';
        } else {
            this.dictCategory = dictCategory;
        }

        return (
            <div>
                <DetailInfo
                    dataFormId="system-DictInfo"
                    dataReady={this.dataReady}
                    params={{dictCode: this.dictCode}}
                />
            </div>

        );
    }
}

