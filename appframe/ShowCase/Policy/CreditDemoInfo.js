import React from 'react';
import {Message, propsCompose, Notify, DetailInfo} from '../../../src/components';


@propsCompose
export default class CreditDemoInfo extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            planId: props.param.planId || null,
            prodPolicy: props.param.prodPolicy || null,

        };
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.addButton([{
            name: '保存',
            onClick: this.saveInfo,
            type:'primary'
        }]);
    };

    saveInfo = () => {
        this.voInfo.saveData((err, values) => {
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
                    dataFormId="demo-PolicyDemoInfo"
                    params={{planId: this.state.planId, prodPolicy: this.state.prodPolicy}}
                    formReady={this.formReady}
                />
            </div>

        );
    }
}

