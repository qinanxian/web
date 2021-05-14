import React from 'react';

export default class MsgInfo extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-message`}>
                <div className={`${prefix}-chartsw-header`}>
                    <div className={`${prefix}-chartsw-header-title`}>通知/消息</div>
                </div>
            </div>
        );
    }
}
