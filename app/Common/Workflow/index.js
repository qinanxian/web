import Settings from './settings.js';
import {Message, Modal, Icon, Button, Notify} from "../../../src/components";

/**
 * 查找流程对应的处视图
 * @param procDefKey
 */
export const lookupView = (procDefKey) => {
    return Settings.mapping[procDefKey];
}
/**
 * 打开流程处理页面
 * @param props
 * @param procDefKey
 * @param task
 */
export const openProcessTab = (props, taskBrief) => {
    const {flexTabs, param} = props;
    const viewURL = lookupView(taskBrief.procDefKey);
    if (!flexTabs) {
        Message.error('打开流程处理页面出错，flexTabs对象不存在');
        return;
    }
    if (!viewURL) {
        Message.error(`打开流程处理页面出错，没有找到流程${taskBrief.procDefKey}对应的处理页面`);
        return;
    }

    flexTabs.open(`流程:${taskBrief.taskName}`, viewURL, {procId:taskBrief.procId, taskId:taskBrief.taskId});
}