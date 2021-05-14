import React from "react";
import {
    DataTable,
    openModal,
    Fieldset,
    Button,
    Icon,
    Dropdown, Menu, Upload, Modal, Message
} from '../../../src/components';
import ScheduleJobInfo from "./ScheduleJobInfo";
import * as rest from '../../../src/lib/rest';

export default class ScheduleJobList extends React.Component {
    static ScheduleJobInfo = ScheduleJobInfo;

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        setTimeout(()=>{
            this.tableRefresh2();
        },1000);
    }

    formReady1 = (volist) => {
        this.volist1 = volist;
        this.volist1.addButton([{
            name: '新增',
            icon:'fa-plus',
            type: 'primary',
            onClick: () => this.openInfo(),
            disabled:this.readonly
        },
            {
                name: '修改',
                icon:'fa-edit',
                type: 'warning',
                selectBind: true,
                onClick: () => this.openInfo(this.volist1.getSelectedRow())
            },
            {
                name: '删除',
                icon: 'delete',
                type: 'danger',
                selectBind: true,
                onClick: this.deleteData1,
                disabled:this.readonly
            },
            {
                name: '刷新',
                type: 'primary',
                onClick: this.tableRefresh1,
                disabled:this.readonly
            },
            {
                name: '自动刷新',
                type: 'primary',
                onClick: () => this.timeoutRefresh(),
                disabled:this.readonly
            }]);

        this.buttonColumnTemplate(this.volist1);
    };


    formReady2 = (volist) => {
        this.volist2 = volist;
        this.volist2.addButton([{
            name: '新增',
            icon:'fa-plus',
            type: 'primary',
            onClick: () => this.openInfo(),
            disabled:this.readonly
        },
            {
                name: '修改',
                icon:'fa-edit',
                type: 'warning',
                selectBind: true,
                onClick: () => this.openInfo(this.volist2.getSelectedRow())
            },
            {
                name: '删除',
                icon: 'delete',
                type: 'danger',
                selectBind: true,
                onClick: this.deleteData2,
                disabled:this.readonly
            },
            {
                name: '刷新',
                type: 'primary',
                onClick: this.tableRefresh2,
                disabled:this.readonly
            },
            {
                name: '自动刷新',
                type: 'primary',
                onClick: () => this.timeoutRefresh(),
                disabled:this.readonly
            }]);
        this.buttonColumnTemplate(this.volist2);
    };

    formReady3 = (volist) => {
        this.volist3 = volist;
        this.volist3.addButton([{
            name: '新增',
            icon:'fa-plus',
            type: 'primary',
            onClick: () => this.openInfo(),
            disabled:this.readonly
        },
            {
                name: '修改',
                icon:'fa-edit',
                type: 'warning',
                selectBind: true,
                onClick: () => this.openInfo(this.volist3.getSelectedRow())
            },
            {
                name: '删除',
                icon: 'delete',
                type: 'danger',
                selectBind: true,
                onClick: this.deleteData3,
                disabled:this.readonly
            },
            {
                name: '刷新',
                type: 'primary',
                onClick: this.tableRefresh3,
                disabled:this.readonly
            },
            {
                name: '自动刷新',
                type: 'primary',
                onClick: () => this.timeoutRefresh(),
                disabled:this.readonly
            }]);
        this.buttonColumnTemplate(this.volist3);
    };

    openInfo = (row) => {
        const jobId = row?row.jobId:null;
        openModal(<ScheduleJobInfo />, {
            title:jobId ? "任务详情":"新增任务",
            defaultButton: true,
            refresh: this.tableRefreshAll,
            jobId:jobId,
            onOk: (modal, compnent,but) => {
                compnent.infoSave((err, value) => {
                    if (!err) {
                        modal.close();
                    } else {
                        but.setDisabled(false);
                    }
                });
            },

        });
    };

    tableRefreshAll = () => {
        this.volist1.refresh();
        this.volist2.refresh();
        this.volist3.refresh();

    };

    tableRefresh1 = () => {
        this.volist1.refresh();
    };
    tableRefresh2 = () => {
        this.volist2.refresh();
    };
    tableRefresh3 = () => {
        this.volist3.refresh();
    };

    buttonColumnTemplate = (dataTable) => {
        dataTable.setColumnTemplate('button', (text, record, i) => {
            return (<div>
                <Button onClick={() => this.showHistList(record)} ><Icon type="history"/>运行历史</Button>
                <Dropdown overlay={
                    <Menu>
                        <Menu.Item><Button size={'small'} onClick={() => this.runJob(record)}><Icon type="fa-play"/>立即执行</Button></Menu.Item>
                        <Menu.Item><Button size={'small'}  onClick={() => this.resumeJob(record)}><Icon type="fa-stop-circle-o"/>启动定时</Button></Menu.Item>
                        <Menu.Item><Button size={'small'}  onClick={() => this.pauseJob(record)} type={'warning'}><Icon type="fa-stop-circle-o"/>暂停定时</Button></Menu.Item>
                        <Menu.Item><Button size={'small'}  onClick={() => this.restStatus(record)}><Icon type="redo"/>重置状态</Button></Menu.Item>
                    </Menu>
                }>
                    <Button style={{margin: '2px' }}><Icon type="tool"/>任务调度</Button>
                </Dropdown>
                <Upload
                    style={{ whiteSpace: 'nowrap', margin: '2px' }}
                    action={`/risk/etl/updateFile/${record.jobId}`}
                    onChange={this.uploadFile}
                    name={"上传"}
                />
            </div>);
        });
    }

    deleteData1 = () => {
        const selectedRows = this.volist1.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                this.volist1.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    deleteData2 = () => {
        const selectedRows = this.volist2.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                this.volist2.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    deleteData3 = () => {
        const selectedRows = this.volist3.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                this.volist3.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    uploadFile = (fileStatus) => {
        if (fileStatus === "done") {
            Message.info('上传成功！');
            this.tableRefreshAll();
        } else if (fileStatus === "uploading") {
        } else {
            Message.info('上传失败！');
        }
    };

    runJob = (row) => {
        const jobId = row.jobId;
        const jobGroup = row.jobGroup;
        const jobName = row.jobName;
        const {callBack, openLoading, closeLoading} = this.props;

        openLoading&&openLoading();

        rest.post("/etl/schedule/runJob", {jobId: jobId,jobGroup: jobGroup}).then((rst) => {
            if(rst.valid){
                Message.success(`任务[${jobName}]立即执行调用成功!`);
                this.tableRefreshAll();
            } else {
                Message.error(`任务[${jobName}]立即执行调用出错!!!`);
            }
            closeLoading&&closeLoading();
        }).catch((error)=>{
            Message.error(`任务[${jobName}]立即执行调用出错!!!`);
            closeLoading&&closeLoading();
        });
    }

    resumeJob = (row) => {
        const jobId = row.jobId;
        const jobGroup = row.jobGroup;
        const jobName = row.jobName;
        const {callBack, openLoading, closeLoading} = this.props;

        openLoading&&openLoading();

        rest.post("/etl/schedule/resumeJob", {jobId: jobId,jobGroup: jobGroup}).then((rst) => {
            if(rst.valid){
                Message.success(`任务[${jobName}]启动定时运行成功!`);
                this.tableRefreshAll();
            } else {
                Message.error(`任务[${jobName}]启动定时运行出错!!!`);
                this.tableRefreshAll();
            }
            closeLoading&&closeLoading();

        }).catch((error)=>{
            Message.error(`任务[${jobName}]启动定时运行出错!!!`);
            closeLoading&&closeLoading();
        });
    }

    pauseJob = (row) => {
        const jobId = row.jobId;
        const jobGroup = row.jobGroup;
        const jobName = row.jobName;
        const {callBack, openLoading, closeLoading} = this.props;

        openLoading&&openLoading();

        Modal.confirm({
            title: `暂停任务定时运行`,
            content: `您确定暂停[${jobName}]暂停定时运行吗？`,
            onOk: () => {
                rest.post("/etl/schedule/pauseJob", {jobId: jobId,jobGroup: jobGroup}).then((rst) => {
                    if(rst.valid){
                        Message.success(`任务[${jobName}]暂停定时运行成功!`);
                        this.tableRefreshAll();
                    } else {
                        Message.error(`任务[${jobName}]暂停定时运行出错!!!`);
                        this.tableRefreshAll();
                    }
                    closeLoading&&closeLoading();

                }).catch((error)=>{
                    Message.error(`任务[${jobName}]暂停定时运行出错!!!`);
                    closeLoading&&closeLoading();
                });
            },
            onCancel: () => {
                closeLoading&&closeLoading();
                return;
            },
        });
    }

    restStatus = (row) => {
        const jobId = row.jobId;
        const jobGroup = row.jobGroup;
        const jobName = row.jobName;
        const {callBack, openLoading, closeLoading} = this.props;

        openLoading&&openLoading();

        rest.post("/risk/etl/restStatus", {jobId: jobId,jobGroup: jobGroup}).then((rst) => {
            if(rst){
                Message.success(`任务[${jobName}]重置状态成功!`);
                this.tableRefreshAll();
            } else {
                Message.error(`任务[${jobName}]重置状态出错!!!`);
                this.tableRefreshAll();
            }
            closeLoading&&closeLoading();

        }).catch((error)=>{
            Message.error(`任务[${jobName}]重置状态出错!!!$`);
            closeLoading&&closeLoading();
        });
    }

    dataReady1 = (volist) =>{
        this.volist1 = volist;

        this.volist1.setColumnTemplate('latestRst', (text, record, i) => {
            const appStatus = record.latestRst || "";
            if (appStatus === "succeed") {
                return (<span style={{"color": "#008000"}}>{text}</span>);
            } else {
                return (<span style={{"color": "#DC143C","fontWeight": "bold"}}>{text}</span>);
            }
        });
    }

    dataReady2 = (volist) =>{
        this.volist2 = volist;

        this.volist2.setColumnTemplate('latestRst', (text, record, i) => {
            const appStatus = record.latestRst || "";
            if (appStatus === "succeed") {
                return (<span style={{"color": "#008000"}}>{text}</span>);
            } else {
                return (<span style={{"color": "#DC143C","fontWeight": "bold"}}>{text}</span>);
            }
        });
    }

    dataReady3 = (volist) =>{
        this.volist3 = volist;

        this.volist3.setColumnTemplate('latestRst', (text, record, i) => {
            const appStatus = record.latestRst || "";
            if (appStatus === "succeed") {
                return (<span style={{"color": "#008000"}}>{text}</span>);
            } else {
                return (<span style={{"color": "#DC143C","fontWeight": "bold"}}>{text}</span>);
            }
        });
    }

    showHistList = (record) => {
        const {flexTabs} = this.props;
        flexTabs.open(`运行历史:${record.jobName}`,'EtlManage/ScheduleJobHistList/ScheduleJobIdHistList',
            {
                jobId:record.jobId
            });
    };

    timeoutRefresh = (func) => {
        this.tableRefreshAll();
        setTimeout(()=>{
            this.timeoutRefresh();
        },5000);
    }

    render() {
        return (
            <span>
              <Fieldset legend={"ETL-1任务调度 (数据仓库ODS->数据集市)"} showArrow={false}>
                    <DataTable
                        dataFormId="etl-ScheduleJobList"
                        params={{jobGroup: 'etl1'}}
                        dataReady={this.dataReady1}
                        formReady={this.formReady1}
                        pageSize={10}
                    />
              </Fieldset>

              <Fieldset legend={"ETL-2任务调度 (数据集市->可视化平台)"} showArrow={false}>
                    <DataTable
                        dataFormId="etl-ScheduleJobList"
                        params={{jobGroup: 'etl2'}}
                        dataReady={this.dataReady2}
                        formReady={this.formReady2}
                        pageSize={10}
                    />
              </Fieldset>

              <Fieldset legend={"定时任务"} showArrow={false}>
                    <DataTable
                        dataFormId="etl-ScheduleJobList"
                        params={{jobGroup: 'timer'}}
                        dataReady={this.dataReady3}
                        formReady={this.formReady3}
                        pageSize={10}
                    />
              </Fieldset>

            </span>


    );
}
}


