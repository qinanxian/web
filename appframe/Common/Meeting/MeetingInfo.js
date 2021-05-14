import React from 'react';
import {DetailInfo,Message, Row, Col, DataTable, Button, openModal, Modal} from '../../../src/components/index';

import MeetingMemberInfo from "./MeetingMemberInfo";

export default class MeetingInfo extends React.Component {
    static MeetingMemberInfo = MeetingMemberInfo;

    constructor(props) {
        super(props);
        this.state = {
            meetingId: props.param.meetingId ? props.param.meetingId:null
        };
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.addButton([{
            name: '保存',
            type: 'primary',
            onClick: this.meetingInfoSave
        }])
    };

    meetingInfoSave = () => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
        });
    };

    memberListformReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            type: 'default',
            name: '新增',
            onClick: this.openMeetingMemberInfo
        }, {
            type: 'default',
            name: '删除',
            selectBind: true,
            onClick: this.deleteMeetingMember
        }]);
    };

    openMeetingMemberInfo = (row) => {
        openModal(<MeetingMemberInfo/>, {
            title: row.meetingMemberId ? "会议与会人员信息详情":"新增会议与会人员信息",
            defaultButton: true,
            onOk: (modal, compnent) => {
                compnent.memberInfoSave((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                });
            },
            tableRefresh: this.tableRefresh,
            infoRefresh: this.infoRefresh,
            meetingId:this.state.meetingId,
            meetingMemberId:row.meetingMemberId ? row.meetingMemberId:null,
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    infoRefresh = () => {
        this.voInfo.refresh();
    };

    deleteMeetingMember = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.voList.deleteRows(selectedRows);
                this.infoRefresh && this.infoRefresh();
            }
        });
    };

    memberListdataReady = (voList) => {
        this.voList.setColumnTemplate('memberName', (text, record, i) => {
            return (<a onClick={() => this.openMeetingMemberInfo(record)}>{text}</a>);
        });
    };

    render() {
        return (
            <div>
                <Row >
                    <Col span={14}>
                        <DetailInfo
                            dataFormId="common-MeetingInfo"
                            params={{meetingId: this.state.meetingId}}
                            formReady={this.formReady}
                        />

                    </Col>
                    <Col span={10}>
                        <DataTable
                            dataFormId="common-MeetingMemberList"
                            formReady={this.memberListformReady}
                            params={{meetingId: this.state.meetingId}}
                            dataReady={this.memberListdataReady}
                        />
                    </Col>
                </Row>
            </div>

        );
    }
}

