import React from "react";
import FnastatInfo from "./FnastatInfo";
import FnastatIndictor from "./FnastatIndictor";
import FnastatFieldSet from "./FnastatFieldSet";
import { DataTable, Message, Modal, openModal, propsCompose} from '../../../src/components';
/**
 * Created by dswang on 2018/3/8.
 */

@propsCompose
export default class FnastatList extends React.Component {

    static FnastatIndictor = FnastatIndictor;
    static FnastatFieldSet = FnastatFieldSet;


    constructor(props) {
        super(props);
        const {param, custId,readonly} = this.props;
        this.custId = custId;
        if (param && param.custId) {
            this.custId = param.custId;
        }
        this.readonly = readonly;
    }

    formReady = (volist) => {
        this.volist = volist;
        this.volist.addButton([{
            name: '新增报表',
            onClick: this.openFnastatInfo,
            disabled:this.readonly
        },
            {
                name: '报表明细',
                selectBind: true,
                onClick: this.viewFnastatDetail
            },
            {
                name: '报表说明',
                selectBind: true,
                onClick: this.viewFnastatInfo
            },
            {
                name: '删除报表',
                selectBind: true,
                onClick: this.deleteFnastat,
                disabled:this.readonly
            }]);
        // this.volist.setColumnTemplate('serialNo', (text, record, i) => {
        //     return (<a onClick={() => this.viewFnastatDetail(record)}>{text}</a>);
        // });
    };



    viewFnastatDetail = (row) =>{
        const {flexTabs} = this.props;
        //查看财务报表明细
        if(!row.serialNo){
            let line = this.volist.getSelectedRows();
            flexTabs.open('财务报表明细','Common/Fnastat',{bookId:line[0].serialNo});
        }else{//链接触发
            flexTabs.open('财务报表明细','Common/Fnastat',{bookId:row.serialNo});
        }
    }

    viewFnastatInfo = () =>{
        //按钮触发查看详情
        let row = this.volist.getSelectedRows();
        this.openFnastatInfo(row[0]);
    }


    openFnastatInfo = (row) => {
        openModal(<FnastatInfo/>, {
            title:row.serialNo ? "财务报表详情":"新增财务报表",
            defaultButton: true,
            minWidth:'895px',
            onOk: (modal, compnent,but) => {
                if(row.serialNo){
                    modal.close();
                }else{
                    compnent.fnastatInfoSave((err, value) => {
                        if (!err) {
                            modal.close();
                        } else {
                            but.setDisabled(false);
                        }
                    });
                }
            },
            refresh: this.tableRefresh,
            custId:this.custId,
            serialNo:row.serialNo ? row.serialNo:null,
        });
    };

    deleteFnastat = () => {
        const selectedRows = this.volist.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                this.volist.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.volist.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="customer-FnastatList"
                    formReady={this.formReady}
                    params={{custId: this.custId}}
                    showPagination={true}
                />
            </div>
        );
    }
}