import React from 'react';
import {
    DataTable,
    Row,
    Col,
    DetailInfo,
    Message,
    Button,
    DataTablePicker,
    openModal,
    Modal,
    Notify
} from '../../../../src/components';
import UserAddOrg from "./UserAddOrg";

export default class UserInfo extends React.Component {
    constructor(props) {
        super();
        this.userId = props.userId;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if (this.userId) {
            this.voInfo.setItemVisible('id', true);
        } else {
            this.voInfo.setValue('status', '1');
        }
        this.voInfo.setItemSuffix('orgname', () => {
            return (
              <DataTablePicker
                dataFormId="system-OrgSummaryList"
                pageSize={5}
                title='选择机构'
                onOk={(e, row) => {
                  row && this.voInfo.setValue('orgname', row.name);
                  this.voInfo.setValue('orgId', row.id)
                }}
              />
            );
        })
    };

    userInfoSave = () => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Notify.error('保存失败！');
            } else {
                Notify.success('保存成功！');
                this.tableRefresh();
                this.refresh();
            }
        });
    };

    tableRefresh = () => {
        this.voInfo.refresh();
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.add,
            type: 'primary',
            icon: 'save'
        }, {
            name: '删除',
            selectBind: true,
            onClick: this.deleteOrg,
            type: 'primary',
            icon: 'delete'
        }
        ]);
    };

    add = () =>{
        const that = this;
        openModal(<UserAddOrg params={{userId: this.userId}}/>,{
                defaultButton: true,
                title:"机构添加" ,
                onOk(modal, compnent, btn) {
                    compnent.relateUser((data) => {
                        if (data) {
                            modal.close();
                            Notify.info("添加成功！");
                            that.tableRefresh();
                            that.refresh();
                        } else {
                            btn.setDisabled(false);
                        }

                    });
                },
                onCancel(modal, compnent) {
                },
            }
        );
    }

    deleteOrg = () =>{
        const selectedRows = this.voList.getSelectedRows();
        console.log(selectedRows[0])
        if(selectedRows[0].isMain=="Y"){
            Notify.error("主机构不得删除", "错误提示");
        }else {
            Modal.confirm({
                title: '删除机构确认',
                content: '您确定删除这些机构吗？删除后数据不可恢复！',
                okText:'确定',
                cancelText:'取消',
                onOk: () => {
                    this.voList.deleteRows(selectedRows);
                },
            });
        }
    }

    refresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
                <Row>
                    <Col span={12}>
                        <Button type='primary' style={{display: this.userId ? '' : 'none'}} onClick={this.userInfoSave}>保存</Button>
                        <DetailInfo
                            dataFormId="system-UserInfo"
                            dataReady={this.dataReady}
                            params={{userId: this.userId}}
                        />
                    </Col>
                    <Col span={12}>
                        <h3>用户所属机构</h3>
                        <DataTable
                            dataFormId="system-UserOrgList"
                            formReady={this.formReady}
                            params={{userId: this.userId}}
                            selectionType="multiple"
                            showPagination={false}
                         />
                    </Col>
                </Row>


        );
    }
}

