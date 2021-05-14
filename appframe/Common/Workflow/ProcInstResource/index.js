import React from 'react';
import WorkflowTaskProcessor from '../WorkflowTaskProcessor/index';
import * as TaskResolve from '../TaskProcess/TaskResolve';

//@propsCompose
export default class ProcInstResource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackMode : false
        }
        this.common = null;
    }
    _ready = (a) => {
        this.common = a
    };
    _buttonClick = (but) => {
        const { flexTabs, refresh } = this.props;
        let commonMessage = "";
        if(but.id !== "WBViewFlowGraph"){
            commonMessage = this.common.getSubRegionComponent("SRSignComment").getComment()
        }
        let param = this.props.param;
        console.log(this.props.param);
        param = {
            ...param,
            comment: commonMessage,
            openLoading: this.props.openLoading,
            closeLoading: this.props.closeLoading,
            flexTabs: flexTabs,
            common: this.common,
            callBack: () => {
                flexTabs.close(param.__id);
                refresh(this.props.param.preId);
            }
        };
        but.action.includes('=>') ? eval(but.action)() : eval(but.action);
    };

    _linkClick = (link, pageParam) => {

        return {
            ...link,
            name: `${pageParam.pageParam.planName}-${link.name}`
        };

    };

    render() {
        const { feedbackMode } = this.state;
        return <WorkflowTaskProcessor
            buttonClick={this._buttonClick}
            resourceUrl={'/workflow/resource/procInstResource/' + this.props.param.record.procId}
            summaryUrl={'/workflow/process/procInstResourceWorkflowTask/' + this.props.param.record.procId}
            ready={this._ready}
            linkClick={this._linkClick}
            showButtons={ feedbackMode }
        />
    }
}
