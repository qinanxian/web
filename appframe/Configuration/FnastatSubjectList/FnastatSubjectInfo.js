/**
 * Created by apachechen on 2018/1/30.
 */
import React from 'react';
import {DetailInfo,Message} from '../../../src/components';

export default class FnastatSubjectInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectId: props.subjectId ? props.subjectId : null,
        };
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
        const { fnastatDefId } = this.props;
        if (fnastatDefId) {
            this.voInfo.setValue('fnastatDefId', fnastatDefId);
        }
    };

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        const { fnastatDefId } = this.props;
        if (fnastatDefId) {
            this.voInfo.setValue('fnastatDefId', fnastatDefId);
        }
    };

    saveData = (cb) => {
        return this.voInfo && this.voInfo.saveData((err, values) => {
                if (err) {
                    Message.info('保存失败！');
                } else {
                    const {refresh} = this.props;
                    refresh && refresh();
                }
                cb(err, values);
            });
    }

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="configuration-FnastatSubjectInfo"
                    params={{fnastatDefId:this.props.fnastatDefId,subjectId:this.state.subjectId}}
                    formReady={this.formReady}
                    //dataReady={this.dataReady}
                />
            </div>

        );
    }
}
