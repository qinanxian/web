import React from "react";
import {DetailInfo,Message} from "../../../src/components/index";

export default class DetectorItemDetail extends React.Component{

    constructor(props) {
        super(props);
        this.state ={
            detectorCode: props.detectorCode,
            itemCode: props.itemCode,
        }}



    formReady = (voInfo) =>{
        this.voInfo =voInfo;
        this.voInfo.setValue("detectorCode", this.state.detectorCode)
    }



    detectorItemInfoSave = (cb, param) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        }, param);
    };

    render(){
        return(
            <div>
                <DetailInfo
                    dataFormId ="configuration-DetectorInfo"
                    formReady ={this.formReady}
                    params = {{detectorCode:this.props.detectorCode,itemCode:this.state.itemCode}}
                />
            </div>
        )
    }
}