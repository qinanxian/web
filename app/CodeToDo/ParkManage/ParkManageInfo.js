import React from "react";

import {Row,Col, DetailInfo, Message, openModal, Modal,Icon} from '../../../src/components';
import {getUser} from '../../../src/lib/cache';

export default class ParkManageInfo extends React.Component {

    constructor(props){
        super(props);
        const {parkId,networkId} = props;
        this.parkId = parkId;
        this.networkId = networkId;
    }


    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue("networkId",this.networkId);
        if(this.parkId != null){
            // this.voInfo.setValueReadonly('id', true);
        }
    };

    parkInfoSave = (cb) => {
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
                            dataFormId="codetodo-ParkInfo"
                            dataReady={this.dataReady}
                            params={{parkId: this.parkId}}
                            labelWidth={158}
                        />
                    </Col>
                </Row>
            </div>

        );
    }

}