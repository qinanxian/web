import React from "react";

import {
    DetailInfo,
    Row
} from '../../../src/components/index';
import {ImageViewer,  openMask} from 'roface';
import {Notify, rest} from "../../../src/components";
import "./index.less";

export default class CustWishesInfoDetail extends React.Component {

    constructor(props){
        super(props);
        this.state = ({
            custId: props.param ? props.param.custId : props.custId,
            readonly: props.param ? props.param.readonly : props.readonly,
            //借款借据
            loanImageOb: {},
            //交易对手信息
            rivalImageOb: {},
            //提款申请书
            drawImageOb: {},
            //人脸照片、身份证正反面照片
            faceImageOb: {},
            frontImageOb: {},
            reverseImageOb: {},
        })
    }

    componentDidMount(){
        this.showCompressedImg();
    }

    showCompressedImg = () => {
        if(this.state.custId != null){
            rest.get(`/customerWishes/getCompressedImgByCustomerId/${this.state.custId}`)
                .then((response)=>{
                    const loanImageOb = response.loan[0] || {};
                    const rivalImageOb = response.counter[0] || {};
                    const drawImageOb = response.drawings[0] || {};
                    const faceImageOb = response.faceFileId[0] || {};
                    const frontImageOb = response.frontImageId[0] || {};
                    const reverseImageOb = response.reverseImageId[0] || {};
                    this.setState({
                      loanImageOb,
                      rivalImageOb,
                      drawImageOb,
                      faceImageOb,
                      frontImageOb,
                      reverseImageOb
                    })
                }).catch((error)=>{
                Notify.error("未加载到客户意愿图片");
            })
        }
    }

    _imageChange = (imgBaseId) => {
        this.setImages([{
                url: `/api/network/getBigImgById/${imgBaseId}`,
                thumbnailUrl: `/api/network/getBigImgById/${imgBaseId}`,
                containSession: false,
                info: '',
                title: ''
            }])
    };
    didMount = ({setImages}) => {
        this.setImages = setImages;
    };

    openImg = (bigImageId) => {
        openMask(
          <div style={{margin: '0 auto', width: document.documentElement.clientWidth, height:document.documentElement.clientHeight}}>
            <ImageViewer didMount={this.didMount} width={document.documentElement.clientWidth - 110} height={document.documentElement.clientHeight}/>
          </div>
        );
        this._imageChange(bigImageId);
    }

    renderImageItem = (title, imageOb) => {
        let base64Str = imageOb.imageBase || '';
        if (!base64Str.includes('data:image/')) {
            base64Str = `data:image/png;base64,${imageOb.imageBase}`
        }
      return (
        <div className="cust-wishes-img-item">
          <div>{title}：</div>
          {imageOb.bigImageId
            ? <img
                className="cust-wishes-info-img"
                src={base64Str}
                onClick={() => this.openImg(imageOb.bigImageId)}
              />
            : <div className="cust-wishes-info-img">{"\<当前无图片\>"}</div>
          }
        </div>
      )
    }

    render() {
        const { loanImageOb, rivalImageOb, drawImageOb, faceImageOb,
          frontImageOb, reverseImageOb } = this.state;
        return (
            <div>
                <Row>
                    <DetailInfo
                        dataFormId="othapplications-CustWishesInfo"
                        dataReady = {this.dataReady}
                        formReady = {this.formReadyBasicInfo}
                        params = {{custId:this.state.custId}}
                    />
                </Row>
                <div className="cust-wishes-wrapper">
                    {this.renderImageItem("借款借据", loanImageOb,)}
                    {this.renderImageItem("提款申请书", drawImageOb)}
                    {this.renderImageItem("交易对手信息", rivalImageOb)}
                    {this.renderImageItem("人脸照片", faceImageOb)}
                    {this.renderImageItem("身份证正面", frontImageOb)}
                    {this.renderImageItem("身份证反面", reverseImageOb)}
                </div>
            </div>
        );
    }
}