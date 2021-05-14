import React from 'react';
import {DetailInfo, Message, Notify} from '../../../src/components';

export default class HomeBlockInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardKey: props.boardKey
        };
    }

    formReady = (voinfo) => {
        this.voinfo = voinfo;
    };

    saveInfo = (cb) => {
        this.voinfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        });
    };




    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="configuration-HomeBlockInfo"
                    params={{boardKey: this.state.boardKey || ''}}
                    formReady={this.formReady}
                    labelWidth={100}
                />
            </div>

        );
    }
}

