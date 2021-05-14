import React from "react";

import {Row, Col, DataTable, Message, Modal, propsCompose} from '../../../../src/components';

@propsCompose
export default class ParamItemTreeList extends React.Component {

    constructor(props) {
        super(props);
        const {paramCode} = props;
        this.paramCode = paramCode;
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
            {name: '新增', onClick: () => this.addRecord()},
            {name: '保存', onClick: () => this.saveRecord()},
            {name: '删除', onClick: () => this.deleteRecord()}
        ]);
        voList.setColumnTemplate('paramCode', (text, record, index) => {
            return (<div>{text}</div>);
        });
    };

    addRecord = () => {
        this.voList.addRow({paramCode: this.paramCode});
    };

    saveRecord = () => {
        this.voList.saveData().then(() => {
            Message.success('保存成功');
            const {onCancel, refresh} = this.props;
            onCancel && onCancel();
            refresh && refresh();
        });
    };

    deleteRecord = () => {
        const selectedRows = this.voList.getSelectedRows();
        if (selectedRows.length < 1) {
            Message.info('请先选择一行！');
            return;
        }

        const paramItemName = selectedRows[0].name;
        let contentMsg = '您确定删除当前数据吗？删除后数据不可恢复！';
        if (paramItemName) {
            contentMsg = `您确定删除条目名称[${paramItemName}]吗？删除后数据不可恢复！`;
        }
        Modal.confirm({
            title: '删除确认',
            content: contentMsg,
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DataTable
                            dataFormId="common-ParamItemTreeList"
                            params={{paramCode: this.paramCode}}
                            formReady={this.formReady}
                            editMode={true}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}