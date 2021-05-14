import React from 'react';
import { Button, Charts, Icon } from 'roface';
import TimeRange from './TimeRange';
import CashFlow from './CashFlow';
import {Col, DatePicker} from 'antd';
import { formatMoney, formatNumber } from '../../../../src/lib/accounting';

const { RangePicker } = DatePicker;
const { Chart, Geom, Axis, Tooltip, Legend } = Charts;

const data = [
    {
        year: "2019-03-01",
        value: 3000000
    },
    {
        year: "2019-04-01",
        value: 4000000
    },
    {
        year: "2019-05-01",
        value: 350000
    },
    {
        year: "2019-06-01",
        value: 5000000
    },
    {
        year: "2019-07-01",
        value: 4900000
    },
    {
        year: "2019-08-01",
        value: 6000000
    },
    {
        year: "2019-09-01",
        value: 7000000
    },
    {
        year: "2019-10-01",
        value: 900000
    },
    {
        year: "2019-11-31",
        value: 1300000
    }
];
const cols = {
    value: {
        min: 0
    },
    year: {
        range: [0, 1]
    }
};

export default class PAInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource:null
        };
    }
    componentWillReceiveProps(nextProps){
        if (!Object.is(nextProps.dataSource,this.props.dataSource)) {
            this.setState({
                dataSource:nextProps.dataSource
            });
        }
    }
    render(){
        const { dataSource } = this.state;
        const { prefix = 'ro', title='块标题', subTitle='subtitle' } = this.props;
        if (!dataSource) {
            return null;
        }
        return (
            <div className={`${prefix}-product`}>
                <div className={`${prefix}-chartsw-header`}>
                    <div className={`${prefix}-chartsw-header-title`}>{title}</div>
                    <div className={`${prefix}-chartsw-header-component`}>
                        {/*<TimeRange/>*/}
                        <div style={{display:'flex',alignItems:'center',marginRight:'8px',fontSize:'15px'}}><span style={{width: '145px'}}>订单录入时间：</span><RangePicker/></div>
                        <div className={`${prefix}-chartsw-header-component-btn`}>
                            <Button type='primary'>查询</Button>
                        </div>
                    </div>
                </div>
                <div className={`${prefix}-product-content`}>
                    <div className={`${prefix}-product-content-top`}>
                        <CashFlow cashData={dataSource.statistics}/>
                    </div>
                    <div className={`${prefix}-product-content-bottom`}>
                        <div className={`${prefix}-product-content-bottom-left`}>
                            <div className={`${prefix}-product-content-bottom-left-theme`}>
                                <div className={`${prefix}-product-content-bottom-left-theme-subtitle`}>
                                    {subTitle}
                                </div>
                                <div className={`${prefix}-product-content-bottom-left-theme-subtext`}>
                                    <Col span={4}>{dataSource.proportion.col_1}</Col>
                                    <Col span={16}>{dataSource.proportion.col_2}</Col>
                                    <Col span={4}>{dataSource.proportion.col_3}</Col>
                                </div>
                            </div>
                            <div className={`${prefix}-product-content-bottom-left-charts`}>
                                <Col span={4}>{dataSource.proportion.col_1_value}</Col>
                                <Col span={16}>
                                    <div className={`${prefix}-product-content-bottom-left-charts-center`}>
                                        <div className={`${prefix}-product-content-bottom-left-charts-center-outer`}>
                                            <div style={{width:dataSource.proportion.col_2_value}} className={`${prefix}-product-content-bottom-left-charts-center-outer-inner`}/>
                                        </div>
                                        <div className={`${prefix}-product-content-bottom-left-charts-center-number`}>{formatNumber(dataSource.proportion.col_2_num)}</div>
                                    </div>
                                </Col>
                                <Col span={4}>{dataSource.proportion.col_3_value}</Col>
                            </div>
                        </div>
                        <div className={`${prefix}-product-content-bottom-right`}>
                            <div className={`${prefix}-product-content-bottom-right-title`}>
                                <Icon type='areachart'/>
                                {dataSource.chartsData.title}
                            </div>
                            <Chart height={310} data={data} scale={cols} forceFit padding={[20,80,50,80]}>
                                <Axis name="year" />
                                <Axis name="value" label={{
                                    formatter(text) {
                                        return formatNumber(text);
                                    }
                                }}/>
                                <Tooltip
                                    crosshairs={{
                                        type: "y"
                                    }}
                                />
                                <Geom type="line" position="year*value" size={2} color="#8362d6" />
                                <Geom
                                    type="point"
                                    position="year*value"
                                    size={4}
                                    color="#8362d6"
                                    shape={"circle"}
                                    style={{
                                        stroke: "#fff",
                                        lineWidth: 1
                                    }}
                                />
                            </Chart>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

