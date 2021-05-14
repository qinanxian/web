import React from 'react'
import {DataTable, Download, Icon, Message, Modal, openModal, rest} from '../../../src/components';
import {getUser} from '../../../src/lib/cache';
import ElectAuthorInfo from "../ElectAuthor/ElectAuthorInfo";

export default class ElectAuthorList extends React.Component {

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
                          onClick={() => this.pdfOpen(`预览${record.pdfFileName}授权协议`, 'Common/PDFViewer', {url: rest.getRequestURL(`/comn/file/showWord2PDF/${record.pdfFileId}`)})}/>
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
                onClick: this.electAuthorInfo
            },
            {
                name: '删除',
                selectBind: true,
                onClick: this.deleteElectAuthor
            },
            {
                name: '导出EXCEL',
                type: 'default',
                onClick: () => this.exportExcel(true)
            }
        ]);
    };
    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `电子授权.xlsx`);
    };
    deleteElectAuthor = (voList) => {
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
    electAuthorInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const id = this.voList.getSelectedRows()[0].id;
        const faceFileId = this.voList.getSelectedRows()[0].faceFileId;
        this.openElectAuthorInfoModal(id,faceFileId,'电子授权详情');
    }

    openElectAuthorInfoModal = (id,faceFileId,title) => {
        openModal(<ElectAuthorInfo readonly={this.props.readonly}/>, {
            title: title,
            id: id,
            faceFileId:faceFileId,
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
                    dataFormId="othapplications-ElectAuthorList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params = {{userOrg : this.userOrg}}
                />
            </div>
        );
    }

}