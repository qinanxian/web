import React from "react";

import {Row,Col, DetailInfo, Message, openModal, Modal,Icon} from '../../../src/components';


export default class NetInfo extends React.Component {

    constructor(props){
        super(props);
        const {netId} = props;
        this.netId = netId;
    }


    dataReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    netInfoSave = (cb) => {
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
                            dataFormId="common-NetInfo"
                            dataReady={this.dataReady}
                            params={{netId: this.netId}}
                            reading = {this.props.readonly}
                            labelWidth={158}
                        />
                    </Col>
                </Row>
            </div>

        );
    }

}