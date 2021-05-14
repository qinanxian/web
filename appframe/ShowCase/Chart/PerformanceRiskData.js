import React from 'react';
import {Table, Divider, Tag} from 'antd';
const {Column, ColumnGroup} = Table;

export default class PerformanceRiskData extends React.Component {
    constructor(props) {
        super();
    }


    render() {
        const data = [{
                name: '上证综指',
                rateOfReturn_recentOneMonth: -3.02,
                rateOfReturn_recentThrMonth: -0.14,
                rateOfReturn_curYear: 1.64,
                rateOfReturn_allTime: 0.00,
                sharp_curYear: 0.65,
                sharp_allTime: 0.00,
                yearLluctuationRate_recentOneMonth: 10.43,
                yearLluctuationRate_recentThrMonth: 9.04,
                yearLluctuationRate_curYear: 8.74,
                yearLluctuationRate_allTime: 0.00,
                maximumRetreat_curYear: -4.85,
                maximumRetreat_allTime: 0.00,

            },
            {
                name: '沪深300',
                rateOfReturn_recentOneMonth: -0.87,
                rateOfReturn_recentThrMonth: 1.53,
                rateOfReturn_curYear: 3.92,
                rateOfReturn_allTime: 0.00,
                sharp_curYear: 1.57,
                sharp_allTime: 0.00,
                yearLluctuationRate_recentOneMonth: 8.57,
                yearLluctuationRate_recentThrMonth: 8.40,
                yearLluctuationRate_curYear: 8.18,
                yearLluctuationRate_allTime: 0.00,
                maximumRetreat_curYear: -2.45,
                maximumRetreat_allTime: 0.00,
            },
            {
                name: '中证500',
                rateOfReturn_recentOneMonth: -4.41,
                rateOfReturn_recentThrMonth: -0.19,
                rateOfReturn_curYear: -0.83,
                rateOfReturn_allTime: 0.00,
                sharp_curYear: -0.14,
                sharp_allTime: 0.00,
                yearLluctuationRate_recentOneMonth: 16.07,
                yearLluctuationRate_recentThrMonth: 12.22,
                yearLluctuationRate_curYear: 13.05,
                yearLluctuationRate_allTime: 0.00,
                maximumRetreat_curYear: -7.40,
                maximumRetreat_allTime: 0.00,
            },
            {
                name: '创业板指',
                rateOfReturn_recentOneMonth: -4.82,
                rateOfReturn_recentThrMonth: -1.88,
                rateOfReturn_curYear: -5.67,
                rateOfReturn_allTime: 0.00,
                sharp_curYear: -1.16,
                sharp_allTime: 0.00,
                yearLluctuationRate_recentOneMonth: 15.86,
                yearLluctuationRate_recentThrMonth: 13.02,
                yearLluctuationRate_curYear: 15.30,
                yearLluctuationRate_allTime: 0.00,
                maximumRetreat_curYear: -9.12,
                maximumRetreat_allTime: 0.00,
            }
        ];
        return (
            <div>
                <Table dataSource={data}>
                    <Column
                        title="组合名称"
                        dataIndex="name"
                        key="name"
                    />
                    <ColumnGroup title="收益率">
                        <Column
                            title="近一个月"
                            dataIndex="rateOfReturn_recentOneMonth"
                            key="rateOfReturn_recentOneMonth"
                        />
                        <Column
                            title="近三个月"
                            dataIndex="rateOfReturn_recentThrMonth"
                            key="rateOfReturn_recentThrMonth"
                        />
                        <Column
                            title="今年以来"
                            dataIndex="rateOfReturn_curYear"
                            key="rateOfReturn_curYear"
                        />
                        <Column
                            title="投资至今"
                            dataIndex="rateOfReturn_allTime"
                            key="rateOfReturn_allTime"
                        />
                    </ColumnGroup>
                    <ColumnGroup title="Sharp">

                        <Column
                            title="今年以来"
                            dataIndex="sharp_curYear"
                            key="sharp_curYear"
                        />
                        <Column
                            title="投资至今"
                            dataIndex="sharp_allTime"
                            key="sharp_allTime"
                        />
                    </ColumnGroup>
                    <ColumnGroup title="年华波动率">
                        <Column
                            title="近一个月"
                            dataIndex="yearLluctuationRate_recentOneMonth"
                            key="yearLluctuationRate_recentOneMonth"
                        />
                        <Column
                            title="近三个月"
                            dataIndex="yearLluctuationRate_recentThrMonth"
                            key="yearLluctuationRate_recentThrMonth"
                        />
                        <Column
                            title="今年以来"
                            dataIndex="yearLluctuationRate_curYear"
                            key="yearLluctuationRate_curYear"
                        />
                        <Column
                            title="投资至今"
                            dataIndex="yearLluctuationRate_allTime"
                            key="yearLluctuationRate_allTime"
                        />
                    </ColumnGroup>
                    <ColumnGroup title="最大回撤">

                        <Column
                            title="今年以来"
                            dataIndex="maximumRetreat_curYear"
                            key="maximumRetreat_curYear"
                        />
                        <Column
                            title="投资至今"
                            dataIndex="maximumRetreat_allTime"
                            key="maximumRetreat_allTime"
                        />
                    </ColumnGroup>
                </Table>
            </div>
        );
    }
}

