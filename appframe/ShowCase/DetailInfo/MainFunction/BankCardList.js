import React from "react";

import {Row, Col, DataTable, Message, Modal} from '../../../../src/components';

export default class BankCardList extends React.Component {

    constructor(props) {
        super(props);
        const {personId} = this.props;
        this.personId = personId;
    }

    formReady = (formList) => {
        this.formList = formList;
        this.formList.addButton([
            {name: '新增', onClick: () => this.addRecord()},
            {name: '保存', onClick: () => this.saveRecord()},
            {name: '删除', onClick: () => this.deleteRecord(), selectBind: true}
        ]);
    };

    addRecord = () => {
        this.formList.addRow({personId: this.personId, status: 'Y'});
    };

    saveRecord = () => {
        this.formList.saveData().then(() => {
            this.formList.refresh();
        }).then(() => {
            Message.success('保存成功');
        });
    };

    deleteRecord = () => {
        const selectedRows = this.formList.getSelectedRows();
        const cardNo = this.formList.getSelectedValue('cardNo');
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除卡号[${cardNo}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.formList.deleteRows(selectedRows);
            }
        });
    };

    tableRefresh = () => {
        this.formList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="demo-PersonBankCardList"
                    formReady={this.formReady}
                    params={{personId: this.personId}}
                    editMode={true}
                    showPagination={false}
                />
            </div>
        );
    }
}