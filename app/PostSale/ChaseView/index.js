import React from "react";
import {Col, DetailInfo, Fieldset, Row} from "../../../src/components";
import ChaseTaskList from "../ChaseTask/ChaseTaskList"

export default class ChaseView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {chaseId} = this.props.params;
        return (

            <Row>

                <Col span={10}>
                    <Fieldset legend="催收信息" headerType='gist' showArrow={false} expanded={true}>
                        <DetailInfo
                            params={{chaseId: chaseId}}
                            dataFormId="obiz-ChaseInfo"
                            reading={true}
                        />
                    </Fieldset>
                </Col>
                <Col span={14}>
                    <Fieldset legend="任务信息" headerType='gist' showArrow={false} expanded={true}>
                        <ChaseTaskList chaseId={chaseId} />
                    </Fieldset>
                </Col>
            </Row>

        );
    }
}
