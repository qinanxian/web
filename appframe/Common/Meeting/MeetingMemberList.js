import React from "react";

import { DataTable, Message, Modal, openModal, propsCompose} from '../../../src/components/index';
import MeetingMemberInfo from "./MeetingMemberInfo";

@propsCompose
export default class MeetingMemberList extends React.Component {
    static MeetingMemberInfo = MeetingMemberInfo;

    constructor(props) {
        super(props);
        this.state = {
            meetingId: props.param.meetingId ? props.param.meetingId:null
        };
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            type: 'primary',
            name: '新增',
            onClick: this.openMeetingMemberInfo
        }, {
            type: 'primary',
            name: '删除',
            selectBind: true,
            onClick: this.deleteMeetingMember
        }]);
    };


    openMeetingMemberInfo = (row) => {
        openModal(<MeetingMemberInfo/>, {
            title: row.meetId ? "会议与会人员信息详情":"新增会议与会人员信息",
            defaultButton: true,
            onOk: (modal, compnent) => {
                compnent.accountInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                });
            },
            refresh: this.tableRefresh,
            meetingId:this.state.meetingId,
            meetingMemberId:row.meetingMemberId ? row.meetingMemberId:null,
         });
    };

    deleteMeetingMember = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    dataReady = (voList) => {
        this.voList.setColumnTemplate('memberName', (text, record, i) => {
            return (<a onClick={() => this.openMeetingMemberInfo(record)}>{text}</a>);
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="common-MeetingMemberList"
                    formReady={this.formReady}
                    params={{meetingId: this.state.meetingId}}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}