import React from 'react';
import {Row, Col, DetailInfo, Button, Message} from '../../../../src/components/index';

export default class FiscalGaapItemInfo extends React.Component {
    constructor(props) {
        super(props);
        const {gaapEntryDef, gaapDef} = this.props;
        this.gaapEntryDef = gaapEntryDef;
        this.gaapDef = gaapDef;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
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
                    dataFormId="configuration-FiscalGaapEntryInfo"
                    dataReady={this.dataReady}
                    params={{gaapEntryDef:this.gaapEntryDef, gaapDef:this.gaapDef}}
                    labelWidth={"100px"}
                />
            </div>
        );
    }
}

