import React from "react";
import {getUser} from '../../../src/lib/cache';
import {Row, Col, DetailInfo, Message, openModal, Modal, Icon, DataTable} from '../../../src/components';


export default class QueryOrderManager extends React.Component {


  constructor(props) {
    super(props);
    const {userOrg} = props;
    this.userOrg = userOrg;
    this.userId = getUser().id;
  }

  dataReady = (v) =>{
    const { dataReady } = this.props;
    dataReady && dataReady(v)
  };

  render() {
    return (
        <div>
          <DataTable
              dataFormId="insure-QueryOrderManager"
              params={{userOrg: this.userOrg,userId:this.userId}}
              dataReady={this.dataReady}
          />
        </div>
    );
  }
}
