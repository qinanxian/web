import React from "react";

import {
  Row,
  Col,
  rest,
  DetailInfo,
  Notify,
  Upload,
  Message,
  openModal,
  Modal,
  Icon,
  MultiPartInput,
  Button
} from '../../../src/components';
import {ImageViewer,  openMask} from 'roface';
import LayoutIcon from "../../../appframe/Components/jsmind/Icon";
import {getUser} from '../../../src/lib/cache';
import NewNetWorkInfo from "../NetWork/NewNetWorkInfo";
import moment from "moment";

export default class BusinessTypeInfo extends React.Component {

    constructor(props){
        super(props);
        const {businessTypeId} = props;
        this.businessTypeId = businessTypeId;
        this.state = ({
            hasImgBase : false,
            imgBase : {},
            imgBaseId : '',
            realId : '',
            bigImageId : '',
        })
    }

    componentDidMount(){
        $('.business-flow').css("margin-left","79px");
        this.showCompressedImg();
    }

    showCompressedImg = () => {
        if(this.businessTypeId != null){
            rest.get(`/businessType/getCompressedImgByBusinessId/${this.businessTypeId}`)
            .then((response)=>{
                console.log(response.body[0].imageBase);
                if(response.body.length > 0){
                    this.setState({
                        hasImgBase : true,
                        imgBase : response.body[0].imageBase,
                        imgBaseId : response.body[0].id,
                        bigImageId : response.body[0].bigImageId,
                    })
                }

            }).catch((error)=>{
                Notify.error("未加载到业务流程图片");
            })
        }
    }

    dataReady = (voInfo) => {
      this.voInfo = voInfo;
      if(this.openTimeId != null){
          // this.voInfo.setValueReadonly('id', true);
      }
      this.voInfo.setItemTemplate(
        'channel',
        <MultiPartInput />
      );
      this.voInfo.setItemTemplate(
        'tip',
        <MultiPartInput />
      );
      this.voInfo.setItemSuffix('businessIcon', () => {
        return (
          <Icon
            type="ellipsis"
            onClick={this._showLayoutIcon}
            style={{ height: 20, ...this.props.style, cursor: 'pointer' }}
          />
        );
      })
    };

    handleIconChangeSubmit = (icon) => {
      this.voInfo.setValue("businessIcon", icon);
      this.currentIconModal && this.currentIconModal.close();
    };

    _showLayoutIcon = () => {
      this.currentIconModal = openModal(<LayoutIcon onClick={this.handleIconChangeSubmit}/>, {
        defaultButton: false,
        width: '80%',
        title: '业务图标选择',
        footer: <Button key="back"
                        onClick={() => this.currentIconModal && this.currentIconModal.close()}>取消</Button>,
      });
    };

    _multiPartInputOnChange = (value, array, code) => {
        const str = array.join(" ");
        console.log(str);
        this.voInfo.setValue(code, str);
        const x = this.voInfo.getData();
        console.log(x);
    }

    businessTypeInfoSave = (cb) => {
        //0001-已删除，0002-未删除
        this.voInfo.setValue('deleteFlag', '0002');
        if(this.state.realId.length > 0){
            this.voInfo.setValue('id',this.state.realId);
            this.voInfo.setValue('createdBy',getUser().id);
            this.voInfo.setValue('createdTime',moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
        }
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error(err.message);
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        });
    };

    uploadChange = (status, file, itemId, group) => {
        if (status === 'done') {
          const { response } = file;
          const { data } = this.state;

          console.log(response.body);
          const body = response.body;
          if(body != null){
            Message.success('文件上传成功');
            this.setState({
                hasImgBase : true,
                imgBase : body.imageBase,
                imgBaseId : body.id,
                realId : body.realId,
                bigImageId : body.bigImageId,
              });
          }else{
            Message.error(response.message);
          }

        } else if (status === 'error') {
          this.setState({
            hasImgBase: false,
          });
          Message.error('文件上传失败');
        }
    };

    _imageChange = (num,imgBaseId) => {
      console.log("_imageChange start");
      console.log(imgBaseId);
      console.log("_imageChange end");
        this.setImages([
            {
                url: `/api/network/getBigImgById/${imgBaseId}`,
                thumbnailUrl: `/api/network/getBigImgById/${imgBaseId}`,
                containSession: false,
                info: '业务流程图',
                title: '业务流程图'
            }
        ].splice(0, 11 - (11-num)), 0);
    };

    didMount = ({setImages}) => {
        this.setImages = setImages;
    };

    openImg = (imgBaseId,e) => {
      console.log("openImg id:"+imgBaseId);
        openMask(<div style={{margin: '0 auto', width: document.documentElement.clientWidth, height:document.documentElement.clientHeight}}>
            <ImageViewer didMount={this.didMount} width={document.documentElement.clientWidth - 110} height={document.documentElement.clientHeight}/>
        </div>);
        this._imageChange(2,imgBaseId);
    }

    deleteImg = (id,e) => {
      console.log(id);
      rest.get(`/api/network/deleteImgById/${id}`)
        .then((data)=>{
          if(data > 0){
            this.showCompressedImg();
            this.setState({hasImgBase:false})
          }
        }).catch((error)=>{
        Notify.error("图片加载异常");
      })
    }

    render() {

        let imgBaseShower;
        if(this.state.hasImgBase){
            imgBaseShower = <div>
              <img className="ro-modal-tree-img" width='100px' height='100px'
                   style={{marginLeft:'30px'}}
                   src={this.state.imgBase}
                   onClick={this.openImg.bind(this,this.state.bigImageId)} />
              <span className="ro-modal-tree-onblock" onClick={this.deleteImg.bind(this,this.state.imgBaseId)}>X</span>
            </div>
        }else{
            imgBaseShower = <div></div>
        }

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DetailInfo
                            dataFormId="codetodo-BusinessTypeInfo"
                            dataReady={this.dataReady}
                            params={{businessTypeId: this.businessTypeId}}
                            reading = {this.props.readonly}
                            labelWidth={158}
                        />
                    </Col>
                </Row>
                {/*{ this.businessTypeId != null ?*/}
                <div className='business-flow'>
                    <span>业务流程图：</span>
                    <Upload
                        style={{ whiteSpace: 'nowrap', margin: '2px' }}
                        action={`/businessType/uploadBusinessFlowImg/${this.businessTypeId}`}
                        onChange={this.uploadChange}
                        name={"上传"}
                        buttonType={'a'}
                        multiple={false}
                    />
                </div> : <div></div>
              {/*}*/}
                {imgBaseShower}
            </div>

        );
    }

}

