import React from "react";
import {
    Col,
    Row,
    Text
} from '../../../src/components';

export default class InputModal extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            labelName: props.labelName,
        };
    }

    dataChange = (value) => {
        this.setState({
            inputValue: value,
        });
    }

    inputText = (cb) =>{
        const text = this.state.inputValue;
        cb(text);
    }


    render() {
        return (
            <div>
                <Row>
                    <Col span={3}>
                        {this.state.labelName}
                    </Col>
                    <Col span={5}>
                        <Text onBlur={(value) => this.dataChange(value)} valuenullholder={' '} reading={false}/>
                     </Col>
                </Row>
            </div>
              );
}
}


