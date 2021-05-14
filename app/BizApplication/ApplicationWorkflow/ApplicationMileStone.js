import React from 'react';
import {MileStone,Modal,Message} from '../../../src/components';

export default class  ApplicationMileStone extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            applicationId: props.param.workflowTask.workflowProc.objectId,
            dataSource:[],
            toggle:false,
        };
    }
    componentDidMount(){
        this.props.rest.get(`/landMark/getLandmarkItems/${this.state.applicationId}/APPLICATION`).then((ret) => {
            this.setState({
                dataSource:ret,
            });
        }).catch((e) => {
            Modal.error({
                title: '获取数据失败',
                content: e.message,
            });
        });
    }
    _handleClick = (value) => {
        console.log(value);
    };
    render() {
        return (
            <div className='milestone-showcase-container'>
                <MileStone
                    dataSource={this.state.dataSource}
                    handleClick={this._handleClick}
                />
            </div>
        );
    }
}
