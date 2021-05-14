import React from 'react';
import {Row, Col, Tabs, DetailInfo,Divider} from '../../../src/components';
import PerformanceRisk from './PerformanceRisk';
import {FixationAnalysis} from './FixationAnalysis';
import SuspensionStatistics from './SuspensionStatistics';
import ContributionDegree from './ContributionDegree';
import AssetAllocation from './AssetAllocation';
import SubfundAllocation from './SubfundAllocation';

export default class ChartTab extends React.Component {
    constructor(props) {
        super();
        const {param} = props;
        this.state = {
            planName: null
        };
        this.tabsOptions = [
            {
                tab: '业绩风险',
                key: 'performanceRisk',
                content: <PerformanceRisk/>
            },
            {
                tab: '固收分析',
                key: 'fixationAnalysis',
                content: <FixationAnalysis/>
            },
            {
                tab: '停牌统计',
                key: 'suspensionStatistics',
                content: <SuspensionStatistics/>
            },
            {
                tab: '贡献度',
                key: 'contributionDegree',
                content: <ContributionDegree/>
            },
            {
                tab: '资产配置',
                key: 'assetAllocation',
                content: <AssetAllocation/>
            },
            {
                tab: '子基金配置',
                key: 'subfundAllocation',
                content: <SubfundAllocation/>
            },


        ]
    }


    render() {
        const {param} = this.props;
        return (
            <div>
              <Row>
                <Col span={24}>
                  <Divider style={{margin: 'auto auto',height:'1px',top:'1px',boxShadow: '0 -1px 1px 0 #E0DEDE'}}/>
                  <Tabs type='line' style={{ color: '#9fa1a3' }} options={this.tabsOptions}/>
                </Col>
              </Row>
            </div>
        );
    }
}

