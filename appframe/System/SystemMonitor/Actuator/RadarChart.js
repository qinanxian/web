import React from "react";
import DataSet from "./util/DataSet";
import {Row, Col, Tabs, Collapse,Charts, propsCompose} from '../../../../src/components';
const { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape} = Charts;
const { DataView } = DataSet;

@propsCompose
export default class RadarChart extends React.Component {

    constructor(props) {
        super(props);
        this.flag = true;
        this.state = {
            disk:[0,0,0],
            memory:[0,0,0],
            heap:[0,0,0],
            nonheap:[0,0,0],
            thread:[0,0,0],
            data: [
                { item: '磁盘占用比', a: 0, b: 0,c:0},
                { item: '内存占用比', a: 0, b: 0,c:0 },
                { item: '堆内存占用比', a: 0, b: 0,c:0 },
                { item: '非堆内存占用比', a: 0, b: 0,c:0 },
                { item: '线程比', a: 0, b: 0,c:0 }
              ],
            cols: {
                score: {
                    min: 0,
                    max: 100
                  }
              },
            dv:null
          }
    }

    dataProcess = () =>{
        this.state.dv = new DataView().source(this.state.data);
        this.state.dv.transform({
            type: 'fold',
            fields: [ 'a', 'b','c'], // 展开字段集
            key: 'user', // key字段
            value: 'score', // value字段
          }); 
    }

    getData = () =>{
      if(this.flag){
        const {rest} = this.props;
        rest.get('/metrics').then((data)=>{
          //内存占用比
          const mem = Number((data.mem - data['mem.free'])/data.mem*100).toFixed(2);
          this.state.memory.shift();
          this.state.memory.push(mem);
          this.state.data[1].a=this.state.memory[0];
          this.state.data[1].b=this.state.memory[1];
          this.state.data[1].c=this.state.memory[2];
          //堆内存占用比
          const heap = Number(data['heap.used']/data.heap*100).toFixed(2);
          this.state.heap.shift();
          this.state.heap.push(heap);
          this.state.data[2].a=this.state.heap[0];
          this.state.data[2].b=this.state.heap[1];
          this.state.data[2].c=this.state.heap[2];
          //非堆内存占用比
          if(!data.nonheap || data.nonheap==0){
            console.log('未设置总非堆内存大小');
            console.log('当前非堆内存使用量:');
            const nonheapInuse = Number(data['nonheap.used']/1024).toFixed(2);
            console.log(nonheapInuse+'MB');
          }else{
            const nonheap = data['noheap.used']/data.nonheap;
            this.state.nonheap.shift();
            this.state.nonheap.push(nonheap);
            this.state.data[3].a=this.state.nonheap[0];
            this.state.data[3].b=this.state.nonheap[1];
            this.state.data[3].c=this.state.nonheap[2];
          }
          //线程占用比
          const thread = Number(data.threads/data['threads.totalStarted']*100).toFixed(2);
          this.state.thread.shift();
          this.state.thread.push(thread);
          this.state.data[4].a=this.state.thread[0];
          this.state.data[4].b=this.state.thread[1];
          this.state.data[4].c=this.state.thread[2];
        });
        rest.get('/health').then((data)=>{
          const value = Number(((data.diskSpace.total-data.diskSpace.free)/data.diskSpace.total*100).toFixed(2));
          this.state.disk.shift();
          this.state.disk.push(value * 10);
          this.state.data[0].a=this.state.disk[0];
          this.state.data[0].b=this.state.disk[1];
          this.state.data[0].c=this.state.disk[2];
        });
        this.setState({ data: this.state.data });
        setTimeout(()=>{
          this.getData();
        },5000);
      }
    }

    componentWillUnmount(){
      this.flag=false;
    }

    componentDidMount() {
      this.getData();
    }

    render() {
        this.dataProcess();
        return (
            <Chart height={400} data={this.state.dv} padding={[20, 20, 95, 20 ]} scale={this.state.cols} forceFit>
            <Coord type="polar" radius={0.8} />
            <Axis name="item" line={null} tickLine={null} grid={{lineStyle: {
                lineDash: null
              },
              hideFirstLine: false}} />
            <Tooltip />
            <Axis name="score" line={null} tickLine={null} grid={{type: 'polygon',
              lineStyle: {
                lineDash: null
              },
              alternateColor: 'rgba(0, 0, 0, 0.04)'}} />
            <Legend name="user" marker="circle" offset={30}/>
            <Geom type='line' position="item*score" color="user" size={2}/>
            <Geom type='point' position="item*score" color="user" shape="circle" size={4} style={{stroke: '#fff',
            lineWidth: 1,
            fillOpacity: 1}} />
          </Chart>
        )
    }
}