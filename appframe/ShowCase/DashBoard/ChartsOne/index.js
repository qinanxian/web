import React from 'react';
import UserInfo from './UserInfo';
import AccountInfo from './AccountInfo';
import MsgInfo from './MsgInfo';
import OrderInfo from './OrderInfo';
import AchieveInfo from './AchieveInfo';
import ProductInfo from './ProductInfo';

import './index.less';

export default class ChartsOne extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-chartsw`}>
                <div className={`${prefix}-chartsw-brief`}>
                    <div className={`${prefix}-chartsw-brief-left ${prefix}-chartsw-box`}>
                        <UserInfo/>
                    </div>
                    <div className={`${prefix}-chartsw-brief-center ${prefix}-chartsw-box`}>
                        <AccountInfo/>
                    </div>
                    <div className={`${prefix}-chartsw-brief-right ${prefix}-chartsw-box`}>
                        <MsgInfo/>
                    </div>
                </div>
                <div className={`${prefix}-chartsw-order ${prefix}-chartsw-box`}>
                    <OrderInfo/>
                </div>
                <div className={`${prefix}-chartsw-product ${prefix}-chartsw-box`}>
                    <ProductInfo/>
                </div>
                <div className={`${prefix}-chartsw-achievement ${prefix}-chartsw-box`}>
                    <AchieveInfo/>
                </div>
            </div>
        );
    }
}
