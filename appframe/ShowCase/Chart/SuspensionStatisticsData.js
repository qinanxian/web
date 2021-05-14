import React from 'react';
import {Table, Divider, Tag} from 'antd';
const {Column, ColumnGroup} = Table;

export default class SuspensionStatisticsData extends React.Component {
    constructor(props) {
        super();
    }


    render() {
        const data = [
            {
                name: '伟安食品',
                count: 2127363,
                value: 85.41,
                netValueRatio: 0.06,
                marketValueRatio: 0.12,
                averageTurnoverRatio: 2.58,
                generalCapitalRatio: 0.1,
                circulatingStockBookRatio: 0.39,
                status: '停牌',
            },
            {
                name: '韦尔股份',
                count: 199953,
                value: 1.4,
                netValueRatio: 0.00,
                marketValueRatio: 0.00,
                averageTurnoverRatio: 0.00,
                generalCapitalRatio: 0.01,
                circulatingStockBookRatio: 0.00,
                status: '停牌',
            },
            {
                name: '鸣志电器',
                count: 1768.51,
                value: 1.99,
                netValueRatio: 0.00,
                marketValueRatio: 0.00,
                averageTurnoverRatio: 0.00,
                generalCapitalRatio: 0.01,
                circulatingStockBookRatio: 0.00,
                status: '停牌',
            },
            {
                name: '乾景园林',
                count: 92449.65,
                value: 223.64,
                netValueRatio: 0.15,
                marketValueRatio: 0.32,
                averageTurnoverRatio: 12.53,
                generalCapitalRatio: 0.46,
                circulatingStockBookRatio: 1.02,
                status: '停牌',
            },
            {
                name: '绿康生化',
                count: 281.29,
                value: 0.43,
                netValueRatio: 0.00,
                marketValueRatio: 0.00,
                averageTurnoverRatio: 0.00,
                generalCapitalRatio: 0.00,
                circulatingStockBookRatio: 0.00,
                status: '停牌',
            },
            {
                name: '鲁亿通',
                count: 85426.91,
                value: 288.49,
                netValueRatio: 0.19,
                marketValueRatio: 0.42,
                averageTurnoverRatio: 84.53,
                generalCapitalRatio: 0.79,
                circulatingStockBookRatio: 1.82,
                status: '停牌',
            },
            {
                name: '万通智控',
                count: 491.76,
                value: 0.21,
                netValueRatio: 0.00,
                marketValueRatio: 0.00,
                averageTurnoverRatio: 0.00,
                generalCapitalRatio: 0.00,
                circulatingStockBookRatio: 0.00,
                status: '停牌',
            },
            {
                name: '超频三',
                count: 380.32,
                value: 0.34,
                netValueRatio: 0.00,
                marketValueRatio: 0.00,
                averageTurnoverRatio: 0.00,
                generalCapitalRatio: 0.00,
                circulatingStockBookRatio: 0.00,
                status: '停牌',
            },
        ];
        return (
            <div>
                <Table dataSource={data}>
                    <Column
                        title="名称"
                        dataIndex="name"
                        key="name"
                    />
                    <Column
                        title="数量"
                        dataIndex="count"
                        key="count"
                    />
                    <Column
                        title="市值（万）"
                        dataIndex="value"
                        key="value"
                    />
                    <Column
                        title="净占值比例（%）"
                        dataIndex="netValueRatio"
                        key="netValueRatio"
                    />
                    <Column
                        title="占股票市值（‰）"
                        dataIndex="marketValueRatio"
                        key=" marketValueRatio"
                    />
                    <Column
                        title="占平均成交量（‰）"
                        dataIndex="averageTurnoverRatio"
                        key=" averageTurnoverRatio"
                    />
                    <Column
                        title="占总股本（‰）"
                        dataIndex="generalCapitalRatio"
                        key=" generalCapitalRatio"
                    />
                    <Column
                        title="占流通股本（‰）"
                        dataIndex="circulatingStockBookRatio"
                        key=" circulatingStockBookRatio"
                    />
                    <Column
                        title="交易状态"
                        dataIndex="status"
                        key="status"
                    />

                </Table>
            </div>
        );
    }
}

