import React from 'react';

import {DetailInfo, Button} from '../../../../src/components';

export default class MetaSeparateData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            voinfo: null,
            disabled: true,
        };
    }

    formReady = (formInfo) => {
        this.setState({
            formInfo,
            disabled: false,
        });
    };
    fillData = () => {
        const {formInfo} = this.state;
      formInfo.setData({
            birth: '1990-02-02 00:00:00.000',
            chnName: 'Alan',
            code: 'P1001',
            gender: 'M',
            name: '艾伦',
        });
    };

    render() {
        return (
            <div>
                <Button disabled={this.state.disabled} onClick={this.fillData}>填充数据</Button>
                <DetailInfo dataFormId="demo-PersonSimpleInfo" formReady={this.formReady}/>
            </div>
        );
    }
}

