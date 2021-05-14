/**
 * Created by jkwu on 2019-05-29.
 */
import React, { Component } from 'react';
import { Charts } from '../../../../../src/components/index';
const {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape,Facet,Util } = Charts;
import DataSet from "@antv/data-set";
export default class TrendRent extends Component {
    render() {
        const data = [
            {
                name: "London",
                "Jan.": 18.9,
                "Feb.": 28.8,
                "Mar.": 39.3,
                "Apr.": 81.4,
                May: 47,
                "Jun.": 20.3,
                "Jul.": 24,
                "Aug.": 35.6
            },
            {
                name: "Berlin",
                "Jan.": 12.4,
                "Feb.": 23.2,
                "Mar.": 34.5,
                "Apr.": 99.7,
                May: 52.6,
                "Jun.": 35.5,
                "Jul.": 37.4,
                "Aug.": 42.4
            }
        ];
        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
            type: "fold",
            fields: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug."],
            // 展开字段集
            key: "月份",
            // key字段
            value: "月均降雨量" // value字段
        });
        return (
            <div>
                <Chart height={130} data={dv} forceFit padding={[40,40,40,40]}>
                    <Axis name="月份" />
                    <Axis name="月均降雨量" />
                    <Legend position="top" offsetY={15} layout="horizontal"/>
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom
                        type="interval"
                        position="月份*月均降雨量"
                        color={"name"}
                        size={2}
                        adjust={[
                            {
                                type: "dodge",
                                marginRatio: 1/5
                            }
                        ]}
                    />
                </Chart>
            </div>
        );
    }
}
