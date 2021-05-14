import React from "react";

import {DataTable, Message, openModal, Modal} from '../../../src/components';
import CustRelationInfo from "./RelationInfo";
export default class CustRelationList extends React.Component {
    constructor(props) {
        super(props);
        const {custId} = props;
        this.custId = custId;
    }
    formReady = (volist) => {
            this.volist = volist;
        if(!this.props.readonly) {
            this.volist.addButton([{
                name: '新增',
                onClick: this.openRelationInfo
            }, {
                selectBind: true,
                name: '详情',
                onClick: this.editRelationInfo
            }, {
                selectBind: true,
                name: '删除',
                onClick: this.deleteRelation
            }]);
        } else {
            this.volist.addButton([{
                selectBind: true,
                name: '详情',
                onClick: this.editRelationInfo
            }]);
        }

        };

        openRelationInfo = () => {
            this.openRelationInfoModal(null, '新增客户关系');
        };

        editRelationInfo = () => {
            const selectedRows = this.volist.getSelectedRows();
            const relationId = this.volist.getSelectedRows()[0].id;
            this.openRelationInfoModal(relationId, '查看客户关系');
        };

        openRelationInfoModal = (id, title) => {
            openModal(<CustRelationInfo readonly = {this.props.readonly}/>, {
                title:title,
                defaultButton: !this.props.readonly,
                custId: this.custId,
                id: id,
                ...this.props,
                onOk: (a, b, but) => {
                    b.relationInfoSave((errors, values) =>{
                        if (!errors) {
                            a.close();
                        } else {
                            but.setDisabled(false)
                        }
                    });
                },
                refresh: this.tableRefresh
            });
            refresh: this.tableRefresh
        };

        deleteRelation = () => {
            const selectedRows = this.volist.getSelectedRows();
            Modal.confirm({
                title: '删除确认',
                content: '您确定删除吗？删除后数据不可恢复！',
                onOk: () => {
                    this.volist.deleteRows(selectedRows);
                },
                onCancel: () => {
                    return;
                },
            });
        };

    tableRefresh = () => {
        this.volist.refresh();
    };

    render() {
        return (
            <DataTable
                dataFormId="customer-CustRelationList"
                formReady={this.formReady}
                params={{custId: this.custId}}
            />
        );
    }
}