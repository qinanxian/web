import React from 'react'
import {DataTable, Download, Icon, Message, Modal, openModal, rest} from '../../../src/components';
import {getUser} from '../../../src/lib/cache';
import CompanyInfo from './CompanyInfo';

export default class CompanyList extends React.Component {

    static CompanyInfo = CompanyInfo;
    constructor(props){
        super(props);
        this.state = {};
        this.userOrg = getUser().orgId;
    }

    dataReady = (voList) => {
        this.voList = voList;
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
            {
                name: '新增',
                onClick: this.createCompanyInfo
            },
            {
                name: '详情',
                selectBind: true,
                onClick: this.editCompanyInfo
            },
            {
                name: '删除',
                selectBind: true,
                onClick: this.deleteCompany
            }
        ]);
    };

    createCompanyInfo = (voList) => {
        //生成自定义的ID主键
        const id =`BX${this.formatTime()}${parseInt(Math.random()*100000)}`;
        const {flexTabs} = this.props;
        flexTabs.open(`新增保险公司`, 'Insure/Company/CompanyInfo', {
            id: id
        });
    }
    formatTime = () => {
        const formatNumber = n => {
            n = n.toString()
            return n[1] ? n : '0' + n
        }
        const date=new Date();
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        return [year, month, day].map(formatNumber).join('')
    }

    editCompanyInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const comId = this.voList.getSelectedRows()[0].comId;
        const {flexTabs} = this.props;
        flexTabs.open(`保险公司详情`, 'Insure/Company/CompanyInfo', {
            id: comId,
        });
    }

    deleteCompany = (voList) => {
        const row = this.voList.getSelectedRow();
        const { rest } = this.props;
        Modal.confirm({
            title: '删除确认',
            content: '是否确认删除',
            onOk: () => {
                rest.get(`/insure/network/deleteComById/${row.comId}`)
                    .then((res) => {
                        if(res>=0){
                            Message.success("删除保险公司成功");
                            this.tableRefresh();
                        }
                    }).catch(error => {
                    Message.error("删除失败！");
                })
            },
            onCancel: () => {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render(){
        return (
            <div>
                <DataTable
                    dataFormId="insure-CompanyList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }

}