/**
 * 流程任务列表
 * 左晓敏 <xmzuo@amarsoft.com>
 * 2018-03-13
 */
import React from 'react';

import {Collapse, Col, Tabs} from '../../../../src/components/index';

import PaymentCalcInfo from "./PaymentCalcInfo";
import PaymentCalcDBInfo from "./PaymentCalcDBInfo";
import ImplicationPaymentCalcInfo from "./ImplicationPaymentCalcInfo";

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

export default class AdjustInterestTabs extends React.Component {
    static PaymentCalcInfo = PaymentCalcInfo;
    static PaymentCalcDBInfo = PaymentCalcDBInfo;
    static ImplicationPaymentCalcInfo = ImplicationPaymentCalcInfo;

    constructor(props) {
        super(props);
        const {param} = props;
        const data = {
            EqualLoan:             {paymentMode:'EqualLoan',            payPointTime:'Postpay',interestCalcMode:'M',rateAppearMode:'Indication' ,currency:'CNY',totalAmt: 5000000, firstPayAmt: 0,    terms:24,paymentPeriod:'M',startDate:'2014-07-20',baseRateType:'PBOCLoan',rateFloatType:'Multiply',rateFloat:1.065},
            EqualPrincipal:        {paymentMode:'EqualPrincipal',       payPointTime:'Postpay',interestCalcMode:'D',rateAppearMode:'Indication' ,currency:'CNY',totalAmt: 5000000, firstPayAmt: 10000,terms:24,paymentPeriod:'M',startDate:'2016-12-09',baseRateType:'PBOCLoan',rateFloatType:'Multiply',rateFloat:1.065},
            EachInterest:          {paymentMode:'EachInterest',         payPointTime:'Postpay',interestCalcMode:'M',rateAppearMode:'Indication' ,currency:'CNY',totalAmt: 10000,   firstPayAmt: 0,    terms:6, paymentPeriod:'M',startDate:'2018-06-01',baseRateType:'PBOCLoan',rateFloatType:'Multiply',rateFloat:3.0},
            OneTime:               {paymentMode:'OneTime',              payPointTime:'Postpay',interestCalcMode:'D',rateAppearMode:'Indication' ,currency:'CNY',totalAmt: 10000,   firstPayAmt: 0,    terms:1, paymentPeriod:'Y',startDate:'2018-06-01',baseRateType:'PBOCLoan',rateFloatType:'Multiply',rateFloat:3.0},
            ImplicationCustomize:  {paymentMode:'ImplicationCustomize', payPointTime:'Postpay',interestCalcMode:'D',rateAppearMode:'Implication',currency:'CNY',totalAmt: 10000000,firstPayAmt: 0,terms:10,paymentPeriod:'Q',startDate:'2013-12-26'},
            DeterminatePrincipal:  {paymentMode:'DeterminatePrincipal', payPointTime:'Postpay',interestCalcMode:'D',rateAppearMode:'Indication',currency:'CNY',totalAmt: 10000000,firstPayAmt: 0,terms:10,paymentPeriod:'Q',startDate:'2013-12-26',baseRateType:'PBOCLoan',rateFloatType:'Multiply',rateFloat:1.065}
        };

        const ImplicationPaymentSchedule = [{termTimes:1,  paymentDate:"2014-04-26",paymentAmt:800000.00}, {termTimes:2,  paymentDate:"2014-10-26",paymentAmt:1342000.00}, {termTimes:3,  paymentDate:"2015-04-26",paymentAmt:800000.00}, {termTimes:4,  paymentDate:"2015-10-26",paymentAmt:1800000.00}, {termTimes:5,  paymentDate:"2016-04-26",paymentAmt:800000.00}, {termTimes:6,  paymentDate:"2016-10-26",paymentAmt:1800000.00}, {termTimes:7,  paymentDate:"2017-04-26",paymentAmt:800000.00}, {termTimes:8,  paymentDate:"2017-10-26",paymentAmt:1800000.00}, {termTimes:9,  paymentDate:"2018-04-26",paymentAmt:800000.00}, {termTimes:10, paymentDate:"2018-10-26",paymentAmt:1800000.00}];
        const DeterminatePrincipalPaymentSchedule = [{termTimes:1,  paymentDate:"2014-04-26",principal:500000.00}, {termTimes:2,  paymentDate:"2014-10-26",principal:1000000.00}, {termTimes:3,  paymentDate:"2015-04-26",principal:600000.00}, {termTimes:4,  paymentDate:"2015-10-26",principal:1200000.00}, {termTimes:5,  paymentDate:"2016-04-26",principal:900000.00}, {termTimes:6,  paymentDate:"2016-10-26",principal:1300000.00}, {termTimes:7,  paymentDate:"2017-04-26",principal:1000000.00}, {termTimes:8,  paymentDate:"2017-10-26",principal:900000.00}, {termTimes:9,  paymentDate:"2018-04-26",principal:600000.00}, {termTimes:10, paymentDate:"2018-10-26",principal:2000000.00}];

        this.tabsOptions = [
            {
                tab: '等额本息',
                key: 'EqualLoan',
                content:
                    <PaymentCalcInfo
                        {...props}
                        data={data.EqualLoan}
                    />
            },
            {
                tab: '等额本金',
                key: 'EqualPrincipal',
                content:
                    <PaymentCalcInfo
                        {...props}
                        data={data.EqualPrincipal}
                    />
            },
            {
                tab: '先息后本',
                key: 'EachInterest',
                content:
                    <PaymentCalcInfo
                        {...props}
                        data={data.EachInterest}
                    />
            },
            {
                tab: '一次性还款',
                key: 'OneTime',
                content:
                    <PaymentCalcInfo
                        {...props}
                        data={data.OneTime}
                    />
            },
            {
                tab: '隐含利率',
                key: 'ImplicationCustomize',
                content:
                    <ImplicationPaymentCalcInfo
                        {...props}
                        data={data.ImplicationCustomize}
                        paymentSchedule={ImplicationPaymentSchedule}
                        dataformId={"demo-LacImplicationPaymentScheduleList"}
                    />
            },
            {
                tab: '确定本金',
                key: 'DeterminatePrincipal',
                content:
                    <ImplicationPaymentCalcInfo
                        {...props}
                        data={data.DeterminatePrincipal}
                        paymentSchedule={DeterminatePrincipalPaymentSchedule}
                        dataformId={"demo-LacDeterminatePrincipalPaymentScheduleList"}
                    />
            },
            {
                tab: '等额本息（数据库）',
                key: 'EqualLoanDB',
                content: <PaymentCalcDBInfo
                    {...props}
                    data={data.EqualLoan}
                />
            }
        ]

    }

    render() {
        return (
            <div>
                <Col span={24}>
                    <Tabs options={this.tabsOptions}/>
                </Col>
            </div>
        );
    }
}
