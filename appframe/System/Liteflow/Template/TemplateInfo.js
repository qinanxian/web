import React from "react";

import {DetailInfo,Message} from "../../../../src/components/index";


export default class TemplateInfo extends React.Component{
    constructor(props){
        super(props);
        const {templateId,defExplicit} =props;
        this.templateId =templateId;
        this.defExplicit =defExplicit;
        this.state ={
            templateId:props.templateId,
        }
    }

    formReady = (voInfo) =>{
        this.voInfo =voInfo;
        if (null===this.templateId){
            this.voInfo.setItemVisible("defExplicit",false)
        }
    }


    templateInfoSave = (cb) => {
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
                    dataFormId ="workflow-LiteflowTemplateInfo"
                    formReady ={this.formReady}
                    params ={{templateId:this.state.templateId}}
                />

            </div>
        )
    }
}