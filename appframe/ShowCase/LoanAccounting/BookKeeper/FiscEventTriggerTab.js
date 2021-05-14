import React from 'react';
import {Tabs} from '../../../../src/components';
import LoanIssuanceTriggerInfo from './LoanIssuanceTriggerInfo';
import LoanRepaymentInfo from './LoanRepaymentInfo';
import PrepaymentInfo from './PrepaymentInfo';


export default class FiscEventTriggerTab extends React.Component {
    constructor(props) {
        super();
        const {param} = props;
        this.state = {
            planName: null
        };
        this.tabsOptions = [
            {
                tab: '贷款发放',
                key: 'LoanIssuanceTriggerInfo',
                content: <LoanIssuanceTriggerInfo/>
            },
            {
                tab: '一般还款',
                key: 'LoanRepaymentInfo',
                content: <LoanRepaymentInfo/>
            },
            {
                tab: '提前还款',
                key: 'PrepaymentInfo',
                content: <PrepaymentInfo/>
            }
        ]
    }

    dataReady = (voinfo) => {
        this.voinfo = voinfo;
    };

    render() {
        return (
            <div>
                <Tabs tabPosition={'left'} type='line' style={{ color: '#9fa1a3' }} options={this.tabsOptions}/>
            </div>
        );
    }
}

