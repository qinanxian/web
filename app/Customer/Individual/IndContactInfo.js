import React from 'react';
import {DetailInfo, Button, Message, Notify, DataTable, Modal} from '../../../src/components/index';

export default class IndContactInfo extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            serialNo: props.params.serialNo ? props.params.serialNo : null,
            custId: props.params.custId ? props.params.custId : null,
        };
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue("custId", this.state.custId);
    };


    addSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.info('保存失败,'+err+"!");
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
                    dataFormId="customer-IndCustomerContactInfo"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params={{serialNo:this.state.serialNo}}
                />
            </div>
        );
    }
}

