import React from 'react';
import { Icon, Calendar, Charts, Button } from 'roface';
import { Progress, DatePicker } from 'antd';
import TimeRange from './TimeRange';
import SelectForOrder from './SelectForOrder';

const { RangePicker } = DatePicker;
const { Chart, Geom, Axis, Tooltip, Legend } = Charts;

const data = [
    {
        year: "2019-03-01",
        value: 3
    },
    {
        year: "2019-04-01",
        value: 4
    },
    {
        year: "2019-05-01",
        value: 3.5
    },
    {
        year: "2019-06-01",
        value: 5
    },
    {
        year: "2019-07-01",
        value: 4.9
    },
    {
        year: "2019-08-01",
        value: 6
    },
    {
        year: "2019-09-01",
        value: 7
    },
    {
        year: "2019-10-01",
        value: 9
    },
    {
        year: "2019-11-31",
        value: 13
    }
];
const cols = {
    value: {
        min: 0
    },
    year: {
        range: [0, 1]
    }
};
const data2 = [
    {key:'k1',title:'正式录入订单',value:'37',status:70,color:'#FF0000'},
    {key:'k2',title:'审批中订单',value:'37',status:40,color:'#FFA500'},
    {key:'k3',title:'放款订单',value:'37',status:40,color:'#FFFF00'},
    {key:'k4',title:'逾期订单',value:'37',status:30,color:'#00FF00'},
    {key:'k5',title:'坏账订单',value:'37',status:0,color:'#00FFFF'},
    {key:'k6',title:'拒单订单',value:'37',status:20,color:'#0000FF'},
    {key:'k7',title:'结清订单',value:'37',status:10,color:'#800080'}

];
class OrderProgress extends React.Component{
    render(){

        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-progresscta`}>
                {data2.map(item => {
                    return (
                        <div key={item.key} className={`${prefix}-progresscta-block`}>
                            <div className={`${prefix}-progresscta-block-top`}>
                                <span>{item.title}</span>
                                <span><Icon type='arrowup'/></span>
                            </div>
                            <div className={`${prefix}-progresscta-block-value`}>{item.value}</div>
                            <div className={`${prefix}-progresscta-block-progress`}>
                                <Progress
                                    percent={item.status}
                                    strokeWidth={12}
                                    strokeColor={item.color}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default class OrderInfo extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        const data3 = data2.slice(1);
        return (
            <div className={`${prefix}-order`}>
                <div className={`${prefix}-chartsw-header`}>
                    <div className={`${prefix}-chartsw-header-title`}>订单情况一览</div>
                    <div className={`${prefix}-chartsw-header-component`}>
                        {/*<TimeRange/>*/}
                        <div style={{display:'flex',alignItems:'center',marginRight:'8px',fontSize:'15px'}}><span style={{width: '145px'}}>订单录入时间：</span><RangePicker/></div>
                        <SelectForOrder/>
                        <div className={`${prefix}-chartsw-header-component-btn`}>
                            <Button type='primary'>查询</Button>
                        </div>
                    </div>
                </div>
                <div className={`${prefix}-order-content`}>
                    <div className={`${prefix}-order-content-top`}>
                        <OrderProgress/>
                    </div>
                    <div className={`${prefix}-order-content-bottom`}>
                        <div className={`${prefix}-order-content-bottom-theme`}>
                            <div className={`${prefix}-order-content-bottom-theme-arrays`}>
                                {data3.map(item => {
                                    return (
                                        <span key={item.key} className={`${prefix}-order-content-bottom-theme-arrays-block`}>
                                            <Icon type={"areachart"} style={{color:item.color}}/>
                                            <span>{item.title}</span>
                                        </span>
                                    );
                                })}
                            </div>
                            <div className={`${prefix}-order-content-bottom-theme-charts`}>
                                <Icon type={"linechart"}/>
                                <Icon type={"barschart"}/>
                            </div>
                        </div>
                        <Chart height={370} data={data} scale={cols} forceFit padding={[20,100,50,80]}>
                            <Axis name="year" />
                            <Axis name="value" />
                            <Tooltip
                                crosshairs={{
                                    type: "y"
                                }}
                            />
                            <Geom type="line" position="year*value" size={2} />
                        </Chart>
                    </div>
                </div>
            </div>
        );
    }
}
