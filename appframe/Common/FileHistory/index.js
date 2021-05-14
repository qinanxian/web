import React from "react";

import {DataTable, Message, Download, Modal} from '../../../src/components/index';

export default class FileHistory extends React.Component {

    constructor(props) {
        super(props);
        const {fileId, param} = this.props;
        this.fileId = fileId || (param && param.fileId);
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
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}>
                    <Download
                        action={`/common/FileOperateController/downloadFileHist/${record.fileHistId}`}
                        buttonType={'button'}
                        name={'下载'}
                    />
                </div>)
            }
        };
        this.voList.addColumn(column);
        this.voList.setColumnTemplate('name', (text, record, index) => {
            return (<a onClick={() => this.showFile(record)}>{text}</a>);
        });
    };

    showFile = (record) => {
        const {flexTabs, rest} = this.props;
        const fileUrl = rest.getRequestURL(`/common/FileOperateController/showFile/${record.fileId}`);
        flexTabs.open(`在线查看-${record.name}`, `ShowCase/Office/PDFViewerCase`, {url: fileUrl});
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="common-FileHistoryList"
                    params={{fileId: this.fileId}}
                    formReady={this.formReady}
                    showPagination={false}
                    pageSize={999}/>
            </div>
        );
    }
}