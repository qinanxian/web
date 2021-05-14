import React from "react";
import {DetailInfo, Message} from "../../src/components";


export default class CreditLimitInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        const row = this.voInfo.getData();
        if(row.limitStatus === "DRAFT"){
            //根据申请状态控制按钮是否显示
            this.voInfo.addButton([ {
                name: '保存',
                icon: 'save',
                type: 'success',
                onClick: this.saveInfo
            }]);
        }else{
            this.voInfo.setAllReadingMode(true);
        }
    };

    saveInfo = () => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.info('保存失败,'+err+"!");
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
        });
    }


    render() {
        return (
            <div>
                <DetailInfo
                    buttonFixed = {false}
                    dataFormId={this.props.dataformId}
                    params={{limitId:this.props.limitId}}
                    dataReady={this.dataReady}
                />
            </div>

        );
    }
}