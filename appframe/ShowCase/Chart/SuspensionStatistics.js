import React from 'react';
import {Row, Col, Fieldset,Notify} from '../../../src/components';
import HisSuspensionAndTrendAnalysis from './HisSuspensionAndTrendAnalysis'
import SuspensionStatisticsData from './SuspensionStatisticsData'

export default class SuspensionStatistics extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <Row>
                    <Fieldset legend="历史停牌股票数量及市场占比走势分析" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                        <HisSuspensionAndTrendAnalysis/>
                    </Fieldset>
                </Row>
                <Row>
                    <Fieldset legend="详细数据" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                        <SuspensionStatisticsData/>
                    </Fieldset>
                </Row>
            </div>

        );
    }
}

