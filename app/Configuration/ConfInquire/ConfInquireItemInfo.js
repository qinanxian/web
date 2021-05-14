import React from "react";
import {DetailInfo, Message} from "../../../src/components";


export default class ConfInquireItemInfo extends React.Component {

    constructor(props) {
        super(props);
        this.dossierDefKey = props.dossierDefKey;
        this.itemDefKey = props.itemDefKey;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue('dossierDefKey',this.dossierDefKey);
    }

    saveInfoData = (callback, btn) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
                btn.setLoading(false);
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            callback(err, values);
        });
    }

    render() {
        return (
            <DetailInfo
                dataFormId="configuration-InquireItemInfo"
                dataReady={this.dataReady}
                params={{dossierDefKey: this.dossierDefKey,itemDefKey:this.itemDefKey}}
            />
        );
    }

}