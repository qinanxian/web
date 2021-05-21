import React from "react";

import CustomTree from "./CustomTree";
import CustomInfo from "./CustomInfo";
import CustomInfoLabelInfo from "./CustomInfoLabelInfo";

import { DataTable, Message, openModal, Modal,Download,Icon,rest} from '../../../src/components';
import BusinessTypeInfo from "../../CodeToDo/AccessableBusinessType/BusinessTypeInfo";

export default class Custom extends React.Component {
    static CustomTree = CustomTree;
    static CustomInfo = CustomInfo;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
            {
                name: '导出EXCEL',
                type: 'default',
                onClick: () => this.exportExcel(true)
            },
            {
                name: '客户标签',
                selectBind: true,
                onClick: this.CustomLabel
            },
        ]);
    };

    CustomLabel = (voList) => {
        const id = this.voList.getSelectedRows()[0].id;
        this.openCustomLabelModal(id, "编辑客户标签");
    }

    openCustomLabelModal = (id, title) => {
        openModal(<CustomInfoLabelInfo readonly={this.props.readonly}/>, {
            title: title,
            id: id,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b, c) => {
                a.close();
                b.LabelInfoadd((err, value) => {
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `客户列表信息.xlsx`);
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    dataReady = (voList) => {
        this.voList.setColumnTemplate('certName', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
        this.voList.setColumnTemplate('operator', (text, record, i ) => {
            return (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Download
                        style={{ whiteSpace: 'nowrap', margin: '2px' }}
                        action={`/comn/file/downloadFile/${record.creditFileId}`}
                        onChange={this.downloadFile}
                        name={"下载"}
                        buttonType={'a'}
                        disable={ record.creditFileId ? 'false' : 'true'}
                    />
                    <Icon type="fa-eye"
                          disable={ record.creditFileId ? 'false' : 'true'}
                          onClick={() => this.pdfOpen(`预览${record.certName}征信授权文件`, 'Common/PDFViewer', {url: rest.getRequestURL(`/comn/file/showWord2PDF/${record.creditFileId}`)})}/>
                          {/*onClick={() => this.pdfOpen(`预览${record.certName}征信授权文件`, 'Common/PDFViewer', {url: rest.getRequestURL(`/comn/file/downloadFile/${record.creditFileId}`)})}/>*/}
                </div>);
        });
    };

    clickName = (row) => {
        const custId = row.id ? row.id : null;
        const certName = row.certName ? row.certName : '客户';
        const readonly = row.allowEdit === 'Y' ? false: true;
        const {flexTabs} = this.props;
        flexTabs.open(`客户：${certName}`, 'Customer/Custom/CustomTree', {
            custId: custId,
            readonly
        });
    };

    downloadFile = (fileStatus) => {
        if (fileStatus === "done") {
            Message.info('下载成功！');
            this.tableRefresh();
        } else {
            Message.info('下载失败！');
        }
    };

    pdfOpen = (title, url, param) => {
        const {flexTabs} = this.props;
        flexTabs.open(title, url, param);
    }

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="customer-CustomList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}
