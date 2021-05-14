/**
 * 简易附件上传列表
 */
import React from "react";

import {Icon, Message, Modal, DataTable, propsCompose, Upload, Download, Notify} from '../../../../src/components';

@propsCompose
export default class SimpleDocListItemList extends React.Component {

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        if (!this.readOnly) {
            this.voList.addTemplate([<Upload
                action={`/common/FileOperateController/uploadAndCreateFile/${this.objectId}/${this.objectType}/${this.groupCode}`}
                onChange={this.uploadFile}
                name={"上传"}
            />]);
        }

        const column = {
            title: '操作',
            key: 'buttonComponent',
            sortCode: '2000',
            width: 80,
            render: (text, record, index) => {
                return (<div style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}>
                    <Download
                        action={`/common/FileOperateController/downloadFile/${record.fileId}`}
                        disable={record.fileId ? 'false' : 'true'}
                        beforeDownload={() => this.beforeDownloadFile(record)}
                        buttonType={'a'}
                    />
                    <Icon type="delete"
                          disable={this.readOnly ? 'true' : 'false'}
                          onClick={() => this.deleteItem(record)}/>
                </div>)
            }
        };
        this.voList.addColumn(column);
        this.voList.setColumnTemplate('name', (text, record, i) => {
            return (<a onClick={() => this.showFile(record)}>{text}</a>);
        });
    };

    uploadFile = (fileStatus) => {
        if (fileStatus === "done") {
            Message.info('上传成功！');
            this.tableRefresh();
        } else if (fileStatus === "uploading") {
        } else {
            Message.info('上传失败！');
        }
    };

    beforeDownloadFile = (row) => {
        if (!row.fileId) {
            Message.info('请先上传文件！');
            return false;
        }
    };

    deleteItem = (row) => {
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${row.name}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows([row]);
            },
            onCancel: () => {
                return;
            },
        });
    };

    showFile = (record) => {
        const {flexTabs, rest} = this.props;
        const fileUrl = rest.getRequestURL(`/common/FileOperateController/showFile/${record.fileId}`);
        flexTabs.open(`在线查看-${record.name}`, `ShowCase/Office/PDFViewerCase`, {url: fileUrl});
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        const {param, dataFormId, objectId, objectType, groupCode, extendsParams} = this.props;
        this.dataFormId = dataFormId || (param && param.dataFormId);
        this.objectId = objectId || (param && param.objectId);
        this.objectType = objectType || (param && param.objectType);
        this.groupCode = groupCode || (param && param.groupCode);
        this.extendsParams = extendsParams || (param && param.extendsParams);
        this.readOnly = this.extendsParams && this.extendsParams.readOnly;

        return (
            <div>
                <DataTable
                    dataFormId={this.dataFormId ? this.dataFormId : 'common-CmonSimpleDocListItemList'}
                    params={{
                        objectId: this.objectId,
                        objectType: this.objectType,
                        groupCode: this.groupCode
                    }}
                    formReady={this.formReady}
                    showPagination={false}
                    pageSize={999}
                />
            </div>
        );
    }
}