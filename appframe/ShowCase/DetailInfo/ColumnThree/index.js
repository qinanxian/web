import React from 'react';

import { DetailInfo } from '../../../../src/components';


export default class ColumnThree extends React.Component {
  render() {
    return (
      <DetailInfo
        dataFormId="demo-PersonThreeColInfo"
        params={{id: 18}}
        reading={true}
        valueNullHolder={' '}
        tableBorder={true}
        labelWidth='150px'
        labelAlign='right'
      />
    );
  }
}

