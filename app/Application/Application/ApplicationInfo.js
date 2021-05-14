import React from "react";

import {Row,Col, DetailInfo, Message, openModal, Modal,Icon} from '../../../src/components';


export default class ApplicationInfo extends React.Component {

    constructor(props){
        super(props);
        const {appId} = props;
        this.appId = appId;
    }


    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if(this.appId != null){
            this.voInfo.setValueReadonly('id', true);
        }
    };

    applicationInfoSave = (cb) => {
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
                            dataFormId="application-ApplicationInfo"
                            dataReady={this.dataReady}
                            params={{appId: this.appId}}
                            reading = {this.props.readonly}
                            labelWidth={158}
                        />
                    </Col>
                </Row>
            </div>

        );
    }

}