import React from "react";
import {Row, Col, Tabs, Collapse,Charts, propsCompose} from '../../../../src/components';
const { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } = Charts;

@propsCompose
export default class StackChart extends React.Component {

    constructor(props) {
        super(props);
        this.flag=true;
        this.state = {
          memory:[0,0,0,0,0,0,0],
          thread_max:[0,0,0,0,0,0,0],
          thread_daemon:[0,0,0,0,0,0,0],
          thread_start:[0,0,0,0,0,0,0],
          thread_now:[0,0,0,0,0,0,0],
          data: [
            {attribute: '内存使用量', time: '70', value: 0},
            {attribute: '内存使用量', time: '60', value: 0},
            {attribute: '内存使用量', time: '50', value: 0},
            {attribute: '内存使用量', time: '40', value: 0},
            {attribute: '内存使用量', time: '30', value: 0},
            {attribute: '内存使用量', time: '20', value: 0},
            {attribute: '内存使用量', time: '10', value: 0},

            {attribute: '线程峰值', time: '70', value: 0},
            {attribute: '线程峰值', time: '60', value: 0},
            {attribute: '线程峰值', time: '50', value: 0},
            {attribute: '线程峰值', time: '40', value: 0},
            {attribute: '线程峰值', time: '30', value: 0},
            {attribute: '线程峰值', time: '20', value: 0},
            {attribute: '线程峰值', time: '10', value: 0},

            {attribute: '守护线程数', time: '70', value: 0},
            {attribute: '守护线程数', time: '60', value: 0},
            {attribute: '守护线程数', time: '50', value: 0},
            {attribute: '守护线程数', time: '40', value: 0},
            {attribute: '守护线程数', time: '30', value: 0},
            {attribute: '守护线程数', time: '20', value: 0},
            {attribute: '守护线程数', time: '10', value: 0},

            {attribute: '总共启动线程数', time: '70', value: 0},
            {attribute: '总共启动线程数', time: '60', value: 0},
            {attribute: '总共启动线程数', time: '50', value: 0},
            {attribute: '总共启动线程数', time: '40', value: 0},
            {attribute: '总共启动线程数', time: '30', value: 0},
            {attribute: '总共启动线程数', time: '20', value: 0},
            {attribute: '总共启动线程数', time: '10', value: 0},

            {attribute: '当前线程数', time: '70', value: 0},
            {attribute: '当前线程数', time: '60', value: 0},
            {attribute: '当前线程数', time: '50', value: 0},
            {attribute: '当前线程数', time: '40', value: 0},
            {attribute: '当前线程数', time: '30', value: 0},
            {attribute: '当前线程数', time: '20', value: 0},
            {attribute: '当前线程数', time: '10', value: 0},
          ],
          cols: {
            time: {
                type: 'linear',
                tickInterval: 10
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

    getData = () => {
      if(this.flag==true){
        const {rest} = this.props;
        rest.get('/metrics').then((data)=>{
          const mem = Number((data.mem - data['mem.free'])/1024).toFixed(2);
          this.state.memory.shift();
          this.state.memory.push(mem);
          this.state.thread_max.shift();
          this.state.thread_max.push(data['threads.peak']);
          this.state.thread_daemon.shift();
          this.state.thread_daemon.push(data['threads.daemon']);
          this.state.thread_start.shift();
          this.state.thread_start.push(data['threads.totalStarted']);
          this.state.thread_now.shift();
          this.state.thread_now.push(data.threads);
          this.dataProcess();
        });
        this.setState({ data: this.state.data }, () => {
        setTimeout(()=>{
          this.getData();
        },5000);
        });
      }
    }

    dataProcess =()=>{
      for(let i = 0;i < 7;i++){
        //内存取值有问题
        // this.state.data[i].value = this.state.memory[i];
        this.state.data[i+7].value = this.state.thread_max[i];
        this.state.data[i+2*7].value = this.state.thread_daemon[i];
        this.state.data[i+3*7].value = this.state.thread_now[i];
        this.state.data[i+4*7].value = this.state.thread_now[i];
      }
    }

    render() {
        return(
        <Chart height={400} data={this.state.data} scale={this.state.cols} forceFit>  
          <Axis name="time" />
          <Axis name="value" />
          <Legend />
          <Tooltip crosshairs={{type:'line'}}/>
          <Geom type="area" position="time*value" color='attribute' />
          <Geom type="line" position="time*value" size={2} color='attribute' />
        </Chart>
        );
    }
}