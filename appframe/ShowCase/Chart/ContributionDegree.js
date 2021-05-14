import React from 'react';
import {Row, Col, Fieldset,Notify} from '../../../src/components';
import TopContributionDegree from './TopContributionDegree'
import LastContributionDegree from './LastContributionDegree'
import ContributionDegreeData from './ContributionDegreeData'

export default class ContributionDegree extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div>
                <Row >
                    <Col span={12}>
                        <Fieldset legend="前三区度贡献度" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                            <TopContributionDegree/>
                        </Fieldset>
                    </Col>

                    <Col span={12}>
                        <Fieldset legend="后三区度贡献度" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                            <LastContributionDegree/>
                        </Fieldset>
                    </Col>
                </Row>

                <Row>
                    <Fieldset legend="区度贡献度明细" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                        <ContributionDegreeData/>
                    </Fieldset>
                </Row>
            </div>

        );
    }
}

