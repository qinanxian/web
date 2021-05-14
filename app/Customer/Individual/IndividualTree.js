import React from 'react';
import {TreeDetail, Row, Col, Message, DetailInfo, Button} from '../../../src/components/index';

export default class IndividualTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            custId: props.param.custId ? props.param.custId : null,
            readonly: props.param ? props.param.readonly : props.readonly
        };

        const {rest, openLoading, closeLoading} = props;
        openLoading();
        rest.get('/base/params/itemsTree/IndividualCustomerTree')
            .then((data) => {
                this.setState({dataSource: data});
                closeLoading();
            });
    }

    treeOnSelect = (nodeCtx, node) => {
        const selectedNode = node.selectedNodes[0];
        if (!selectedNode) return;

        const nodeValue = selectedNode.props && selectedNode.props.value || selectedNode.value;
        let paramsJson = {custId: this.state.custId,readonly: this.state.readonly};
        if (nodeValue.code == '40') {//自然人客户文档资料
            let extendsParams = {};
            extendsParams.readOnly = this.state.readonly;
            paramsJson = {objectId: this.state.custId, objectType: 'CUSTOMER',extendsParams: extendsParams};
        }
        nodeCtx.openDetail(nodeValue.value, paramsJson);
    };

    render() {
        return (
            <div>
                <Row>
                    <TreeDetail
                        showLine
                        defaultSelectedKeys={['10']}
                        treeSpan={4} detailSpan={20} onSelect={this.treeOnSelect}
                        dataSource={this.state.dataSource}
                        nodeTitle="value.name" nodeKey="value.code" childrenKey="children">
                    </TreeDetail>
                </Row>
            </div>
        );
    }
}

