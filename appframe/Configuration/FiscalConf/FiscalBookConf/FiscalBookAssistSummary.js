import React from 'react';
import {Row, Col, DataTable, Button, Message} from '../../../../src/components/index';

export default class FiscalBookAssistSummary extends React.Component {
    constructor(props) {
        super(props);
        const {bookEntryId} = this.props;
        this.bookEntryId = bookEntryId;
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;

        this.voInfo.addButton([{
            name: '新增',
            onClick: this.addFiscalBookAssistRows
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteFiscalBookAssist
        }, {
            name: '保存',
            onClick: this.saveFiscalBookAssist
        }]);
    };







    paramItemInfoSave = (cb) => {
        this.voInfo.setValue("gaapEntryId",this.gaapEntryId)
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        });
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="configuration-FiscalBookAssistSummary"
                    formReady={this.formReady}
                    editMode={true}
                    params={{bookEntryId: this.bookEntryId}}
                    showPagination={false}
                />
            </div>
        );
    }
}

