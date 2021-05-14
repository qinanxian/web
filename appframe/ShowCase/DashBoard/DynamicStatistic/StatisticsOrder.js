import React from 'react';
import { formatNumber } from '../../../../src/lib/accounting';

const data = [{
    key:'one',
    title:'订单统计',
    theme:'rgb(59,185,254)',
    children:[{
        key:'child1',
        title:'放款订单',
        number:1,
    },{
        key:'child2',
        title:'审批中订单',
        number:0,
    },{
        key:'child3',
        title:'逾期订单',
        number:1,
    },{
        key:'child4',
        title:'坏账订单',
        number:0,
    }]
},{
    key:'two',
    title:'金额统计',
    theme:'rgb(220,174,20)',
    children:[{
        key:'child1',
        title:'放款金额(元)',
        number:480000,
    },{
        key:'child2',
        title:'审批中金额(元)',
        number:0,
    },{
        key:'child3',
        title:'逾期金额(元)',
        number:99200,
    },{
        key:'child4',
        title:'坏账金额(元)',
        number:59781,
    }]
}];

export default class StatisticsOrder extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-staticorder ${prefix}-block`}>
                <div className={`${prefix}-block-title`}>本月订单统计</div>
                <div className={`${prefix}-staticorder-content`}>
                    {data.length && data.map(item => {
                        return (
                            <div key={item.key} className={`${prefix}-staticorder-content-block`}>
                                <div className={`${prefix}-staticorder-content-block-title`}>
                                    <span style={{background:item.theme}}/>
                                    <span>{item.title}</span>
                                </div>
                                <div className={`${prefix}-staticorder-content-block-children`}>
                                    {item.children.length && item.children.map((child,num) => {
                                        return (
                                            <div key={child.key} className={`${prefix}-staticorder-content-block-children-item`}>
                                                <span>{child.title}</span>
                                                <span style={{color:item.theme,fontWeight:'bold'}}>{formatNumber(child.number)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
