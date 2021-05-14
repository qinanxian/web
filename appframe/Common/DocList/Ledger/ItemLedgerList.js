import React from "react";

import {GroupDataTable, Message, Download, Icon, openModal} from '../../../../src/components';
import FileHistory from '../../FileHistory';

export default class DocListItemList extends React.Component {

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
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
                        name={""}
                        beforeDownload={() => this.beforeDownloadFile(record)}
                        buttonType={'a'}
                    />
                    {/*<a onClick={() => this.viewHistory(record.fileId)}><Icon type="fa-history"/>查看历史</a>*/}
                </div>)
            }
        };
        this.voList.addColumn(column);

        this.voList.setColumnTemplate('versionCode', (text, record, i) => {
            return (<a onClick={() => this.viewHistory(record.fileId)}>{text}</a>);
        });
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

    formatGroupName = (voList, dataList, subList) => {
        if (subList[0].groupName) {
            return `${subList[0].groupName}(${subList.length})`;
        } else {
            return `未分组(${subList.length})`;
        }
    };

    render() {
        const {param} = this.props;
        this.doclistId = param ? param.doclistId : '';
        return (
            <div>
                <GroupDataTable
                    dataFormId="common-CmonDocListItemLedgerList"
                    params={{doclistId: this.doclistId}}
                    formReady={this.formReady}
                    groupIdField={"groupCode"}
                    groupName={this.formatGroupName}
                    defaultOpenAllKeys={true}
                    showPagination={false}
                    pageSize={999}
                />
            </div>
        );
    }
}