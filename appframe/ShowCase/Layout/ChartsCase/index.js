import React from "react";
import {Charts, propsCompose} from '../../../../src/components';
const { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } = Charts;

const data = [
  { genre: 'Sports', sold: 275, income: 2300 },
  { genre: 'Strategy', sold: 115, income: 667 },
  { genre: 'Action', sold: 120, income: 982 },
  { genre: 'Shooter', sold: 350, income: 5271 },
  { genre: 'Other', sold: 150, income: 3710 }
];
const cols = {
  sold: { alias: '销售量' },
  genre: { alias: '游戏种类' }
};
const data1 = [
  { year: "1991", value: 3 },
  { year: "1992", value: 4 },
  { year: "1993", value: 3.5 },
  { year: "1994", value: 5 },
  { year: "1995", value: 4.9 },
  { year: "1996", value: 6 },
  { year: "1997", value: 7 },
  { year: "1998", value: 9 },
  { year: "1999", value: 13 }
];
const cols1 = {
  value: { min: 4 },
  year: {range: [ 0 , 1], formatter:(item) => item + '年' }
};

@propsCompose
export default class StackChart extends React.Component {
  render() {
    return(
      <div>
        <Chart width={600} height={400} data={data} scale={cols}>
          <Axis name="genre" />
          <Axis name="sold" visible={true} />
          <Legend
            position="top"
            dy={-20}
            marker='circle'
            textStyle={{rotate: 30}}
          />
          <Tooltip />
          <Geom type="interval" position="genre*sold" color="genre" />
        </Chart>
        <Chart height={400} data={data1} scale={cols1}  width={600}>
          <Axis name="year" />
          <Axis name="value" />
          <Tooltip crosshairs={{type : "y"}}/>
          <Geom type="line" position="year*value" size={2} />
          <Geom type='point' position="year*value" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1}} />
        </Chart>
      </div>
    );
  }
}