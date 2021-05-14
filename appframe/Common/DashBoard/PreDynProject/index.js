import React from 'react';
import {Icon, Modal, Spin, Charts} from 'roface';
const { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } = Charts;
import './style/index.less';

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

/* eslint-disable */
class RoPreDynProject extends React.Component {
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
            <div className={`${prefix}-predynpro`}>
                <Spin spinning={this.state.loading}>
                    <div className={`${prefix}-prover-header`}>柱状图</div>
                    <Chart className={`${prefix}-predynpro-chart`} height={500} data={data} scale={cols}>
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
                </Spin>
            </div>
        );
    }
}

export default RoPreDynProject;
