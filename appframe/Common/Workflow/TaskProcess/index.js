import React from 'react';
import WorkflowTaskProcessor from '../WorkflowTaskProcessor/index';
import * as TaskResolve from '../TaskProcess/TaskResolve';

//@propsCompose
export default class Task extends React.Component {
    constructor(props) {
        super(props);
        this.common = null
        this.state={
            param:{
                ...this.props,
                common:this.common,
            }
        }
    }
    _ready = (a) => {
        this.common = a
    };
    _buttonClick = (but) => {
        const { flexTabs, refresh } = this.props;
        let commentMessage = "";
        // if(but.id !== "WBViewFlowGraph"){
        //     commonMessage = this.common.getSubRegionComponent("SRSignComment").getComment()
        // }
        if (this.common.getSubRegionComponent("SRSignApplyComment")) {
            commentMessage = this.common.getSubRegionComponent("SRSignApplyComment").getComment();
        }
        if (this.common.getSubRegionComponent("SRSignComment")) {
            commentMessage = this.common.getSubRegionComponent("SRSignComment").getComment();
        }

        let param = this.props.param;
        param = {
            ...param,
            comment: commentMessage,
            openLoading: this.props.openLoading,
            closeLoading: this.props.closeLoading,
            flexTabs: flexTabs,
            common: this.common,
            callBack: () => {
                flexTabs.close(param.__id);
                flexTabs.getTabs().map(mapItem => mapItem.__id).includes('Home') ?refresh(this.props.param.preId) : flexTabs.goToTab();
            }
        };
        but.action.includes('=>') ? eval(but.action)() : eval(but.action);
    };
    render() {
        return <WorkflowTaskProcessor
            param={this.state.param}
            resourceUrl={'/workflow/resource/taskResource/' + this.props.param.record.taskId}
            summaryUrl={'/workflow/process/workflowTask/' + this.props.param.record.taskId}
            feedbackStatusUrl={'/workflow/process/feedbackStatus/?taskId=' + this.props.param.record.taskId}
            ready={this._ready}
            buttonClick={this._buttonClick}
        />
    }
}