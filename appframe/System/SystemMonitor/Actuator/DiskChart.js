import React from "react";
import {Row, Col, Tabs, Collapse,Charts, propsCompose} from '../../../../src/components';
const { Chart, Geom, Axis, Tooltip, Legend, Coord,Guide,Shape} = Charts;
const { Arc, Html } = Guide;

@propsCompose
export default class DiskChart extends React.Component {

    constructor(props) {
        super(props);
        this.flag=true;
        this.state = {
          data: [{value: 5.0}],
          cols: {
            'value': {
                min: 0,
                max: 10,
                tickInterval: 1,
                nice: false
              }
            }
        }
    }

    componentDidMount() {
      this.getData();
    }

    componentWillUnmount(){
      this.flag=false;
    }

    getData = () =>{
      if(this.flag){
        const {rest} = this.props;
        rest.get('/health').then((data)=>{
          const value = Number(((data.diskSpace.total-data.diskSpace.free)/data.diskSpace.total*100).toFixed(2));
          this.setState({ data: [{value: value }] }, () => {
            setTimeout(()=>{
             this.getData();
            },30000);
          });
        });
      }
    }


    drawLoader = ()=>{
      Shape.registerShape('point', 'pointer', {
        drawShape(cfg, group) {
          let point = cfg.points[0]; // 获取第一个标记点
          point = this.parsePoint(point);
          const center = this.parsePoint({ // 获取极坐标系下画布中心点
            x: 0,
            y: 0
          });
          // 绘制指针
          group.addShape('line', {
            attrs:  {
              x1: center.x,
              y1: center.y,
              x2: point.x,
              y2: point.y - 20,
              stroke: cfg.color,
              lineWidth: 5,
              lineCap: 'round'
            }
          });
          return group.addShape('circle', {
            attrs: {
              x: center.x,
              y: center.y,
              r: 12,
              stroke: cfg.color,
              lineWidth: 4.5,
              fill: '#fff'
            }
          });
        }
      });
    }

    render() {
      this.drawLoader();
        return (
          <Chart height={400} data={this.state.data} scale={this.state.cols} padding={[ 0, 0, 200, 0 ]} forceFit>
          <Coord type='polar' startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.75} />
          <Axis name='value'
          zIndex={2}
          line={null}
          label={{
            offset: -16,
            textStyle: {
            fontSize: 18,
            fill: 'rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            textBaseline: 'middle'
          }}}
          subTickCount={4}
          subTickLine={{
          length: -8,
          stroke: '#fff',
          strokeOpacity: 1
          }}
          tickLine={{
          length: -18,
          stroke: '#fff',
          strokeOpacity: 1
          }}
          />
          <Axis name="1" visible ={false} />
          <Guide  >
          <Arc zIndex={0} start={[ 0, 0.965 ]} end={[ 9, 0.965 ]}
          style={{ // 底灰色
          stroke: '#000',
          lineWidth: 18,
          opacity: 0.09
          }}/>
          <Arc zIndex={1} start={[ 0, 0.965 ]} end={[ this.state.data[0].value, 0.965 ]}
          style={{ // 底灰色
            stroke: '#1890FF',
            lineWidth: 18,
          }}  />
            <Html position={[ '50%', '95%' ]}
            html={() => {return ('<div style="width: 300px;text-align: center;font-size: 12px!important;"><p style="font-size: 1.25em; color: rgba(0,0,0,0.43);margin: 0;">磁盘空间占用率</p><p style="font-size: 3em;color: rgba(0,0,0,0.85);margin: 0;">'+ this.state.data[0].value * 10+'%</p></div>')}} />
          </Guide>
          <Geom type="point" position="value*1" shape='pointer' color='#1890FF'
          active={false}
          style={{stroke: '#fff',lineWidth: 1}}
          />
        </Chart>
        );
    }
}