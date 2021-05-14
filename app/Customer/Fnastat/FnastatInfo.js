import React from "react";

import {Row, Col, Message, DetailInfo, Button,} from '../../../src/components';
/**
 * Created by dswang on 2018/3/8.
 */

export default class FnastatInfo extends React.Component {

    constructor(props) {
        super(props);
        const {custId,serialNo} = props;
        this.custId = custId;
        this.serialNo = serialNo;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue('custId', this.custId);
        if(this.serialNo){
            let keys = Object.keys(this.voInfo.getData());
            keys.forEach(element => {
              this.voInfo.setValueReadonly(element, true);
            });
        }
    };

    fnastatInfoSave = (cb) => {
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
                <Row>
                    <Col span={24}>
                        <DetailInfo
                            dataFormId="customer-FnastatInfo"
                            dataReady={this.dataReady}
                            params={{custId: this.custId,serialNo:this.serialNo}}
                            labelWidth={130}
                            reading = {this.props.readonly}
                        />
                    </Col>
                </Row>
            </div>

        );
    }

}