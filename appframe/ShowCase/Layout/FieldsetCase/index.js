import React from "react";
import {Tabs, Collapse, Fieldset,Badge,Message,Button} from '../../../../src/components';
import HelloWord from "../../Guide/HelloWord";
import AnnotationCase from "../../Guide/AnnotationCase";
import Simple from "../../DetailInfo/Simple";
import ReactDom from "react-dom";

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;


export default class FieldsetCase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {fieldset1:<span style={{fontSize:'18px'}}>你好(不能收起）<Badge count={109} style={{ backgroundColor: '#52c41a' }} /></span>};
    }
  
    onToggle = (expanded) => {
        if(expanded){
            Message.info('展开了');
        }else{
            Message.info('收起了');
        }
    };
  
    // onRef = (ref) => {
    //   this.simple = ref;
    // };
  
  handleClick = () => {
    this.simple.saveRecord();
  };
    
    render() {
        return (
            <div>
                <Fieldset legend={this.state.fieldset1} showArrow={false}>
                  <HelloWord/>
                </Fieldset>
                <Fieldset legend="全局对象注入（默认收起)" expanded={true}>
                    <AnnotationCase/>
                </Fieldset>
                <Fieldset legend="简单详情(展开收起监听)" expanded={false} onToggle={this.onToggle}>
                    <Button onClick={this.handleClick}>测试按钮</Button>
                    <Simple
                      // onRef={this.onRef}
                      ref={instance => this.simple = instance}
                    />
                </Fieldset>
                <Fieldset headerType='gist' legend="简单详情(展开收起监听)" expanded={true}>
                  <Fieldset legend={this.state.fieldset1} showArrow={false}>
                    <HelloWord/>
                  </Fieldset>
                </Fieldset>
            </div>
        );
    }

}
