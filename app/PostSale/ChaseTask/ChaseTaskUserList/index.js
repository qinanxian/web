import React from "react";
import {DataTable, Modal, Notify, openModal} from "../../../../src/components";
import ChaseTaskUserInfo from "../ChaseTaskUserInfo";


export default class ChaseTaskList extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.setColumnTemplate('chaseTaskId', (text, record, i) => {
            return <a onClick={() => this.viewTaskInfo(record.chaseTaskId)}>{text}</a>
        });
    };

    dataReady = (voList) => {

    };

    viewTaskInfo = (chaseTaskId) => {
        openModal(<ChaseTaskUserInfo chaseTaskId={chaseTaskId} disabledContainer/>, {
            defaultButton: true,
            title: "查看催收任务",
            onOk: (modal, component, btn) => {
                component.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                }, btn);
            },
            refresh: this.refreshList,
        });
    }

    refreshList = () => {
        this.voList.refresh();
    }




    render() {
        return (
            <DataTable
                majorKey="chaseTaskId"
                dataFormId="obiz-ChaseTaskUserList"
                dataReady={this.dataReady}
                formReady={this.formReady}
                showPagination={false}
                pageSize={0}
            />
        );
    }
}
