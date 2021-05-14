import React from "react";
import { DataTable, Message,openModal,Modal} from '../../../../src/components';
import FiscalBookInfo from './FiscalBookInfo'
import FiscalBookSummary from './FiscalBookSummary'
import FiscalBookTab from './FiscalBookTab'

export default class FiscalBookList extends React.Component {

    static FiscalBookTab = FiscalBookTab;

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openFiscalBookSummary
        },{
            name: '删除',
            selectBind: true,
            onClick: this.deleteFiscalBook
        },{
            name: '查看凭证',
            selectBind: true,
            onClick: this.openVoucherList
        }
        ]);

        this.voList.setColumnTemplate('bookName', (text, record, i) => {
            return (<a onClick={() => this.openFiscalBook(record)}>{text}</a>);
        });
    };

    openVoucherList = () => {
        const row = this.voList.getSelectedRows()[0];
        const {bookCode} = row;
        const {flexTabs} = this.props;
        flexTabs.open(`记账凭证`, 'ShowCase/LoanAccounting/BookKeeper/VoucherList', {
            bookCode,
        });
    };

    openFiscalBook = (row) => {
        const {bookName,bookCode} = row;
        const {flexTabs,openLoading,closeLoading} = this.props;
        flexTabs.open(`帐套详情|${bookName}`, 'Configuration/FiscalConf/FiscalBookConf/FiscalBookTab', {
            bookCode
        });
    };

    openFiscalBookSummary = () => {
        openModal(<FiscalBookSummary/>, {
            title: "新增帐套",
            defaultButton: true,
            onOk: (modal, compnent,but) => {
                compnent.summarySave((err, value) => {
                    if (!err) {
                        modal.close();
                        this.tableRefresh && this.tableRefresh();
                    } else {
                        but.setDisabled(false)
                    }
                });
            },
            onCancel(a, b) {
            }
        });
    };

    deleteFiscalBook = () => {
        const selectedRows = this.voList.getSelectedRows();
        if (selectedRows.length < 1) {
            Message.info('请先选择一行！');
            return;
        }

        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk:() => {
                this.voList.deleteRows(selectedRows);
            }
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="configuration-FiscalBookList"
                    formReady={this.formReady}
                    showPagination={false}
                />
            </div>
        );
    }
}