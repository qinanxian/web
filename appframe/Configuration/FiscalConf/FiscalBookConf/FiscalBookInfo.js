import React from 'react';
import {DetailInfo, Message, ModalInput, DataTablePicker, Notify} from '../../../../src/components';

export default class FiscalBookInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;

        this.voInfo.addButton([{
            name: '保存',
            type: 'primary',
            onClick: this.infoSave
        }]);

        this.voInfo.setItemSuffix('mainCorpName', () => {
            return (
                <DataTablePicker
                    dataFormId="configuration-CorpList"
                    pageSize={5}
                    title="选择主体公司"
                    onOk={(e, row) => {
                        row && this.voInfo.setData({
                            mainCorpId: row.corpId,
                            mainCorpName: row.corpName,
                            unifiedCreditCode: row.unifiedCreditCode,
                            taxNature: row.taxNature,
                            telephone: row.telephone,
                            taxNo: row.taxNo,
                            raxRate: row.raxRate,
                            email: row.email,
                            bankAccountNo: row.bankAccountNo,
                            address: row.address,
                            faxNo: row.faxNo,
                        });
                    }}
                />
            );
        });

        /*this.voInfo.setItemTemplate('gaapName', () => {
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
        })*/
    };



    infoSave = () => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Notify.error({
                    message: '保存失败',
                });
            } else {
            }
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="configuration-FiscalBookInfo"
                    formReady = {this.formReady}
                    params={{bookCode: this.props.bookCode}}
                />
            </div>

        );
    }
}

