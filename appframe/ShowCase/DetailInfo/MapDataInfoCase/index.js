import React from 'react';

import {DetailInfo} from '../../../../src/components';

export default class MapDataInfoCase extends React.Component {
    formReady = (formInfo) => {
        this.formInfo = formInfo;
        this.formInfo.addButton([{
            name: '保存',
            type: 'primary',
            icon: 'fa-save',
            onClick: this.saveData
        }]);
    };

    saveData = () => {
        this.formInfo.saveData();
    };

    dataReady = (dataInfo) => {
        console.log('voinfo',dataInfo);
    };

    render() {
        return (
            <DetailInfo
                params={{id: 18}}
                dataFormId="demo-MapPersonInfo"
                formReady={this.formReady}
                dataReady={this.dataReady}/>
        );
    }
}

