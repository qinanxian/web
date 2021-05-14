import React from "react";
import {DataTable, openModal, Message} from '../../../../src/components';
import TaxRateSummer from "./TaxRateSummary";
import TaxRateInfo from "./TaxRateInfo";

export default class TaxRateProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (volist) => {
        this.volist = volist;
        volist.addButton([
            {
                name: '新增',
                onClick: this.openTaxRateSummary
            },{
                name: '详情',
                selectBind: true,
                onClick: this.openTaxRateInfo
            },{
                name: '置为无效',
                selectBind: true,
                onClick: this.makeInvalid
            }
        ]);
    };

    /**
     * 打开新增税务维护面板
     */
    openTaxRateSummary = () => {
        openModal(<TaxRateSummer refresh={this.tableRefresh} statusDict={this.volist.getColumnDict('status')}/>,{
            defaultButton: true,
            title:"新增税率维护" ,
            width:'34%',
            onOk: (modal, compnent, btn) => {
                compnent.summarySave((err, value) => {
                    if (!err) {
                        modal.close();
                    } else  {
                        btn.setLoading(false);
                    }
                });
                this.tableRefresh();
            },
        });
    };

    tableRefresh = () => {
        this.volist.refresh();
    };

    /**
     * 置为无效
     */
    makeInvalid = () => {
        const selectedRow = this.volist.getSelectedRow();
        this.volist.invoke('changeStatus', selectedRow)
            .then(()=>{
                Message.success("已置为无效！");
            }).catch((err)=> {
                Message.error(err);
        });
        this.tableRefresh();
    }

    /**
     * 打开税务维护详情面板
     */
    openTaxRateInfo = () => {
        const selectedRow = this.volist.getSelectedRow();
        openModal(<TaxRateInfo taxId={selectedRow.taxRateId} refresh={this.tableRefresh}/>,{
            defaultButton: true,
            title:"税率维护详情" ,
            onOk: (modal, compnent, btn) => {
                compnent.summarySave((err, value) => {
                    if (!err) {
                        modal.close();
                    } else  {
                        btn.setLoading(false);
                    }
                });
                this.tableRefresh();
            },
        });
    }

    render() {
        return (
            <DataTable
                dataFormId="configuration-TaxRateList"
                formReady={this.formReady}
                // onSelectRow={this.setValidBtnName}
            />
        );
    }
}