import React from 'react';
import { formatNumber } from '../../../../src/lib/accounting';

export default class OrgPer extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-busin ${prefix}-block`}>
                <div className={`${prefix}-block-title`}>业务员业绩排行</div>
                <div className={`${prefix}-busin-intever`}>
                    <span className={`${prefix}-busin-intever-left`}>
                        <span style={{width:'40%'}} className={`${prefix}-busin-intever-left-width`}/>
                        <span className={`${prefix}-busin-intever-left-number`}>{formatNumber(2054668)}</span>
                    </span>
                    <span>客户体验</span>
                </div>
                <div className={`${prefix}-busin-intever2 ${prefix}-busin-intever`}>
                    <span className={`${prefix}-busin-intever-left`}>
                        <span style={{width:'60%'}} className={`${prefix}-busin-intever-left-width`}/>
                        <span className={`${prefix}-busin-intever-left-number`}>{formatNumber(480000)}</span>
                    </span>
                    <span>CS内金</span>
                </div>
            </div>
        );
    }
}
