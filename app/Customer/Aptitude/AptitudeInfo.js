import React from "react";

import {Row, Col, Message, DetailInfo, Button,} from '../../../src/components';

export default class CustAptitudeInfo extends React.Component {

    constructor(props) {
        super(props);
        const {aptitudeId, custId} = props;
        this.aptitudeId = aptitudeId;
        this.custId = custId;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue('custId', this.custId);
    };

    aptitudeInfoSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.info('保存失败！');
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
                    dataFormId="customer-CustAptitudeInfo"
                    dataReady={this.dataReady}
                    params={{aptitudeId: this.aptitudeId}}
                    reading = {this.props.readonly}
                />
            </div>

        );
    }

}