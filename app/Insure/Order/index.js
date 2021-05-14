import React from 'react'
import {DataTable, Download, Icon, Message, Modal, Notify, openModal, rest} from '../../../src/components';
import {getUser} from '../../../src/lib/cache';
import OrderInfo from './OrderInfo';
import RecInsureUpdateInfo from './RecInsureUpdateInfo';
import SelfRecInsureInfo from './SelfRecInsureInfo';
import TranInsureInfo from './TranInsureInfo';
import EditOrderInfo from './EditOrderInfo';

export default class OrderList extends React.Component {

    static OrderInfo = OrderInfo;
    constructor(props){
        super(props);
        this.userOrg = getUser().orgId;
        this.userId = getUser().id;
        this.roleNum = '';
    }

    componentWillMount(){
        if(this.userId != null){
            rest.get(`/insure/network/getUserRoleInfoById/${this.userId}`)
                .then((response)=>{
                    this.roleNum = response.roleNum;
                }).catch((error)=>{
                Notify.error("未获取到用户操作权限信息");
            })
        }
    }

    didMount = ({setImages}) => {
        this.setImages = setImages;
    };

    dataReady = (voList) => {
        this.voList = voList;
        this.voList.setColumnTemplate('appName', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
        this.voList.setColumnTemplate('appCert', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
    };
    clickName = (row) => {
        //保单编号
        const orderId = row.orderId;
        if(orderId === ""){
            Notify.error("保单ID为空，无法查看保单详情！");
        }else{
            const {flexTabs} = this.props;
            flexTabs.open(`保单信息详情`, 'Insure/Order/OrderInfo', {
                id: orderId,
            });
        }
    };

    formReady = (voList) => {
        this.voList = voList;
        if(this.roleNum == 'R02'){
            this.voList.addButton([
                // {
                //     name: '详情',
                //     selectBind: true,
                //     onClick: this.lookOrderInfo
                // },
                {
                    name: '修改',
                    selectBind: (rows) => this.isEditBtnDisabled(rows),
                    onClick: this.editOrderInfo
                },
                {
                    name: '导出EXCEL',
                    type: 'default',
                    onClick: () => this.exportExcel(true)
                }
            ]);
        }else if(this.roleNum == 'R01'){
            this.voList.addButton([
                // {
                //     name: '详情',
                //     selectBind: true,
                //     onClick: this.lookOrderInfo
                // },
                {
                    name: '收到保单新增信息',
                    selectBind: (rows) => this.isBtnDisabled(rows),
                    onClick: this.revInsureUpdate
                }
                ,
                {
                    name: '本人领取保单',
                    selectBind: (rows) => this.isSelfRecBtnDisabled(rows),
                    onClick: this.selfRecInsure
                }
                ,
                {
                    name: '保单移交',
                    selectBind: true,
                    onClick: this.tranInsure
                },
                {
                    name: '导出EXCEL',
                    type: 'default',
                    onClick: () => this.exportExcel(true)
                }
            ]);
        }else{
            this.voList.addButton([
                // {
                //     name: '详情',
                //     selectBind: true,
                //     onClick: this.lookOrderInfo
                // },
                {
                    name: '导出EXCEL',
                    type: 'default',
                    onClick: () => this.exportExcel(true)
                }
            ]);
        }
    };
    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `保单信息.xlsx`);
    };

    isEditBtnDisabled = (rows) => {
        const count = rows.size();
        if(count > 0){
            if(rows[0].isRec == 1){
                return true ;
            }else if(rows[0].insStatus == '03'){
                return true ;
            }
            else{
                return false ;
            }
        }
        return true ;
    }
    isSelfRecBtnDisabled = (rows) => {
        const count = rows.size();
        if(count > 0){
            if(rows[0].isRec == 1){
                return true ;
            }else{
                return false ;
            }
        }
        return true ;
    }
    isBtnDisabled = (rows) => {
        const count = rows.size();
        if(count > 0){
            if(rows[0].isRev == 1){
                    return true ;
            }else{
                return false ;
            }
        }
        return true ;
    }
    tranInsure = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const orderId = this.voList.getSelectedRows()[0].orderId;
        const insStatus = this.voList.getSelectedRows()[0].insStatus;
        const nowTime = this.formatTime();
        const mgrName = this.voList.getSelectedRows()[0].mgrName;
        const mgrOaNo = this.voList.getSelectedRows()[0].mgrOaNo;
        const expireTime = this.voList.getSelectedRows()[0].expireTime;
        const netorgNo = this.voList.getSelectedRows()[0].netorgNo;
        const isRev = this.voList.getSelectedRows()[0].isRev;
        if(isRev == 0){
            Notify.info('未收到保单新增信息，不能移交');
        }else if(insStatus =='03'){
            Notify.info('保单到期已移交，不能再移交');
        }else if(insStatus =='04'){
            Notify.info('保单已被客户领取，不能再移交');
        }else if(insStatus =='05'){
            Notify.info('保单到期期满作废，不能再移交');
        }else {
            this.tranInsureInfoModal(nowTime,netorgNo,expireTime,mgrName,mgrOaNo,orderId, '保单移交');
        }
    }

    tranInsureInfoModal = (nowTime,netorgNo,expireTime,mgrName,mgrOaNo,id,title) => {
        openModal(<TranInsureInfo readonly={this.props.readonly}/>, {
            title: title,
            id: id,
            mgrName: mgrName,
            mgrOaNo: mgrOaNo,
            expireTime: expireTime,
            netorgNo: netorgNo,
            nowTime: nowTime,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b, c) => {
                b.tranInsureInfoSave((err, value) => {
                    c.setLoading(false);
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    selfRecInsure = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const orderId = this.voList.getSelectedRows()[0].orderId;
        const expireTime = this.voList.getSelectedRows()[0].expireTime;
        const isRec = this.voList.getSelectedRows()[0].isRec;
        const isRev = this.voList.getSelectedRows()[0].isRev;
        const nowTime = this.formatTime();
        if(isRev == 0){
            Notify.info('未收到保单新增信息，不能领取');
        }else if(isRec ==1){
            Notify.info('保单已领取');
        }else if(nowTime>expireTime){
            Notify.info('保单已过期，不可领取');
        }else {
            this.selfRecInsureInfoModal(nowTime,orderId, '本人领取保单');
        }
    }

    selfRecInsureInfoModal = (time,id,title) => {
        openModal(<SelfRecInsureInfo readonly={this.props.readonly}/>, {
            title: title,
            id: id,
            time: time,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b,c) => {
                b.selfRecInsureInfoSave((err, value) => {
                    c.setLoading(false);
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

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
        return [year, month, day].map(formatNumber).join('-')
    }

    editOrderInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const id = this.voList.getSelectedRows()[0].orderId;
        this.openEditOrderInfo(id, "修改保单信息");
    }
    openEditOrderInfo = (id, title) => {
        openModal(<EditOrderInfo {...this.props} readonly={this.props.readonly}/>, {
            title: title,
            id: id,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b,c) => {
                b.EditOrderInfoSave((err, value) => {
                    c.setLoading(false);
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    revInsureUpdate = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const orderId = this.voList.getSelectedRows()[0].orderId;
        const isRev = this.voList.getSelectedRows()[0].isRev;
        if(isRev ==1){
             Notify.info('保单信息已提交');
        }else {
            this.recInsureUpdateInfoModal(orderId, '收到保单新增信息');
        }
    }

    recInsureUpdateInfoModal = (id, title) => {
        openModal(<RecInsureUpdateInfo readonly={this.props.readonly}/>, {
            title: title,
            id: id,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b, c) => {
                b.recInsureUpdateInfoSave((err, value) => {
                    c.setLoading(false);
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    // lookOrderInfo = (voList) => {
    //     const selectedRows = this.voList.getSelectedRows();
    //     const orderId = this.voList.getSelectedRows()[0].orderId;
    //     const {flexTabs} = this.props;
    //     flexTabs.open(`保单信息详情`, 'Insure/Order/OrderInfo', {
    //         id: orderId,
    //     });
    // }

    tableRefresh = () => {
        this.voList.refresh();
    };

    render(){
        return (
            <div>
                <DataTable
                    dataFormId="insure-OrderList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params={{userOrg: this.userOrg}}
                />
            </div>
        );
    }

}