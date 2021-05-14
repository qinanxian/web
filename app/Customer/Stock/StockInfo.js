import React from "react";

import {Row, Col, Message, DetailInfo, Button,} from '../../../src/components';

export default class CustStockInfo extends React.Component {

    constructor(props) {
        super(props);
        const {stockId, custId} = props;
        this.stockId = stockId;
        this.custId = custId;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue('custId', this.custId);
    };

    stockInfoSave = (cb) => {
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
                            dataFormId="customer-CustStockInfo"
                            dataReady={this.dataReady}
                            params={{stockId: this.stockId}}
                            reading = {this.props.readonly}
                            labelWidth={158}
                        />
                    </Col>
                </Row>
            </div>

        );
    }

}