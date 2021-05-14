import React from "react";
import {DetailInfo, Message} from "../../../src/components";


export default class OpporIntentInfo extends React.Component {

    constructor(props) {
        super(props);
        const {opporId,preComponentId} = props.param;
        this.opporId = opporId;
        this.preComponentId = preComponentId;
    }


    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.addButton([{
            type: 'success',
            name: '保存',
            icon: "fa-save",
            onClick: this.saveInfoInTabs
        }]);
    };

    saveInfoInModal = (callback,btn) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
                btn.setLoading(false);
            }
            callback&&callback(err, values);
        });
    }

    saveInfoInTabs = () => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
                return;
            }
            //自刷新,把参数传进去，重新取数据
            // this.voInfo.setData(values);
            this.voInfo.refresh({params:{opporId:values.opporId,preComponentId:this.preComponentId}});
            //刷新打开他的列表
            const {flexTabs} = this.props;
            const preComp = flexTabs.getTabComponent(this.preComponentId)
            preComp && preComp.voList.refresh();
        });
    }

    render() {
        return (
            <DetailInfo
                dataFormId="obiz-OpporIntentInfo"
                dataReady={this.dataReady}
                params={{opporId: this.opporId}}
                buttonFixed = {true}
            />
        );
    }
}