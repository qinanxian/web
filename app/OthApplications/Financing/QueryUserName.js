import React from "react";

import {Row, Col, DetailInfo, Message, openModal, Modal, Icon, DataTable} from '../../../src/components';


export default class QueryUserName extends React.Component {


  constructor(props) {
    super(props);
    const {userOrg} = props;
    this.userOrg = userOrg;
  }

  dataReady = (v) =>{
    const { dataReady } = this.props;
    dataReady && dataReady(v)
  };

  render() {
    return (
        <div>
          <DataTable
              dataFormId="othapplications-QueryUserName"
              params={{userOrg: this.userOrg}}
              dataReady={this.dataReady}
          />
        </div>
    );
  }

}
