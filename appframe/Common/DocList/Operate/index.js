/**
 * 资料清单列表，带分组
 */
import React from "react";

import {
    Row, Col, Icon, Message, Button, Modal, openModal, GroupDataTable,
    propsCompose, Upload, Download, Notify
} from '../../../../src/components';
import DocListItemInfo from './DocListItemInfo';
import DocListItemHidingGroup from './DocListItemHidingGroup';
import SimpleDocListItemList from './SimpleDocListItemList';
import MakingAmendsDocList from './MakingAmendsDocList';
import FileHistory from '../../FileHistory';

@propsCompose
export default class DocListItemList extends React.Component {

    static DocListItemInfo = DocListItemInfo;
    static SimpleDocListItemList = SimpleDocListItemList;
    static  DocListItemHidingGroup = DocListItemHidingGroup;
    static  MakingAmendsDocList = MakingAmendsDocList;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        console.log(this)
        let flag = true;
        if(undefined != this.props.isDisabled){
            flag = this.props.isDisabled;
        }
        // const isDisable = !!this.props.isDisabled;
        if (!this.readOnly && flag) {
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
        openModal(<DocListItemInfo doclistCode={this.doclistCode} objectId={this.objectId}
                                   objectType={this.objectType}/>, {
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
            // Message.info('请先上传文件！');
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
            // Message.info('只能删除手动新增的资料清单明细项！');
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

    formatGroupName = (voList, dataList, subList) => {
        if (subList[0].groupName) {
            return `${subList[0].groupName}(${subList.length})`;
        } else {
            return `未分组(${subList.length})`;
        }
    };

    render() {
        const {param, objectId, objectType, dataFormId, extendsParams} = this.props;
        this.dataFormId = dataFormId || (param && param.dataFormId);
        this.objectId = objectId || (param && param.objectId);
        this.objectType = objectType || (param && param.objectType);
        this.extendsParams = extendsParams || (param && param.extendsParams);
        this.readOnly = this.extendsParams && this.extendsParams.readOnly;

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <GroupDataTable
                            dataFormId={this.dataFormId ? this.dataFormId : 'common-CmonDocListItemList'}
                            params={{...this.extendsParams, objectId: this.objectId, objectType: this.objectType}}
                            formReady={this.formReady}
                            groupIdField={"groupCode"}
                            // groupName={"groupName"}
                            // defaultOpenKeys={['START_PROJECT_REPORT', '__ungroup']}
                            groupName={this.formatGroupName}
                            defaultOpenAllKeys={true}
                            showPagination={false}
                            pageSize={999}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}