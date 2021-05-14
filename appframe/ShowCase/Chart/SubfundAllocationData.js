import React from 'react';
import {Table, Divider, Tag} from 'antd';
const {Column, ColumnGroup} = Table;

export default class SubfundAllocationData extends React.Component {
    constructor(props) {
        super();
    }


    render() {
        const data = [
            {
                assetType: '鑫福1号',
                value: 49624.28,
                totalValueRatio: 32.53,
                netValueRatio: 32.53,
            },
            {
                assetType: '鑫福7号',
                value: 19823.04,
                totalValueRatio: 12.99,
                netValueRatio: 12.99,
            },
            {
                assetType: '鑫福6号',
                value: 16936.14,
                totalValueRatio: 11.10,
                netValueRatio: 11.10,
            },
            {
                assetType: '鑫福8号',
                value: 16609.73,
                totalValueRatio: 10.89,
                netValueRatio: 10.89,
            },
            {
                assetType: '鑫福4号',
                value: 15228.62,
                totalValueRatio: 9.98,
                netValueRatio: 9.98,
            },
            {
                assetType: '鑫福2号',
                value: 15086.66,
                totalValueRatio: 9.89,
                netValueRatio: 9.89,
            },
            {
                assetType: '鑫福3号',
                value: 11557.20,
                totalValueRatio: 7.58,
                netValueRatio: 7.58,
            },
            {
                assetType: '鑫福5号',
                value: 5447.00,
                totalValueRatio: 3.57,
                netValueRatio: 3.57,
            }
            ,
            {
                assetType: '其他',
                value: 0.53,
                totalValueRatio: 0,
                netValueRatio: 0,
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

