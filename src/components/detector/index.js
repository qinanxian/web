import React from 'react';
import {Icon} from '../index';
import {get} from '../../lib/rest';
import {developCompose} from '../developcompose/developCompose';
import './style/index.less';

@developCompose
class Detector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blocks: [],
            result: false,
            done: false,
        };
        this.items = [];
    }

    componentDidMount() {
        /* eslint-disable */
        const {detcReady,callback, autoStart = true, param, code} = this.props;
        if (!param) {
            console.error('调用Detector组件错误，请填写参数param');
            return;
        }
        if (!code) {
            console.error('调用Detector组件错误，请填写参数code');
            return;
        }

        this.detector = {
            start: this._detcStart,
            reset: this._detcReset,
            getResult:this._getResult,
            isDone:this._isDone,
        };

        get(`/base/detector/${code}`, param).then((res) => {
            this.items = res.items;
            this.setState({
                blocks: this.buildBlocks(),
            });

            detcReady && detcReady(this.detector);
            autoStart && this.exec();
        });
    }

    // componentWillReceiveProps(nextProps){
    //     const {detcReady, autoStart = true, param, code} = this.props;
    //     // detcReady && detcReady(this.detector);
    //     // autoStart && this.exec();
    // }

    renderItemStatusIcon = (item) => {

        const statusOptions = {
            "ready": {"icon": <Icon type='playcircleo'/>},
            "running": {"icon": <Icon type="loading1" className="anticon-spin anticon-loading"/>},
            "success": {"icon": <Icon type='checkcircle' style={{color: "#29b770"}}/>},
            "warning": {"icon": <Icon type='exclamationcircle' style={{color: "#FFA801"}}/>},
            "forbid": {"icon": <Icon type='minuscircle' style={{color: "#ed4343"}}/>},
        };

        if (statusOptions[item.status]) {
            return statusOptions[item.status].icon;
        }
    };

    exec = () => {
        const {param} = this.props;
        const reqQueue = this.items.map(item => () => {
            return get(`/base/detector/exec/${item.detectorCode}/${item.itemCode}`, param);
        });
        const asyncRunEvents = async () => {
            for (let i = 0; i < reqQueue.length; i++) {
                //排序运行每个单项
                this.items[i].status = "running";
                this.updateItem(this.items[i]);

                await reqQueue[i]().then((ret) => {
                    const item = this.items[i];
                    item.done = true;
                    item.licit = ret.pass || (item.failureProcessMode == 'WARNING');
                    item.messageResults = ret.message;
                    if (ret.message && ret.message.length == 0) {
                        item.messageResults = [(item.licit) ? '通过' : '未通过'];
                    }

                    //更新状态
                    if (ret.pass) {
                        item.status = 'success';
                    } else if (!ret.pass && item.failureProcessMode == 'WARNING') {
                        item.status = 'warning';
                    } else {
                        item.status = 'forbid';
                    }

                    this.updateItem(item);
                })
            }
        };
        return asyncRunEvents();
    }

    /**
     * 监视并处理状态
     */
    watchStatus = () => {
        const blocks = this.state.blocks;
        const {callback} = this.props;
        let fullDone = true;
        let fullLicit = true;

        blocks.map((block) => {
            let done = true;
            let licit = true;
            block.items.map((item) => {
                done = done && item.done;
                licit = licit && item.licit;
            })
            block.done = done;
            block.licit = licit;
            fullDone = fullDone && done;
            fullLicit = fullLicit && licit;
            if (done) {
                block.message = licit ? "通过" : "未通过";
                if (!licit) {
                    block.messageColor = 'red';
                }
            }

        });

        if(fullDone){
            callback&&callback(fullLicit);
        }

        this.setState({blocks: [...blocks],done:fullDone,result:fullLicit});
    }

    updateItem = (item) => {
        const blockIndex = item.blockIndex;
        const inBlockIndex = item.inBlockIndex;

        const blocks = this.state.blocks;
        blocks[blockIndex].items[inBlockIndex] = item;

        // this.setState({blocks:[...blocks]});
        this.watchStatus();
    }
    /**
     * 根据明细项，构建分组信息
     * @returns {Array}
     */
    buildBlocks = () => {
        const items = this.items;

        const blocks = [];

        //把所有的分组先计算出来
        const blockCodes = {};
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.groupCode) {
                item.groupCode = "NULL:";
            }
            item.status = 'ready';
            item.done = false;
            item.licit = false;
            item.messageResults = [];

            let cnt = blockCodes[item.groupCode] || 0;
            blockCodes[item.groupCode] = ++cnt;
        }
        for (let k in blockCodes) {
            const codes = k.split(":");
            let code, name;
            if (codes.length >= 2) {
                code = codes[0], name = codes[1];
            } else {
                code = k, name = k;
            }
            blocks.push({
                code: code,
                header: name || '',
                count: blockCodes[k],
                groupCode: k,
                status: '',
                message: '',
                messageColor: '',
                items: []
            });
        }


        //把每个项放到相应的分组中去
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                if (item.groupCode == block.groupCode) {
                    item.blockIndex = i;                        //当前项所在块的序号
                    item.inBlockIndex = block.items.length;     //当前项在块中的序号
                    block.items.push(item);
                }
            }
        }

        return blocks;
    }

    _detcStart = () => {
        this.exec();
    };
    _detcReset = () => {
        this.setState({
            blocks: this.buildBlocks(),
        });
    };
    _getResult = () => {
        return this.state.result;
    }

    _isDone = () => {
        return this.state.done;
    }

    // _addBtn = (value) => {
    //     return value.map((item) => {
    //         return (
    //             <Button
    //                 key={item.name}
    //                 type={item.type}
    //                 size={item.size}
    //                 onClick={item.onClick}
    //             >
    //                 {item.name}
    //             </Button>
    //         );
    //     });
    // };

    render() {
        const {blocks,done,result} = this.state;
        const {prefix = 'ro'} = this.props;
        return (
            <div className={`${prefix}-detector`}>
                {blocks.map((block, index) => {
                    return (
                        <div key={index} className={`${prefix}-detector-container`}>
                            <div className={`${prefix}-detector-container-title`}>
                                <span className={`${prefix}-detector-container-title-hLine`}/>
                                <span
                                    className={`${prefix}-detector-container-title-text`}><strong>{block.header}</strong></span>
                                <span
                                    className={`${prefix}-detector-container-title-result ${prefix}-detector-container-title-${block.messageColor}`}
                                    style={{visibility: `${block.done ? 'visible' : 'hidden'}`}}>{block.message}</span>
                            </div>
                            <div className={`${prefix}-detector-container-table`}>
                                <table className={`${prefix}-detector-container-table-box`}>
                                    <thead className={`${prefix}-detector-container-table-box-botLine`}>
                                        <tr>
                                            <th style={{width:'11%',minWidth: '60px'}}>&nbsp;</th>
                                            <th style={{width:'12%',minWidth: '200px'}}>任务</th>
                                            <th style={{width:'25%',minWidth: '300px'}}>结果</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {block.items.map((item, itemIndex) => {
                                        return (
                                            <tr key={item.itemCode}
                                                className={`${prefix}-detector-container-table-box-bodyItem`}>
                                                <td>
                                                    {this.renderItemStatusIcon(item)}
                                                </td>
                                                <td>{item.itemName}</td>
                                                <td>
                                                    <ul>
                                                    {item.messageResults.map((text) => {
                                                        return <li><span key={text}>{text}</span></li>
                                                    })}
                                                    </ul>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
                <div className={`${prefix}-detector-bottom`}>
                    <div className={`${prefix}-detector-bottom-result ${prefix}-detector-bottom-${result}`} style={{visibility: `${done ? 'visible' : 'hidden'}`}}>
                        <span className={`${prefix}-detector-bottom-result-${result}`}>最终结果:
                            <span className={`${prefix}-detector-bottom-result-text`}>
                                {result ? ' 通过' : ' 未通过'}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Detector;
