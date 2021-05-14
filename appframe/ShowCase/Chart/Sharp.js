/**
 * Created by luyu on 2018/12/28.
 */
import React from "react";
import {Charts} from 'roface';
const {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape,Facet,Util } = Charts;
import DataSet from "@antv/data-set";

export default class Sharp extends React.Component {

    render() {
        const data = [
            { name:'上证综指',  '今年以来' :0.7, '投资至今': 0 },
            { name:'沪深300',  '今年以来' :1.6, '投资至今': 0 },
            { name:'中证500',  '今年以来' :-0.1, '投资至今': 0 },
            { name:'创业板指',  '今年以来' :-1.2, '投资至今': 0 }
        ];
        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
            type: 'fold',
            fields: [ '今年以来','投资至今'], // 展开字段集
            key: '时间', // key字段
            value: 'sharp', // value字段
        });
        return (
            <div>
                <Chart height={300} data={dv} forceFit>
                    <Axis name="时间" />
                    <Axis name="sharp" />
                    <Legend position='top'/>
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom
                        type="interval"
                        position="时间*sharp"
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
