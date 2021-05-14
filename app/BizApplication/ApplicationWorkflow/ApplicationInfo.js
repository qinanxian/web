import React from "react";
import {DetailInfo, Message} from "../../../src/components";


/**
 * 流程资源块-申请信息
 */
export default class ApplicationInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            applicationId: props.param.workflowTask.workflowProc.objectId,
            dataformId: props.param.dataformId,
        };
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        //根据申请状态控制按钮是否显示
        // this.voInfo.addButton([ {
        //     name: '保存',
        //     icon: 'save',
        //     type: 'success',
        //     onClick: this.saveInfo
        // }]);
    };

    saveInfo = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.info('保存失败,'+err+"!");
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            if(cb) cb(err, values);
        });
    }


    render() {
        return (
            <div>
                <DetailInfo
                    buttonFixed = {false}
                    dataFormId={this.state.dataformId}
                    params={{applicationId:this.state.applicationId}}
                    dataReady={this.dataReady}
                />
            </div>

        );
    }
}
