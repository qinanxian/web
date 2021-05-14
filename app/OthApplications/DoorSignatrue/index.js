import React from 'react'
import {DataTable, Download, Icon, Message, Modal, openModal, rest} from '../../../src/components';
import {getUser} from '../../../src/lib/cache';
import DoorSignatrueInfo from "../DoorSignatrue/DoorSignatrueInfo";

export default class DoorSignatrueList extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
        this.userOrg = getUser().orgId;
    }

    dataReady = (voList) => {
        this.voList = voList;
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
            {
                name: '详情',
                selectBind: true,
                onClick: this.doorSignatrueInfo
            },
            {
                name: '删除',
                selectBind: true,
                onClick: this.deleteDoorSignatrue
            },
            {
                name: '导出EXCEL',
                type: 'default',
                onClick: () => this.exportExcel(true)
            }
        ]);
    };
    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `上门面签.xlsx`);
    };
    deleteDoorSignatrue = (voList) => {
        const row = this.voList.getSelectedRow();
        Modal.confirm({
            title: '删除确认',
            content: '是否确认删除',
            onOk: () => {
                this.voList.deleteRows([row]);
            },
            onCancel: () => {
                return;
            },
        });
    };
    doorSignatrueInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const id = this.voList.getSelectedRows()[0].id;
        const faceFileId = this.voList.getSelectedRows()[0].faceFileId;
        const frontImageId = this.voList.getSelectedRows()[0].frontImageId;
        const reverseImageId = this.voList.getSelectedRows()[0].reverseImageId;
        const signatureId = this.voList.getSelectedRows()[0].signatureId;
        this.openDoorSignatrueInfoModal(id,faceFileId,frontImageId,reverseImageId,signatureId,'上面面签详情');
    }

    openDoorSignatrueInfoModal = (id,faceFileId,frontImageId,reverseImageId,signatureId,title) => {
        openModal(<DoorSignatrueInfo readonly={this.props.readonly}/>, {
            title: title,
            id: id,
            faceFileId:faceFileId,
            frontImageId:frontImageId,
            reverseImageId:reverseImageId,
            signatureId:signatureId,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                a.close();
                // b.saveData((err, value) => {
                //     if (!err) {
                //         a.close();
                //     }
                // });
            },
            onCancel: (a, b) => {
            }
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render(){
        return (
            <div>
                <DataTable
                    dataFormId="othapplications-DoorSignatrueList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params = {{userOrg : this.userOrg}}
                />
            </div>
        );
    }

}