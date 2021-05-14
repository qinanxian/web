/**
 * Created by jkwu on 2019-05-29.
 */
import React, { Component } from 'react';
import { Charts } from '../../../../../src/components/index';
const {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape,Facet,Util } = Charts;
import DataSet from "@antv/data-set";
import GeoData from './geoData';

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

export default class BizDashboard extends Component {
  _showTooltip = () => {
    console.log(this.g2Chart);
    console.log(this.g2Chart.getAllGeoms());
    // 山西省
    // "cp": [
    //   112.4121,
    //   37.6611
    // ],
    const point = {
      x: 85,
      y: 41,
      // x: 122.0438 * 2,
      // y: 41.0889 * 2
    };
    console.log(this.g2Chart.getTooltipItems(point));
    console.log('userDv', this.userDv);
    console.log('userData', this.userData);
    console.log('geoDv', this.geoDv);
    console.log('GeoData', this.GeoData);
    this.g2Chart.showTooltip(point);
  };

  render() {
    function addPoint(collection, point) {
      const count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      for (let i = 0; i < count; i++) {
        collection.push(point);
      }
    }

    function getCount(x, y, medianX, medianY) {
      const distance = Math.pow(x - medianX, 2) + Math.pow(y - medianY, 2);
      if (distance < 4) {
        return 3;
      } else if (distance < 16) {
        return 3;
      } else if (distance < 64) {
        return 2;
      }
      return 1;
    }

    const data = GeoData;
    const geoDv = new DataSet.View().source(data, {
      type: 'GeoJSON',
    });
    const ranges = {
      lat: geoDv.range('latitude'),
      lon: geoDv.range('longitude'),
    };
    const medians = {
      lat: geoDv.median('latitude'),
      lon: geoDv.median('longitude'),
    };

// console.log(ranges, medians);
    const userData = [];
    for (let lon = ranges.lon[0]; lon <= ranges.lon[1]; lon += 0.5) {
      for (let lat = ranges.lat[0]; lat <= ranges.lat[1]; lat += 0.5) {
        if (geoDv.geoContains(data, [lon, lat])) {
          addPoint(userData, {
            latitude: lat,
            longitude: lon,
          }, getCount(lon, lat, medians.lon, medians.lat));
        }
      }
    }
//     console.log(userData);
//     const userDv = new DataSet.View().source(userData).transform({
//       // sizeByCount: true,
//       type: 'geo',
//       fields: ['longitude', 'latitude'],
//       as: ['longitude', 'latitude', 'count'],
//     });
//     this.userDv = userDv;//
//     const geoProjection = new DataSet.View().source(userData).transform({
//       type: 'geo.centroid',
//       field: 'name',                        // 标注地名的字段
//       geoDataView: geoDv,             // 使用的geo数据来源，可以是DataView实例，也可以是DataView实例的name
//       as: [ '_centroid_x', '_centroid_y' ], // _centroid_x是中心点的x坐标
//                                             // _centroid_y是中心点y坐标
//     });
//
//     console.log('geoProjection', geoProjection);
    this.userData = userData;
    this.geoDv = geoDv;
    this.GeoData = GeoData;
    return (
      <Chart
        onGetG2Instance={g2Chart => this.g2Chart = g2Chart}
        height={500}
        scale={scale}
        forceFit
        padding={0}
        background={{
          // fill: '#ffffff', // 图表背景色
          fillOpacity: 0, // 图表背景透明度
        }}
      >
        <Tooltip title={null} />
        {/* // geo view */}
        <View data={geoDv}>
          <Geom
            type="polygon"
            position="longitude*latitude"
            opacity={0.4}
            active
            color={["name", ["#14647D", '#AE92DB', '#FF0000', '#0000FF']]}
            tooltip={['name*longitude*latitude', (name, longitude, latitude) => {
              return {
                //自定义 tooltip 上显示的 title 显示内容等。
                name: '省份',
                title: name,
                value: name
              };
            }]}
          >
            {/*<Label*/}
            {/*content="name"*/}
            {/*offset={0}*/}
            {/*textStyle={{*/}
            {/*fill: "#545454",*/}
            {/*fontSize: 9*/}
            {/*}}*/}
            {/*/>*/}
            <Label
              content="name"
              offset={0}
              textStyle={{
                fill: "#4681d7",
                fontSize: 10
              }}
            />
          </Geom>
        </View>
        {/* // user view */}
        {/*<View data={userDv}>*/}
        {/*<Geom*/}
        {/*type="polygon"*/}
        {/*position="longitude*latitude"*/}
        {/*color={['count', '#0f0-#f00-#00f']}*/}
        {/*size={window.innerHeight / 20}*/}
        {/*style={{*/}
        {/*lineWidth: 10,*/}
        {/*stroke: 'red',*/}
        {/*}}*/}
        {/*/>*/}
        {/*</View>*/}
      </Chart>
    );
  }
}
