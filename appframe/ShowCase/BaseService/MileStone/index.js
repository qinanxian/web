import React from 'react';
import {MileStone,Modal,Message} from '../../../../src/components';
import './style/index.less';

export default class  MileStoneCase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dataSource:[],
      toggle:false,
    };
  }
  componentDidMount(){
    this.props.rest.get('/landMark/getLandmarkItems/0095/APPLICATION').then((ret) => {
      this.setState({
        dataSource:ret,
      });
    }).catch((e) => {
      Modal.error({
        title: '获取数据失败',
        content: e.message,
      });
    });
  }
  _handleClick = (value) => {
    console.log(value);
    Message.info('Don\'t touch me,you bad guy');
  };
  render() {
    return (
      <div className='milestone-showcase-container'>
        <MileStone
          dataSource={this.state.dataSource}
          handleClick={this._handleClick}
        />
      </div>
    );
  }
}
