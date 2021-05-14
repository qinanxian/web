import React from "react";
import moment from 'moment';
import {DataTable, Modal, DetailInfo, Message, Col, Row} from '../../../src/components';

export default class EtlConfigList extends React.Component {

    constructor(props) {
        super(props);
    }

    formReady = (volist) => {
        this.volist = volist;

        this.volist.addButton([
            {name: '添加', type: 'primary', icon: 'fa-plus', onClick: () => this.addRows()},
            {name: '保存', type: 'success', icon: 'fa-save', onClick: () => this.savePage()},
            {name: '删除选中', type: 'danger', icon: 'fa-trash-o', onClick: () => this.deleteSelectedRows(), selectBind: true},
            {name: '刷新', type: 'primary', onClick: () => this.tableRefresh(), disabled:this.readonly},
        ]);

    };

    tableRefresh = () => {
        this.volist.refresh();
    };

    savePage = () => {
        this.volist.saveData()
            .then(()=>{
                Message.success('保存成功');
                this.tableRefresh();
            });
    };

    addRows = () => {
        this.volist.addRow({});
    };

    deleteSelectedRows = () => {
        const rows = this.volist.getSelectedRows();
        this.volist.deleteRows(rows);
    };

    render() {
        return (
            <Row>
                <Col span={10}>
                    <div style={{margin:"10px 0 0 10px"}}>
                        <h3>日志级别配置</h3>
                        <p><span style={{fontWeight:"bold", marginRight:"10px"}}>参数名: </span>LogLevel</p>
                        <p style={{fontWeight:"bold"}}>可配置参数值</p>
                        <p><span style={{fontWeight:"bold", marginRight:"10px"}}>Nothing</span>没有日志 不显示任何输出</p>
                        <p><span style={{fontWeight:"bold", marginRight:"10px"}}>Error</span>错误日志 仅仅显示错误信息</p>
                        <p><span style={{fontWeight:"bold", marginRight:"10px"}}>Minimal</span>最小日志 使用最小的日志</p>
                        <p><span style={{fontWeight:"bold", marginRight:"10px"}}>Basic</span>基本日志 缺省的日志级别</p>
                        <p><span style={{fontWeight:"bold", marginRight:"10px"}}>Detailed</span>详细日志给出日志输出的细节</p>
                        <p><span style={{fontWeight:"bold", marginRight:"10px"}}>Debug</span>调试日志 调试目的，调试输出</p>
                        <p><span style={{fontWeight:"bold", marginRight:"10px"}}>Rowlevel</span>行级日志 打印出每一行记录的信息</p>

                        <hr/>
                        <h3>预设参数</h3>
                        <p><span style={{fontWeight:"bold", marginRight:"10px"}}>DATADATE</span>昨天日期</p>
                        <p><span style={{fontWeight:"bold", marginRight:"10px"}}>BDATADATE</span>前天日期</p>
                    </div>
                </Col>
                <Col span={14}>
                    <DataTable
                    dataFormId="etl-EtlConfigList"
                    dataReady={this.dataReady}
                    formReady={this.formReady}
                    editMode={true}
                    pageSize={20}
                    />
                </Col>
            </Row>
    );
}
}


