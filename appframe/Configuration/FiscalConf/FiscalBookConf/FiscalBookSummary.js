import React from 'react';
import {DetailInfo, Message, ModalInput, DataTablePicker} from '../../../../src/components';

export default class FiscalBookSummary extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;

        this.voInfo.setItemTemplate('gaapName', () => {
            return (
                <ModalInput
                    dataTable={{ dataFormId: "configuration-ConfFiscGaapList"}}
                    modal={{
                        title: '选择会计准则制度',
                        onOk: (e, row) => {
                            row && row.length && this.voInfo.setData({
                                gaapDef: row[0].gaapDef,
                                gaapName: row[0].gaapName,
                            });
                        }
                    }}
                />
            );
        });

        this.voInfo.setItemSuffix('mainCorpName', () => {
            return (
                <DataTablePicker
                    dataFormId="configuration-CorpList"
                    pageSize={5}
                    title="选择主体公司"
                    onOk={(e, row) => {
                        row && this.voInfo.setData({
                            mainCorpId: row.corpId,
                            mainCorpName: row.corpName
                        });
                    }}
                />
            );
        });
    };



    summarySave = (cb) => {
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
                <DetailInfo
                    dataFormId="configuration-FiscalBookSummary"
                    formReady = {this.formReady}
                />
            </div>

        );
    }
}

