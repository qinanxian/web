import React from 'react';
import {Calendar,Col,Row} from '../../../../src/components/index';


export default class CalendarField extends React.Component {
  render() {
    return (
      <div style={{width:'100%',height:'100%',border: '1px solid #d9d9d9', borderRadius: 4,overflow:'hidden'}}>
        <Calendar style={{width:'100%',height:'100%'}} fullscreen={false} />
      </div>
    )
  }
}
