import React from 'react';
import { JSMind } from '../../../Components/index';
import { propsCompose ,Spin} from "../../../../src/components";
import { getAllPilot } from '../../../../src/lib/base';
import formatdata from '../../../Components/jsmind/formatdata.json';
@propsCompose
export default class PilotConfig extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        getAllPilot()
            .then((ret) => {
                this.setState({data: ret});
                // this.setState({data: formatdata});
            });
    }


    render() {
        if (this.state.data) {
            return (
                <JSMind dataSource={this.state.data}/>
            );
        } else {
            return <Spin tip="数据加载中..."/>
        }
    }
}

