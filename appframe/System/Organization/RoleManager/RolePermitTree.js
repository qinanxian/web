import React from "react";
import {getUserPilot, getAllPilot} from "../../../../src/lib/base";
import {Button, Spin, Row, Col, Modal, propsCompose, Notify,Icon} from "../../../../src/components";
import {MindTree} from "../../../Components";

@propsCompose
export default class RolePermitTree extends React.Component {

    constructor(props) {
        super();
        this.roleId = props.roleId;
        this.state = {treeData: null, consoleText: '', doSaving: false};
        this.treeViewRef = null;
    }

    componentDidMount() {
        const {rest} = this.props;
        Promise.all([
            getAllPilot(),
            rest.get(`/auth/role/getPermits/${this.roleId}`)]
        ).then(rets => {
            this.setState({treeData: [rets[0]] });
            const rolePermits = rets[1]
                .filter(item => item.ownerType === 'Full')
                .map(item => item.permitCode);
            this.treeViewRef && this.treeViewRef.setSelectdById(rolePermits); //['id1','id2','id3']
        });

    }

    saveUserPilot = () => {
        if (!this.treeViewRef) return;
        const {rest} = this.props;
        const ret = this.treeViewRef.getSelectedObjectList() || [];

        this.setState({doSaving: true});
        rest.post(`/auth/role/savePermit/${this.roleId}`, ret)
            .then(ret => {
                Notify.success('保存成功')
            }).catch((error) => {
            Modal.error({
                title: '保存失败',
                content: error.message
            })
        }).finally(() => {
            this.setState({doSaving: false});
        });
    }

    getSelectedObjectList = () => {
        if (!this.treeViewRef) return;
        const ret = this.treeViewRef.getSelectedObjectList();  //[{},{}]
        this.setState({consoleText: JSON.stringify(ret, '', 2)});
    };
    getSelectedIdList = () => {
        if (!this.treeViewRef) return;
        const ret = this.treeViewRef.getSelectedIdList();//['id1','id2','id3']
        this.setState({consoleText: JSON.stringify(ret, '', 2)});
    };
    setSelectedById = () => {
        const setIdList1 = [
            "root.home",
            "root.customer.ent.0b2aa0a163d255883.0b2aa0a16dbf2ee86",
            "root.customer.ent.0b2aa0a163d255883",
            "root.customer.ent",
            "root.customer",
            "root.customer.ent.1b2aa0a19f77340ab.0b2aa0a1a96d3e982",
            "root.customer.ent.1b2aa0a19f77340ab",
            "root.customer.thrid.layer.lawfirmmanager",
            "root.customer.thrid.layer",
            "root.customer.thrid",
            "root.customer.thrid.evaluateAgency",
            "root.customer.black",
            "root.daily",
            "root.daily.workflowDelegate",
            "root.project.resolutionImplementationManager.executeTask",
            "root.project.resolutionImplementationManager",
            "root.project"
        ];
        this.treeViewRef && this.treeViewRef.setSelectdById(setIdList1); //['id1','id2','id3']
    };

    render() {
        if (this.state.treeData) {
            return (
                <div style={{padding: 5}}>
                    <div>
                        <Button onClick={this.saveUserPilot}
                                style={{marginRight: 5}}
                                loading={this.state.doSaving}
                                icon={"fa-save"}
                                type={"success"}>
                            保存
                        </Button>
                    </div>
                    <Row>
                        <Col span={24}>
                            <MindTree
                                ref={inst => this.treeViewRef = inst}
                                dataSource={this.state.treeData}
                                dataEcho={false}
                            />
                        </Col>
                        {/*<Col span={10}>*/}
                            {/*<pre className="ro-develop-console-right-bash">{this.state.consoleText}</pre>*/}
                        {/*</Col>*/}
                    </Row>
                </div>
            );
        } else {
            return <Spin tip="数据加载中..."/>
        }
    }
}
