import React from 'react';
import {Message,TreeDetail} from '../../../src/components';
import ProductList from './ProductList';
import AuthProcessList from './AuthProcessList';

export default class ApplicationTree extends React.Component {

    static ProductList = ProductList;
    static AuthProcessList = AuthProcessList;
    
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            appId: props.param ? props.param.appId : props.appId,
            readonly: props.param ? props.param.readonly : props.readonly
        };

        const {rest, openLoading, closeLoading} = props.props ? props.props : props;
        openLoading();
        rest.get('/base/params/itemsTree/ApplicationTree')
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
            nodeCtx.openDetail(nodeValue.value,{appId: this.state.appId,readonly: this.state.readonly});
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

