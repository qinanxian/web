import React from 'react';
import {Table, Divider, Tag} from 'antd';
const {Column, ColumnGroup} = Table;

export default class ContributionDegreeData extends React.Component {
    constructor(props) {
        super();
    }


    render() {
        const data = [
            {
                name: '合计',
                periodStartValue: 20146.52,
                periodEndValue: 69197.40,
                capitalOccupancyRate: 33.20,
                netBuying: 44273.57,
                valueOfReturn: 6675.55,
                rateOfReturn: '',
                contributionDegree: 5.5035,
                ranking: '',
            },
            {
                name: '家用电器',
                periodStartValue: 2405.16,
                periodEndValue: 2491.82,
                capitalOccupancyRate: 3.28,
                netBuying: 12.26,
                valueOfReturn: 2240.08,
                rateOfReturn: 84.33,
                contributionDegree: 1.7307,
                ranking: 1,
            },
            {
                name: '电子',
                periodStartValue: 2556.22,
                periodEndValue: 9499.60,
                capitalOccupancyRate: 3.56,
                netBuying: 5272.50,
                valueOfReturn: 1714.77,
                rateOfReturn: 68.00,
                contributionDegree: 1.4471,
                ranking: 2,
            },
            {
                name: '建筑材料',
                periodStartValue: 493.41,
                periodEndValue: 1549.14,
                capitalOccupancyRate: 0.96,
                netBuying: 323.96,
                valueOfReturn: 732.82,
                rateOfReturn: 140.18,
                contributionDegree: 0.7341,
                ranking: 3,
            },
            {
                name: '汽车',
                periodStartValue: 786.40,
                periodEndValue: 7081.87,
                capitalOccupancyRate: 2.53,
                netBuying: 5859.38,
                valueOfReturn: 626.12,
                rateOfReturn: 37.32,
                contributionDegree: 0.5203,
                ranking: 4,
            },
            {
                name: '电气设备',
                periodStartValue: 1307.35,
                periodEndValue: 2461.47,
                capitalOccupancyRate: 1.65,
                netBuying: 631.61,
                valueOfReturn: 588.55,
                rateOfReturn: 29.28,
                contributionDegree: 0.4228,
                ranking: 5,
            },
            {
                name: '食品饮料',
                periodStartValue: 2308.71,
                periodEndValue: 4373.57,
                capitalOccupancyRate: 2.65,
                netBuying: 1419.85,
                valueOfReturn: 589.30,
                rateOfReturn: 13.54,
                contributionDegree: 0.4102,
                ranking: 6,
            }
        ];
        return (
            <div>
                <Table dataSource={data}>
                    <Column
                        title="行业名称"
                        dataIndex="name"
                        key="name"
                    />
                    <Column
                        title="期初市值（万）"
                        dataIndex="periodStartValue"
                        key="periodStartValue"
                    />
                    <Column
                        title="期末市值（万）"
                        dataIndex="periodEndValue"
                        key="periodEndValue"
                    />
                    <Column
                        title="资金占用（%）"
                        dataIndex="capitalOccupancyRate"
                        key="capitalOccupancyRate"
                    />
                    <Column
                        title="净买入（万）"
                        dataIndex="netBuying"
                        key=" netBuying"
                    />
                    <Column
                        title="收益额（万）"
                        dataIndex="valueOfReturn"
                        key=" valueOfReturn"
                    />
                    <Column
                        title="收益率（‰）"
                        dataIndex="rateOfReturn"
                        key=" rateOfReturn"
                    />
                    <Column
                        title="贡献度（‰）"
                        dataIndex="contributionDegree"
                        key=" contributionDegree"
                    />
                    <Column
                        title="排名"
                        dataIndex="ranking"
                        key="ranking"
                    />

                </Table>
            </div>
        );
    }
}

