import React from 'react';
import {Message,TreeDetail} from '../../../src/components';
import EnterpriseInfo from "./EnterpriseInfo";

export default class EnterpriseTree extends React.Component {
    static EnterpriseInfo = EnterpriseInfo;
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            custId: props.param ? props.param.custId : props.custId,
            readonly: props.param ? props.param.readonly : props.readonly
        };

        const {rest, openLoading, closeLoading} = props.props ? props.props : props;
        openLoading();
        rest.get('/base/params/itemsTree/EnterpriseCustomerTree')
            .then((data) => {
                this.setState({dataSource: data});
                closeLoading();
            });
    }

    treeOnSelect = (nodeCtx, node) => {
        const selectedNode = node.selectedNodes[0];
        if(!selectedNode)return;
        const nodeValue = selectedNode.props && selectedNode.props.value || selectedNode.value;
        if(nodeValue.value){
            nodeCtx.openDetail(nodeValue.value,{custId: this.state.custId,readonly: this.state.readonly});
        }else{
            Message.error('页面的URL为空');
        }
    };
    render() {
        return (
            <div>
                <TreeDetail
                    showLine
                    defaultExpandedKeys={['10']}
                    defaultSelectedKeys={['1010']}
                    treeSpan={4} detailSpan={20}
                    defaultOnSelect={() => {}}
                    onSelect={this.treeOnSelect}
                    dataSource={this.state.dataSource}
                    nodeTitle="value.name" nodeKey="value.code" childrenKey="children"
                />
            </div>
        );
    }
}

