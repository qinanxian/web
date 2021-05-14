import React from 'react';
import {DetailInfo, Message, ModalInput, Modal, DataTablePicker} from '../../../../src/components/index';

export default class FiscEventEntryInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventDef: props.eventDef || null,
            eventEntryDef: props.eventEntryDef || null,
            selectedBookCode: null,
        }
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setItemTemplate('bookCode', () => {
            return (
                <ModalInput
                    dataTable={{dataFormId: "configuration-FiscalBookList"}}
                    modal={{
                        title: '选择帐套',
                        onOk: (e, row) => {
                            if (!row) return;
                            const bookCode = row[0].bookCode;
                            this.voInfo.setValue('bookCode',bookCode);
                            this.voInfo.setItemSuffix('entryName', () => {
                                return (
                                    <DataTablePicker
                                        dataFormId="configuration-FiscBookEntryList"
                                        params={{bookCode: bookCode}}
                                        iconClick={() => {
                                            if (!bookCode) {
                                                Modal.info({
                                                    content: '请先选择帐套'
                                                });
                                                return false;
                                            }
                                            return true;
                                        }}
                                        pageSize={5}
                                        title="选择科目"
                                        onOk={(e, row) => {
                                            row && this.voInfo.setData({
                                                entryCode: row.entryCode,
                                                entryName: row.entryName,
                                                direction: row.direction,
                                            });
                                        }}
                                    />
                                );
                            });
                        }
                    }}
                />
            );
        });

    };

    fiscEventEntrySave = (cb) => {
        let valueFetcher = this.voInfo.getValue("valueFetcher");
        if (valueFetcher&&valueFetcher.indexOf("$") != -1) {
            Message.info("金额取值中配置了表达式，请注意借贷差值！")
        }
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            }
            cb && cb(err, values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="configuration-FiscEventEntryInfo"
                    formReady={this.formReady}
                    params={{eventDef: this.state.eventDef, eventEntryDef: this.state.eventEntryDef}}
                />
            </div>
        );
    }
}

