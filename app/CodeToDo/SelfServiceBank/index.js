import React from "react";


import {DataTable, Message, openModal, Modal, Icon, Upload, DetailInfo} from '../../../src/components/index';
import SelfServiceBankInfo from './SelfServiceBankInfo';
import {Notify, rest} from "../../../src/components";
import {getUser} from "../../../src/lib/cache";


export default class SelfServiceBank extends React.Component {

    static SelfServiceBankInfo = SelfServiceBankInfo;

    constructor(props) {
        super(props);
        this.state = {};
        this.userOrg = getUser().orgId;
    }

    formReady = (voList) => {
        $('.ro-ad-container-search-label').css("width","140px");
        this.voList = voList;
        // this.voList.addTemplate([
        //     <Upload
        //         name={"导入"}
        //         action={`/comn/file/uploadParseDataListToDB/selfbank`}
        //         onChange={this.uploadTestDataCallback}
        //     />
        // ]);
        this.voList.addButton([{
            name: '新增',
            onClick: this.createSelfServiceBankInfo
        },
            {
                name: '删除',
                type: 'danger',
                disabled:this.readonly,
                selectBind: true,
                onClick: this.deleteApplication
            },
            {
                name: '编辑',
                selectBind: true,
                onClick: this.editcreateSelfServiceBankInfo
            },
            {
                name: '导出EXCEL',
                type: 'default',
                onClick: () => this.exportExcel(true)
            }
        ]);

    };


    createSelfServiceBankInfo = (voList) => {
        const row = this.voList.getSelectedRow();
        this.openSelfServiceBankInfo(null, "新增自助银行信息");
    }

    editcreateSelfServiceBankInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const id = this.voList.getSelectedRows()[0].id;
        this.openSelfServiceBankInfo(id, "修改自助银行信息");
    }

    // uploadTestDataCallback = (status,ret) => {
    //     console.log(status);
    //     if(status === 'done'){
    //         const count = ret.response;
    //         Message.success(`成功导入记录[${count}]条`);
    //         this.tableRefresh();
    //     }
    // };

    transferData = () => {
        rest.post('/comn/file/uploadParseDataListToDB/network',null,this.uploadTestDataCallback());
    }

    openSelfServiceBankInfo = (id, title) => {
        openModal(<SelfServiceBankInfo {...this.props} readonly={this.props.readonly}/>, {
            title: title,
            ID: id,
            userOrg: this.userOrg,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b,c) => {
                b.InfoSave((err, value) => {
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

    deleteApplication = (voList) => {
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
    }

    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `自助银行网点信息列表.xlsx`);
    };


    render() {
        return (
            <div>
                <DataTable
                    dataFormId="codetodo-SelfServiceBank"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params = {{userOrg:this.userOrg}}



                />
            </div>
        );
    }
}