import React from "react";

import { DataTable, Message, Modal, openModal, propsCompose} from '../../../src/components/index';
import MeetingSummary from "./MeetingSummary";
import MeetingInfo from "./MeetingInfo";
import MeetingMemberList from "./MeetingMemberList";

@propsCompose
export default class MeetingList extends React.Component {
    static MeetingSummary = MeetingSummary;
    static MeetingInfo = MeetingInfo;
    static MeetingMemberList = MeetingMemberList;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            type: 'default',
            name: '新增',
            onClick: this.openMeetingSummary
        }, {
            type: 'default',
            name: '删除',
            onClick: this.deleteMeeting,
            selectBind: true
        }]);
    };

    openMeetingMemberList = () => {
        const selectedRows = this.voList.getSelectedRows();
        const meetingId = selectedRows[0].meetingId ? selectedRows[0].meetingId : null;

        const {flexTabs} = this.props;
        flexTabs.open(`会议主题：${selectedRows[0].meetingTopic}`, 'Common/Meeting/MeetingMemberList', {
            meetingId: meetingId
        });
    };

  openMeetingSummary = () => {
    openModal(<MeetingSummary/>, {
      title: "新增会议信息",
      defaultButton: true,
      width:'35%',
      onOk: (modal, compnent) => {
        compnent.accountInfo((err, value) => {
          if (!err) {
            modal.close();
          }
        });
      },
      onCancel: (a, b) => {
      },
      refresh: this.tableRefresh,
    });
  };

    openMeetingInfo = (row) => {
        const meetingId = row.meetingId ? row.meetingId:null
        const meetingTopic = row.meetingTopic ? row.meetingTopic:null

        const {flexTabs} = this.props;
        flexTabs.open(`会议信息详情|${meetingTopic}`, 'Common/Meeting/MeetingInfo', {
            meetingId: meetingId,
        });
    };

    deleteMeeting = () => {
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
        this.voList.setColumnTemplate('meetingTopic', (text, record, i) => {
            return (<a onClick={() => this.openMeetingInfo(record)}>{text}</a>);
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="common-MeetingList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}