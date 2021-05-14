import React from "react";
import {DataTable, Notify, Message, DetailInfo, Fieldset ,Button,rest} from '../../../../src/components/index';

export default class PaymentCalcDBInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          doingCalc: false,
        }
    }

    formReady = (formInfo) => {
        this.formInfo = formInfo;

        this.formInfo.setGroupTemplate('30', <DataTable
            dataFormId="demo-LacPaymentScheduleDBList"
            params={{loanId: '0006',loanSegmentId:'0002'}}
            dataReady={this.dataReadyList}
            formReady={this.formReadyList}
            showPagination={false}
            pageSize={999}
            size={'small'}
            requestData={true}
        />);
        this.formInfo.setGroupReadingMode('20',true);
        this.formInfo.setReadingMode('rateAppearMode',true);
        this.formInfo.setReadingMode('paymentMode',true);
    };
    
    dataReadyList = (dataList) => {
        this.dataList = dataList;
    };

    formReadyList = (formList) => {
        this.formList = formList;
        this.formList.addTemplate([
            <Button type="primary"
                    loading={this.state.doingCalc}
                    icon={'fa-calculator'}
                    onClick={this.exeCalc}
                    style={{marginRight: '5px'}}
            >计算</Button>
        ]);
        this.formList.addTemplate([
            <Button type="primary"
                    icon={'save'}
                    onClick={this.saveLoanAccount}
                    style={{marginRight: '5px'}}
            >保存</Button>
        ]);
        this.formList.addTemplate([
            <Button type="primary"
                    icon={'fa-trash-o'}
                    onClick={this.clearPaymentSchedule}
                    style={{marginRight: '5px'}}
            >清除</Button>
        ]);
    };

    clearPaymentSchedule = () => {

        let param = {};
        param.loanId = '0006';

        this.formList.invoke('clearPaymentSchedule',param)
            .then((ret)=>{
                Notify.success({message: '清除成功'});
                this.formList.refresh();
            }).catch((error) => {
                Notify.info({
                    message: `清除失败`
                });
            });
    };

    exeCalc = (e,btnEvent) => {
        const loanData = this.formInfo.getData();
        btnEvent.setLoading(true);
        this.setState({doingCalc: true});
        this.formInfo.invoke('exeCalc',loanData)
            .then((ret)=>{
                btnEvent.setLoading(false);
                const segmentList = ret.segmentList;
                const paymentScheduleList = [];
                segmentList.forEach((value, index, array) => {
                    const scheduleList = value.scheduleList;
                    scheduleList.forEach((schedule) => {
                        paymentScheduleList.push(schedule);
                    })
                });
                // console.log('line:',paymentScheduleList);
                const segment = ret.segmentList && ret.segmentList[0];
                if(!segment)return;
                const segmentData = {
                    baseRateGrade:segment.baseRateGrade,
                    baseRate:segment.baseRate,
                    interestRate:segment.interestRate,
                    perTermPrincipal:segment.perTermPrincipal,  //每期还本金
                    perTermPaymentAmt:segment.perTermPaymentAmt //每期还利息
                };
                const loanData = {
                    loanAmt:ret.loanAmt,                        //总共债权金额
                    totalPaymentAmt:ret.totalPaymentAmt,        //还款总额
                    totalInterestAmt:ret.totalInterestAmt,      //还息总额
                    actualXirr:ret.actualXirr,
                    expiryDate:ret.expiryDate,
                    segments:ret.segmentList.length,

                };
                this.formInfo.setData(segmentData);
                this.formInfo.setData(loanData);

                this.formList.setData(paymentScheduleList);
            });
    };

    saveLoanAccount = () => {
        this.formInfo.invoke('saveLoadInfo',this.formInfo.getData())
            .then((ret)=>{
                const listDatas = this.dataList.getData();
                listDatas.forEach(element => {
                    element.loanId = ret.loanId;
                    element.loanSegmentId = ret.loanSegmentId;
                });
                this.dataList.setData(listDatas);
                this.dataList.saveData().then(()=>{
                    Notify.success({message: '保存成功'});
                });
            }).catch((error) => {
                Notify.info({
                    message: `保存失败`
                });
            });
    };
    
    render() {
        return (
            <div>
                <DetailInfo
                    params={{k: 'v',loanId:"0006"}}
                    labelWidth={"120px"}
                    dataFormId="demo-LacLoanDBInfo"
                    formReady={this.formReady}
                    buttonFixed = {true}
                />
            </div>

        );
    }
}