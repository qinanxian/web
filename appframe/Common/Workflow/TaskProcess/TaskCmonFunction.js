import React from 'react';
import {Message, Modal, Icon, Button, Notify} from "../../../../src/components";
import WorkflowProcessorConfig from '../../../../app/Common/Workflow/Processor';

/**
 * 任务处理器路由
 * @param task
 * @param props
 */
export const processorRoute = (task, props) => {
    const { flexTabs,param } = props;

    let processorUrl = '';
    WorkflowProcessorConfig.forEach(element => {
        if(element.key&&task.procDefKey==element.key){
            processorUrl = element.processor;
        }
    });
    if(processorUrl!=""){
        flexTabs.open(taskName, processorUrl, {record: task, preId: param.__id});
    } else {
        if (task.flowType === 'lite') {
            flexTabs.open(`${task.summary}`,'System/Workflow/LiteflowTaskProcessor',{record: task, procId:task.procId,param});
        } else {
            flexTabs.open(`${task.taskName}`,'Common/Workflow/TaskList/TaskProcessPage',{record: task, preId: param.__id });
        }
    }
};
