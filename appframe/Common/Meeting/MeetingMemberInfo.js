import React from 'react';
import { DetailInfo, Message, DataTablePicker } from '../../../src/components/index';

export default class MeetingMemberInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meetingId: props.meetingId ? props.meetingId:null,
            meetingMemberId: props.meetingMemberId ? props.meetingMemberId:null
        };
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setItemSuffix('memberName', () => {
            return (
                <DataTablePicker
                    dataFormId="system-UserSummaryList"
                    pageSize={5}
                    title='选择参会人员信息'
                    onOk={(e, row) => {
                        if (row) {
                            this.voInfo.setData({
                                memberId: row.id,
                                memberName: row.name,
                            });
                        }
                    }}
                />
            );
        })
    };

    memberInfoSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {tableRefresh,infoRefresh} = this.props;
                tableRefresh && tableRefresh();
                infoRefresh && infoRefresh();
            }
            cb(err, values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="common-MeetingMemberInfo"
                    params={{meetingId: this.state.meetingId,meetingMemberId: this.state.meetingMemberId}}
                    dataReady={this.dataReady}
                />
            </div>

        );
    }
}

