import {Row, Tabs, Badge} from '../../../../src/components';
import './index.css';

import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';

import CalendarDetail from './CalendarDetail';

const TabPane = Tabs.TabPane;

export default class HolidayProfile extends React.Component {
  constructor(props){
    super(props);
    // 获取包括当年在内的十年的数据
    moment.locale('zh-cn');
    this.current = moment();
    const tempYears = [];
    tempYears.push(moment(this.current).subtract(1, 'y'));
    tempYears.push(this.current);
    for (let i = 1 ; i <= 8; i++) {
      tempYears.push(moment(this.current).add(i, 'y'))
    }
    this.state = {
      years: tempYears,
      allHolidays: [],
    };
  }
  componentDidMount(){
    const { rest, closeLoading, openLoading } = this.props;
    openLoading && openLoading();
    rest.get(`/holiday/holidays`).then((data) => {
      this.setState({
        allHolidays: data.reduce((a, b) => {
          const tempA = {...a};
          const year = moment(b.holidayDate).format('YYYY');
          if (!tempA[year]) {
            tempA[year] = [];
          }
          tempA[year].push(b.holidayDate);
          return tempA;
        }, {}),
      }, () => {
        closeLoading && closeLoading();
      });
    });
  }
  render() {
    const { years, allHolidays } = this.state;
        return (
            <Row>
                <Tabs
                    defaultActiveKey={this.current.year().toString()}
                >
                  {
                    years.map(y => {
                      return (
                        <TabPane
                          tab={
                            <span className={'holiday-profile-tab'}>
                              <span
                                className={'holiday-profile-tab-name'}
                              >
                                {y.year()}
                              </span>
                              <span
                                style={{display: (allHolidays[y.year()] || []).length > 0 ? '' : 'none'}}
                                className={'holiday-profile-tab-count'}
                              >
                                {(allHolidays[y.year()] || []).length}
                              </span>
                            </span>
                          }
                          key={y.year().toString()}
                        >
                          <CalendarDetail {...this.props} date={y}/>
                        </TabPane>
                      )
                    })
                  }
                </Tabs>
            </Row>

        );
  }
}