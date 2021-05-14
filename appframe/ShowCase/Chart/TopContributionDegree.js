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

export default class TopContributionDegree extends React.Component {

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
            }
        };
        const data = [{
            "name": "家用电器",
            "capitalOccupancyRate": 3.28,
            "rateOfReturn": 84.33,
            "contributionDegree": 1.731
        }, {
            "name": "电子",
            "capitalOccupancyRate": 3.56,
            "rateOfReturn": 68.00,
            "contributionDegree": 1.447
        }, {
            "name": "建筑材料",
            "capitalOccupancyRate": 0.96,
            "rateOfReturn": 140.18,
            "contributionDegree": 0.734
        }];
        return (
            <div>
                <Chart height={400} data={data} scale={cols} forceFit>
                    <Tooltip showTitle={false} />
                    <Axis name='capitalOccupancyRate' title='true'/>
                    <Axis name='rateOfReturn'  title='true'/>
                    <Geom type='point' position="capitalOccupancyRate*rateOfReturn" color='#d9af9d'//
                          tooltip='name*capitalOccupancyRate*rateOfReturn*contributionDegree' opacity={0.65} shape="circle" size={['contributionDegree', [ 4, 65 ]]} style={['continent', {
                        stroke: '#ff9fe6'
                    }]}/>
                </Chart>
            </div>
        );
    }
}