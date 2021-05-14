import React from 'react';
import {
    DetailInfo,
    Message,
    DataTablePicker,
    Notify
} from '../../../../src/components';

export default class UserSummary extends React.Component {
    constructor(props) {
        super();
        this.userId = props.userId;
    }

    dataReady = (voinfo) => {
        this.voinfo = voinfo;
        if (this.userId) {
            this.voinfo.setItemVisible('id', true);
        } else {
            this.voinfo.setValue('status', '1');
        }
        this.voinfo.setItemSuffix('orgname', () => {
            return (
                <DataTablePicker
                    dataFormId="system-OrgSummaryList"
                    pageSize={5}
                    title='选择机构'
                    onOk={(e, row) => {
                        row && this.voinfo.setValue('orgname', row.name);
                        this.voinfo.setValue('orgId', row.id)
                    }}
                />
            );
        })
      this.voinfo.setItemOnChange('code',this.itemOnChange);
    };

    itemOnChange = (value) => {
      this.voinfo.setValue("id",value);
    }

    userInfoSave = (cb) => {
        this.voinfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                this.props.refresh();
            }
            cb(err,values);
        });
    };

    render() {
        return (
            <DetailInfo
                dataFormId="system-UserSummary"
                dataReady={this.dataReady}
                params={{userId: this.userId}}
                labelWidth="130px"
            />
        );
    }
}

