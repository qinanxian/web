import React from "react";

import {Message, Modal,openModal,Detector,Notify} from '../../../src/components';
import WorkflowTaskProcessor from '../../../appframe/Common/Workflow/WorkflowTaskProcessor';
import * as TaskResolve from '../../../appframe/Common/Workflow/TaskProcess/TaskResolve'

export default class ApplicationProcessor extends React.Component {

    constructor(props) {
        super(props);
        const {param} = this.props;
        const {taskId,procId} = param;
        this.resourceUrl = `/workflow/resource/taskResource/${taskId}`;
        this.summaryUrl = `/workflow/process/workflowTask/${taskId}`;
        this.feedbackStatusUrl = `/workflow/process/feedbackStatus/?taskId=${taskId}`;
    }

    static saveFieldSet = (processor) => {
        processor.getSubRegionComponent('ApplicationInfo').saveInfo();
    };

    static commitWithSave = (processor, param) => {
        new Promise((res) => {
            let firstFlag = false;
            processor.getSubRegionComponent('ApplicationInfo').saveInfo((err) => {
                if (!err) {
                    firstFlag = true;
                }
                if (firstFlag) {
                    res();
                }
            });
        }).then(() => {
            TaskResolve.commit(param);
        });
    }


    static commitAssigneeWithSave = (processor, param) => {
        const {openLoading, closeLoading} = param;
        openLoading();
        new Promise((res) => {
            let firstFlag = false;
            processor.getSubRegionComponent('ApplicationInfo').saveInfo((err) => {
                if (!err) {
                    firstFlag = true;
                }
                if (firstFlag) {
                    res();
                }
                closeLoading();
            });
        }).then(() => {
            TaskResolve.commitAssignee(param);
        });
    }



    buttonClick = (btn, runParam) => {
        const processor = this.processor;
        const {flexTabs, refresh, openLoading, closeLoading} = this.props;
        let comment = '';
        if (this.processor.getSubRegionComponent("SRSignApplyComment")) {
            comment = this.processor.getSubRegionComponent("SRSignApplyComment").getComment();
        }
        if (this.processor.getSubRegionComponent("SRSignComment")) {
            comment = this.processor.getSubRegionComponent("SRSignComment").getComment();
        }

        let param = this.props.param;
        param = {
            ...param,
            ...runParam,
            comment: comment,
            callBack: () => {
                flexTabs.close(param.__id);
                refresh(this.props.param.preId);
            },
            openLoading: openLoading,
            closeLoading: closeLoading,
            flexTabs: flexTabs,
            common: this.processor,
        };
        eval(btn.action)();
    };

    ready = (processor) => {
        this.processor = processor
    };

    linkClick = (link) => {
        return {
            ...link,
            name: `${link.name}`
        };
    };

    render() {
        return <WorkflowTaskProcessor
            resourceUrl={this.resourceUrl}
            summaryUrl={this.summaryUrl}
            feedbackStatusUrl={this.feedbackStatusUrl}
            ready={this.ready}
            buttonClick={this.buttonClick}
            linkClick={this.linkClick}
            processor={'area'}
        />
    }
}
