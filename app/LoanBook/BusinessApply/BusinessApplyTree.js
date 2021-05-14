import React from 'react';
import {Message,TreeDetail} from '../../../src/components';

export default class BusinessApplyTree extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            custId: props.param ? props.param.custId : props.custId,
            applyId: props.param ? props.param.applyId : props.applyId,
            readonly: props.param ? props.param.readonly : props.readonly
        };

        const {rest, openLoading, closeLoading} = props.props ? props.props : props;
        openLoading();
        rest.get('/base/params/itemsTree/BusinessApplyTree')
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
            console.log(nodeValue);
            nodeCtx.openDetail(nodeValue.value,{applyId: this.state.applyId,custId:this.state.custId,readonly: this.state.readonly});
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

