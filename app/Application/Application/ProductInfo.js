import React from "react";

import {Row, Col, Message, DetailInfo, Button,} from '../../../src/components';

export default class ProductInfo extends React.Component {

    constructor(props) {
        super(props);
        const {productId, appId} = props;
        this.productId = productId;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue("appId",this.props.appId);
    };

    productInfoSave = (cb) => {
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
                            dataFormId="product-ProductInfo"
                            dataReady={this.dataReady}
                            params={{productId: this.productId}}
                            // reading = {this.props.readonly}
                            labelWidth={158}
                        />
                    </Col>
                </Row>
            </div>

        );
    }

}