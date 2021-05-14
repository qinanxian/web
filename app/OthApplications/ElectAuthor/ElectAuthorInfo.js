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

export default class ElectAuthorInfo extends React.Component {

    constructor(props){
        super(props);
        const {id} = props;
        this.id = id;
        const {faceFileId} = props;
        this.faceFileId = faceFileId;
        this.state = {
            style: ''
        }
        if(this.faceFileId !=''){
            this.state.style='yes';
        }
    }

    componentDidMount(){
        $('.business-flow').css("margin-left","79px");
    }

    didMount = ({setImages}) => {
        this.setImages = setImages;
        this._imageChange(2);
    };

    _imageChange = (num) => {
        this.setImages([
            {
                url: `/api/network/getBigImgById/${this.faceFileId}`,
                thumbnailUrl: `/api/network/getBigImgById/${this.faceFileId}`,
                containSession: false,
                info: '人脸照片',
                title: '人脸照片'
            }
        ].splice(0, 11 - (11-num)), 0);
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DetailInfo
                            dataFormId="othapplications-ElectAuthorInfo"
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