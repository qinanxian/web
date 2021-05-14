import React from 'react';
import {propsCompose} from '../../../../src/components';
import * as TaskResolve from './TaskResolve'
import WorkflowTaskProcessor from '../WorkflowTaskProcessor/index';

//@propsCompose
export default class HistTaskPage extends React.Component {
    constructor(props) {
        super(props);
        this.common = null
    }
    _ready = (a) => {
        this.common = a
    }
    _buttonClick = (but) => {
        const { flexTabs, refresh } = this.props;
        // SRSignComment有可能不配置,或者配置其他名称的
        const SRSignComment = this.common.getSubRegionComponent("SRSignComment");
        let commonMessage = '';
        if(SRSignComment) {
            commonMessage = SRSignComment.getComment();
        }

        let param = this.props.param;
        param = {
            ...param,
            comment: commonMessage,
            openLoading: this.props.openLoading,
            closeLoading: this.props.closeLoading,
            flexTabs:flexTabs,
            callBack: () => {
                flexTabs.close(param.__id);
                refresh(this.props.param.preId);
            }
        };
        but.action.includes('=>') ? eval(but.action)() : eval(but.action);
    };
    render() {
        return <WorkflowTaskProcessor
            buttonClick={this._buttonClick}
            resourceUrl={'/workflow/resource/histTaskResource/' + this.props.param.record.taskId}
            summaryUrl={'/workflow/process/workflowTask/' + this.props.param.record.taskId}
            ready={this._ready}
            reading
        />
    }
}
