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
} from '../../../src/components/index';

import {ImageViewer,  openMask} from 'roface';

export default class DoorSignatrueInfo extends React.Component {

    constructor(props){
        super(props);
        const {id} = props;
        this.id = id;
        const {faceFileId} = props;
        this.faceFileId = faceFileId;
        const {frontImageId} = props;
        this.frontImageId = frontImageId;
        const {reverseImageId} = props;
        this.reverseImageId = reverseImageId;
        const {signatureId} = props;
        this.signatureId = signatureId;
        this.state = {
            style: ''
        }
        if(this.faceFileId !=''||this.frontImageId !=''||this.reverseImageId !=''||this.signatureId !=''){
            this.state.style='yes';
        }
    }

    componentDidMount(){
        $('.business-flow').css("margin-left","79px");
    }

    didMount = ({setImages}) => {
        this.setImages = setImages;
        this._imageChange(11);
    };

    _imageChange = (num) => {
        let arr=[
            {
                url: `/api/network/getBigImgById/${this.faceFileId}`,
                thumbnailUrl: `/api/network/getBigImgById/${this.faceFileId}`,
                containSession: false,
                info: '人脸照片',
                title: '人脸照片',
                id:this.faceFileId
            },
            {
                url: `/api/network/getBigImgById/${this.frontImageId}`,
                thumbnailUrl: `/api/network/getBigImgById/${this.frontImageId}`,
                containSession: false,
                info: '身份证正面照片',
                title: '身份证正面照片',
                id:this.frontImageId
            },
            {
                url: `/api/network/getBigImgById/${this.reverseImageId}`,
                thumbnailUrl: `/api/network/getBigImgById/${this.reverseImageId}`,
                containSession: false,
                info: '身份证反面照片',
                title: '身份证反面照片',
                id:this.reverseImageId
            },
            {
                url: `/api/network/getBigImgById/${this.signatureId}`,
                thumbnailUrl: `/api/network/getBigImgById/${this.signatureId}`,
                containSession: false,
                info: '客户签字照片',
                title: '客户签字照片',
                id:this.signatureId
            }
        ].filter(item=>item.id);
        this.setImages(arr.splice(0, 11 - (11-num)), 0);
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DetailInfo
                            dataFormId="othapplications-DoorSignatrueInfo"
                            dataReady={this.dataReady}
                            params={{id: this.id}}
                            reading = {this.props.readonly}
                            labelWidth={158}
                        />
                    </Col>
                </Row>
                <div style={{marginLeft:'150px'}} >
                    {
                        this.state.style === '' ? null: <ImageViewer didMount={this.didMount}  width={400} height={500}/>
                    }
                </div>
            </div>
        );
    }

}