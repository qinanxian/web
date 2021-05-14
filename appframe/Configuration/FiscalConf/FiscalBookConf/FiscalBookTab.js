import React from 'react';
import {Row, Col, Tabs} from '../../../../src/components';
import FiscalBookInfo from './FiscalBookInfo'
import FiscBookEntryList from './FiscBookEntryList'
import FiscBookPeriodInfo from './FiscBookPeriodInfo'


export default class FiscalBookTab extends React.Component {
  constructor(props) {
        super();
        const {bookCode} = props.param;
        const {closeLoading,openLoading} = props;
        this.tabsOptions = [
            {
                tab: '基本信息',
                key: 'fiscalBookInfo',
                content: <FiscalBookInfo bookCode = {bookCode}/>
            },
            {
                tab: '会计期间',
                key: 'fiscBookPeriod',
                content: <FiscBookPeriodInfo bookCode = {bookCode} closeLoading={closeLoading} openLoading={openLoading}/>
            },
            {
                tab: '科目明细',
                key: 'fiscVoucher',
                content: <FiscBookEntryList bookCode = {bookCode}/>
            }
        ]
  }


  render() {
    const {param} = this.props;
      return (
          <div>
              <Row>
                  <Col span={24}>
                      <Tabs type='line' style={{ color: '#9fa1a3' }} options={this.tabsOptions}/>
                  </Col>
              </Row>
          </div>
      );
  }
}

