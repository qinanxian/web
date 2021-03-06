import React from 'react';
import {DataTable, Button, Icon, rest, Notify, Cron, openModal, Popconfirm, Divider} from '../../src/components';
import $ from "jquery";
import numeral from 'numeral';
import './style/index.less';
import './index.css';
import config from '../../src/lib/config.js'
import BatchJobExecutionDetail from "./BatchJobExecutionDetail";
import JobLogDetail from "./JobLogDetail";

export default class BatchJobConsole extends React.Component {
    static BatchJobExecutionDetail = BatchJobExecutionDetail;
    static JobLogDetail = JobLogDetail;

    constructor() {
        super();

        let baseURL = `${config.baseUrl}`;
        let realAddress;
        if((new RegExp("^https://")).test(baseURL)){
            realAddress = baseURL.substring(8); //HTTPS
            this.wsURL = `wss://${realAddress}/batch/websocket`;
        }else if((new RegExp("^http://")).test(baseURL)){
            realAddress = baseURL.substring(7); //HTTP
            this.wsURL = `ws://${realAddress}/batch/websocket`;
        }else{
            if(baseURL.startsWith("/"))baseURL = baseURL.substring(1);
            const hostname = location.hostname;
            const port = location.port;
            const protocol = (new RegExp("^https://")).test(location.protocol)?'wss':'ws';
            if(port){
                realAddress = `${protocol}://${hostname}:${port}/${baseURL}`;
            }else{
                realAddress = `${protocol}://${hostname}/${baseURL}`;
            }
            this.wsURL = `${realAddress}/batch/websocket`;
        }
        this.timerId;
        this.ws = null;
        this.state = {
            dataSource: [],
            filterData: [],
            updateValue: null,
            synchronizeParam: '',
            selectedItem: {},
        }
    }

    componentDidMount() {
        // this.refresh();
        // this.timerId = setInterval(
        //     () => this.refresh(),
        //     500000
        // );
        const _this = this;
        this.ws = new WebSocket(this.wsURL);
        const ws = this.ws;
        ws.onopen = (evt) =>{
            console.log("Connection open ...");
            // ws.send("Hello WebSockets!");
        };
        ws.onmessage = (evt) => {
            console.log("onmessage response ...");
            const retText = evt.data;
            if(!retText)return;
            const ret = JSON.parse(retText);
            if(!ret)return;

            if(ret.type === 'timerList'){           //?????????????????????
                _this.setState({dataSource: ret.body});
            }else if(ret.type === 'switchEnable'){  //?????????????????????
                _this.setState({dataSource: ret.body});
            }else if(ret.type === 'beforeJob'){  //?????????????????????
                _this.setState({dataSource: ret.body});
            }else if(ret.type === 'afterJob'){  //?????????????????????
                _this.setState({dataSource: ret.body});
            }

            //????????????????????????????????????
            const {closeLoading,openLoading} = this.props;
            closeLoading();
        };
    }

    componentWillUnmount() {
        // clearInterval(this.timerId);
        this.ws.close();
    }

    refresh = () => {
        const {closeLoading,openLoading} = this.props;

        rest.get('/batch/timers')
            .then((data) => {
                this.setState({dataSource: data});
                closeLoading();
            });
    };
    synchronize = () => {
        rest.post(`/batch/jobs/register/synchronize/`).then((data) => {
            this.refresh();
        }).catch((error) => {
            console.error(error);
            Notify.error('????????????');
        });
    };
    filter = () => {
        let str = $(".ant-input").val();
        if (str.length === 0)
            this.refresh();
        let res = this.state.filterData.filter(function (item, index, array) {
            //??????????????????????????????????????????
            return item.timerName.indexOf(str) != -1;
        });
        this.setState({dataSource: res});
    };
    start = (data) => {
        rest.post(`/batch/jobs/start/${data.timerKey}`).then((data) => {
            this.refresh();
        }).catch((error) => {
            console.error(error);
            Notify.error('????????????');
        });
    };
    stop = (data) => {
        rest.post(`/batch/jobs/stop/${data.timerKey}`).then((data) => {
            this.refresh();
        }).catch((error) => {
            console.error(error);
            Notify.error('????????????');
        });
    };
    enable = (data) => {
        rest.post(`/batch/jobs/enable/${data.timerKey}`).then((data) => {
            // this.refresh();
        });
    };
    disable = (data) => {
        rest.post(`/batch/jobs/disable/${data.timerKey}`).then((data) => {
            // this.refresh();
        });
    };
    handleStatus = (value, flag) => {
        if (flag) {
            this.start(value);
        } else {
            this.stop(value);
        }
    };
    handleEnable = (item) => {
        const {closeLoading,openLoading} = this.props;
        openLoading('???????????????...');

        if (item.timerStatus === '1') {
            this.disable(item);
        } else {
            this.enable(item);
        }
    };
    preventBubble = (e) => {
        e&&e.stopPropagation();
    }
    handleModal = (expr, times) => {
        this.setState({
            updateValue: {
                jobName: '',
                cronExpr: expr,
            },
        });
    };
    customizeModal = (data) => {
        openModal(<div style={{height: '600px'}}><Cron expr={data.cronExpr} onChange={this.handleModal}/></div>, {
            defaultButton: true,
            title: <div><Icon type='infocirlce'/>&nbsp;<span style={{fontSize: '14px'}}>Cron?????????</span></div>,
            onOk: (modal, instance, btn) => {
                rest.post(`/batch/jobs/update-cronexpr`, {}, {
                    data: $.param({...this.state.updateValue, jobName: data.timerKey}),
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                }).then(ret => {
                    this.refresh();
                });
                modal.close();
            }
        });
    };
    handleConfirm = (value, flag, btn) => {
        console.log('handleConfirm', value, flag, btn)
        btn ? this.handleStatus(value, flag) : this.handleEnable(value, flag);
    };
    viewJobExecutionParams = (volist) => {
        this.volist = volist;
        const row = volist.getSelectedRow();
        const ref = openModal(
            <div style={{height: 600, width: 800}}>
                <DataTable
                    dataFormId="system-BatchJobExecutionParamsList"
                    params={{jobExecutionId: row.jobExecutionId}}
                    nowrap={true}
                    formReady={(table) => {
                        volist = table;
                    }}
                />
            </div>
            , {
                title: '??????????????????',
                defaultButton: true,
                onOk(modal, compnent) {
                    const row = volist.getSelectedRow();
                    Message.info(row.name);
                    modal.close();
                },
                onCancel(a, b) {
                }
            });
    };

    viewJobExecutionStep = (volist) => {
        this.volist = volist;
        const row = volist.getSelectedRow();
        const ref = openModal(
            <div style={{height: 600, width: 800}}>
                <DataTable
                    dataFormId="system-BatchStepExecutionList"
                    params={{jobExecutionId: row.jobExecutionId}}
                    formReady={(table) => {
                        volist = table;
                    }}
                    nowrap={true}
                />
            </div>
            , {
                title: '??????????????????',
                defaultButton: true,
                onOk(modal, compnent) {
                    const row = volist.getSelectedRow();
                    Message.info(row.name);
                    modal.close();
                },
                onCancel(a, b) {
                }
            });
    };
    viewJobLog = () => {
        const row = this.volist.getSelectedRow();
        console.log(`${row.jobInstanceId}-${row.jobName}`);
        const {flexTabs} = this.props;
        flexTabs.open(`??????[${row.jobInstanceId}]??????`,'BatchJobConsole/JobLogDetail',{jobId:row.jobInstanceId});
    }

    formReady = (volist) => {
        this.volist = volist;

        //????????????
        volist.addButton([
            {name: '??????????????????', selectBind: true, onClick: () => this.openDetail(volist)},
            {name: '??????????????????', selectBind: true, onClick: () => this.viewJobExecutionParams(volist)},
            {name: '??????????????????', selectBind: true, onClick: () => this.viewJobExecutionStep(volist)},
            {name: '??????????????????', selectBind: true, onClick: () => this.viewJobLog()}
        ]);
    };

    synchronizeRight = (data) => {
        this.volist.removeData();
        this.setState({
            selectedItem: data,
            synchronizeParam: data.timerKey,
            dataSource: this.state.dataSource.map((item) => {
                if (data.timerKey === item.timerKey) {
                    return {
                        ...item,
                        selected: 'selected'
                    };
                }
                return {
                    ...item,
                    selected: ''
                };
            })
        });
        // this.volist.refresh();
    };

    openDetail = () => {
        const row = this.volist.getSelectedRow();
        const id = row.jobExecutionId ? row.jobExecutionId : null;

        openModal(<BatchJobExecutionDetail
            params={{jobExecutionId: id}}
        />, {
            title: '??????????????????',
            defaultButton: true,
            onOk: (a, b, c) => {
                b.addSave((errors, values) => {
                    if (!errors) {
                        a.n();
                    }
                    this.voList.refresh();
                    c.setLoading(false);
                });
            }
        });
    };


    render() {
        const {dataSource} = this.state;
        return (
            <div>
                <div className='batch-container'>
                    <div className='batch-container-left'>
                        <div className='batch-container-left-header'>
                            <Button onClick={this.synchronize}>??????</Button>
                            <div className="ro-quick-container-box">
                                <div className="ant-input-affix-wrapper">
                                    <input type="text" placeholder="ID/??????" className="ant-input"/>
                                    <div className="ant-input-suffix" onClick={this.filter}><i
                                        className='anticon anticon-search ro-quick-container-box-icon'/></div>
                                </div>
                            </div>
                        </div>
                        <div className='batch-container-left-box'>
                            <ul className='batch-container-left-box-ul'>
                                {dataSource.map((item) => {
                                    if(!item)return;
                                    //????????????????????????????????????????????????????????????
                                    item.lastExecStartTime = item.lastExecStartTime||'                           ';
                                    item.lastExecTimeCost = item.lastExecTimeCost||0;
                                    item.isRunning = item.isRunning||'N';

                                    const status = item.isRunning !== 'N' ? {
                                            icon: 'clockcircle',
                                            text: '?????????',
                                            color: '#1890ff',
                                            btnName: '??????',
                                            btnIcon: 'fa-stop-circle',
                                            flag: false
                                        }
                                        : {
                                            icon: 'fa-stop-circle',
                                            text: '??????',
                                            color: '#f5b025',
                                            btnName: '??????',
                                            btnIcon: 'play',
                                            flag: true
                                        };

                                    const batchStatusMap = {
                                        'COMPLETED':['??????','#14D614',true],
                                        'STARTING':['?????????','#FF9900',false],
                                        'STARTED':['?????????','#FF9900',false],
                                        'STOPPING':['?????????','#0000FF',false],
                                        'STOPPED':['?????????','#0000FF',false],
                                        'FAILED':['??????','#A52A2A',false],
                                        'ABANDONED':['?????????','#A52A2A',false],
                                        'UNKNOWN':['??????','#A52A2A',false],
                                    };

                                    const isSuccess = {
                                            text: batchStatusMap[item.lastExecStatus||'UNKNOWN'][0],
                                            color: batchStatusMap[item.lastExecStatus||'UNKNOWN'][1],
                                            flag: batchStatusMap[item.lastExecStatus||'UNKNOWN'][2]
                                        };


                                    return (
                                        <li
                                            key={item.timerKey}
                                            className={`batch-container-left-box-ul-li batch-container-left-box-ul-li${item.selected}`}
                                            onClick={() => this.synchronizeRight(item)}
                                        >
                                            <div className='batch-container-left-box-ul-li-left'>
                                                <div className='batch-container-left-box-ul-li-left-top'>
                                                    <span
                                                        className='batch-container-left-box-ul-li-left-top-text'>{item.timerName}</span>
                                                    <span
                                                        className='batch-container-left-box-ul-li-left-top-key'>({item.timerKey})</span>
                                                </div>
                                                <div className='batch-container-left-box-ul-li-left-bottom'>
                                                    <div className='batch-container-left-box-ul-li-left-bottom-main'>
                                                        <div
                                                            className='batch-container-left-box-ul-li-left-bottom-main-timer'>
                                                            <div
                                                                className="batch-container-left-box-ul-li-left-bottom-main-timer-header">
                                                                <div
                                                                    className='batch-container-left-box-ul-li-left-bottom-main-timer-header-status'>
                                                                    <span><Icon style={{color: status.color}}
                                                                                type={status.icon}/>&nbsp;{status.text}</span>
                                                                </div>
                                                                <div
                                                                    className="batch-container-left-box-ul-li-left-bottom-main-timer-header-text">{item.cronExpr}</div>
                                                            </div>
                                                            <div
                                                                className="batch-container-left-box-ul-li-left-bottom-main-timer-edit"
                                                                onClick={() => this.customizeModal(item)}>
                                                                <Icon type='fa-pencil'/>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className='batch-container-left-box-ul-li-left-bottom-main-list'>
                                                            <span
                                                                className='batch-container-left-box-ul-li-left-bottom-main-list-block'>
                                                                <span
                                                                    className='batch-container-left-box-ul-li-left-bottom-main-list-block-top'>{item.lastExecStartTime.substring(0,19)}</span>
                                                                <span
                                                                    className='batch-container-left-box-ul-li-left-bottom-main-list-block-bottom'>??????????????????</span>
                                                            </span>
                                                            <span
                                                                className='batch-container-left-box-ul-li-left-bottom-main-list-line'/>
                                                            <span
                                                                className='batch-container-left-box-ul-li-left-bottom-main-list-block'>
                                                                <span
                                                                    className='batch-container-left-box-ul-li-left-bottom-main-list-block-top'>{numeral(item.lastExecTimeCost / 1000).format('0.0')} s</span>
                                                                <span
                                                                    className='batch-container-left-box-ul-li-left-bottom-main-list-block-bottom'>?????????????????????</span>
                                                            </span>
                                                            <span
                                                                className='batch-container-left-box-ul-li-left-bottom-main-list-line'/>
                                                            <span
                                                                className='batch-container-left-box-ul-li-left-bottom-main-list-block'>
                                                                <span
                                                                    className='batch-container-left-box-ul-li-left-bottom-main-list-block-top'
                                                                    style={{color: isSuccess.color}}>{isSuccess.text}</span>
                                                                <span
                                                                    className='batch-container-left-box-ul-li-left-bottom-main-list-block-bottom'>??????????????????</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='batch-container-left-box-ul-li-right' onClick={(e)=>this.preventBubble(e)}>
                                                <Popconfirm title={status.flag ? '????????????' : '????????????'} cancelText='??????'
                                                            okText='??????' onClick={(e)=>this.preventBubble(e)}
                                                            onConfirm={() => this.handleConfirm(item, status.flag, true)}>
                                                    <Icon type={status.btnIcon} style={{
                                                        color: '#e63f24',
                                                        fontSize: '24px',
                                                        display: item.timerStatus === '1' ? '' : 'none'
                                                    }} onClick={(e)=>this.preventBubble(e)}/>
                                                </Popconfirm>
                                                <Popconfirm title={item.timerStatus === '1' ? '????????????' : '????????????'}
                                                            cancelText='??????' okText='??????'
                                                            onConfirm={() => this.handleEnable(item)} onClick={(e)=>this.preventBubble(e)}>
                                                    <Button size='small' onClick={(e)=>this.preventBubble(e)}>{item.timerStatus === '1' ? '??????' : '??????'}</Button>
                                                </Popconfirm>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className='batch-container-left-tail'/>
                    </div>
                    <div className='batch-container-right'>
                        {/*<br/>*/}
                        {/*<h3>&nbsp;&nbsp;{this.state.selectedItem.timerName}({this.state.selectedItem.timerKey})</h3>*/}
                        <DataTable
                            dataFormId="system-BatchJobExecutionList"
                            formReady={this.formReady}
                            params={{jobName: this.state.synchronizeParam.length == 0 ? "null" : this.state.synchronizeParam}}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
