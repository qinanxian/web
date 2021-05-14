import React from 'react';
import {Row, Col, DetailInfo, Button, Message} from '../../../../src/components';

export default class ParamInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if (this.props.paramCode) {
            this.voInfo.setValueReadonly('code', true);
        }
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
        })
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="system-ParamInfo"
                    dataReady={this.dataReady}
                    params={{paramCode: this.props.paramCode}}
                />
            </div>

        );
    }
}

