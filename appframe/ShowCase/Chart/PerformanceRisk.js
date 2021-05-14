import React from 'react';
import {Row, Col, Fieldset,Notify} from '../../../src/components';
import RateOfReturn from './RateOfReturn'
import Sharp from './Sharp'
import YearLluctuationRate from './YearLluctuationRate'
import MaximumRetreat from './MaximumRetreat'
import PerformanceRiskData from './PerformanceRiskData'

export default class PerformanceRisk extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div>
                <Row >
                    <Col span={12}>
                        <Fieldset legend="收益率" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                            <RateOfReturn />
                        </Fieldset>
                    </Col>

                    <Col span={12}>
                        <Fieldset legend="Sharp" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                            <Sharp />
                        </Fieldset>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Fieldset legend="年华波动率" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                            <YearLluctuationRate />
                        </Fieldset>
                    </Col>

                    <Col span={12}>
                        <Fieldset legend="最大回撤" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                            <MaximumRetreat />
                        </Fieldset>
                    </Col>
                </Row>
                <Row>
                    <Fieldset legend="详细数据" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                        <PerformanceRiskData />
                    </Fieldset>
                </Row>
            </div>

        );
    }
}

