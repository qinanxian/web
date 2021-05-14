import React from "react";
import moment from 'moment';
import {Spin,Icon, Divider,openModal} from '../../../../src/components';
import './style/index.less';
import PublicNoticeInfo from '../../../Configuration/PublicNotice/PublicNoticeInfo'

export default class PublicNoticeList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataFormCombiner:null,
      rotate:'',
    };
    this.showLoadMore = 'none';
    this.pageSize = 10;
  }

  componentDidMount() {
    this.getData();
  }

  getbody = () => {
    if (!this.state.dataFormCombiner)
      return ;
    const data = this.state.dataFormCombiner.body.dataList;
    const pageCount = this.state.dataFormCombiner.body.pageCount;
    const index = this.state.dataFormCombiner.body.index;
    let result;
    if (data.length > 0) {
      result =  data.map(item =>
        <div className="pubNotice-container-body-data" key = {item.publicNoticeId}>
          <span className="pubNotice-container-body-data-item"><a href="#" onClick={()=>this.publicNoticeInfo(item,true)}>{item.title}</a></span><span>{moment(item.publishTime).format('YYYY-MM-DD')}</span>
        </div>);
    }
    if (pageCount > (index + 1)) {
      this.showLoadMore = '';
    } else {
      this.showLoadMore = 'none';
    }
    return result;
  };

  publicNoticeInfo = (record,isReadOnly) => {
      openModal(<PublicNoticeInfo publicNoticeId={record.publicNoticeId} isReadOnly={isReadOnly}/>,{
          title:"公告详情"
      });
  };

  loadMore = () => {
    this.pageSize = this.pageSize + 10;
    this.getData();
  };

  getData = (refresh = false) => {
    const {rest} = this.props;
    const url = `/dataform/data/list/common-PublicNoticeList/1=1/1=1/0-${this.pageSize}`;
    rest.get(url)
      .then(res => {
        this.setState({
          dataFormCombiner: res,
        },() => {
          refresh && setTimeout(() => {
            this.setState({
              rotate: '',
            });
          },1500);
        });
      })
  };

  refresh = () => {
    this.setState({
      rotate:'rotate'
    });
    this.pageSize = 10;
    this.showLoadMore = '';
    this.getData(true);
  };

  render() {
    const {rotate} = this.state;
    return (
      <div className="pubNotice-container">
        <div className="pubNotice-container-layout">
          <div>&nbsp;&nbsp;&nbsp;&nbsp;公司公告</div>
          <div className={`pubNotice-container-layout-icon pubNotice-container-layout-${rotate}`}>
            <Icon onClick ={this.refresh} type = "fa-refresh"/>
          </div>
        </div>
        <Divider className="pubNotice-container-divider"/>
        <Spin spinning={!!rotate}>
          <div className="pubNotice-container-body">
            {rotate ? null : this.getbody()}
          </div>
        </Spin>
        <Divider style={{display: this.showLoadMore}} className="pubNotice-container-divider"/>
        <div style={{display: this.showLoadMore}} className="pubNotice-container-loadMore">
          <span onClick={this.loadMore}>加载更多</span>
        </div>
      </div>
    );
  }
}