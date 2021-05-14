import React from 'react';
import BlockCta from './BlockCta';
import OrgPer from './OrgPer';
import LoanBlock from './LoanBlock';
import BusinBlock from './BusinBlock';
import HotSellers from './HotSellers';
import MonthOrder from './MonthOrder';
import StatisticsOrder from './StatisticsOrder';
import { DropDown, TimeRange,ZoomHandle } from './OuterPack';
import './index.less';

export default class DynamicStatistic extends React.Component{
    render(){
        const { prefix = 'ro' } = this.props;
        return (
          <div className={`${prefix}-charts`}>
              <div className={`${prefix}-charts-header`}>
                  <div className={`${prefix}-charts-header-left`}>
                      <div className={`${prefix}-charts-header-left-formitem`}>
                          <DropDown/>
                      </div>
                      <div className={`${prefix}-charts-header-left-line`}/>
                  </div>
                  <div className={`${prefix}-charts-header-center`}>
                      <div className={`${prefix}-charts-header-center-text`}>业务驾驶仓</div>
                      <div className={`${prefix}-charts-header-center-line`}>
                          <span/>
                          <span/>
                      </div>
                  </div>
                  <div className={`${prefix}-charts-header-right`}>
                      <div className={`${prefix}-charts-header-right-formitem`}>
                          {/*<TimeRange/>*/}
                          <ZoomHandle {...this.props}/>
                      </div>
                      <div className={`${prefix}-charts-header-right-line`}/>
                  </div>
              </div>
              <div className={`${prefix}-charts-content`}>
                  <div className={`${prefix}-charts-content-row`} style={{height:'42%'}}>
                      <BlockCta colW={3}>
                          <OrgPer/>
                      </BlockCta>
                      <BlockCta colW={6}>
                          <LoanBlock/>
                      </BlockCta>
                      <BlockCta colW={3}>
                          <BusinBlock/>
                      </BlockCta>
                  </div>
                  <div className={`${prefix}-charts-content-row`} style={{height:'52%'}}>
                      <BlockCta colW={3}>
                          <HotSellers/>
                      </BlockCta>
                      <BlockCta colW={6}>
                          <MonthOrder/>
                      </BlockCta>
                      <BlockCta colW={3}>
                          <StatisticsOrder/>
                      </BlockCta>
                  </div>
              </div>
          </div>
        );
    }
}
