import React from "react";
import moment from 'moment';

import {
  Button, DetailInfo, Upload, DataTable, openModal, Modal, Fieldset, Message,
  Notify, TimeRangPicker,TimePicker,rest
} from '../../../src/components';
import {ImageViewer,  openMask} from 'roface';
import NewNetWorkInfo from "../../CodeToDo/NetWork/NewNetWorkInfo";
import ProductInfo from './ProductInfo';

export default class CompanyInfo extends React.Component {

    constructor(props){
        super(props);
        const {id,name} = props.params;
        //保险公司ID
        this.id = id;
    }

    componentDidMount(){
    }

    didMount = ({setImages}) => {
        this.setImages = setImages;
    };

    formReadyBasicInfo = (voinfo) => {
        this.basicVoInfo = voinfo;
    }
    saveComBasicInfo = () => {
        this.basicVoInfo.setValue("comId", this.id);
        this.basicVoInfo.setValue("flag", "0");
        this.basicVoInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
                Notify.success({
                    message: '保存成功',
                })
            }
        });
    }

    formReadyPro = (voList) => {
        this.proList = voList;
        this.proList.addButton([{
               name: '新增',
               onClick: this.createPro
            },
            {
                name: '详情',
                selectBind: true,
                onClick: this.editPro
            },
            {
                name: '删除',
                selectBind: true,
                onClick: this.deletePro
            },
            {
                name: '导出EXCEL',
                type: 'default',
                onClick: () => this.exportExcel(true)
            }
        ]);
    }

    exportExcel = (isAll) => {
        this.proList.exportExcel(isAll, `保险产品.xlsx`);
    };
    createPro = (voList) => {
        this.openProductInfoModal(null,"新增保险产品");
    }
    editPro = (voList) => {
        const selectedRows = this.proList.getSelectedRows();
        const proId = selectedRows[0].proId;
        this.openProductInfoModal(proId, "保险产品详情");
    }
    openProductInfoModal = (proId, title) => {
        openModal(<ProductInfo readonly={this.props.readonly}/>, {
            title: title,
            proId: proId,
            comId : this.id,
            defaultButton: !this.props.readonly,
            refresh: this.productTableRefresh,
            onOk: (a, b, c) => {
                b.productInfoSaves((err, value) => {
                    c.setLoading(false);
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };
    deletePro = (voList) => {
        const row = this.proList.getSelectedRow();
        const { rest } = this.props;
        Modal.confirm({
            title: '删除确认',
            content: '是否确认删除',
            onOk: () => {
                rest.get(`/insure/network/deleteProById/${row.proId}`)
                    .then((res) => {
                        if(res>=0){
                            Message.success("删除成功");
                            this.productTableRefresh();
                        }
                    }).catch(error => {
                    Message.error("删除失败！");
                })
            },
            onCancel: () => {
                return;
            },
        });
    }
    productTableRefresh = () => {
        this.proList.refresh();
    }

    formReadyNet = (voList) => {
        this.netList = voList;
        this.netList.addTemplate([
            <Upload
                name={"导入"}
                action={`/comn/file/uploadParseDataListToDB/insurenet`}
                onChange={this.uploadTestDataCallback}
            />
        ]);
        this.netList.addButton([{
            name: '新增',
            onClick: this.createNet
        },
            {
                name: '删除',
                selectBind: true,
                onClick: this.deleteComNet
            },
            {
                name: '下载模版',
                icon:'fa-download',
                type: 'primary',
                selectBind: false,
                onClick: () => this.downloadTemplate()
            }
        ]);
    }
    uploadTestDataCallback = (status,ret) => {
        console.log(status);
        if(status === 'done'){
            const count = ret.response;
            Message.success(`成功导入记录[${count}]条`);
            this.netTableRefresh();
        }
    };

    downloadTemplate = () => {
        rest.download('/comn/file/downloadInsureNet','get',{templateName:'保险公司网点关联模板.xlsx'});
    };

    createNet = () => {
        this.openNetWorkInfoModal("新增网点");
    }
    openNetWorkInfoModal = (name) => {
        const { rest, openLoading, closeLoading } = this.props;
        openLoading();
        rest.get(`/insure/network/getExistedNetwork/${this.id}`)
            .then((response) => {
                closeLoading();
                const selectedKeys = response && response.map((item) => item.code);
                openModal(
                    <NewNetWorkInfo
                        {...this.props}
                        checkable={true}
                        checkedKeys={selectedKeys}
                        dataReady={handler => {
                            this.treeHandler = handler
                        }}
                    />,
                    {
                        title: name,
                        defaultButton: true,
                        onOk: (a, b, c) => {
                            a.close()
                            this.saveNewNetWorkInfo();
                        },
                        onCancel: (a, b) => {
                            console.log(a, b);
                        }
                    }
                );
            }).catch((error) => {
            closeLoading();
            Message.error("获取错误：未能获取当前关联机构！");
        })
    };

    saveNewNetWorkInfo = () => {
        const selectedKeys = this.treeHandler.getSelectedKeys();
        const { rest } = this.props;
        if (selectedKeys && selectedKeys.length > 0) {
            rest.post('/insure/network/addNetWork',{orgIdArray: selectedKeys,comId: this.id}).then((response) => {
                    this.netTableRefresh();
                }).catch(error => {
                Message.error("保存错误！");
            })
        }
    }
    deleteComNet = (voList) => {
        const row = this.netList.getSelectedRow();
        Modal.confirm({
            title: '删除确认',
            content: '是否确认删除',
            onOk: () => {
                this.netList.deleteRows([row]);
                this.netTableRefresh();
            },
            onCancel: () => {
                return;
            },
        });
    };
    // deleteComNet = (voList) => {
    //     const row = this.netList.getSelectedRow();
    //     const { rest } = this.props;
    //     Modal.confirm({
    //         title: '删除确认',
    //         content: '是否确认删除',
    //         onOk: () => {
    //             rest.post('/insure/network/deleteNetById',{comId: row.comId,netId: row.netId})
    //                 .then((res) => {
    //                     if(res>=0){
    //                         Message.success("删除成功");
    //                         this.productTableRefresh();
    //                     }
    //                 }).catch(error => {
    //                 Message.error("删除失败！");
    //             })
    //         },
    //         onCancel: () => {
    //             return;
    //         },
    //     });
    // }
    netTableRefresh = () => {
        this.netList.refresh();
    }

    render() {
        return (
            <div>
                <fieldset>
                    <div>
                        <Button type='success' onClick={this.saveComBasicInfo}>保存</Button>
                    </div>
                </fieldset>
                <Fieldset  legend="基本信息" showArrow={true}>
                    <DetailInfo
                        dataFormId="insure-CompanyInfo"
                        params={{id: this.id}}
                        labelWidth={158}
                        dataReady = {this.dataReady}
                        formReady = {this.formReadyBasicInfo}
                    />
                </Fieldset>
                <Fieldset  legend="保险产品配置" showArrow={true}>
                    <DataTable
                        dataFormId="insure-ProductList"
                        formReady={this.formReadyPro}
                        dataReady={this.dataReadyPro}
                        params={{id: this.id}}
                        // labelWidth={158}
                    />
                </Fieldset>
                <Fieldset  legend="网点配置" showArrow={true}>
                    <DataTable
                        dataFormId="insure-NetWorkList"
                        formReady={this.formReadyNet}
                        dataReady={this.dataReadyNet}
                        params={{id: this.id}}
                        // labelWidth={158}
                    />
                </Fieldset>
            </div>
        );
    }
}
