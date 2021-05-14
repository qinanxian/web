import React from "react";

import {Row, Col, Message, DetailInfo, Button,} from '../../../src/components';

export default class CustDebtInfo extends React.Component {

    constructor(props) {
        super(props);
        const {debtId, custId} = props;
        this.debtId = debtId;
        this.custId = custId;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue('custId', this.custId);
        this.voInfo.setItemOnChange('isMarket', this.isMarketOnChange);
    };

    isMarketOnChange = (value) => {
        if (value === 'Y') {
            this.voInfo.setItemRequired('bourseName', true);
            this.voInfo.setItemVisible('bourseName', true);
        } else {
            this.voInfo.setItemRequired('bourseName', false);
            this.voInfo.setItemVisible('bourseName', false);
        }
    };

    debtInfoSave = (cb) => {
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
                <Row>
                    <Col span={24}>
                        <DetailInfo
                            dataFormId="customer-CustDebtInfo"
                            dataReady={this.dataReady}
                            params={{debtId: this.debtId}}
                            reading = {this.props.readonly}
                            labelWidth={158}
                        />
                    </Col>
                </Row>
            </div>

        );
    }

}