import React from 'react';

import {DataTable, Notify, Message, openModal, Modal} from '../../../src/components';

import PublicNoticeInfo from "./PublicNoticeInfo"


export default class AnnounceProfile extends React.Component {
    static PublicNoticeInfo = PublicNoticeInfo;

    constructor(props) {
        super(props);
    }

    formReady = (volist) => {
        this.volist = volist;
        volist.addButton([
            {
                name: '新增',
                type: 'primary',
                onClick: this.openAnnounceSummary
            },{
                name: '详情',
                type: 'primary',
                selectBind: true,
                onClick: this.openAnnounceInfo
            },{
                name: '删除',
                selectBind: true,
                onClick: this.deleteSelectedRows
            },{
                name: '置为无效',
                selectBind: (rows) => this.isBtnDisabled(rows),
                onClick: this.updatePublicNoticeStatus
            }
        ]);
    };

    isBtnDisabled = (rows) => {
        if (rows.length != 1) {
            return true;
        }
        const row = rows[0];
        if (row.status !== 'VALID') {
            return true;
        }
        return false;
    };

    updatePublicNoticeStatus = () => {
        const selectedRow = this.volist.getSelectedRow();
        this.volist.invoke('updatePublicNoticeStatus', selectedRow)
            .then((data) => {
                Notify.success(data && `变更成功`);
                this.volist.refresh();
            }).catch((error) => {
            Modal.info({
                content: error.message,
            });
        })
    };

    openAnnounceInfo=()=>{
        const selectedRow = this.volist.getSelectedRow();
        openModal(<PublicNoticeInfo publicNoticeId={selectedRow.publicNoticeId} refresh={this.tableRefresh} operate={"info"}/>,{
            defaultButton: true,
            title:"公告维护详情" ,
            onOk: (modal, compnent, btn) => {
                compnent.summarySave((err, value) => {
                    if (!err) {
                        modal.close();
                    } else  {
                        btn.setLoading(false);
                    }
                });
                this.tableRefresh();
            },
        });

    };


    openAnnounceSummary=()=>{
        openModal(<PublicNoticeInfo  statusDict={this.volist.getColumnDict('status')} refresh={this.tableRefresh} operate={"add"}/>,{
            defaultButton: true,
            title:"新增公告" ,
            onOk: (modal, compnent, btn) => {
                compnent.summarySave((err, value) => {
                    if (!err) {
                        modal.close();
                    } else  {
                        btn.setLoading(false);
                    }
                });
                this.tableRefresh();
            },
        });

    };

    deleteSelectedRows = (volist) => {
        const dataList = this.volist.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.volist.deleteRows(dataList);
            },
            onCancel: () => {
                return;
            },
        });

    };


    tableRefresh = () => {
        this.volist.refresh();
    };






    render() {
        return (
            <DataTable
                dataFormId="configuration-PublicNoticeList"
                formReady={this.formReady}

            />
        );
    }


}