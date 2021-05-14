/**
 * Created by apachechen on 2018/2/8.
 */
import React from 'react';

import { DetailInfo, Message, Row, Col,openModal,Icon, Upload} from '../../../../src/components';
export default class ParamList extends React.Component {

    formReady = (voInfo) =>{
        this.voInfo = voInfo;
        this.voInfo.setValue('procDefKey', this.props.procDefKey)
        this.voInfo.setValue('bomId', this.props.bomId)
    }

    saveInfo = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {paramListRefresh} = this.props;
                paramListRefresh && paramListRefresh();
            }
            cb(err, values);
        });
    }

    render() {
        return (
            <DetailInfo
                dataFormId="workflow-WorkflowParamsInfo"
                params={{procDefKey: this.props.procDefKey,
                         bomId: this.props.bomId
                }}
                formReady={this.formReady}
            />
        );
    }
}
