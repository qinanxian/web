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
import GetCompanyInfo from './GetCompanyInfo';
import GetProductInfo from './GetProductInfo';
import QueryOrderManager from "./QueryOrderManager";

export default class EditOrderInfo extends React.Component {

    constructor(props) {
        super(props);
        const {id,comName,proName} = props;
        this.id = id;
        this.state = {
            hasImg : false,
            orderImg : [],
            imgId : "",
            netorgNo: "",
            comId:"",
            comName:"",
            proName:"",
        }
    }
    componentWillMount(){
        if(this.id != null){
            rest.get(`/insure/network/getComProInfoById/${this.id}`)
                .then((response)=>{
                    this.state.comName = response.comName;
                    this.state.proName = response.proName;
                }).catch((error)=>{
                Notify.error("未获取到用户操作权限信息");
            })
        }
      this.getOrderImg();
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue("attribut1", this.state.comName);
        this.voInfo.setValue("attribut2", this.state.proName);
        this.voInfo.setItemSuffix('netorgName', () => {
            return (
                <Icon
                    type="ellipsis"
                    onClick={this.openNetWorkNoModal}
                    style={{ height: 20, ...this.props.style, cursor: 'pointer' }}
                />
            );
        });
        this.voInfo.setItemSuffix('comId', () => {
            return (
                <Icon
                    type="ellipsis"
                    onClick={this.openComInfoModal}
                    style={{ height: 20, ...this.props.style, cursor: 'pointer' }}
                />
            );
        });
        this.voInfo.setItemSuffix('proId', () => {
            return (
                <Icon
                    type="ellipsis"
                    onClick={this.openProInfoModal}
                    style={{ height: 20, ...this.props.style, cursor: 'pointer' }}
                />
            );
        });
        this.voInfo.setItemSuffix('mgrName', () => {
            return (
                <Icon
                    type="ellipsis"
                    onClick={this.openMgrNameModal}
                    style={{ height: 20, ...this.props.style, cursor: 'pointer' }}
                />
            );
        })
    };
    openMgrNameModal = () => {
        this.state.netorgNo = this.voInfo.getValue("netorgNo");
        if(this.state.netorgNo === ""){
            Notify.error("保单所属网点为空，无法查找网点对应的保单管理员！");
        }else{
            openModal(<QueryOrderManager
                    userOrg={this.state.netorgNo}
                    dataReady={handler => {
                        this.treeHandler = handler
                    }}
                />,
                {
                    userOrg: this.state.netorgNo,
                    title: "保单管理员",
                    defaultButton: true,
                    onOk: (a, b, c) => {
                        const selected = this.treeHandler.getSelectedRows();
                        const selectedItem = selected &&　selected[0];
                        this.voInfo.setValue("mgrName",  selectedItem.manName);
                        this.voInfo.setValue("mgrOaNo",  selectedItem.manOa);
                        a.close();
                    },
                    onCancel: (a, b) => {
                    }
                }
            );
        }
    };
    openProInfoModal = () => {
        this.state.comId = this.voInfo.getValue("comId");
        if(this.state.comId === ""){
            Notify.error("保险公司为空，无法查找保险公司对应的保险产品！");
        }else{
            openModal(<GetProductInfo
                    comId={this.state.comId}
                    dataReady={handler => {
                        this.treeHandler = handler
                    }}
                />,
                {
                    comId: this.state.comId,
                    title: "选择保险产品",
                    defaultButton: true,
                    onOk: (a, b, c) => {
                        const selected = this.treeHandler.getSelectedRows();
                        const selectedItem = selected &&　selected[0];
                        this.voInfo.setValue("proId", selectedItem.proId);
                        this.voInfo.setValue("attribut2",  selectedItem.proName);
                        a.close();
                    },
                    onCancel: (a, b) => {
                    }
                }
            );
        }
    };
    openComInfoModal = () => {
        this.state.netorgNo = this.voInfo.getValue("netorgNo");
        if(this.state.netorgNo === ""){
            Notify.error("保单所属网点为空，无法查找网点对应的保险公司！");
        }else{
                openModal(<GetCompanyInfo
                        netorgNo={this.state.netorgNo}
                        dataReady={handler => {
                            this.treeHandler = handler
                        }}
                    />,
                    {
                        netorgNo: this.state.netorgNo,
                        title: "选择保险公司",
                        defaultButton: true,
                        onOk: (a, b, c) => {
                            const selected = this.treeHandler.getSelectedRows();
                            const selectedItem = selected &&　selected[0];
                            this.state.comId = selectedItem.comId ;
                            this.voInfo.setValue("comId", this.state.comId);
                            this.voInfo.setValue("attribut1",  selectedItem.comName);
                            this.voInfo.setValue("attribut2", "");
                                this.voInfo.setValue("proId", "");
                            a.close();
                        },
                        onCancel: (a, b) => {
                        }
                    }
                );
        }
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
                    this.state.netorgNo = selectedItem.id;
                    this.voInfo.setValue("netorgNo", this.state.netorgNo);
                    this.voInfo.setValue("netorgName", selectedItem.name);
                    rest.get(`/insure/network/getBraInfo/${this.state.netorgNo}`)
                        .then((data) => {
                            console.log(data);
                            if (data.status == 1) {
                                this.voInfo.setValue("orgName", data.braName);
                                this.voInfo.setValue("orgNo", data.braId);
                                this.voInfo.setValue("attribut1", "");
                                    this.voInfo.setValue("attribut2", "");
                                    this.voInfo.setValue("comId", "");
                                    this.voInfo.setValue("proId", "");
                                    this.voInfo.setValue("mgrName", "");
                            } else {
                                Notify.error("获取支行信息失败！");
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

    EditOrderInfoSave = (cb) => {
        const startTime = this.voInfo.getValue("startTime");
        const expireTime = this.voInfo.getValue("expireTime");
        if(expireTime < startTime){
            Notify.info('保单到期时间不能比起始时间早')
            cb(new Error("保单到期时间不能比起始时间早"));
        }else{
            this.voInfo.saveData((err, values) => {
                if (err) {
                    Message.error('保存失败！');
                } else {
                    const {refresh} = this.props;
                    refresh && refresh();
                }
                cb(err, values);
            });
        }
    };

    upload = (fileStatus) => {
      if (fileStatus === "done"){
        Notify.info('上传成功');
        this.getOrderImg();
        const {refresh} = this.props;
        refresh && refresh();
      }else if(fileStatus === "uploading"){

      } else {
        Notify.info('上传失败');
      }
    };

    getOrderImg = () => {
        if(this.id != null){
            rest.get(`/insure/network/getCompressedImgById/${this.id}`)
                .then((response)=>{
                    if(response.status == 1){
                        this.setState({
                            orderImg:response.voucher,
                            hasImg:true
                        });
                    }else{
                        this.setState({
                            orderImg:response.body,
                            hasImg:false
                        });
                    }
                }).catch((error)=>{
                Notify.error("图片加载异常");
            })

        }
    }

    _imageChange = (num,bigImageId) => {
      console.log("_imageChange start");
      console.log(bigImageId);
      console.log("_imageChange end");
      this.setImages([
        {
          url: `/api/network/getBigImgById/${bigImageId}`,
          thumbnailUrl: `/api/network/getBigImgById/${bigImageId}`,
          containSession: false,
          info: '缴费凭证',
          title: '缴费凭证'
        }
      ].splice(0, 11 - (11-num)), 0);
    };

    didMount = ({setImages}) => {
      this.setImages = setImages;
    };

    openImg = (bigImageId,e) => {
      console.log("openImg id:"+bigImageId);
      this.setState({imgId:bigImageId})
      openMask(<div style={{margin: '0 auto', width: document.documentElement.clientWidth, height:document.documentElement.clientHeight}}>
        <ImageViewer didMount={this.didMount} width={document.documentElement.clientWidth - 110} height={document.documentElement.clientHeight}/>
      </div>);
      this._imageChange(2,bigImageId);
    }

    deleteImg = (id,e) => {
      console.log(id);
      rest.get(`/api/network/deleteImgById/${id}`)
        .then((data)=>{
          if(data > 0){
            this.getOrderImg();
          }
        }).catch((error)=>{
        Notify.error("图片删除异常");
      })
    }

    renderOrderImg = () => {
      if(this.state.hasImg){
        const orderImg = this.state.orderImg;
        console.log(orderImg);
        return (
          <div>
            {orderImg.map((item)=>{
                let base64Str = item.imageBase || '';
                if (!base64Str.includes('data:image/')) {
                    base64Str = `data:image/png;base64,${item.imageBase}`
                }
              return <div>
                <img className="ro-modal-tree-img" width='100px' height='100px'
                     style={{marginLeft:'90px'}}
                     src={base64Str}
                     onClick={this.openImg.bind(this,item.bigImageId)} />
                <span className="ro-modal-tree-onblock" onClick={this.deleteImg.bind(this,item.id)}>X</span>
              </div>
            })}
          </div>
        )
      }else{
        return <div></div>
      }
    }

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="insure-EditOrderInfo"
                    dataReady={this.dataReady}
                    params={{id: this.id}}
                    reading={this.props.readonly}
                    labelWidth={158}
                />
              { this.id != null ?
              <div style={{"margin-left" : "70px"}}>
                <span>>点击上传：</span>
                <Upload
                  style={{ whiteSpace: 'nowrap', margin: '2px' }}
                  //MSB_NETWORK_INFO表中的主键id
                  action={`/api/network/uploadImg/${this.id}/0006`}
                  onChange={this.upload}
                  name={"上传"}
                  buttonType={'a'}
                  multiple={true}
                />
              </div> : <div></div>}
              {this.renderOrderImg()}
            </div>
        );
    }

}
