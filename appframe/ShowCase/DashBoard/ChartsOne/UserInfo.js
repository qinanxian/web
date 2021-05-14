import React from 'react';

export default class UserInfo extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-user`}>
                <div className={`${prefix}-chartsw-header`}>
                    <div className={`${prefix}-chartsw-header-title`}>欢迎，尊敬的车贷帮用户</div>
                </div>
                <div className={`${prefix}-user-content`}>

                </div>
            </div>
        );
    }
}
