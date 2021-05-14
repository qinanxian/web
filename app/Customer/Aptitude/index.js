import React from "react";

import {Row, Col, DataTable, Message, openModal, Modal} from '../../../src/components';
import CustAptitudeInfo from "./AptitudeInfo";

export default class CustAptitudeList extends React.Component {

    static CustAptitudeInfo = CustAptitudeInfo;

    constructor(props) {
        super(props);
        const {custId} = props;
        this.custId = custId;
    }

    formReady = (voList) => {
        this.voList = voList;
        if(!this.props.readonly) {
            this.voList.addButton([{
                name: '新增',
                onClick: this.openAptitudeInfo
            }, {
                selectBind: true,
                name: '删除',
                onClick: this.deleteAptitude
            }]);
        }
        this.voList.addButton([{
            selectBind: true,
            name: '详情',
            onClick: this.editAptitudeInfo
        }]);
    };

    openAptitudeInfo = () => {
        this.openAptitudeInfoModal(null, '新增资质与认证信息');
    };

    editAptitudeInfo = () => {
        const aptitudeId = this.voList.getSelectedValue('id');
        this.openAptitudeInfoModal(aptitudeId, '查看资质与认证信息');
    };

    openAptitudeInfoModal = (aptitudeId, title) => {
        openModal(<CustAptitudeInfo readonly={this.props.readonly}/>, {
            title: title,
            custId: this.custId,
            aptitudeId: aptitudeId,
            width:'900px',
            defaultButton: true,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.aptitudeInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {}
        });
    };

    deleteAptitude = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {},
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="customer-CustAptitudeList"
                    params={{custId: this.custId}}
                    formReady={this.formReady}
                />
            </div>
        );
    }
}