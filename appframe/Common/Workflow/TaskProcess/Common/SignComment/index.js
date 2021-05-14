/**
 * Created by apachechen on 2018/3/5.
 */
import React from 'react';

import { TextArea} from '../../../../../../src/components/index';

export default class SuggestTextArea extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value:props.commonvalue || ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.commonvalue !== this.state.value){
            this.setState({value:nextProps.commonvalue})
        }
    }

    getComment = () => {
        return this.state.value;
    };

    handleTextChange = (value) => {
        this.setState({value:value})
    };

    render() {
        const style = this.props.processor === 'default' ?
            {height:'152px',marginLeft: '5px',border: 'none',outline:'4px solid #fff'}
            : {height:'77px',marginLeft: '5px'};
        return (
            <div style={{ paddingRight: '10px'}}>
                <TextArea style={style}
                          signcomment={true}
                          rows={this.props.processor !== 'default' ? 8 : 3}
                          onChange={this.handleTextChange}
                          placeholder ="请填写意见"
                          value={this.state.value}
                />
            </div>
        );
    }
}


