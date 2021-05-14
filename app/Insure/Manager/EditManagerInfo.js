import React from "react";

import {
    Row,
    Col,
    DetailInfo,
    Message,
    openModal,
    Modal,
    Icon,
    DataTablePicker,
    Upload,
    Fieldset, rest, Notify
} from '../../../src/components';
import {ImageViewer,  openMask} from 'roface';
import NewNetWorkInfo from "../../CodeToDo/NetWork/NewNetWorkInfo";

export default class ManagerInfo extends React.Component {

    constructor(props) {
        super(props);
        const {id} = props;
        this.id = id;
    }

    componentDidMount(){
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setItemSuffix('orgName', () => {
            return (
                <Icon
                    type="ellipsis"
                    onClick={this.openNetWorkNoModal}
                    style={{ height: 20, ...this.props.style, cursor: 'pointer' }}
                />
            );
        });
    };

    openNetWorkNoModal = () => {
        openModal(
            <NewNetWorkInfo
                {...this.props}
                checkable={false}
                dataReady={handler => {
                    this.treeHandler = handler
                }}
            />,
            {
                title: "所属机构网点",
                defaultButton: true,
                onOk: (a, b, c) => {
                    const selected = this.treeHandler.getSelectedItem();
                    const selectedItem = selected &&　selected[0];
                    const orgId = selectedItem.id;
                    this.voInfo.setValue("orgId", orgId);
                    this.voInfo.setValue("orgName", selectedItem.name);
                    rest.get(`/insure/network/getBraInfo/${orgId}`)
                        .then((data) => {
                            console.log(data);
                            if (data.status == 1) {
                                this.voInfo.setValue("braName", data.braName);
                                this.voInfo.setValue("braId", data.braId);
                            } else {
                                Notify.error("获取一级支行信息失败！");
                            }
                        }).catch((error) => {
                            Notify.error("出现异常");
                        }
                    )

                    a.close();
                },
                onCancel: (a, b) => {
                }
            }
        );
    };

    EditManInfoSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="insure-EditManagerInfo"
                    dataReady={this.dataReady}
                    params={{id: this.id}}
                    reading={this.props.readonly}
                    labelWidth={158}
                />
            </div>
        );
    }

}
