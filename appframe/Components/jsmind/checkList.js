import React from 'react';
import { Steps } from 'antd';
import { propsCompose } from '../../../src/components/propscompose';

const Step = Steps.Step;

/* eslint-disable */
@propsCompose
class CheckList extends React.Component {
    render() {
      const { dataSource } = this.props;
        return (
          <Steps direction="vertical" size="small" current={dataSource.length + 1}>
            {
              dataSource.map(stepItem => <Step title={stepItem} />)
            }
          </Steps>
        );
    }
}

export default CheckList;
