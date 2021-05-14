/**
 * Created by luyu on 2018/12/28.
 */
import React from "react";
import {Charts} from 'roface';
const {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape,Facet,Util } = Charts;
import DataSet from "@antv/data-set";

export default class SubfundAllocationChart extends React.Component {

    render() {
        const { DataView } = DataSet;
        const data = [
            { name: '鑫福1号', amount: 49624.28 },
            { name: '鑫福7号', amount: 19823.04 },
            { name: '鑫福6号', amount: 16936.14 },
            { name: '鑫福8号', amount: 16609.73 },
            { name: '鑫福4号', amount: 15228.62 },
            { name: '鑫福2号', amount: 15086.66 },
            { name: '鑫福3号', amount: 11557.20 },
            { name: '鑫福5号', amount: 5447.00 },
            { name: '其他', amount: 0 },
        ];
        const dv = new DataView();
        dv.source(data).transform({
            type: 'percent',
            field: 'amount',
            dimension: 'name',
            as: 'percent'
        });
        const cols = {
            percent: {
                formatter: val => {
                    if (val === 0) return;
                    val = (val*100).toFixed(2);
                    return val;
                }
            }
        }
        return (
            <div>
                <Chart height={400} data={dv} scale={cols} padding={[ 80, 100, 80, 80 ]} forceFit>
                    <Coord type='theta' radius={0.75} />
                    <Axis name="percent" />
                    <Legend position='top'  />
                    <Tooltip
                        showTitle={false}
                        nameTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                    />
                    <Geom
                        type="intervalStack"
                        position="percent"
                        color='name'
                        tooltip={['name*percent',(name, percent) => {
                            percent = (percent * 100).toFixed(2) + '%';
                            return {
                                name: name,
                                value: percent
                            };
                        }]}
                        style={{lineWidth: 1,stroke: '#fff'}}
                    >
                        <Label content='percent' offset={-40} textStyle={{
                            rotate: 0,
                            textAlign: 'center',
                            shadowBlur: 2,
                            shadowColor: 'rgba(0, 0, 0, .45)'
                        }} />
                    </Geom>
                </Chart>
            </div>
        );
    }
}