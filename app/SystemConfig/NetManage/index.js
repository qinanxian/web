import React from "react";

import { DataTable, Message, openModal, Modal,Icon,rest,Upload} from '../../../src/components';

import NetInfo from './NetInfo';

export default class NetManageList extends React.Component {

    static NetInfo = NetInfo;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addTemplate([
            <Upload
                name={"导入"}
                action={`/comn/file/uploadParseDataListToDB/network`}
                onChange={this.uploadTestDataCallback}
            />
        ]);
        this.voList.addButton([{
            name: '新增',
            onClick: this.createNet
        },
        {
            name: '删除',
            selectBind: true,
            onClick: this.deleteNet
        },
        {
            name: '详情',
            selectBind: true,
            onClick: this.editNetInfo
        },
        {
            name: '下载模版',
            icon:'fa-download',
            type: 'primary',
            selectBind: false,
            onClick: () => this.downloadTemplate()
        },
        {
            name: '导出EXCEL',
            type: 'default',
            onClick: () => this.exportExcel(true)
        }
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
        rest.download('/comn/file/downloadNetWork','get',{templateName:'网点信息模版模板.xlsx'});
    };

    transferData = () => {
        rest.post('/comn/file/uploadParseDataListToDB/network',null,this.uploadTestDataCallback());
    }

    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `网点管理列表.xlsx`);
    };

    createNet = (voList) => {
        const row = this.voList.getSelectedRow();
        this.openNetInfoModal(null,"新增网点");
    }

    editNetInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const netId = this.voList.getSelectedRows()[0].id;
        this.openNetInfoModal(netId, '修改网点');
    }

    openNetInfoModal = (netId, title) => {
        openModal(<NetInfo readonly={this.props.readonly}/>, {
            title: title,
            netId: netId,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.netInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    deleteNet = (voList) => {
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

    getIcon = (value) => {
        if (value === 'Y')
            return <Icon type="check" />
        return <Icon type="close" />
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    dataReady = (voList) => {

    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="common-NetManageList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}
