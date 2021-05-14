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

export default class HisSuspensionAndTrendAnalysis extends React.Component {

    render() {
        const data2 = [{     "time": "2017/01/03",     "stopCount": 14,     "rate": 1.2 }, {     "time": "2017/01/04",     "stopCount": 14,     "rate": 1.2 }, {     "time": "2017/01/05",     "stopCount": 15,     "rate": 1.3 }, {     "time": "2017/01/06",     "stopCount": 16,     "rate": 1.4 }, {     "time": "2017/01/07",     "stopCount": 12,     "rate": 1.0 }, {     "time": "2017/01/08",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/09",     "stopCount": 12,     "rate": 1.0 }, {     "time": "2017/01/10",     "stopCount": 13,     "rate": 1.1 }, {     "time": "2017/01/11",     "stopCount": 15,     "rate": 1.3 }, {     "time": "2017/01/12",     "stopCount": 18,     "rate": 1.5 }, {     "time": "2017/01/13",     "stopCount": 23,     "rate": 1.8 }, {     "time": "2017/01/14",     "stopCount": 20,     "rate": 1.7 }, {     "time": "2017/01/15",     "stopCount": 15,     "rate": 1.3 }, {     "time": "2017/01/16",     "stopCount": 4,     "rate": 0.2 }, {     "time": "2017/01/17",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/18",     "stopCount": 20,     "rate": 1.7 }, {     "time": "2017/01/19",     "stopCount": 25,     "rate": 2.3 }, {     "time": "2017/01/20",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/21",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/22",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/23",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/24",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/25",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/26",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/27",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/28",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/29",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/30",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/01/31",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/02/01",     "stopCount": 10,     "rate": 0.8 }, {     "time": "2017/02/02",     "stopCount": 10,     "rate": 0.8 }];
        const ds = new DataSet({
            state: {
                start: '2017/01/03',
                end: '2017/02/02'
            }
        });
        const dv = ds.createView('origin').source(data2);
        const scale = {
            time: {
            },
            stopCount: {
                alias: '停牌数量'
            },
            rate: {
                alias: '市值占比'
            },
            sales:{
                min: 0, // 定义数值范围的最小值
                max: 25, // 定义数值范围的最大值
               // ticks: [100, 1000, 2000, 3000], // 用于指定坐标轴上刻度点的文本信息，当用户设置了 ticks 就会按照 ticks 的个数和文本来显示。
                tickInterval: 5, // 用于指定坐标轴各个标度点的间距，是原始数据之间的间距差值，tickCount 和 tickInterval 不可以同时声明。
            }
        };
        let chart;
        return (
            <div>
                <Chart
                    height={400}
                    data={dv}
                    padding={[40, 40, 40, 80]}
                    scale={scale}
                    onGetG2Instance={g2Chart => {
                        g2Chart.animate(false);
                        chart = g2Chart;
                    }}
                    forceFit
                >
                    <Axis name="stopCount" grid={null} />
                    <Axis name="rate" title />
                    <Tooltip />
                    <Legend
                        custom
                        position="top"
                        items={[
                            { value: '停牌数量', marker: { symbol: 'circle', fill: '#5ff8ff', radius: 5 } },
                            { value: '市值占比', marker: { symbol: 'circle', fill: '#ff6934', radius: 5 } },
                        ]}
                        onClick={ ev => {
                            const item = ev.item;
                            const value = item.value;
                            const checked = ev.checked;
                            const geoms = chart.getAllGeoms();
                            for (let i = 0; i < geoms.length; i++) {
                                const geom = geoms[i];
                                if (geom.getYScale().field === value) {
                                    if (checked) {
                                        geom.show();
                                    } else {
                                        geom.hide();
                                    }
                                }
                            }
                        }}
                    />
                    <Geom type="line" position="time*stopCount" color="#5ff8ff" opacity={0.85} />
                    <Geom type="area" position="time*rate" color="#ff6934" opacity={0.85} />
                </Chart>
            </div>
        );
    }
}