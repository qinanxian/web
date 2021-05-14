import React from "react";
import {DataTable, Notify, Message, DetailInfo, Fieldset ,Button,rest} from '../../../../src/components/index';

export default class ImplicationPaymentCalcInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doingCalc: false,
            data:props.data,
            paymentSchedule:props.paymentSchedule,
            dataformId:props.dataformId
        }

    }

    formReady = (formInfo) => {
        this.formInfo = formInfo;
        this.formInfo.setGroupTemplate('30', <DataTable
            dataFormId={this.state.dataformId}
            params={{code: 'BeanPersonList'}}
            dataReady={this.dataReadyList}
            formReady={this.formReadyList}
            showPagination={false}
            size={'small'}
            requestData={false}
            editMode={true}
        />);
        this.formInfo.setGroupReadingMode('20',true);
        this.formInfo.setReadingMode('rateAppearMode',true);
        this.formInfo.setReadingMode('paymentMode',true);
        this.formInfo.setData(this.state.data);
    };

    dataReady = (dataInfo) => {
        this.formInfo.setData(this.state.data);
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
            >计算</Button>
        ]);
        const {paymentSchedule} = this.props;
        this.formList.setData(paymentSchedule);
    };

    exeCalc = (e,btnEvent) => {

        const loanData = this.formInfo.getData();
       /* let segmentList = [];
        let segment = {segmentLoanAmt:loanData.totalAmt,startDate: loanData.startDate,rateAppearMode:this.state.data.rateAppearMode,segmentTerms:loanData.terms,paymentMode:this.state.data.paymentMode,interestCalcMode:loanData.interestCalcMode};

        segment.scheduleList = scheduleList;
        segmentList[0]=segment;*/
        let scheduleList = this.state.paymentSchedule;
        loanData.scheduleList=scheduleList;
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

                this.dataList.setData(paymentScheduleList);
            });
    };
    
    render() {
        return (
            <div>
                <DetailInfo
                    params={{k: 'v'}}
                    labelWidth={"120px"}
                    dataFormId="demo-LacLoanInfo"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    buttonFixed = {true}
                    requestData={false}
                />
            </div>
        );
    }
}