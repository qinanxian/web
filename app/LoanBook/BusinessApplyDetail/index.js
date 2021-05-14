import React from 'react';

import { DetailInfo, Message, openModal, Modal,Icon} from '../../../src/components';

export default class BusinessDetail extends React.Component {

    constructor(props) {
        super(props);
        const {applyId} = this.props.applyId;
        this.applyId = applyId;
    }

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="business-BusinessApplyDetail"
                    params={{applyId: this.props.applyId}}
                    //defaultButton={!this.props.isReadOnly}
                    reading = {this.props.readonly}
                    labelWidth={150}
                    saveMessageEnable={false}
                />
            </div>
        );
    }
}