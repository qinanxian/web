import React from "react";

import {Message, Notify, Fieldset} from '../../../src/components';
import FnastatIndictor from './FnastatIndictor'
import FnastatList from './index'

export default class FnastatFieldSet extends React.Component {

    constructor(props) {
        super(props);
    }

    saveRecord = (cb) => {
        this.fnastatInfo.saveRecord(cb);
    };

    render() {
        const {param, custId ,readonly} = this.props;
        this.custId = custId;
        if (param && param.custId) {
            this.custId = param.custId;
        }
        this.readonly = readonly;
        if (param && param.readonly) {
            this.readonly = param.readonly;
        }
        return (
            <div>
                <Fieldset legend="财务信息-财务报表" showArrow={true}>
                    <FnastatList ref={instance => this.fnastatInfo = instance} custId={this.custId} readonly={this.readonly}/>
                </Fieldset>
                <Fieldset legend="财务信息-财务指标" showArrow={true}>
                    <FnastatIndictor custId={this.custId}/>
                </Fieldset>
            </div>
        );
    }
}