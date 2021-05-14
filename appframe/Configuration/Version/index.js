import React from 'react';

import {DataTable, Notify, Message, openModal, Modal, Row, Col, DetailInfo} from '../../../src/components';
import VersionInfo from "./VersionInfo";
import VersionChangeInfo from "./VersionChangeInfo";




export default class Version extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            versionId: null,
            displayType: 'none'
        };
    }

    formReady = (volist) => {
        this.volist = volist;
        volist.addButton([
            {
                name: '新增',
                type: 'primary',
                onClick: this.openVersionSummary
            },{
                name: '删除',
                selectBind: true,
                onClick: this.deleteSelectedRows
            }
        ]);
    };


    formReady2 = (voinfo) => {
        this.voinfo = voinfo;
        voinfo.addButton([
            {
                name: '新增',
                type: 'primary',
                onClick: this.openVersionChangeSummary
            },{
                name: '删除',
                selectBind: true,
                onClick: this.deleteSelectedVersionChangeRows
            }
        ]);
    };


    openVersionSummary=()=>{
        openModal(<VersionInfo  refresh={this.tableRefresh} />,{
            defaultButton: true,
            title:"新增版本公告" ,
            width:'35%',
            onOk: (modal, compnent, btn) => {
                compnent.summarySave((err, value) => {
                    if (!err) {
                        modal.close();
                        this.tableRefresh();
                    } else  {
                        btn.setLoading(false);
                    }
                });
                this.tableRefresh();
            },
        });

    };
    openVersionChangeSummary=()=>{
        openModal(<VersionChangeInfo  refresh={this.tableRefresh2} versionId={this.state.versionId}  />,{
            defaultButton: true,
            title:"新增版本变更公告" ,
            width:'35%',
            onOk: (modal, compnent, btn) => {
                compnent.summarySave((err, value) => {
                    if (!err) {
                        modal.close();

                    } else  {
                        btn.setLoading(false);
                    }
                });
                this.tableRefresh2();
            },
        });

    };



    tableRefresh = () => {
        this.volist.refresh();
    };

    tableRefresh2=()=>{
        this.voinfo.refresh();
    }


    deleteSelectedRows = () => {
        const dataList = this.volist.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？当前版本以及变更后的内容全部删除不可恢复！',
            onOk: () => {
                this.volist.deleteRows(dataList);
                this.setState({displayType: 'none'});
            },
            onCancel: () => {
                return;
            },
        });

    };

    deleteSelectedVersionChangeRows = () => {
        const dataList = this.voinfo.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.voinfo.deleteRows(dataList);
            },
            onCancel: () => {
                return;
            },
        });

    };

    selectRow = (key, rows) => {
        // console.log(rows[0].versionId);
        rows.length > 0 && this.setState({versionId: rows[0].versionId, displayType: ''});
    };


    render() {
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <DataTable
                            dataFormId="configuration-VersionList"
                            formReady={this.formReady}
                            onSelectRow={this.selectRow}
                        />
                    </Col>

                    <Col span={12}>
                        <div style={{display:this.state.displayType}}>
                            <DataTable
                                dataFormId="configuration-VersionChangeList"
                                formReady={this.formReady2}
                                params={{versionId: this.state.versionId}}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }


}