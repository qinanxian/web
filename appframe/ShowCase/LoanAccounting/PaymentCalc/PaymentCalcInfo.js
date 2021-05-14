import React from "react";
import {DataTable, Notify, Message, DetailInfo, Fieldset ,Button,rest} from '../../../../src/components/index';

export default class PaymentCalcInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          doingCalc: false,
        }
    }

    formReady = (formInfo) => {
        this.formInfo = formInfo;
        const {data} = this.props;

        this.formInfo.setGroupTemplate('30', <DataTable
            dataFormId="demo-LacPaymentScheduleList"
            params={{code: 'BeanPersonList'}}
            dataReady={this.dataReadyList}
            formReady={this.formReadyList}
            showPagination={false}
            size={'small'}
            requestData={false}
        />);
        this.formInfo.setGroupReadingMode('20',true);
        this.formInfo.setReadingMode('rateAppearMode',true);
        this.formInfo.setReadingMode('paymentMode',true);
        this.formInfo.setData(data);

        this.formInfo.setItemOnChange("payPoint",this.payPointOnChange);
    };

    payPointOnChange = (value) => {
        if (value === 'FIXED_DAY') {
            this.formInfo.setItemVisible("payFixedDay",true);
            this.formInfo.setItemRequired("payFixedDay",true);
        } else {
            this.formInfo.setItemVisible("payFixedDay",false);
            this.formInfo.setItemRequired("payFixedDay",false);
        }
    };
    
    dataReadyList = (dataList) => {
        this.dataList = dataList;
        // this.dataList.addButton([{
        //     name: '计算',
        //     type: 'primary',
        //     icon: 'fa-calculator',
        //     onClick: ()=>{
        //         this.exeCalc();
        //     }
        // }]);
    };

    formReadyList = (formList) => {
        this.formList = formList;
        this.formList.addTemplate([
            <Button type="primary"
                    loading={this.state.doingCalc}
                    icon={'fa-calculator'}
                    onClick={this.exeCalc}
            >计算</Button>
        ])
    };

    exeCalc = (e,btnEvent) => {
        const loanData = this.formInfo.getData();
        btnEvent.setLoading(true);
        this.setState({doingCalc: true});
        this.formInfo.invoke('exeCalc',loanData)
            .then((ret)=>{
                btnEvent.setLoading(false);
                // console.log('ret',ret);
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
                // this.voInfo.setData(ret);
                // this.voInfo.setValue('loanAmt',ret.loanAmt);
                // this.voInfo.setValue('expiryDate',ret.loanAmt);
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
    
    render() {
        return (
            <div>
                <DetailInfo
                    params={{k: 'v'}}
                    labelWidth={"120px"}
                    dataFormId="demo-LacLoanInfo"
                    formReady={this.formReady}
                    buttonFixed = {true}
                />
            </div>

        );
    }
}