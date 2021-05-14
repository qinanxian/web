/**
 * Created by luyu on 2018/12/28.
 */
import React from "react";
import {Charts} from 'roface';
const {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape,Facet,Util } = Charts;
import DataSet from "@antv/data-set";

export default class AssetAllocationChart extends React.Component {

    render() {
        const { DataView } = DataSet;
        const data = [
            { name: '股票', amount: 87851.53 },
            { name: '基金', amount: 14211.26 },
            { name: '债券', amount: 3124.42 },
            { name: '金融衍生品', amount: 0 },
            { name: '买入返售证券', amount: 25294.27 },
            { name: '财富管理产品', amount: 0 },
            { name: '非标', amount: 0 },
            { name: '现金', amount: 22073.79 },
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