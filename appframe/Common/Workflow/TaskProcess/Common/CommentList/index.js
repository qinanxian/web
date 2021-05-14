/**
 * Created by apachechen on 2018/3/5.
 */
import React from 'react';
import {ApprovalProcess} from '../../../../../../src/components/index';

export default class CommentList extends React.Component {
    
    render() {
        const {procId} = this.props.param;
        return (
            <ApprovalProcess
              params={procId}
            />
        );
    }
}

{/*<DataTable*/}
{/*dataFormId="workflow-WorkflowCommentList"*/}
{/*params={{procId: procId}}*/}
{/*/>*/}