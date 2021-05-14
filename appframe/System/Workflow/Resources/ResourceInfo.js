import React from 'react';

import {DetailInfo,Message} from "../../../../src/components";

export default class ResourceInfo extends React.Component{


    formReady = (voInfo) =>{
        this.voInfo = voInfo;
        this.voInfo.setValue('procDefKey', this.props.procDefKey)
        this.voInfo.setValue('resourceId', this.props.resourceId)
    }


    saveInfo = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.info('保存失败！');
            } else {
                const {resourceListRefresh} = this.props;
                resourceListRefresh && resourceListRefresh();
            }
            cb(err, values);
        });
    }

    render() {
        return (
            <DetailInfo
                dataFormId="workflow-WorkflowResourceInfo"
                params={{resourceId: this.props.resourceId,
                    procDefKey: this.props.procDefKey
                }}
                formReady={this.formReady}
            />
        );
    }
}