import React from 'react';

import { DataTable,openModal,Modal} from '../../../../src/components';
import ParamInfo from "./paramInfo"

export default class ParamsList extends React.Component{

    static ParamInfo = ParamInfo;

    constructor(props) {
        super(props);
        this.state = {
            bomId: null
        };
    }

    formReady = (voList) =>{
        this.voList = voList;
    };

    dataReady = (voList) =>{
        this.voList = voList;
    };

    paramFormReady = (paramVoList) =>{
        this.paramVoList = paramVoList;
        this.paramVoList.addButton([{
            type: 'primary',
            name: '新增',
            onClick: this.addParams
        }, {
            type: 'primary',
            name: '详情',
            selectBind: true,
            onClick: this.addParams
        },{
            type: 'primary',
            name: '删除',
            selectBind: true,
            onClick: this.deleteParams
        }]);
    }

    paramDataReady = (paramVoList) =>{
        this.paramVoList = paramVoList;
    }

    paramListRefresh = () => {
        this.paramVoList && this.paramVoList.refresh();
    }

    addParams = () => {
        const selectRow = this.paramVoList.getSelectedRow();
        openModal(<ParamInfo/>, {
            title: selectRow && selectRow.bomId ? "参数信息详情":"新增参数信息",
            defaultButton: true,
            onOk: (modal, compnent) =>{
                compnent.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                });
            },
            paramListRefresh: this.paramListRefresh,
            procDefKey:this.props.procDefKey,
            bomId: selectRow && selectRow.bomId
        });
    }

    deleteParams = () => {
        const selectedRows = this.paramVoList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除吗？删除后数据不可恢复！`,
            onOk: () => {
                this.paramVoList.deleteRows(selectedRows);
            }
        });
    }

    render(){

        return (
            <DataTable
                dataFormId="workflow-WorkflowParamsList"
                params={{procDefKey: this.props.procDefKey,
                    bomId: this.state.bomId
                }}
                formReady={this.paramFormReady}
                dataReady={this.paramDataReady}
            />
        );
    }

}