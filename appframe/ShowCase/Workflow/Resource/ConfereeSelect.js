import React from "react";
import {openModal, Button, Message, DataTable, rest} from '../../../../src/components/index';
import {Modal, Notify} from "../../../../src/components";
import $ from "jquery";

export default class ConfereeSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            procInstId: props.param.workflowTask.workflowProc.procInstId,
        };
    }

    _selectRow = (keys, rows) => {
        this.setState({
            rows: rows
        })
    };


    updateConereeUsers = () => {
        // 获取候选人id数组
        const userIds = this.state.rows.map(row => row.id);

        const params = {
            procInstId: this.state.procInstId,
            users: userIds.join(),
        };

        rest.post("/investplan/updateConfereeUsers",{},{
            data: $.param(params),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
        }).then((data) => {

        }).catch((error) => {
            console.error(error);
            Modal.error({
                title: "更新参会人员",
                content: "更新参会人员出错,请重试!"
            });
        });
    };

    selectUser = () => {
        openModal(<DataTable
                params={''}
                selectionType={'multiple'}
                dataFormId={'credit-ConfereeSelect'}
                onSelectRow={this._selectRow}/>, {
                    title: '请选择参会人员',
                    defaultButton: true,
                    refresh: this.tableRefresh,
                    onOk: (modal,dev,btn) => {
                        this.updateConereeUsers();
                        modal.close();
                    },
                    onCancel: (modal) => {
                    }
                })
    };

    render() {
        return (
            <div>
                <Button onClick={() => this.selectUser()}>参会人员选择</Button>
                <div>
                    <p style={{marginTop: '10px',}}>
                        <span><strong>参会人员:</strong></span><span>{this.state.rows.map(row => row.name+",")}</span>
                    </p>
                </div>
            </div>
        );
    }
}