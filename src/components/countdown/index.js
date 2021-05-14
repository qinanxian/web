import React from 'react';

export default class CountDown extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      count: props.count || 0,
    };
  }
  componentDidMount(){
    // 开始倒计时
    const { countEnd } = this.props;
    this.count = setInterval(() => {
      this.setState({
        count: this.state.count - 1,
      },  () => {
        if (this.state.count === 0) {
          // 结束倒计时
          clearInterval(this.count);
          countEnd && countEnd();
        }
      });
    }, 1000);
  }
  componentWillUnmount(){
    // 结束倒计时
    clearInterval(this.count);
  }
  render() {
    const { count } = this.state;
    return (
      <span>
        {count}
      </span>
    );
  }
}
