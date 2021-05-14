import React from "react";

import { Collapse, Message, propsCompose} from '../../../src/components';
import InvestHistoryList from './InvestHistoryList';
import InvestValidList from './InvestValidList';

const Panel = Collapse.Panel;

@propsCompose
export default class Invest extends React.Component {
    render() {
        return (
            <div>
              <InvestValidList custId={this.props.custId} readonly = {this.props.readonly} />
            </div>
        );
    }
}