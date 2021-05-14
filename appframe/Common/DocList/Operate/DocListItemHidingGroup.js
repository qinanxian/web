/**
 * 资料清单列表，无分组
 */
import React from "react";

import {
    Icon, Message, Button, Modal, openModal, DataTable, propsCompose, Upload, Download, Notify
} from 'roface';
import FileHistory from '../../FileHistory';
import DocListItemInfoHidingGroup from './DocListItemInfoHidingGroup';

@propsCompose
export default class DocListItemHidingGroup extends React.Component {

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        if (!this.readOnly && !this.hidingHeaderBtn) {
            this.voList.addButton([{
                name: '新增',
                onClick: this.openItemInfo
            }]);
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
                    <Upload
                        action={`/common/FileOperateController/uploadFile/${record.itemId}/${this.objectType}/${record.fileId}`}
                        onChange={this.uploadFile}
                        disable={(this.readOnly) || (record.itemReading && record.itemReading === 'true') ? 'true' : 'false'}
                        buttonType={'a'}
                    />
                    <Download
                        action={`/common/FileOperateController/downloadFile/${record.fileId}`}
                        disable={record.fileId ? 'false' : 'true'}
                        beforeDownload={() => this.beforeDownloadFile(record)}
                        buttonType={'a'}
                    />
                    <Icon type="delete"
                          disable={(record.itemCode) || (this.readOnly) || (record.itemReading && record.itemReading === 'true') ? 'true' : 'false'}
                          onClick={() => this.deleteItem(record)}/>
                </div>)
            }
        };
        this.voList.addColumn(column);

        this.voList.setColumnTemplate('versionCode', (text, record, i) => {
            return (<a onClick={() => this.viewHistory(record.fileId)}>{text}</a>);
        });
        this.voList.setColumnTemplate('name', (text, record, i) => {
            return (<a onClick={() => this.showFile(record)}>{text}</a>);
        });
    };

    openItemInfo = () => {
        openModal(<DocListItemInfoHidingGroup objectId={this.objectId} objectType={this.objectType}
                                              groupCode={this.groupCode}/>, {
            title: '新增清单明细项',
            defaultButton: true,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.docListItemInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel(a, b) {
            }
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

    viewHistory = (fileId) => {
        if (!fileId) {
            Message.info('请先上传文件！');
            return false;
        }

        openModal(<FileHistory fileId={fileId}/>, {
            title: '查看附件历史版本',
            defaultButton: false
        });
    };

    showFile = (record) => {
        const {flexTabs, rest} = this.props;
        const fileUrl = rest.getRequestURL(`/common/FileOperateController/showFile/${record.fileId}`);
        flexTabs.open(`在线查看-${record.name}`, `ShowCase/Office/PDFViewerCase`, {url: fileUrl});
    };

    deleteItem = (row) => {
        if (row.itemCode) {
            Message.info('只能删除手动新增的资料清单明细项！');
            return;
        }

        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${row.itemName}]吗？删除后数据不可恢复！`,
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

    render() {
        const {param, dataFormId, objectId, objectType, groupCode, extendsParams} = this.props;
        this.dataFormId = dataFormId || (param && param.dataFormId);
        this.objectId = objectId || (param && param.objectId);
        this.objectType = objectType || (param && param.objectType);
        this.groupCode = groupCode || (param && param.groupCode);
        this.extendsParams = extendsParams || (param && param.extendsParams);
        this.readOnly = this.extendsParams && this.extendsParams.readOnly;
        this.hidingHeaderBtn = this.extendsParams && this.extendsParams.hidingHeaderBtn;

        return (
            <div>
                <DataTable
                    dataFormId={this.dataFormId ? this.dataFormId : 'common-CmonDocListItemList'}
                    params={{
                        ...this.extendsParams,
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