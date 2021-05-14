import React from 'react';
import { formatMoney, formatNumber } from '../../../../src/lib/accounting';
const data = [
    {key:'data1',value:'67',label:'累计订单数量'},
    {key:'data2',value:'6',label:'历史订单数量'},
    {key:'data3',value:'6789',label:'账户余额'}
];

export default class AccountInfo extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-account`}>
                <div className={`${prefix}-chartsw-header`}>
                    <div className={`${prefix}-chartsw-header-title`}>账户信息</div>
                </div>
                <div className={`${prefix}-account-content`}>
                    {data.map(item => {
                        return (
                            <div key={item.key} className={`${prefix}-account-content-block`}>
                                <div>{item.label}</div>
                                <div>{formatNumber(item.value)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
