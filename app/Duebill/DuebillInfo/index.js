import {DetailInfo, propsCompose} from "../../../src/components";
import React from "react";


@propsCompose
export default class DuebillInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
    }

    render() {
        let duebillId = this.props.duebillId||this.props.param.duebillId;
        return (
            <DetailInfo
                params={{duebillId}}
                reading={true}
                dataFormId="obiz-LeaseOutDuebillInfo"
                dataReady={this.dataReady}
            />
        );
    }
}
