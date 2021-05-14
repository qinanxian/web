import React from "react";
import { DataTable, Message, propsCompose} from '../../../../src/components';


@propsCompose
export default class BookList extends React.Component {
    formReady = (formList) => {
        this.formList = formList;
        this.formList.addButton([{
            name: '查看凭证',
            selectBind: true,
            onClick: this.openVoucherList
        }]);

    };

    openVoucherList = () => {
        const row = this.formList.getSelectedRows()[0];
        const {bookCode} = row;
        const {flexTabs} = this.props;
        flexTabs.open(`记账凭证`, 'ShowCase/LoanAccounting/BookKeeper/VoucherList', {
            bookCode,
        });
    };

    tableRefresh = () => {
        this.formList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="demo-BookList"
                    formReady={this.formReady}
                />
            </div>
        );
    }
}