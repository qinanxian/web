import React from 'react';

export default class UserInfo extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-user`}>
                <div className={`${prefix}-chartsw-header`}>
                    <div className={`${prefix}-chartsw-header-title`}>欢迎您</div>
                </div>
                <div className={`${prefix}-user-content`}>
                    <div className={`${prefix}-user-content-left`}>
                        <div className={`${prefix}-user-content-left-tcircle`}/>
                        <div className={`${prefix}-user-content-left-bcircle`}/>
                    </div>
                    <div className={`${prefix}-user-content-right`}>
                        <span>账号角色：客户经理</span>
                        <span>所属组织：总部机构</span>
                    </div>
                </div>
            </div>
        );
    }
}
