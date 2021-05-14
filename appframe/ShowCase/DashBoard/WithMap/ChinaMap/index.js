/**
 * Created by jkwu on 2019-05-29.
 */
import React, { Component } from 'react';
import numeral from 'numeral';
import { Charts } from '../../../../../src/components/index';
const {Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape,Facet,Util } = Charts;
import DataSet from "@antv/data-set";
import GeoData from './geoData';

const scale = {
    latitude: {
        sync: true,
        nice: false,
        min: 7.320122,
        max: 53.563269,
    },
    longitude: {
        sync: true,
        nice: false,
        min: 73.502355,
        max: 135.09567
    },
    centroidX: {
        sync: true,
        nice: false,
        min: 73.502355,
        max: 135.09567
    },
    centroidY: {
        sync: true,
        nice: false,
        min: 7.320122,
        max: 53.563269,
    },
    value:{
        formatter: val => numeral(val || 0).format('0.0%')
    }
};

const constructGeoJSON = (features) => {
    if (!features) return false;
    if (Array.isArray(features)) {
        return {
            type: 'FeatureCollection',
            features: [...features],
        };
    }
    return features;
};

export default class ChinaMap extends Component {
    constructor(props){
        super(props);
        this.num = 1;
        this.timer = null;
        this.state = {
            finalData:null,
            setHeight:props.mapHeight
        };
    }
    componentDidMount() {
        this.setState({
            finalData:this.processGeoData(GeoData)
        },() => {
            this.timer = setInterval(() => {
                this.g2Charts.showTooltip(this.g2Charts.getXY(this.state.finalData.origin[this.num]));
                this.num > 16 ? this.num = 0 : this.num = this.num + 1;
            },3000);
        });
    }
    componentWillReceiveProps(nextProps){
        if (this.state.setHeight !== nextProps.mapHeight) {
            this.setState({
                setHeight:nextProps.mapHeight
            });
        }
    }
    componentWillUnmount(){
        this.timer && clearInterval(this.timer);
    }
    processGeoData = (geoData) => {
        const formattedFeas = geoData && geoData.features.map(v => {
            return {...v, label: v.properties.name, value: Math.ceil(Math.random() * 25)}
        });
        const geoDv = new DataSet.View().source(constructGeoJSON(formattedFeas), {
            type: 'GeoJSON',
        });
        return geoDv;
    };
    handleTooltipChange = (ev) => {
        ev.items.push({
            title:'上汽通用',
            name:'对象属性名1',
            marker:true,
            value:'自定义省份1'
        });
        ev.items.push({
            title:'上汽通用',
            name:'对象属性名1',
            marker:true,
            value:'自定义省份2'
        });
        ev.items.shift();
    };
  render() {
      const { finalData, setHeight } = this.state;
      if(!finalData) {
          return '数据加载中...'
      }
    return (
      <Chart
        onGetG2Instance={instance => this.g2Charts = instance}
        height={setHeight}
        width={setHeight}
        data={finalData}
        scale={scale}
        padding={[74,0,0,10]}
        className="cust-map-style"
        background={{
          // fill: '#ffffff', // 图表背景色
          fillOpacity: 0, // 图表背景透明度
        }}
        onTooltipChange={this.handleTooltipChange}
      >
          <Geom
              type="polygon"
              position="longitude*latitude"
              active
              // color={["name", ["#2163EB", '#4821D7', '#D5024F', '#61d3f8','#345234']]}
              color={['value', ['#d6deff', '#d5024f']]}
          >
              <Geom
                  type="point"
                  opacity={0}
                  size={0}
                  position="centroidX*centroidY"
                  tooltip={["label*properties", (label, value) => {
                      return {
                          name: "省份",
                          value: JSON.stringify(value),
                      }}
                  ]}
              />
              <Legend
                  layout="vertical"
                  width={10}
                  height={100}
                  offsetY={-360}
                  offsetX={-360}
              />
          </Geom>
        <Tooltip
            position="top"
            triggerOn="none"
        />
      </Chart>
    );
  }
}
