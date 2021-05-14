/**
 * Created by jkwu on 2019-05-29.
 */
import React, { Component } from 'react';
import { Charts } from '../../../../../src/components/index';
const {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape,Facet,Util } = Charts;
import DataSet from "@antv/data-set";

const scale = {
  latitude: {
    sync: true,
    nice: false,
  },
  longitude: {
    sync: true,
    nice: false,
  },
};

export default class ContractBrand extends Component {
  render() {
    const data = [
      {
        item: "林肯",
        count: 40
      },
      {
        item: "事例二",
        count: 21
      },
      {
        item: "凯迪拉克",
        count: 17
      },
      {
        item: "事例四",
        count: 13
      },
      {
        item: "事例五",
        count: 9
      }
    ];
    const { DataView } = DataSet;
    const { Html } = Guide;
    const dv = new DataView();
    dv.source(data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });

    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };

    return (
      <Chart
        height={230}
        data={dv}
        scale={cols}
        padding={[30, 0, 30, 70]}
        forceFit
      >
        <Coord
          type={"theta"}
          radius={0.7}
          innerRadius={0.5}
        />
        <Axis name="percent" />
        <Legend
          position="left"
          marker="square"
          offsetY={-33}
          offsetX={0}
        />
        <Tooltip
          showTitle={false}
          itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
        />
        <Geom
          type="intervalStack"
          position="percent"
          color="item"
          tooltip={[
            "item*percent",
            (item, percent) => {
              percent = percent * 100 + "%";
              return {
                name: item,
                value: percent
              };
            }
          ]}
          style={{
            lineWidth: 1,
            stroke: "#fff",
          }}
        >
          <Label
            content="count"
            offset={-7}
            labelLine={false}
            position="middle"
          />
        </Geom>
      </Chart>
    );
  }
}
