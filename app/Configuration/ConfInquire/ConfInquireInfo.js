import React from "react";
import {DetailInfo, Message} from "../../../src/components";


export default class ConfInquireInfo extends React.Component {

    constructor(props) {
        super(props);
        this.dossierDefKey = props.dossierDefKey;
        this.dossierType = props.dossierType;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue('dossierType',this.dossierType);
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
                dataFormId="configuration-InquireInfo"
                dataReady={this.dataReady}
                params={{dossierDefKey: this.dossierDefKey}}
            />
        );
    }

}