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
/*const colorMap = {
    'Asia': G2.Global.colors[0],
    'Americas': G2.Global.colors[1],
    'Europe': G2.Global.colors[2],
    'Oceania': G2.Global.colors[3]
};*/

export default class LastContributionDegree extends React.Component {

    render() {


        const cols={
            name: {
                alias: '名称'
            },
            capitalOccupancyRate: {
                alias: '资金占用率（%）'
            },
            rateOfReturn: {
                alias: '收益率（%）'
            },
            contributionDegree: {
                type: 'pow',
                alias: '贡献度（%）'
            },

        }
        const data = [{
            "name": "汽车",
            "capitalOccupancyRate": 2.53,
            "rateOfReturn": 37.32,
            "contributionDegree": 0.52
        }, {
            "name": "电气设备",
            "capitalOccupancyRate": 1.65,
            "rateOfReturn": 29.28,
            "contributionDegree": 0.423
        }, {
            "name": "食品饮料",
            "capitalOccupancyRate": 2.65,
            "rateOfReturn": 13.54,
            "contributionDegree": 0.41
        }];
        return (
            <div>
                <Chart height={400} data={data} scale={cols} forceFit>
                    <Tooltip showTitle={false} />
                    <Axis name='capitalOccupancyRate' title='true'/>
                    <Axis name='rateOfReturn'  title='true'/>
                    <Geom type='point' position="capitalOccupancyRate*rateOfReturn" color='#0a232f'//
                          tooltip='name*capitalOccupancyRate*rateOfReturn*contributionDegree' opacity={0.65} shape="circle" size={['contributionDegree', [ 4, 20 ]]} style={['continent', {
                        stroke: '#0a232f'
                    }]}/>
                </Chart>
            </div>
        );
    }
}