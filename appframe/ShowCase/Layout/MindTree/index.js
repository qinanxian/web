import React from 'react';
import { MindTree } from '../../../Components/index';
import {Spin, Button } from "../../../../src/components";
import { getUserPilot } from "../../../../src/lib/base";

export default class MindTreeCase extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: null };
        this.treeViewRef = null;
    }

    componentDidMount() {
        getUserPilot()
            .then((ret) => {
                this.setState({ data: [ret] });
            });
    }

    getSelectedObjectList = () => {
        this.treeViewRef && this.treeViewRef.getSelectedObjectList();  //[{},{}]
    };
    getSelectedIdList = () => {
        this.treeViewRef && this.treeViewRef.getSelectedIdList();//['id1','id2','id3']
    };
    setSelectedById = () => {
        const setIdList = [
            "root.home",
            "root.customer.ent.0b2aa0a163d255883.0b2aa0a16dbf2ee86",
            "root.customer.ent.0b2aa0a163d255883.1b2aa0a1747225c83",
            "root.customer.ent.0b2aa0a163d255883.2b2aa0a18320ae0fd",
            "root.customer.ent.0b2aa0a163d255883",
            "root.customer.ind",
            "root.customer.black"
        ];
        // const setIdList1 = [
        //     "root.home",
        //     "root.customer.ent.0b2aa0a163d255883.0b2aa0a16dbf2ee86",
        //     "root.customer.ent.1b2aa0a19f77340ab.0b2aa0a1a96d3e982",
        //     "root.customer.thrid.layer.lawfirmmanager",
        //     "root.customer.thrid.evaluateAgency",
        //     "root.customer.black",
        //     "root.daily",
        //     "root.daily.workflowDelegate"
        // ]; -origin data
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
        if (this.state.data) {
            return (
              <div style={{ padding: 5 }}>
                  <div>
                      <Button onClick={this.getSelectedObjectList} style={{ marginRight: 5 }}>选中结构数据</Button>
                      <Button onClick={this.getSelectedIdList} style={{ marginRight: 5 }}>选中主键数据</Button>
                      <Button onClick={this.setSelectedById} style={{ marginRight: 5 }}>设置选中</Button>
                  </div>
                  <MindTree
                    ref={inst => this.treeViewRef = inst}
                    dataSource={this.state.data}
                  />
              </div>
            );
        } else {
            return <Spin tip="数据加载中..." />
        }
    }
}

