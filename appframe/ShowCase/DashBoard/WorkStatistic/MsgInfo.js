import React from 'react';
import { Icon } from 'roface';
import { formatMoney, formatNumber } from '../../../../src/lib/accounting';

const data = [
    {key:'data1',flag:false,value:'67',label:'未读消息',icon:'roic-email',blockKey:'one'},
    {key:'data4',flag:true},
    {key:'data2',flag:false,value:'6',label:'待办任务',icon:'fa-calendar-check-o',blockKey:'two'},
    {key:'data6',flag:true},
    {key:'data3',flag:false,value:'6789',label:'GPS预警',icon:'roic-insurance',blockKey:'three'}
];

export default class MsgInfo extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-message`}>
                <div className={`${prefix}-chartsw-header`}>
                    <div className={`${prefix}-chartsw-header-title`}>通知/消息</div>
                </div>
                <div className={`${prefix}-message-content`}>
                    {data.map((item) => {
                        if (item.flag) {
                            return <div key={item.key} className={`${prefix}-message-content-line`}/>
                        }
                        return (
                            <div key={item.key} className={`${prefix}-message-content-block`}>
                                <div className={`${prefix}-message-content-block-icon ${prefix}-message-content-block-icon${item.blockKey}`}>
                                    <Icon type={item.icon}/>
                                </div>
                                <div className={`${prefix}-message-content-block-msg`}>
                                    <div>{item.label}</div>
                                    <div>{formatNumber(item.value)}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
