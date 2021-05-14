import React from 'react';
import {DetailInfo, Message} from "../../../src/components";




export  default  class  VersionChangeInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voinfo) => {
        this.voinfo = voinfo;
        voinfo.setValue('versionId',this.props.versionId);
    };

    summarySave = (cb) => {
        this.voinfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        })
    };


    render() {
        return(
            <DetailInfo
                dataFormId="configuration-VersionChangeInfo"
                formReady={this.formReady}
            />
        )
    }



}