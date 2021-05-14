import React from 'react';
import {Table, Divider, Tag} from 'antd';
const {Column, ColumnGroup} = Table;

export default class AssetAllocationData extends React.Component {
    constructor(props) {
        super();
    }


    render() {
        const data = [
            {
                assetType: '股票',
                value: 87851.53,
                totalValueRatio: 57.59,
                netValueRatio: 57.59,
            },
            {
                assetType: '基金',
                value: 14211.26,
                totalValueRatio: 9.32,
                netValueRatio: 9.32,
            },
            {
                assetType: '债券',
                value: 3124.42,
                totalValueRatio: 2.05,
                netValueRatio: 2.05,
            },
            {
                assetType: '金融衍生品',
                value: 0.00,
                totalValueRatio: 0.00,
                netValueRatio: 0.00,
            },
            {
                assetType: '买入返售证券',
                value: 25294.27,
                totalValueRatio: 16.58,
                netValueRatio: 16.58,
            },
            {
                assetType: '财富管理产品',
                value: 0.00,
                totalValueRatio: 0.00,
                netValueRatio: 0.00,
            },
            {
                assetType: '非标',
                value: 0.00,
                totalValueRatio: 0.00,
                netValueRatio: 0.00,
            },
            {
                assetType: '现金',
                value: 22073.79,
                totalValueRatio: 14.47,
                netValueRatio: 14.47,
            }
        ];
        return (
            <div>
                <Table dataSource={data}>
                    <Column
                        title="资产类型"
                        dataIndex="assetType"
                        key="assetType"
                    />
                    <Column
                        title="金额（万）"
                        dataIndex="value"
                        key="value"
                    />
                    <Column
                        title="占总值（%）"
                        dataIndex="totalValueRatio"
                        key="totalValueRatio"
                    />
                    <Column
                        title="占净值（%）"
                        dataIndex="netValueRatio"
                        key="netValueRatio"
                    />
                </Table>
            </div>
        );
    }
}

