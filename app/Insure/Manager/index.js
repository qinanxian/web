import React from 'react'
import {DataTable, Download, Icon, Message, Modal, openModal, rest, Upload} from '../../../src/components';
import {getUser} from '../../../src/lib/cache';
import ManagerInfo from './ManagerInfo';
import EditManagerInfo from './EditManagerInfo';

export default class ManagerList extends React.Component {

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
                name: '新增',
                onClick: this.createManagerInfo
            },
            {
                name: '详情',
                selectBind: true,
                onClick: this.editManagerInfo
            },
            {
                name: '删除',
                selectBind: true,
                onClick: this.deleteManager
            }
            ,
            {
                name: '导出EXCEL',
                type: 'default',
                onClick: () => this.exportExcel(true)
            },
        ]);
        if(this.userOrg == "801000"){
            this.voList.addTemplate([
                <Upload
                    name={"导入"}
                    action={`/comn/file/uploadParseDataListToDB/insureManager`}
                    onChange={this.uploadTestDataCallback}
                />
            ]);
            this.voList.addButton([
                {
                    name: '下载模版',
                    icon:'fa-download',
                    type: 'primary',
                    selectBind: false,
                    onClick: () => this.downloadTemplate()
                }
            ]);
        }
    };
    uploadTestDataCallback = (status,ret) => {
        console.log(status);
        if(status === 'done'){
            const count = ret.response;
            Message.success(`成功导入记录[${count}]条`);
            this.tableRefresh();
        }
    };
    downloadTemplate = () => {
        rest.download('/comn/file/downloadInsureManager','get',{templateName:'保单管理员模板.xlsx'});
    };
    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `保单管理员.xlsx`);
    };
    deleteManager = (voList) => {
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

    createManagerInfo = (voList) => {
        this.openManagerInfo(null, "新增管理员信息");
    }
    editManagerInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const id = this.voList.getSelectedRows()[0].manOa;
        this.openManagerInfo2(id, "管理员信息详情");
    }
    openManagerInfo2 = (id, title) => {
        openModal(<EditManagerInfo {...this.props} readonly={this.props.readonly}/>, {
            id: id,
            title: title,
            userOrg: this.userOrg,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b,c) => {
                b.EditManInfoSave((err, value) => {
                    c.setLoading(false);
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };
    openManagerInfo = (id, title) => {
        openModal(<ManagerInfo {...this.props} readonly={this.props.readonly}/>, {
            id: id,
            title: title,
            userOrg: this.userOrg,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b,c) => {
                b.ManInfoSave((err, value) => {
                    c.setLoading(false);
                    if (!err) {
                        a.close();
                    }
                });
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
                    dataFormId="insure-ManagerList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params={{userOrg: this.userOrg}}
                />
            </div>
        );
    }

}