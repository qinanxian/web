import React from 'react';
import {DetailInfo, Message,Notify} from '../../../src/components';

export default class CustomInfo extends React.Component {
    constructor(props) {
        super(props);
        const { param, custId } = this.props;
        this.state = {
            custId: custId || (param && param.custId),
        };
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    formReady = (voinfo) => {
        this.voinfo = voinfo;
        
        this.voinfo.setItemTemplate("frontImageId",<img src={this.voinfo.getValue("frontImageId")}/>);
        this.voinfo.setItemTemplate("reverseImageId",<img src={this.voinfo.getValue("reverseImageId")}/>);
    };

    saveInfo = () => {
        this.voinfo.setValue("isDraft","N");
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="customer-CustomInfo"
                    params={{custId: this.state.custId}}
                    dataReady={this.dataReady}
                    formReady={this.formReady}
                    //defaultButton={!this.props.isReadOnly}
                    reading = {this.props.readonly}
                    labelWidth={150}
                    saveMessageEnable={false}
                />
            </div>
        );
    }
}

