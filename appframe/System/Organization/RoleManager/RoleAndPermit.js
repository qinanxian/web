import React from "react";
import {Button, Col, DetailInfo, Row} from "../../../../src/components";
import RoleInfo from "./RoleInfo";
import RolePermitTree from "./RolePermitTree";

export default class RoleAndPermit extends React.Component {

    constructor(props) {
        super();
        this.roleId = props.roleId ? props.roleId : null;
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <RoleInfo roleId={this.roleId}/>
                    </Col>
                    <Col span={12}>
                        <RolePermitTree roleId={this.roleId}/>
                    </Col>
                </Row>
            </div>

        );
    }

}
