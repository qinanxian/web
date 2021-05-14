import React from 'react';
import {TreeTable, Modal, openModal, Notify, Text} from '../../../src/components';
import ProductDefinitionInfo from './ProductDefinitionInfo';
import PolicyDesign from './PolicyDesign';

export default class ProductDefinitionList extends React.Component {
    static PolicyDesign = PolicyDesign;
    addProductDefinition = () => {
        //const row = this.voList.getSelectedRows()[0];
        openModal(<ProductDefinitionInfo/>, {
            width: '34%',
            defaultButton: true,
            title: "新增产品配置规则信息",
            isDragact: true,
            onOk: (modal, compnent, btn) => {
                btn.setLoading(true);
                compnent.saveProductDefinition((err, value) => {
                    if (!err) {
                        modal.close();
                        this.voList.refresh();
                    }
                    btn.setLoading(false);
                });
            },
            //policyId: row && row.policyId
        })
    };
    deleteProductDefinition = () => {
        const rows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '该产品下可能存在子产品，您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.voList.deleteRows(rows || []).then(() => {
                    this.voList.refresh();
                });
            },
        });
    };
    copyProductDefinition = () => {
        const {openLoading, closeLoading, rest} = this.props;
        const record = this.voList.getSelectedRow();
        let policyCode = record.policyCode;
        let policyId = record.policyId;
        const that = this;
        that.policyCode = policyCode;
        Modal.confirm({
            title: `将会复制${policyCode}`,
            content: (
                <div>
                    新产品代码:<Text value={that.policyCode} onChange={value => that.policyCode = value}/>
                </div>
            ),
            onOk() {
                openLoading && openLoading();
                rest.post(`/policy/copy/${policyId}/${that.policyCode}`).then((res) => {
                    if (res) {
                        closeLoading && closeLoading();
                        that.voList.refresh();
                        Notify.success({
                            message: '复制成功',
                        });
                    }
                }).catch((e) => {
                    closeLoading && closeLoading();
                    Modal.error({
                        title: '复制失败',
                        content: JSON.stringify(e),
                    });
                });
            },
        });
    };

    openTabProductInfo = () => {
        const selectedRow = this.voList.getSelectedRow();
        console.log(selectedRow);
        openModal(<ProductDefinitionInfo policyId={selectedRow.policyId}/>, {
            width: '34%',
            defaultButton: true,
            title: "产品详情",
            onOk: (modal, compnent, btn) => {
                compnent.saveProductDefinition((err, value) => {
                    if (!err) {
                        modal.close();
                        this.voList.refresh();
                    } else {
                        btn.setLoading(false);
                    }
                });
                this.voList.refresh();
            },
        });


    };


    openNewTabPolicyDesign = (type) => {
        const {flexTabs} = this.props;
        const record = this.voList.getSelectedRows()[0];
        flexTabs.open(`产品【${record.policyName}】${type === 'config' ? '配置' : '设计'}`, 'Configuration/PolicyDefinition/PolicyDesign', {
            policyId: record.policyId,
            type,
        })
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
            {
                type: 'primary',
                name: '新增产品',
                onClick: this.addProductDefinition,
                icon: "fa-plus"
            },
            {
                type: 'primary',
                name: '产品详情',
                selectBind: true,
                onClick: this.openTabProductInfo,
                icon: "fa-file-text-o"
            },
            {
                name: '配置产品',
                selectBind: true,
                onClick: () => this.openNewTabPolicyDesign('config'),
                icon: "fa-edit"
            },
            {
                name: '设计产品',
                selectBind: true,
                onClick: () => this.openNewTabPolicyDesign('design'),
                icon: "roic-apply"
            }, {
                type: 'primary',
                name: '克隆',
                selectBind: true,
                onClick: this.copyProductDefinition,
                icon: "fa-clone"
            }, {
                name: '删除',
                selectBind: true,
                onClick: this.deleteProductDefinition,
                icon: "delete"
            }, {
                name: '展开',
                onClick: this.expand,
                icon: "pluscircleo"
            }, {
                name: '收起',
                onClick: this.collapse,
                icon: "minuscircleo"
            }]);

        this.voList.setColumnTemplate('policyName', (text, record, i) => {
            const appStatus = record.policyStatus || "";
            if (appStatus === "VALID") {
                return (<span style={{"color": "#008000","fontWeight": "bold"}}>{text}</span>);
            } else {
                return (<span style={{"color": "#DCDCDC"}}>{text}</span>);
            }
        });
    };

    expand = () => {
        this.voList.expand();
    };
    collapse = () => {
        this.voList.collapse();
    };

    render() {
        return (<TreeTable
            dataFormId="configuration-PolcDefinitionList"
            keyAttribute="policyCode"
            parentAttribute="parentPolicyCode"
            toggleAttribute="policyCode"
            pageSize={0}
            formReady={this.formReady}
            buttonFixed
            expandAll
        />);
    }
}