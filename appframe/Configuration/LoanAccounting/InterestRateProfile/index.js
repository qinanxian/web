import React from "react";
import {DataTable, Tabs} from '../../../../src/components';

const TabPane = Tabs.TabPane;

export default class InterestRateProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * 表格源数据（表头信息）加载完成后，调用
     * @param volist
     */
    formReady = (volist) => {
        this.volist = volist;
    };

    render() {
        return (

            <Tabs defaultActiveKey="1">
                <TabPane tab="人行基准利率" key="1">
                    <DataTable
                        dataFormId="configuration-InterestRateList"
                        params={{rateType: 'PBOCBaseRate'}}
                        formReady={this.formReady}
                    />
                </TabPane>
                <TabPane tab="SHIBOR" key="2">
                    <DataTable
                        dataFormId="configuration-InterestRateList"
                        params={{rateType: 'SHIBOR'}}
                        formReady={this.formReady}
                    />
                </TabPane>
            </Tabs>
        );
    }
}