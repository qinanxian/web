import React from 'react'
import {DataTable, Download, Icon, Message, Modal, openModal, rest, Upload} from '../../../src/components';
import {getUser} from '../../../src/lib/cache';
import StaffWhiteInfo from './StaffWhiteInfo';
import EditStaffWhiteInfo from './EditStaffWhiteInfo';

export default class StaffWhiteList extends React.Component {

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
                onClick: this.createStaffWhiteInfo
            },
            {
                name: '修改',
                selectBind: true,
                onClick: this.editStaffWhiteInfo
            },
            {
                name: '删除',
                selectBind: true,
                onClick: this.deleteStaffWhite
            },
            {
                name: '导出EXCEL',
                type: 'default',
                onClick: () => this.exportExcel(true)
            },
            {
                name: '下载模版',
                icon:'fa-download',
                type: 'primary',
                selectBind: false,
                onClick: () => this.downloadTemplate()
            }
        ]);
        this.voList.addTemplate([
            <Upload
                name={"导入"}
                action={`/comn/file/uploadParseDataListToDB/StaffWhite`}
                onChange={this.uploadTestDataCallback}
            />
        ]);
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
        rest.download('/comn/file/downloadStaffWhite','get',{templateName:'保险职业人员白名单模板.xlsx'});
    };
    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `保险职业人员白名单.xlsx`);
    };
    deleteStaffWhite = (voList) => {
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

    createStaffWhiteInfo = (voList) => {
        this.openStaffWhiteInfo(null, "新增保险职业人员白名单");
    }
    editStaffWhiteInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const id = this.voList.getSelectedRows()[0].oaNo;
        this.openStaffWhiteInfo2(id, "保险职业人员白名单信息修改");
    }
    openStaffWhiteInfo2 = (id, title) => {
        openModal(<EditStaffWhiteInfo {...this.props} readonly={this.props.readonly}/>, {
            id: id,
            title: title,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b,c) => {
                b.EditStaffWhiteInfoSave((err, value) => {
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
    openStaffWhiteInfo = (id, title) => {
        openModal(<StaffWhiteInfo {...this.props} readonly={this.props.readonly}/>, {
            id: id,
            title: title,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b,c) => {
                b.StaffWhiteInfoSave((err, value) => {
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
                    dataFormId="insure-StaffWhiteList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}