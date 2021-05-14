import React from 'react';
import {Icon, Modal, Spin, Charts} from 'roface';
const { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } = Charts;
import './style/index.less';

const data = [
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
const cols = {
    value: { min: 4 },
    year: {range: [ 0 , 1], formatter:(item) => item + '年' }
};

/* eslint-disable */
class RoPreJectOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false
        };
    }
    componentDidMount(){

    }
    render() {
        const {prefix = 'ro'} = this.props;
        return (
            <div className={`${prefix}-prover`}>
                <Spin spinning={this.state.loading}>
                    <div className={`${prefix}-prover-header`}>折线图</div>
                    <Chart className={`${prefix}-prover-chart`} height={500} data={data} scale={cols}>
                        <Axis name="year" />
                        <Axis name="value" />
                        <Tooltip crosshairs={{type : "y"}}/>
                        <Geom type="line" position="year*value" size={2} />
                        <Geom type='point' position="year*value" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1}} />
                    </Chart>
                </Spin>
            </div>
        );
    }
}

export default RoPreJectOverview;
