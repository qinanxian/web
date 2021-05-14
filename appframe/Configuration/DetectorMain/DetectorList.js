import React from "react";

import {DataTable,openModal,Modal, Row, Col, Tabs} from "../../../src/components/index";
import DetectorInfo from "./DetectorInfo";

export default class DetectorList extends React.Component {

    static DetectorInfo = DetectorInfo;

    constructor(props) {
        super(props);
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openDetectorDetail
        },{
            selectBind:true,
            name:'编辑',
            onClick:this.editDetectorListInfo
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteDetector
        }]);
    };

    openDetectorDetail = () => {
        this.openInfoModal('新增风险探测规则', 'add');
    };

    editDetectorListInfo = () => {
        this.openInfoModal('编辑风险探测规则','edit');
    };


    deleteDetector = () => {
        const selectedRows = this.voList.getSelectedRows();
        const detectorName = selectedRows[0].name;
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${detectorName}]吗？删除后数据不可恢复！`,
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


    openInfoModal = (title, operation) => {
        const selectedRows = this.voList.getSelectedRows();
        const detectorCode = selectedRows[0] && selectedRows[0].code;
        openModal(<DetectorInfo/>, {
            title: title,
            defaultButton: true,
            width:'35%',
            operation: operation,
            code: 'edit' === operation ? detectorCode : null,
            refresh: this.tableRefresh,
            onOk: (modal, component,but) => {
                component.detectorListInfoSave((err, value) => {
                    if (!err) {
                        modal.close();
                    }else {
                        but.setDisabled(false)
                    }
                });
            },
            onCancel: (modal, component) => {
            }
        });
    };


    render() {
        return (
            <div>
                <DataTable
                    dataFormId="configuration-DetectorList"
                    formReady={this.formReady}
                    onSelectRow={this.props.getSelected}
                />
            </div>)

    }


}