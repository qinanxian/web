import React from "react";

import { DataTable, Message, Modal, openModal, propsCompose} from '../../../src/components';
import CapitalStructInfo from "./CapitalStructInfo";


@propsCompose
export default class CapitalStructList extends React.Component {
    static CapitalStructInfo = CapitalStructInfo;

    constructor(props) {
        super(props);

    }

    formReady = (voList) => {
        this.voList = voList;
        if(!this.props.readonly) {
            this.voList.addButton([{
                name: '新增',
                onClick: this.openCapitalStructInfo
            }, {
                name: '删除',
                selectBind: true,
                onClick: this.deleteCapitalStruct
            }]);
        }
    };


  openCapitalStructInfo = (row) => {

        openModal(<CapitalStructInfo isAdded={row.relationId ? false:true} readonly={this.props.readonly}/>, {
            title: row.relationId ? "资本构成详情":"新增资本构成",
            defaultButton: !this.props.readonly,
            onOk: (modal, compnent, but) => {
                compnent.infoSave((err, value) => {
                    if (!err) {
                        modal.close();
                    } else {
                        but.setDisabled(false);
                    }
                });
            },
            refresh: this.tableRefresh,
            relationId:row.relationId ? row.relationId:null,
            custId:this.props.custId
         });
    };

    deleteCapitalStruct = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
        });
    };


    dataReady = (api) => {
        this.voList.setColumnTemplate('stockholderName', (text, record, i) => {
            return (<a onClick={() => this.openCapitalStructInfo(record)}>{text}</a>);
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="customer-CapitalStructList"
                    formReady={this.formReady}
                    params={{custId: this.props.custId}}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}