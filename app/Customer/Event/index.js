import React from "react";

import {Row, Col, DataTable, Message, openModal, Modal} from '../../../src/components';
import CustEventInfo from "./EventInfo";

export default class CustEventList extends React.Component {

    static CustEventInfo = CustEventInfo;

    constructor(props) {
        super(props);
        this.state = {
            event: null
        };
        const {custId} = props;
        this.custId = custId;
    }

    formReady = (voList) => {
        this.voList = voList;
        if(!this.props.readonly) {
            this.voList.addButton([{
                name: '新增',
                onClick: this.openEventInfo
            }, {
                selectBind: true,
                name: '删除',
                onClick: this.deleteEvent
            }]);
        }
        this.voList.addButton([{
            selectBind: true,
            name: '详情',
            onClick: this.editEventInfo
        }]);
    };

    openEventInfo = () => {
        this.openEventInfoModal(null, '新增大事记');
    };

    editEventInfo = () => {
        const selectedRows = this.voList.getSelectedRows();
        const eventId = this.voList.getSelectedRows()[0].id;
        this.openEventInfoModal(eventId, '查看大事记');
    };

    openEventInfoModal = (eventId, title) => {
        openModal(<CustEventInfo readonly={this.props.readonly}/>, {
            title: title,
            custId: this.custId,
            eventId: eventId,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.eventInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    deleteEvent = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCance: () => {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="customer-CustEventList"
                    params={{custId: this.custId}}
                    formReady={this.formReady}
                />
            </div>
        );
    }
}