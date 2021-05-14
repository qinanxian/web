import React from "react";

import {Row, Col, Message, DetailInfo, Button,} from '../../../src/components';

export default class CustBondInfo extends React.Component {

    constructor(props) {
        super(props);
        const {bondId, custId} = props;
        this.bondId = bondId;
        this.custId = custId;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue('custId', this.custId);
    };

    bondInfoSave = (cb) => {
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
                    dataFormId="customer-CustBondInfo"
                    dataReady={this.dataReady}
                    params={{bondId: this.bondId}}
                    reading = {this.props.readonly}
                    labelWidth={158}
                />
            </div>

        );
    }

}