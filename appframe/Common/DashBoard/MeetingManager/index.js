import React from 'react';
import {Icon, Modal, Spin, Divider} from 'roface';
import './style/index.less';

/* eslint-disable */
class RoMeetingManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            rotate:'',
            groups:[{key:'meeting_1',meetingName:'立项会',meetingNum:2,pendingTask:2,url:''},
                {key:'meeting_2',meetingName:'评审会',meetingNum:2,pendingTask:2,url:''},
                {key:'meeting_3',meetingName:'投委会',meetingNum:2,pendingTask:2,url:''}]
        };
    }
    componentDidMount(){
        this.getData();
    }
    getData(flag = false){
        const {rest} = this.props;
        const url = '';
        // rest.get(url)
        //     .then(res => {
        //         this.setState({
        //             groups: this.resetGroupsData(res),
        //         },() => {
        //             flag && setTimeout(() => {
        //                 this.setState({
        //                     rotate: '',
        //                 });
        //             },1500);
        //         });
        //     })
    }
    resetGroupsData = (value) => {
        //重置meetingNum,pendingTask,url(url用于打开页面)
        return this.state.groups.map(item => {

        });
    };
    refresh = () => {
        this.setState({
            rotate:'rotate'
        });
        this.getData(true);
    };
    openPage = (title,url) => {
        this.props.flexTabs && this.props.flexTabs.open(title,url);
    };
    render() {
        const {prefix = 'ro'} = this.props;
        const {rotate,groups} = this.state;
        return (
            <div className={`${prefix}-meeting`}>
                <div className={`${prefix}-meeting-header`}>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;会议管理</div>
                    <div className={`${prefix}-meeting-header-icon ${prefix}-meeting-header-${rotate}`}>
                        <Icon onClick ={this.refresh} type = "fa-refresh"/>
                    </div>
                </div>
                <Divider className={`${prefix}-meeting-divider`}/>
                <Spin spinning={!!rotate}>
                    <div className={`${prefix}-meeting-container`}>
                        <div className={`${prefix}-meeting-container-totals`}>
                            <span className={`${prefix}-meeting-container-totals-icon`}><Icon type='user'/></span><span>我参与的会议：30 个</span>
                        </div>
                        <div className={`${prefix}-meeting-container-groups`}>
                            {groups.map(item => {
                                return (
                                    <div key={item.key} className={`${prefix}-meeting-container-groups-item`}>
                                        <span className={`${prefix}-meeting-container-groups-item-icon`}>
                                            <Icon onClick={() => this.openPage(item.meetingName,item.url)} type='user'/>
                                        </span>
                                        <div className={`${prefix}-meeting-container-groups-item-right`}>
                                            <span>
                                                <span className={`${prefix}-meeting-container-groups-item-right-color`}>
                                                    {item.meetingName}：
                                                </span>{item.meetingNum}个
                                            </span>
                                            <span>待办任务：{item.meetingNum}个</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
}

export default RoMeetingManager;