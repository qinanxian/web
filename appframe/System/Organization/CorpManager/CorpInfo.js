import React from "react";
import {DetailInfo,Message} from "../../../../src/components/index";


export default class CorpInfo extends React.Component{
    constructor(props){
        super(props);
        const {corpId} =props;
        this.templateId =corpId;
        this.state ={
            corpId:props.corpId,
        }
    }

    formReady = (voInfo) =>{
        this.voInfo =voInfo;
    }



    corpInfoSave = (cb) => {
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
                    dataFormId ="system-CorpInfo"
                    formReady ={this.formReady}
                    params ={{corpId:this.state.corpId}}
                />
            </div>
        )
    }

}