import React from "react";

import {Row, Col, Message, DetailInfo, Button,} from '../../../src/components';

export default class AuthProcessInfo extends React.Component {

    constructor(props) {
        super(props);
        const {authProcessId, appId} = props;
        this.authProcessId = authProcessId;
        this.appId = appId;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue("appId",this.props.appId);
    };

    authProcessInfoSave = (cb) => {
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
                            dataFormId="application-AuthProcessInfo"
                            dataReady={this.dataReady}
                            params={{authProcessId: this.authProcessId}}
                            disabledContainer = {true}
                            // reading = {this.props.readonly}
                            labelWidth={158}
                        />
                    </Col>
                </Row>
            </div>

        );
    }

}