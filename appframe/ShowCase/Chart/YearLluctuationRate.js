/**
 * Created by luyu on 2018/12/28.
 */
/**
 * Created by luyu on 2018/12/28.
 */
import React from "react";
import {Charts} from 'roface';
const {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape,Facet,Util } = Charts;
import DataSet from "@antv/data-set";

export default class YearLluctuationRate extends React.Component {

    render() {
        const data = [
            { name:'上证综指', '近一个月': 10.43, '近三个月': 9.04, '今年以来' :8.74, '投资至今': 0 },
            { name:'沪深300', '近一个月': 8.57, '近三个月': 8.40, '今年以来' :8.18, '投资至今': 0 },
            { name:'中证500', '近一个月': 16.07, '近三个月': 12.22, '今年以来' :13.05, '投资至今': 0 },
            { name:'创业板指', '近一个月': 15.86, '近三个月': 12.02, '今年以来' :15.30, '投资至今': 0 }
        ];
        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
            type: 'fold',
            fields: [ '近一个月','近三个月','今年以来','投资至今'], // 展开字段集
            key: '时间', // key字段
            value: '年华波动率', // value字段
        });
        return (
            <div>
                <Chart height={300} data={dv} forceFit>
                    <Axis name="时间" />
                    <Axis name="年华波动率" />
                    <Legend position='top'/>
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom
                        type="interval"
                        position="时间*年华波动率"
                        color={['name', (cut)=>{
                            //some code
                            if(cut === '上证综指') {
                                return '#5ff8ff';
                            } else if (cut === '沪深300') {
                                return '#ffda33';
                            } else if (cut === '中证500') {
                                return '#ff6934';
                            } else {
                                return '#9c5eff';
                            }
                        }]}
                        adjust={[
                            {
                                type: "dodge",
                                marginRatio: 1 / 32
                            }
                        ]}
                    />
                </Chart>
            </div>
        );
    }
}