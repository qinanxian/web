import React from "react";

import {Row, Col, DataTable, Button, Message, Modal, openModal} from '../../../../src/components/index';

import FiscalGaapSummary from "./FiscalGaapSummary"
import FiscalGaapEntryList from "./FiscalGaapEntryList"

export default class FiscalGaapList extends React.Component {

    static FiscalGaapSummary = FiscalGaapSummary;
    static FiscalGaapEntryList = FiscalGaapEntryList;

    constructor(props) {
        super();
        this.state = {
            gaapDef: null,
            paramTabDisplayType: 'none'
        };
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openFiscGaapSummary
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteFiscGaap
        }]);

        this.voList.setColumnTemplate('gaapName', (text, record, i) => {
            return (<a onClick={() => this.openFiscalGaapEntryList(record)}>{text}</a>);
        });
    };

    selectRow = (key, rows) => {
        this.setState({gaapDef: rows[0].gaapDef, paramTabDisplayType: ''});
    };

    openFiscalGaapEntryList = (row) => {
        const {gaapDef, gaapName} = row;
        const {flexTabs,openLoading,closeLoading} = this.props;
        flexTabs.open(`会计准则|${gaapName}`, 'Configuration/FiscalConf/FiscalGaap/FiscalGaapEntryList', {
            gaapDef
        });
    };

    openFiscGaapSummary = (row) => {
        const that = this;
        openModal(<FiscalGaapSummary/>, {
            title: '新增会计准则',
            width:'35%',
            defaultButton: true,
            onOk: (a, b) => {
                b.paramInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            },
            refresh: this.tableRefresh
        });
    };

    deleteFiscGaap = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${selectedRows[0].gaapName}]吗？删除后数据不可恢复！`,
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
        return (
            <div>
                <DataTable
                    dataFormId="configuration-FiscGaapList"
                    formReady={this.formReady}
                    showPagination={false}
                />
            </div>
        );
    }
}