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

export default class ElectContractInfo extends React.Component {

    constructor(props){
        super(props);
        const {custId} = props;
        this.custId = custId;
    }

    componentDidMount(){
        $('.business-flow').css("margin-left","79px");
    }

    didMount = ({setImages}) => {
        this.setImages = setImages;
    };

    render() {

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DetailInfo
                            dataFormId="othapplications-ElectContractInfo"
                            dataReady={this.dataReady}
                            params={{custId: this.custId}}
                            reading = {this.props.readonly}
                            labelWidth={158}
                        />
                    </Col>
                </Row>
            </div>
        );
    }

}