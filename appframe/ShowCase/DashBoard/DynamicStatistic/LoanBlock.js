import React from 'react';

const data = {total:{totalLoan:'0002534668',num:16},month:{monthLoan:'4202534668',num:16}};

export default class OrgPer extends React.Component{
    getBlockItem(data,prefix){
        const result = [];
        let num = 0;
        for (let code of data) {
            if ([1,4,7].includes(num)) {
                result.push(<div key={num+'comma'} className={`${prefix}-loan-block-box-comma`}>
                    <span className={`${prefix}-loan-iconcomma`}/>
                </div>);
            }
            result.push(<div key={num + 'num'} className={`${prefix}-loan-block-box-num`}>
                <span className={`${prefix}-loan-iconnum ${prefix}-loan-icon${code}`}/>
            </div>);
            num ++;
        }
        return result;
    }
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-loan`}>
                <div className={`${prefix}-loan-block`}>
                    <div className={`${prefix}-loan-block-title`}>
                        <div>总放款金额(元)</div>
                        <div>总放款单数<span>{data.total.num}</span></div>
                    </div>
                    <div className={`${prefix}-loan-block-box`}>
                        {this.getBlockItem(data.total.totalLoan,prefix)}
                    </div>
                </div>
                <div className={`${prefix}-loan-block ${prefix}-loan-block2`}>
                    <div className={`${prefix}-loan-block-title`}>
                        <div>本月放款金额(元)</div>
                        <div>本月放款单数<span>{data.month.num}</span></div>
                    </div>
                    <div className={`${prefix}-loan-block-box`}>
                        {this.getBlockItem(data.month.monthLoan,prefix)}
                    </div>
                </div>
            </div>
        );
    }
}
