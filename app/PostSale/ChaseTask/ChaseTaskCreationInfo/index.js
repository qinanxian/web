import React from 'react';
import {DataTablePicker, DetailInfo, Message} from '../../../../src/components';

export default class ChaseTaskCreationInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue('chaseId',this.props.chaseId);
        this.voInfo.setItemSuffix('userName', () => {
            return (
                <DataTablePicker
                    dataFormId="common-PickerUserList"
                    pageSize={5}
                    title='请选择人员'
                    onOk={(e, row) => {
                        if (!row) return;
                        voInfo.setValue('userId', row['id']);
                        voInfo.setValue('userName', row['name']);
                    }}
                />
            );
        })
    };

    saveInfo = (callback, btn) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
                btn.setLoading(false);
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            callback(err, values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="obiz-ChaseTaskCreationInfo"
                    formReady={this.dataReady}
                />
            </div>

        );
    }
}

