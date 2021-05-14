/**
 * 流程任务列表
 * 左晓敏 <xmzuo@amarsoft.com>
 * 2018-03-13
 */
import React from 'react';
import { Collapse, Col, Tabs,propsCompose,Divider,Icon} from '../../../../src/components';
import {get} from "../../../../src/lib/rest";
import config from "../../../../src/lib/config";
import PendingTaskList from "./PendingTaskList"
import DoneTaskList from "./DoneTaskList"
import MyProcInstList from "./MyProcInstList"
import TaskProcessPage from "../TaskProcess"
import HistTaskPage from "../TaskProcess/HistTaskPage"
import LiteflowTaskProcessor from '../../../System/Workflow/LiteflowTaskProcessor';
import './style/index.less';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const pageStyle = config.surface.defaultOptions.pageStyle;

@propsCompose
export default class WorkflowTaskList extends React.Component {
    static TaskProcessPage = TaskProcessPage;
    static HistTaskPage = HistTaskPage;
    static LiteflowTaskProcessor = LiteflowTaskProcessor;
    constructor(props) {
        super(props);
        this.tabsOptions = [
            {
                tab: '待办理',
                key: 'pending',
                content: <PendingTaskList {...props} />
            },
            {
                tab: '已完成',
                key: 'done',
                content: <DoneTaskList {...props}/>
            },
            {
                tab: '我参与的流程',
                key: 'myProcInt',
                content: <MyProcInstList {...props}/>
            }
        ];
        this.state = {
            taskObj: null,
        };
    }
    componentDidMount(){
        get('/workflow/resource/dashboard').then(ret => {
            this.setState({
                taskObj:JSON.parse(ret)
            });
        });
    }
    render() {
        const {param} = this.props;
        return (
          param.__id === 'Home' ?
          <Col span={24}>
            <div className={`task-list`}>
              {this.renderHeader()}
              <Divider className='workflow-line'/>
              <Tabs options={this.tabsOptions}/>
            </div>
          </Col>
            :
          <Col span={24}>
            <Tabs options={this.tabsOptions}/>
          </Col>
        );
    }
    renderHeader(){
        const {taskObj} = this.state;
        if (!pageStyle) {
            return (
                <div className='workflow-header'>
                    <div className='workflow-header-item'>
                    <span className='workflow-header-item-icon workflow-header-item-icon1'>
                        <Icon type='user'/>
                    </span>
                        <span className='workflow-header-item-text'>
                        <span>我的待办</span>
                        <span><h1>{taskObj ? taskObj.pendingTaskCount : 0}</h1>个任务</span>
                    </span>
                    </div>
                    <div className='workflow-header-item'>
                    <span className='workflow-header-item-icon workflow-header-item-icon2'>
                        <Icon type='clockcircleo'/>
                    </span>
                        <span className='workflow-header-item-text'>
                        <span>本周平均处理时间</span>
                        <span><h1>{taskObj ? taskObj.averageTimeOfTask : 0}</h1>分钟</span>
                    </span>
                    </div>
                    <div className='workflow-header-item'>
                    <span className='workflow-header-item-icon workflow-header-item-icon3'>
                        <Icon type='checkcircleo'/>
                    </span>
                        <span className='workflow-header-item-text'>
                        <span>本周完成任务数</span>
                        <span><h1>{taskObj ? taskObj.completedTaskCount : 0}</h1>个任务</span>
                    </span>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='workflow-headerv2'>
                    <div className='workflow-headerv2-item workflow-headerv2-item1'>
                  <span className='workflow-headerv2-item-icon'>
                    <Icon type='fa-hourglass'/>
                  </span>
                        <span className='workflow-headerv2-item-text'>
                    <span>我的待办</span>
                    <span><h1>{taskObj ? taskObj.pendingTaskCount : 0}</h1>个任务</span>
                  </span>
                    </div>
                    <div className='workflow-headerv2-item workflow-headerv2-item2'>
                        <span className='workflow-headerv2-item-icon'><Icon type='clockcircleo'/></span>
                        <span className='workflow-headerv2-item-text'>
                    <span>本周平均处理时间</span>
                    <span><h1>{taskObj ? taskObj.averageTimeOfTask : 0}</h1>分钟</span>
                  </span>
                    </div>
                    <div className='workflow-headerv2-item workflow-headerv2-item3'>
                        <span className='workflow-headerv2-item-icon'><Icon type='fa-address-card'/></span>
                        <span className='workflow-headerv2-item-text'>
                    <span>本周完成任务数</span>
                    <span><h1>{taskObj ? taskObj.completedTaskCount : 0}</h1>个任务</span>
                  </span>
                    </div>
                </div>
            );
        }
    }
}
