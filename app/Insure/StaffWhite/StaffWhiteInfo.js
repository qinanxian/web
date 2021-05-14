import React from "react";
import {
    Row,
    Col,
    DetailInfo,
    Message,
    openModal,
    Modal,
    Icon,
    DataTablePicker,
    Upload,
    Fieldset, rest, Notify
} from '../../../src/components';
import {ImageViewer,  openMask} from 'roface';

export default class StaffWhiteInfo extends React.Component {

    constructor(props) {
        super(props);
        const {id} = props;
        this.id = id;
    }

    componentDidMount(){
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    StaffWhiteInfoSave = (cb) => {
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
                    dataFormId="insure-StaffWhiteInfo"
                    dataReady={this.dataReady}
                    params={{id: this.id}}
                    reading={this.props.readonly}
                    labelWidth={158}
                />
            </div>
        );
    }
}
