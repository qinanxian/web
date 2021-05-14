import React from "react";

import {DataTable,Modal,openModal, Row, Col, Tabs} from "../../../src/components/index";
import DetectorItemDetail from "./DetectorItemDetail"

export default class DetectorItemList extends React.Component {

    static  DetectorItemDetail = DetectorItemDetail;

    constructor(props) {
        super(props);
    };


    dataReady = (api) => {
        this.voList.setColumnTemplate('itemName', (text, record, i) => {
            return (<a onClick={() => this.editItemInfo(record)}>{text}</a>);
        });
    };



    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openDetectorItemInfo
        }, {
            selectBind: true,
            name: '编辑',
            onClick: this.editDetectorListInfo
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteDetectorItem
        }]);
    };

    openDetectorItemInfo = () => {
        this.openInfoModal('新增风险探测模型', 'add');
    };

    editDetectorListInfo = () => {
        this.openInfoModal('编辑风险探测模型','edit');
    };



    openInfoModal = (title, operation) => {
        const selectedRows = this.voList.getSelectedRows();
        const itemCode = selectedRows[0] && selectedRows[0].itemCode;
        const { detectorCode } = this.props;
        openModal(<DetectorItemDetail/>, {
            title: title,
            defaultButton: true,
            operation: operation,
            detectorCode,
            itemCode: 'edit' === operation ? itemCode : null,
            refresh: this.tableRefresh,
            onOk: (modal, component,but) => {
                component.detectorItemInfoSave((err, value) => {
                    if (!err) {
                        modal.close();
                    }else {
                        but.setDisabled(false)
                    }
                }, {detectorCode});
            },
            onCancel: (a, b) => {
            }
        });
    };

    deleteDetectorItem = () => {
        const selectedRows = this.voList.getSelectedRows();
        const detectorItemName = selectedRows[0].itemName;
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${detectorItemName}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };


    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        const { detectorCode } = this.props;
        return (
            <div style={{ display: detectorCode ? '' : 'none' }}>
                <DataTable
                    dataFormId="configuration-DetectorModelList"
                    formReady={this.formReady}
                    params={{ detectorCode }}
                />
            </div>)

    }
}