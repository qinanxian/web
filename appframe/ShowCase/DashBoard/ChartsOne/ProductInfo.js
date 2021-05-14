import React from 'react';

export default class ProductInfo extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-product`}>
                <div className={`${prefix}-chartsw-header`}>
                    <div className={`${prefix}-chartsw-header-title`}>产品放款金额比例</div>
                </div>
            </div>
        );
    }
}
