/**
 * Created by apachechen on 2018/1/30.
 */
import React from 'react';

import { DataTable, openModal, Modal, Message,params,flexTabs} from '../../../src/components';

import * as rest from '../../../src/lib/rest';
import FnastatSubjectInfo from "./FnastatSubjectInfo";

export default class FnastatSubjectList extends React.Component {

    static FnastatSubjectInfo = FnastatSubjectInfo;
    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            type: 'primary',
            name: '新增',
            onClick: this.addFnastatSubject
        }, {
            type: 'default',
            selectBind: true,
            name: '删除',
            onClick: this.deleteFnastatSubject
        }, {
            type: 'default',
            selectBind: true,
            name: '编辑',
            onClick: this.updateFnastatSubject
        }]);
    };

    refresh = () => {
        const { refresh } = this.props;
        refresh && refresh();
    };

    updateFnastatSubject = () =>{
        const that = this;
        const selectedRows = that.voList.getSelectedRows();
        if (selectedRows.length < 1) {
            Message.info('请先选择一行！');
            return;
        }
        const fnastatDefId = selectedRows[0].fnastatDefId;
        const subjectId = selectedRows[0].subjectId;
        openModal(<FnastatSubjectInfo />, {
            title: "财务科目信息详情",
            defaultButton: true,
            refresh: this.tableRefresh,
            fnastatDefId: fnastatDefId,
            subjectId: subjectId,
            onOk:(currentModal, currentCom,button) => {
                    currentCom.saveData((errors,value) => {
                    if (!errors) {
                        currentModal.close();
                    } else {
                        button.setDisabled(false);
                    }
                });
                this.refresh();
            },
        });
    };

    deleteFnastatSubject = () => {
        const that = this;
        const selectedRows = that.voList.getSelectedRows();
        if (selectedRows.length < 1) {
            Message.info('请先选择一行！');
            return;
        }

        const subjectName = selectedRows[0].subjectName;
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${subjectName}]吗？删除后数据不可恢复！`,
            onOk() {
                that.voList.deleteRows(selectedRows);
            },
            onCancel() {
                return;
            },
        });
    }

    addFnastatSubject = (row) => {
        openModal(<FnastatSubjectInfo />, {
            title: "新增财务科目信息",
            defaultButton: true,
            refresh: this.tableRefresh,
            fnastatDefId: this.props.param.fnastatDefId,
            onOk(currentModal, currentCom) {
                currentCom.saveData((errors,value) => {
                    if (!errors) {
                        currentModal.close();
                    }
                });
                this.refresh();
            },
        });
    };


    render() {
        const { param } = this.props;
        return (
            <DataTable dataFormId="configuration-FnastatSubjectList"
                       params={{
                           fnastatDefId: param.fnastatDefId
                       }}
                       dataReady={this.dataReady}
                       formReady={this.formReady}
            />
        );
    }
}