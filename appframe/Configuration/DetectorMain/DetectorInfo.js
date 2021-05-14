import React from "react";

import {DetailInfo,Message} from "../../../src/components/index";
export default class DetectorInfo extends React.Component{

    constructor(props) {
        super(props);
        this.state ={
            code: props.code,
        }}


    formReady = (voInfo) =>{
        this.voInfo =voInfo;
    }


    detectorListInfoSave = (cb) => {
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

    render(){
        return(
            <div>
                <DetailInfo
                    dataFormId ="configuration-DetectorDetail"
                    formReady ={this.formReady}
                    params = {{code:this.state.code}}
                />
            </div>
        )
    }
}



