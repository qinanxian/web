import React from "react";

import {Row, Col, DetailInfo, Message, openModal, Modal, Icon} from '../../../src/components';


export default class AppraiseRecordInfo extends React.Component {


    constructor(props) {
        super(props);
        const {appraiseRecordId} = props;
        this.appraiseRecordId = appraiseRecordId;
    }


    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="codetodo-AppraiseRecordInfo"
                    params={{appraiseRecordId: this.appraiseRecordId}}
                    reading={this.props.readonly}
                    labelWidth={158}
                />
            </div>
        );
    }

}
