import React from 'react';

export default class AchieveInfo extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-order`}>
                <div className={`${prefix}-chartsw-header`}>
                    <div className={`${prefix}-chartsw-header-title`}>业绩情况一览</div>
                </div>
            </div>
        );
    }
}
