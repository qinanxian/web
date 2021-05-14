import React from 'react';

import {DetailInfo, Button} from '../../../../src/components/index';

export default class ProcInstInfo extends React.Component {
    //dataTable(vm),meta,dom
    dataReady(info,meta,dom){
        // info.setAllReadingMode(true);
        // console.log('form-ready:',dataTable,meta,dom);
    }
    //   System/Workflow/Designer/WorkflowProcInstList


    render() {
        const { param } = this.props;
        return (
            <DetailInfo dataFormId="workflow-ProcInstInfo"
                        dataReady={this.dataReady}
                        reading={true}
                       params={{
                           procId: param.procId
                       }}/>
        );
    }
}