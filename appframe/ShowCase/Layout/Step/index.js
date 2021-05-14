import React from 'react';
import {Steps,Detector} from '../../../../src/components';
import './style/index.less'

export default class  Step extends React.Component {
  constructor(props){
    super(props);
    this.steps = [
      {title:'标题一',content:<div className='text'>步骤一(组件/文本)</div>,buttons:[{name:'下一步',key:'next_1'}]},
      {title:'标题二',content:<div className='text'>步骤二(组件/文本)</div>,buttons:[{name:'上一步',key:'pre_2'},{name:'下一步',key:'next_2'}]},
      {title:'标题三',content:<div className='text'>步骤三(组件/文本)</div>,buttons:[{name:'上一步',key:'pre_3'},{name:'下一步',key:'next_3'}]},
      {title:'标题四',content:<div className='text'>步骤四(组件/文本)</div>,buttons:[{name:'上一步',key:'pre_4'},{name:'结束',key:'next_4'}]}
    ];
  }
  buttonClick = (key, steps, com) => {
    if (key.startsWith('next_')) {
      steps.next();
      if (key === 'next_2') {
        steps.setStatus('error');
        steps.setButtonDisabled('next_3', true)
      }
    }
    if (key.startsWith('pre_')) {
      steps.pre();
    }
  };
  buttonClick2 = (key, steps, com) => {
    if (key.startsWith('next_')) {
      steps.next();
    }
    if (key.startsWith('pre_')) {
      steps.pre();
    }
  };
  
  render() {
    return (
      <div className='step-container'>
        <Steps
          steps={this.steps}
          buttonClick={this.buttonClick}
        />
        <Steps
          steps={this.steps}
          buttonClick={this.buttonClick2}
        />
      </div>
    );
  }
}