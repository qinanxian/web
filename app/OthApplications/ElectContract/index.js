import React from 'react'
import {DataTable, Download, Icon, Message, Modal, openModal, rest} from '../../../src/components';
import {getUser} from '../../../src/lib/cache';
import ElectContractInfo from "../ElectContract/ElectContractInfo";

export default class ElectContractList extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
        this.userOrg = getUser().orgId;
    }

    dataReady = (voList) => {
        this.voList = voList;
        this.voList.setColumnTemplate('pdfFileName', (text, record, i ) => {
            return (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Download
                        style={{ whiteSpace: 'nowrap', margin: '2px' }}
                        action={`/comn/file/downloadFile/${record.pdfFileId}`}
                        onChange={this.downloadFile}
                        name={"下载"}
                        buttonType={'a'}
                        disable={ record.pdfFileId ? 'false' : 'true'}
                    />
                    <Icon type="fa-eye"
                          disable={ record.pdfFileId ? 'false' : 'true'}
                          onClick={() => this.pdfOpen(`预览${record.pdfFileName}电子合同`, 'Common/PDFViewer', {url: rest.getRequestURL(`/comn/file/showWord2PDF/${record.pdfFileId}`)})}/>
                    {/*onClick={() => this.pdfOpen(`预览${record.certName}征信授权文件`, 'Common/PDFViewer', {url: rest.getRequestURL(`/comn/file/downloadFile/${record.creditFileId}`)})}/>*/}
                </div>);
        });
    };

    pdfOpen = (title, url, param) => {
        const {flexTabs} = this.props;
        flexTabs.open(title, url, param);
    }

    downloadFile = (fileStatus) => {
        if (fileStatus === "done") {
            Message.info('下载成功！');
            this.tableRefresh();
        } else {
            Message.info('下载失败！');
        }
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
            {
                name: '详情',
                selectBind: true,
                onClick: this.electContractInfo
            },
            {
                name: '删除',
                selectBind: true,
                onClick: this.deleteElectContract
            },
            {
                name: '导出EXCEL',
                type: 'default',
                onClick: () => this.exportExcel(true)
            }
        ]);
    };
    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `电子合同.xlsx`);
    };
    deleteElectContract = (voList) => {
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
    electContractInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const custId = this.voList.getSelectedRows()[0].id;
        this.openElectContractInfoModal(custId, '电子合同详情');
    }

    openElectContractInfoModal = (custId, title) => {
        openModal(<ElectContractInfo readonly={this.props.readonly}/>, {
            title: title,
            custId: custId,
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
                    dataFormId="othapplications-ElectContractList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params = {{userOrg : this.userOrg}}
                />
            </div>
        );
    }

}