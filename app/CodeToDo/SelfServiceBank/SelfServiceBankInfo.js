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
import NewNetWorkInfo from "../NetWork/NewNetWorkInfo";


export default class SelfServiceBankInfo extends React.Component {

    constructor(props) {
        super(props);
        const {ID} = props;
        this.ID = ID;
        this.state = {
        hasImg : false,
        networkImg : [],
        imgId : ""
      }
    }

    componentDidMount(){
      this.getNetworkImg();
    }

    formReady = (voList) => {
        $('.ro-ad-container-search-label').css("width","140px");
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.createNetWorkNo
        },
        ]);
    };

    createNetWorkNo = () => {
        this.openNetWorkNoModal("新增所属机构");
    }

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
                    this.voInfo.setValue("names", selectedItem.name);
                    this.voInfo.setValue("networkNo", selectedItem.code);
                    a.close();
                },
                onCancel: (a, b) => {
                }
            }
        );
    };

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        // this.voInfo.setValue("networkNo", this.userOrg);
        this.voInfo.setItemSuffix('names', () => {
            return (
                <Icon
                    type="ellipsis"
                    onClick={this.openNetWorkNoModal}
                    style={{ height: 20, ...this.props.style, cursor: 'pointer' }}
                />
            );
        })
    };

    InfoSave = (cb) => {
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

    upload = (fileStatus) => {
      if (fileStatus === "done"){
        Notify.info('上传成功');
        this.getNetworkImg();
        const {refresh} = this.props;
        refresh && refresh();
      }else if(fileStatus === "uploading"){

      } else {
        Notify.info('上传失败');
      }

    };

    getNetworkImg = () => {
      rest.get(`/api/network/getImageRecordByNetworkId/${this.ID}/0002`)
        .then((data)=>{
          if(data.body.length > 0){
            this.setState({
              networkImg:data.body,
              hasImg:true
            });
          }else {
            this.setState({
              networkImg:data.body,
              hasImg:false
            });
          }
        }).catch((error)=>{
        Notify.error("图片加载异常");
      })
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
          info: '网点照片',
          title: '网点照片'
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
            this.getNetworkImg();
          }
        }).catch((error)=>{
        Notify.error("图片删除异常");
      })
    }

    renderNetWorkImg = () => {
      if(this.state.hasImg){
        const networkImg = this.state.networkImg;
        console.log(networkImg);
        return (
          <div>
            {networkImg.map((item)=>{
              return <div>
                <img className="ro-modal-tree-img" width='100px' height='100px'
                     style={{marginLeft:'30px'}}
                     src={item.imageBase}
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
                    dataFormId="codetodo-SelfServiceBankInfo"
                    dataReady={this.dataReady}
                    params={{ID: this.ID}}
                    reading={this.props.readonly}
                    labelWidth={158}
                />
              { this.ID != null ?
              <div style={{"margin-left" : "40px"}}>
                <span>>点击上传：</span>
                <Upload
                  style={{ whiteSpace: 'nowrap', margin: '2px' }}
                  //MSB_NETWORK_INFO表中的主键id
                  action={`/api/network/uploadImg/${this.ID}/0002`}
                  onChange={this.upload}
                  name={"上传"}
                  buttonType={'a'}
                  multiple={true}
                />
              </div> : <div></div>}
              {this.renderNetWorkImg()}
            </div>
        );
    }

}
