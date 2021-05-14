import React from 'react';
import { Charts } from 'roface';
const { Chart, Geom, Axis, Tooltip, Legend } = Charts;

const data = [
    {
        month: "2019-01",
        type: "客户体验",
        trend: 70000
    },
    {
        month: "2019-02",
        type: "金华门店",
        trend: 3900
    },
    {
        month: "2019-03",
        type: "客户体验",
        trend: 6900
    },
    {
        month: "2019-04",
        type: "金华门店",
        trend: 4200
    },
    {
        month: "2019-05",
        type: "客户体验",
        trend: 9500
    },
    {
        month: "2019-06",
        type: "金华门店",
        trend: 5700
    }
];
const cols = {
    orgper: {
        tickInterval: 10000
    }
};

export default class MonthOrder extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-orgper ${prefix}-block`}>
                <div className={`${prefix}-block-title`}>月度订单增长趋势</div>
                <Chart height={350} data={data} scale={cols} forceFit padding={[80,30,70,60]}>
                    <Legend
                        textStyle={{
                            fill:'#ffffff'
                        }}
                    />
                    <Axis
                        name="month"
                        label={{
                            textStyle:{
                                fill:'#ffffff'
                            }
                        }}
                    />
                    <Axis
                        name="trend"
                        label={{
                            formatter: val => `${val}`,
                            textStyle:{
                                fill:'#ffffff'
                            }
                        }}
                    />
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom
                        type="line"
                        position="month*trend"
                        size={2}
                        color={"type"}
                        shape={"smooth"}
                    />
                    <Geom
                        type="point"
                        position="month*trend"
                        size={4}
                        shape={"circle"}
                        color={"type"}
                        style={{
                            stroke: "#fff",
                            lineWidth: 1
                        }}
                    />
                </Chart>
            </div>
        );
    }
}
