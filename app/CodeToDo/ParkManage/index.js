import React from 'react'

import { DataTable, Message, openModal, Modal,Icon,rest,Upload} from '../../../src/components';

import ParkManageInfo from './ParkManageInfo';
import {getUser} from '../../../src/lib/cache'; 


//停车场列表移至网点详情NetWorkInfo页面中了，
export default class ParkList extends React.Component {

    static ParkManageInfo = ParkManageInfo;

    constructor(props){
        super(props);
        this.state = {};
        this.userOrg = getUser().orgId;
    }

    componentDidMount = () => {

    }

    dataReady = (voList) => {
        this.voList = voList;
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.createPark
        },
        {
            name: '删除',
            selectBind: true,
            onClick: this.deletePark
        },
        {
            name: '详情',
            selectBind: true,
            onClick: this.editPark
        },
        {
            name: '导出EXCEL',
            type: 'default',
            onClick: () => this.exportExcel(true)
        }
        ]);

    };

    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `停车场信息.xlsx`);
    };

    createPark = (voList) => {
        const row = this.voList.getSelectedRow();
        this.openParkInfoModal(null,"新增停车场");
    }

    editPark = (voList) => {
        const row = this.voList.getSelectedRow();
        const parkId = row.id;
        this.openParkInfoModal(parkId,"修改停车场信息");
    }

    openParkInfoModal = (id , title) => {
        openModal(<ParkManageInfo readonly={this.props.readonly}/>, {
            title: title,
            parkId: id,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.parkInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    deletePark = (voList) => {
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

    tableRefresh = () => {
        this.voList.refresh();
    };

    render(){
        return (
            <div>
                <DataTable
                    dataFormId="codetodo-ParkList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params = {{userOrg:this.userOrg}}
                    labelWidth={158}
                />
            </div>
        );
    }

}