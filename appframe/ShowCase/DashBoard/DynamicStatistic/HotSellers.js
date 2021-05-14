import React from 'react';
import { formatNumber } from '../../../../src/lib/accounting';

export default class HotSellers extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-hotsellers ${prefix}-block`}>
                <div className={`${prefix}-block-title`}>热销产品</div>
                <div className={`${prefix}-hotsellers-content`}>
                    <div className={`${prefix}-hotsellers-content-text`}>
                        <span>车抵贷产品A</span>
                        <span>{formatNumber(480000)}</span>
                        <span>一笔</span>
                    </div>
                    <div className={`${prefix}-hotsellers-content-line`}/>
                </div>
            </div>
        );
    }
}
