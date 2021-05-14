import React from "react";
import {DetailInfo, Message, Notify} from "../../../src/components";


export default class ApplicationInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        //根据申请状态控制按钮是否显示
        this.voInfo.addButton([ {
            name: '保存',
            icon: 'save',
            type: 'success',
            onClick: this.saveInfo
        }]);
        this.voInfo.addButton([ {
            name: '暂存',
            onClick: this.saveTempInfo
        }]);
    };

    saveInfo = () => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.info('保存失败,'+err+"!");
            } else {
                Message.success('保存成功');
                const {refresh} = this.props;
                refresh && refresh();
            }
        },{"isDraft":"N"});
    }

    saveTempInfo = () => {
        this.voInfo.saveWithoutValidate((hasError)=>{
            if(hasError){
                Notify.error('暂存失败');
            }else{
                Notify.success('暂存成功');
            }
        },{"isDraft":"Y"})
    }


    render() {
        return (
            <div>
                <DetailInfo
                    buttonFixed = {false}
                    dataFormId={this.props.dataformId}
                    params={{applicationId:this.props.applicationId}}
                    dataReady={this.dataReady}
                    saveMessageEnable={false}
                />
            </div>

        );
    }
}
