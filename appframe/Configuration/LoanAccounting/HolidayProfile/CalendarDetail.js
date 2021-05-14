import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Row, Col, Button, Divider, Tabs, openModal, ConfigProvider, Calendar} from '../../../../src/components';
import './index.css';

import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import FieldSet from "../../../../src/components/fieldset";
import LegalDetail from './LegalDetail';

export default class CalendarDetail extends React.Component {
  constructor(props) {
    super(props);
    moment.locale('zh-cn');
    this.state = {
      value: props.date,
      currentYearHolidays: [],
    };
  }
  componentDidMount(){
    const { rest, closeLoading } = this.props;
    const { value } = this.state;
    const date = value.format('x');
    rest.get(`/holiday/holidays/${date}`).then((data) => {
      this.setState({
        currentYearHolidays: data,
      }, () => {
        closeLoading && closeLoading();
      });
    });
  }
  _initWeekend = () => {
    const { rest, openLoading, closeLoading } = this.props;
    const { value } = this.state;
    const date = value.format('x');
    openLoading && openLoading();
    rest.post(`/holiday/init/${date}`).then(() => {
      this.componentDidMount();
    });
  };
  _workDay = () => {
    const { value } = this.state;
    const { rest, openLoading } = this.props;
    const date = value.format('x');
    openLoading && openLoading();
    rest.post(`/holiday/workDay/${date}`).then(() => {
      this.componentDidMount();
    });
  };
  onSelect = (value) => {
    this.setState({
      value,
    });
  };
  onPanelChange = (value) => {
    this.setState({value});
    //
  };

  getDayDate = (value) => {
    const { currentYearHolidays } = this.state;
    const stringValue = value.format('MM-DD-YYYY');
    return currentYearHolidays.filter(d => moment(d.holidayDate).format('MM-DD-YYYY') === stringValue)[0];
  };

  dateFullCellRender = (value) => {
    const data = this.getDayDate(value);
    let cellContent = <span>&nbsp;</span>;
    let className = 'workday';
    if (data) {
      const type = data.holidayType === 'weekend' ? '休' : '假';
      cellContent = <span className={'cell-content'}>{type}</span>;
      className = data.holidayType;
    }
    return (
      <div className={`ant-fullcalendar-date ${className}`}>
        <div className="ant-fullcalendar-value">{value.date()}</div>
        <div className="ant-fullcalendar-content">
          {cellContent}
        </div>
      </div>
    );
  };
  getSimpleDataRange = (days) => {
    return days.sort((a, b) => new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime())
      .map(d => {
        return {
          date: moment(d.holidayDate).format('MM-DD'),
          note: d.note,
        }
      });
  };
  generate = (date, values) => {
    const tempValues = {...values};
    delete tempValues.rangeDate;
    return {
      holidayDate: date.format('YYYY-MM-DD HH:mm:ss'),
      ...tempValues,
    };
  };
  addLegal = () => {
    openModal(<LegalDetail date={this.props.date}/>, {
      title: '添加法定假',
      defaultButton: true,
      onOk: (modal, com, btn) => {
        com.save((values) => {
          modal && modal.close();
          // 构造数组
          const tempDays = [];
          const day1 = values.rangeDate[0];
          const day2 = values.rangeDate[1];
          const count = moment(day2).diff(moment(day1), 'days');
          tempDays.push(day1);
          for (let i = 1; i <= count; i++) {
            tempDays.push(moment(day1).add(i, 'days'));
          }
          const { rest, openLoading } = this.props;
          btn.setLoading(true);
          rest.post(`/holiday/legal`, tempDays.map(d => this.generate(d, values))).then(() => {
            openLoading && openLoading();
            btn.setLoading(false);
            this.componentDidMount();
          });
        })
      }
    })
  };

  render() {
    const { value } = this.state;
    const weekend = this.state.currentYearHolidays
      .filter(h => h.holidayType === 'weekend')
      .reduce((a, b) => {
        const tempA = a;
        const mouth = moment(b.holidayDate).format('M');
        if (!tempA[mouth]){
          tempA[mouth] = [];
        }
        tempA[mouth].push(b);
        return tempA;
      }, {});
    const legal = this.state.currentYearHolidays
      .filter(h => h.holidayType === 'legal')
      .reduce((a, b) => {
        const tempA = a;
        const name = b.holidayName;
        if (!tempA[name]){
          tempA[name] = [];
        }
        tempA[name].push(b);
        return tempA;
      }, {});
    return (
      <Row gutter={10}>
        <Row gutter={10}>
          <Col span={10}>
            <FieldSet legend="假期日历" expanded={true} showArrow={false}>
              <div>
                <Button type={'primary'} onClick={this._initWeekend}>初始化双休日</Button><Divider type="vertical"/>
                <Button onClick={this._workDay}>改为工作日</Button><Divider type="vertical"/>
                <Button type={'primary'} onClick={this.addLegal}>添加法定假</Button><Divider type="vertical"/>
                <div
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    marginTop: 5,
                  }}>
                  <ConfigProvider locale={zhCN}>
                    <Calendar
                      fullscreen={false}
                      value={value}
                      onSelect={this.onSelect}
                      onPanelChange={this.onPanelChange}
                      dateFullCellRender={this.dateFullCellRender}
                      yearChange={false}
                    />
                  </ConfigProvider>
                </div>
              </div>
            </FieldSet>

          </Col>
          <Col span={4}>
            <FieldSet legend="双休日" expanded={true} showArrow={false}>
              <div>
                <table className={'holiday-table'}>
                  <thead>
                  <tr>
                    <th>月份</th>
                    <th>日期</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    Object.keys(weekend).map(m => (
                      <tr key={m}>
                        <td>{m}</td>
                        <td>{weekend[m].map(w => moment(w.holidayDate).format('D')).join(',')}</td>
                      </tr>
                    ))
                  }
                  </tbody>
                </table>
              </div>
            </FieldSet>
          </Col>
          <Col span={10}>
            <FieldSet legend="法定假" expanded={true} showArrow={false}>
              <div>
                <table className={'holiday-table'}>
                  <thead>
                  <tr>
                    <th>节日</th>
                    <th>放假时间段</th>
                    <th>天数</th>
                    <th>假期说明</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    Object.keys(legal).map(m => {
                      const simple = this.getSimpleDataRange(legal[m]);
                      const date = [...new Set(simple.map(s => s.date))].join(',');
                      const note = [...new Set(simple.map(s => s.note))].join(',');
                      return (
                        <tr key={m}>
                          <td>{m}</td>
                          <td>{date}</td>
                          <td>{legal[m].length}</td>
                          <td>{note}</td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </table>
              </div>
            </FieldSet>
          </Col>
        </Row>
      </Row>

    );
  }
}
