import React from 'react';
import {Table} from 'antd';
import {Row,Col,Charts,Fieldset} from 'roface';
const {Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape,Facet,DataSet } = Charts;
const {Column, ColumnGroup} = Table;

export const FixationAnalysis = () => {
    return (
        <div>
            <Row>
                <Fieldset legend="杠杆率走势" headerType='gist' toggle={true} showArrow={false} expanded={true}>{LeverageRatio()}</Fieldset>
            </Row>
            <Row>
                <Fieldset legend="详细数据" headerType='gist' toggle={true} showArrow={false} expanded={true}>{LeverageRatioTable()}</Fieldset>
            </Row>
            <Row>
                <Col span={12}>
                    <Fieldset legend="前10区间资金占用" headerType='gist' toggle={true} showArrow={false} expanded={true}>{beforeMoney()}</Fieldset>
                </Col>
                <Col span={12}>
                    <Fieldset legend="前10区间资金占用表" headerType='gist' toggle={true} showArrow={false} expanded={true}>{beforeMoneyTable()}</Fieldset>
                </Col>
            </Row>
            <Row>
                <Fieldset legend="区间资金占用明细" headerType='gist' toggle={true} showArrow={false} expanded={true}>{moneyDetail() }</Fieldset>
            </Row>
        </div>
    );
};

const beforeMoney = () => {
    const data = [
        {
            money: 50,
            sales: 0
        },
        {
            money: 500,
            sales: -0.05
        },
        {
            money: 850,
            sales: -0.01
        },
        {
            money: 1800,
            sales: -0.07
        }
    ];
    const sales = {
        sales: {
            alias:'贡献度(%)',
            min:-0.06,
            max:0,
            range:[0.2,0.8],
            tickInterval: 0.02,
        },
        money:{
            alias:'净买入(万)',
            min:0,
            max:1800,
            range:[0.1,0.9],
            tickInterval:200
        }
    };
    const labelCol = {
        textStyle:{
            rotate:-90
        },
        autoRotate:false
    };
    return (
        <div>
            <Chart height={400} data={data} scale={sales} forceFit>
                <Axis name="money" title={true} grid={null}/>
                <Axis name="sales" title={true} grid={null} label={labelCol}/>
                <Tooltip
                    crosshairs={{
                        type: "y"
                    }}
                />
                <Geom
                    type="point"
                    position="money*sales"
                    shape="circle"
                    size={["money", [4, 30]]}
                    color='	#FFDAB9'
                />
            </Chart>
            {LeverageTable()}
        </div>
    );
};

const beforeMoneyTable = () => {
    const data = [
        {
            name:'三一转债',
            netBuying:'1,806.41',
            contributionDegree:'-0.00642',
            capitalOccupation:'0.51'
        },
        {
            name:'海印转债',
            netBuying:'546.24',
            contributionDegree:'-0.0218',
            capitalOccupation:'0.16',
        },
        {
            name:'16皖新EB',
            netBuying:'857.03',
            contributionDegree:'-0.0103',
            capitalOccupation:'0.13',
        },
        {
            name:'光大转债',
            netBuying:'49.72',
            contributionDegree:'0.0006',
            capitalOccupation:'0.01',
        },
        {
            name:'合计',
            netBuying:'325.39',
            contributionDegree:'-0.0958',
            capitalOccupation:'0.81',
        }
    ];
    return (
        <Table dataSource={data}>
            <Column
                title="名称"
                dataIndex="name"
                key="name"
                align='center'
            />
            <Column
                title="净买入(万)"
                dataIndex="netBuying"
                key="netBuying"
                align='center'
            />
            <Column
                title="贡献度(%)"
                dataIndex="contributionDegree"
                key="contributionDegree"
                align='center'
            />
            <Column
                title="资金占用(%)"
                dataIndex="capitalOccupation"
                key="capitalOccupationegree"
                align='center'
            />
        </Table>
    );
};

const moneyDetail = () => {
    const data = [
        {
            code:'',
            name:'合计',
            startValue:'0',
            endValue:'3,124.42',
            netBuying:'3,259.39',
            profitValue:'-136.57',
            profitRatio:'',
            contributionDegree:'-0.0958',
            capitalOccupation:'0.81',
            ranking:'',
            bondClass:''
        },
        {
            code:'SH110032',
            name:'三一转债',
            startValue:'0',
            endValue:'1,715.38',
            netBuying:'1,806.41',
            profitValue:'-92.00',
            profitRatio:'-5.06',
            contributionDegree:'-0.00642',
            capitalOccupation:'0.51',
            ranking:'1',
            bondClass:'可转换企业债'
        },
        {
            code:'SZ127003',
            name:'海印转债',
            startValue:'0',
            endValue:'515.80',
            netBuying:'546.24',
            profitValue:'-30.75',
            profitRatio:'-5.62',
            contributionDegree:'-0.0218',
            capitalOccupation:'0.16',
            ranking:'2',
            bondClass:'可转换企业债'
        },
        {
            code:'SH132006',
            name:'16皖新EB',
            startValue:'0',
            endValue:'842.75',
            netBuying:'857.03',
            profitValue:'-14.57',
            profitRatio:'-1.92',
            contributionDegree:'-0.0103',
            capitalOccupation:'0.13',
            ranking:'3',
            bondClass:'可交换公司债券'
        }
    ];
    return (
        <Table dataSource={data}>
            <Column
                title="代码"
                dataIndex="code"
                key="code"
                align='center'
            />
            <Column
                title="名称"
                dataIndex="name"
                key="name"
                align='center'
            />
            <Column
                title="期初市值(万)"
                dataIndex="startValue"
                key="startValue"
                align='center'
            />
            <Column
                title="期末市值(万)"
                dataIndex="endValue"
                key="endValue"
                align='center'
            />
            <Column
                title="净买入(万)"
                dataIndex="netBuying"
                key="netBuying"
                align='center'
            />
            <Column
                title="收益额(万)"
                dataIndex="profitValue"
                key="yield"
                align='center'
            />
            <Column
                title="收益率"
                dataIndex="profitRatio"
                key="profitRatio"
                align='center'
            />
            <Column
                title="贡献度(%)"
                dataIndex="contributionDegree"
                key="contributionDegree"
                align='center'
            />
            <Column
                title="资金占用(%)"
                dataIndex="capitalOccupation"
                key="capitalOccupationegree"
                align='center'
            />
            <Column
                title="排名"
                dataIndex="ranking"
                key="ranking"
                align='center'
            />
            <Column
                title="债券类别"
                dataIndex="bondClass"
                key="bondClass"
                align='center'
            />
        </Table>
    );
};

const LeverageRatioTable = () => {
    const data = [{
        deadLine:'2017-01',
        totalAssets:'127,039.06',
        netWorth:'127,027.59',
        repo_balance:'0.00',
        repo_ratio:'0.00',
        reverse_balance:'40,706.68',
        reverse_ratio:'32.05',
        leverageRatio:'100.01',
        accumulatedReturnRate:'1.90',
    },{
        deadLine:'2017-02',
        totalAssets:'142,979.31',
        netWorth:'142,968.35',
        repo_balance:'0.00',
        repo_ratio:'0.00',
        reverse_balance:'23,801.92',
        reverse_ratio:'16.65',
        leverageRatio:'100.01',
        accumulatedReturnRate:'4.10',
    },{
        deadLine:'2017-03',
        totalAssets:'145,550.46',
        netWorth:'145,535.02',
        repo_balance:'0.00',
        repo_ratio:'0.00',
        reverse_balance:'28,663.69',
        reverse_ratio:'19.70',
        leverageRatio:'100.01',
        accumulatedReturnRate:'4.87',
    }];
    return (
        <Table dataSource={data}>
            <Column
                title='截止日'
                dataIndex='deadLine'
                key='deadLine'
                align='center'
            />
            <Column
                title='资产总值(万)'
                dataIndex='totalAssets'
                key='totalAssets'
                align='center'
            />
            <Column
                title='资产净值(万)'
                dataIndex='netWorth'
                key='netWorth'
                align='center'
            />
            <ColumnGroup title='正回购'>
                <Column
                    title='余额(万)'
                    dataIndex='repo_balance'
                    key='repo_balance'
                    align='center'
                />
                <Column
                    title='净值占比(%)'
                    dataIndex='repo_ratio'
                    key='repo_ratio'
                    align='center'
                />
            </ColumnGroup>
            <ColumnGroup title='逆回购'>
                <Column
                    title='余额(万)'
                    dataIndex='reverse_balance'
                    key='reverse_balance'
                    align='center'
                />
                <Column
                    title='净值占比(%)'
                    dataIndex='reverse_ratio'
                    key='reverse_ratio'
                    align='center'
                />
            </ColumnGroup>
            <Column
                title='杠杆率(%)'
                dataIndex='leverageRatio'
                key='leverageRatio'
                align='center'
            />
            <Column
                title='累计收益率(%)'
                dataIndex='accumulatedReturnRate'
                key='accumulatedReturnRate'
                align='center'
            />
        </Table>
    );
};

const LeverageTable = () => {
    const data = [{
        average1:100.01,
        average2:0.00,
        average3:21.24,
        max1:100.01,
        max2:0.00,
        max3:32.05,
        min1:100.00,
        min2:0.00,
        min3:16.58
    }];
    return (
        <Table dataSource={data}>
            <ColumnGroup title="平均">
                <Column
                    title="杠杆率(%)"
                    dataIndex="average1"
                    key="average1"
                    align='center'
                />
                <Column
                    title="正回购(%)"
                    dataIndex="average2"
                    key="average2"
                    align='center'
                />
                <Column
                    title="逆回购(%)"
                    dataIndex="average3"
                    key="average3"
                    align='center'
                />
            </ColumnGroup>
            <ColumnGroup title="最大">
                <Column
                    title="杠杆率(%)"
                    dataIndex="max1"
                    key="max1"
                    align='center'
                />
                <Column
                    title="正回购(%)"
                    dataIndex="max2"
                    key="max2"
                    align='center'
                />
                <Column
                    title="逆回购(%)"
                    dataIndex="max3"
                    key="max3"
                    align='center'
                />
            </ColumnGroup>
            <ColumnGroup title="最小">
                <Column
                    title="杠杆率(%)"
                    dataIndex="min1"
                    key="min1"
                    align='center'
                />
                <Column
                    title="正回购(%)"
                    dataIndex="min2"
                    key="min2"
                    align='center'
                />
                <Column
                    title="逆回购(%)"
                    dataIndex="min3"
                    key="min3"
                    align='center'
                />
            </ColumnGroup>
        </Table>
    );
};

const LeverageRatio = () => {
    const data = [
        {
            year: "2017-01",
            sales: 100.010,
            sales2:2.2
        },
        {
            year: "2017-02",
            sales: 100.010,
            sales2:4
        },
        {
            year: "2017-03",
            sales: 100.010,
            sales2:4.8
        },
        {
            year: "2017-04",
            sales: 100,
            sales2:4.6
        }
    ];
    const cols = {
        sales: {
            alias:'杠杆率(%)',
            min:100,
            max:100.010,
            //range:[0.1,0.9],
            tickInterval: 0.002
        },
        sales2: {
            alias:'累计收益率(%)',
            min:2.0,
            max:5.0,
            tickCount:7,
            //range:[0.1,0.9]
        }
    };
    return (
        <div>
            <Chart padding={{ right: 60,left:60,bottom:40,top:40 }} height={400} data={data} scale={cols} forceFit>
                <Axis name="sales" title={true} grid={null}/>
                <Axis name="sales2" title={true} grid={null}/>
                <Legend
                    custom
                    position="top"
                    items={[
                        { value: '杠杆率(%)', marker: { symbol: 'circle', fill: '#00BFFF', radius: 5 } },
                        { value: '累计收益率(%)', marker: { symbol: 'circle', fill: '#EEB422', radius: 5 } },
                    ]}
                />
                <Tooltip
                    crosshairs={{
                        type: "y"
                    }}
                />
                <Geom
                    type="interval"
                    position="year*sales"
                    color={['sales',['#00BFFF']]}
                    shape='rect'

                />
                <Geom
                    type="line"
                    position="year*sales2"
                    color={['sales2',['#EEB422']]}
                    shape='circle'
                />
            </Chart>
            {LeverageTable()}
        </div>
    );
};
