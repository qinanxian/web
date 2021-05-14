import React, { Component } from 'react';
import { Charts } from '../../../../../src/components/index';
const {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape,Facet,Util } = Charts;
import DataSet from "@antv/data-set";

export default class CRHistogram extends Component{
    constructor(props){
        super(props);
        this.state = {
            setHeight:props.mapHeight
        };
    }
    componentWillReceiveProps(nextProps){
        if (this.state.setHeight !== nextProps.mapHeight) {
            this.setState({
                setHeight:nextProps.mapHeight
            });
        }
    }
    render(){
        const data = [
            {
                label: "毕节市良驹悦池汽车销售服务有限公司",
                series1: 8,
                series2: 6
            },
            {
                label: "Tuesday",
                series1: 8,
                series2: 3
            },
            {
                label: "Wednesday",
                series1: 9,
                series2: 9
            },
            {
                label: "Thursday",
                series1: 5,
                series2: 3
            },
            {
                label: "Friday",
                series1: 7,
                series2: 10
            }
        ];
        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
            type: "fold",
            fields: ["series1", "series2"],
            // 展开字段集
            key: "type",
            // key字段
            value: "value"
        });
        return (
            <Chart
                height={this.state.setHeight - 180}
                width={this.state.setHeight / 3}
                data={dv}
                padding={[100,30,20,120]}
            >
                <Legend
                    position="top"
                    marker="square"
                    offsetY={60}
                    offsetX={30}
                />
                <Coord reflect={["x"]} transpose scale={[1, -1]} />
                <Axis
                    name="label"
                    label={{
                        offset: 12,
                        htmlTemplate(text, item, index) {
                            return `<span style="position:absolute;white-space: nowrap;left: -355px;top:-13px">${text}</span>`;
                        }
                    }}
                    position={"bottom"}
                />
                <Axis
                    name="value"
                    position={"right"}
                    visible={false}
                />
                <Tooltip />
                <Geom
                    type="interval"
                    position="label*value"
                    color={"type"}
                    size={10}
                    adjust={[
                        {
                            type: "dodge",
                            marginRatio: 1/5
                        }
                    ]}
                />
            </Chart>
        )
    }
}
