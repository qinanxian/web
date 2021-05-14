import React, { Component } from 'react';
import { Charts } from '../../../../../src/components/index';
const {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape,Facet,Util } = Charts;
import DataSet from "@antv/data-set";

export default class KPIHistogram extends Component{
    render() {
        const data = [
            {
                country: "Europe",
                year: "1750",
                value: 163
            },
            {
                country: "Asia",
                year: "1750",
                value: 502
            }
        ];
        const ds = new DataSet();
        const dv = ds
            .createView()
            .source(data)
            .transform({
                type: "percent",
                field: "value",
                // 统计销量
                dimension: "country",
                // 每年的占比
                groupBy: ["year"],
                // 以不同产品类别为分组
                as: "percent"
            });
        const cols = {
            percent: {
                min: 0,

                formatter(val) {
                    return (val * 100).toFixed(2) + "%";
                }
            }
        };
        return (
            <div className='kpi-cta'>
                <span className='kpi-cta-arrow'/>
                <Chart height={790} data={dv} scale={cols} forceFit padding={[120,60,10,10]}>
                    <Axis name="year" />
                    <Axis
                        name="percent"
                        position="right"
                        label={{
                            offset:1
                        }}
                    />
                    <Tooltip />
                    <Geom
                        type="intervalStack"
                        position="year*percent"
                        color={["country",["red","blue"]]}
                        size={15}
                        shape={[
                            "type",
                            function(val) {
                                if (val === "percent") {
                                    // 顶部圆角
                                    return "bottom";
                                }
                            }
                        ]}
                    />
                </Chart>
            </div>
        );
    }
}
