import React from "react";
import DataSet from "./util/DataSet";
import {Row, Col, Tabs, Collapse,Charts, propsCompose} from '../../../../src/components';
const { Chart, Axis, Geom, Tooltip, Legend} = Charts;
const { DataView } = DataSet;

@propsCompose
export default class NonHeapGroupChart extends React.Component {

    constructor(props) {
        super(props);
        this.flag=true;
        this.state = {
            count_arr1:[0,0,0,0,0],
            count_arr2:[0,0,0,0,0],
            time_arr1:[0,0,0,0,0],
            time_arr2:[0,0,0,0,0],
            data: [
                { name:'nonheap.committed', t1: 0, t2: 0, t3 :0, t4: 0, t5: 0 },
                { name:'nonheap.init', t1: 0, t2: 0, t3:0, t4: 0, t5: 0},
                { name:'nonheap.used', t1: 0, t2: 0, t3:0, t4: 0, t5: 0},
                { name:'nonheap', t1: 0, t2: 0, t3:0, t4: 0, t5: 0}
              ],
            dv:null
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
            rest.get('/metrics').then((data)=>{
                this.state.count_arr1.pop();
                this.state.count_arr1.unshift(data['nonheap.committed']);
                this.state.count_arr2.pop();
                this.state.count_arr2.unshift(data['nonheap.init']);
                this.state.time_arr1.pop();
                this.state.time_arr1.unshift(data['nonheap.used']);
                this.state.time_arr2.pop();
                this.state.time_arr2.unshift(data['nonheap']);
                this.dataProcess();
            });
            this.setState({ data: this.state.data });
            setTimeout(()=>{
                this.getData();
            },5000);
        }
    }

    dataProcess = () =>{
        this.state.data[0].t1=this.state.count_arr1[0];
        this.state.data[0].t2=this.state.count_arr1[1];
        this.state.data[0].t3=this.state.count_arr1[2];
        this.state.data[0].t4=this.state.count_arr1[3];
        this.state.data[0].t5=this.state.count_arr1[4];

        this.state.data[1].t1=this.state.count_arr2[0];
        this.state.data[1].t2=this.state.count_arr2[1];
        this.state.data[1].t3=this.state.count_arr2[2];
        this.state.data[1].t4=this.state.count_arr2[3];
        this.state.data[1].t5=this.state.count_arr2[4];

        this.state.data[2].t1=this.state.time_arr1[0];
        this.state.data[2].t2=this.state.time_arr1[1];
        this.state.data[2].t3=this.state.time_arr1[2];
        this.state.data[2].t4=this.state.time_arr1[3];
        this.state.data[2].t5=this.state.time_arr1[4];
        
        this.state.data[3].t1=this.state.time_arr2[0];
        this.state.data[3].t2=this.state.time_arr2[1];
        this.state.data[3].t3=this.state.time_arr2[2];
        this.state.data[3].t4=this.state.time_arr2[3];
        this.state.data[3].t5=this.state.time_arr2[4];
    }

    chartProcess = () =>{
        this.state.dv = new DataView().source(this.state.data);
        this.state.dv.transform({
            type: 'fold',
            fields: [ 't1','t2','t3','t4','t5'], // 展开字段集
            key: 'time', // key字段
            value: 'count', // value字段
          }); 
    }

    render() {
        this.chartProcess();
        return (
        <Chart height={400} data={this.state.dv} forceFit>
            <Axis name="time" />
            <Axis name="count" />
            <Legend />
            <Tooltip crosshairs={{type : "y"}}/>
            <Geom type='interval' position="time*count" color={'name'} adjust={[{type: 'dodge',marginRatio: 1/32}]} />
        </Chart>
        )
    }
}