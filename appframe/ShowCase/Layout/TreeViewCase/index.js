import React from 'react';
import {Tree, Row, Col, DataTable, Message, Modal, showModal, Button,TreeDetail} from '../../../../src/components';

export default class TreeViewCase extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        const {rest, openLoading, closeLoading} = props;
        openLoading();
        rest.get('/base/params/itemsTree/DemoTree')
            .then((data) => {
            console.log(data);
                this.setState({dataSource: data});
                closeLoading();
            });
    }

    treeOnSelect = (nodeCtx, node) => {
        const selectedNode = node.selectedNodes[0];
        if(!selectedNode)return;
        const nodeValue = selectedNode.props && selectedNode.props.value || selectedNode.value;
        // console.log('nodeCtx',nodeCtx);
        // console.log('node数据', nodeValue);
        switch (nodeValue.code){
            case '1010':
                nodeCtx.openDetail('ShowCase/Guide/HelloWord');
                break;
            case '1020':
                nodeCtx.openDetail(<div>这是JSX加载的页面数据</div>);
                break;
            case '1030':
                nodeCtx.openDetail(<DataTable
                    dataFormId="demo-BeanPersonList"
                    params={{code: 'BeanPersonList'}}
                />);
                break;
            default:
                if(nodeValue.value){
                    nodeCtx.openDetail(nodeValue.value);
                }else{
                    Message.error('页面的URL为空');
                }
                break;
        }
    };


    render() {
        return (
            <div>
                <Row>
                    <TreeDetail
                        showLine
                        defaultExpandedKeys={['10', '20']}
                        defaultSelectedKeys={['1010']}
                        treeSpan={6} detailSpan={18}
                        onSelect={this.treeOnSelect}
                        dataSource={this.state.dataSource}
                        nodeTitle="value.name" nodeKey="value.code" childrenKey="children"
                    >
                    </TreeDetail>
                </Row>
            </div>

        );
    }
}

