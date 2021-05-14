import React from 'react';
import { Icon } from 'roface';
import { formatMoney, formatNumber } from '../../../../src/lib/accounting';

export default class CashFlow extends React.Component{
    render(){
        const { prefix = 'ro',cashData = [] } = this.props;
        return (
            <div className={`${prefix}-cashflow`}>
                {cashData.map((item) => {
                    if (item.flag) {
                        return (
                            <div key={item.key} className={`${prefix}-cashflow-line`}/>
                        );
                    }
                    return (
                        <div key={item.key} className={`${prefix}-cashflow-block`}>
                            <div style={{background:item.bgColor.outer}} className={`${prefix}-cashflow-block-left`}>
                                <div style={{background:item.bgColor.inner}} className={`${prefix}-cashflow-block-left-inner`}>
                                    <Icon type={item.icon}/>
                                </div>
                            </div>
                            <div className={`${prefix}-cashflow-block-right`}>
                                <div className={`${prefix}-cashflow-block-right-label`}>{item.title}</div>
                                <div className={`${prefix}-cashflow-block-right-value`}>{formatNumber(item.value)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}
