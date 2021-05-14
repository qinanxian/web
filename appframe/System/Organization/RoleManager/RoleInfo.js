import React from 'react';
import {Row, Col, DetailInfo, Message, Notify, Button} from '../../../../src/components';

export default class RoleInfo extends React.Component {

    constructor(props) {
        super();
        this.roleId = props.roleId ? props.roleId : null;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if (this.roleId) {
            this.voInfo.setItemVisible('id', true);
        } else {
            this.voInfo.setValue('status', '1');
            this.voInfo.setValue('inWorkFlow', 'N');
        }
        this.voInfo.addButton([{
            name: '保存',
            type: 'primary',
            icon: 'fa-save',
            onClick: this.roleInfoSave
        }]);
    };

    roleInfoSave = (e, cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                Notify.success('保存成功！');
                if (this.roleId) {
                    this.voInfo.refresh({roleId: this.roleId});
                } else {
                    const {refresh} = this.props;
                    refresh && refresh();
                }
            }
            cb && (typeof cb === 'function') && cb(err, values);
        });
    };

    render() {
        return (
            <DetailInfo
                dataFormId="system-RoleInfo"
                dataReady={this.dataReady}
                params={{roleId: this.roleId}}
            />

        );
    }
}

