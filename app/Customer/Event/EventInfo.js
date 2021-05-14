import React from "react";

import {Row, Col, Message, DetailInfo, Button,} from '../../../src/components';

export default class CustEventInfo extends React.Component {

    constructor(props) {
        super(props);
        const {eventId, custId} = props;
        this.eventId = eventId;
        this.custId = custId;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue('custId', this.custId);
    };

    eventInfoSave = (cb) => {
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
                            dataFormId="customer-CustEventInfo"
                            dataReady={this.dataReady}
                            params={{eventId: this.eventId}}
                            reading = {this.props.readonly}
                        />
                    </Col>
                </Row>
            </div>

        );
    }

}