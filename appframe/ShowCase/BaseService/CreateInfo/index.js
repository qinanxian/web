import React,{Component} from 'react';
import {DetailInfo,Fieldset,Button} from "../../../../src/components";

export default class CreateInfo extends Component{
    constructor(props){
        super(props);
        this.apis = [];
        this.num = 0;
        this.state = {
            data:[{
                key:this.num,
                content:<Fieldset legend='尽调主要问题摘要'>
                    <DetailInfo
                        params={{id: 18}}
                        dataFormId="demo-MapPersonInfo"
                        dataReady={info => this.apis[this.num] = info}/>
                </Fieldset>
            }]
        };
    }
    addBlock = () => {
        this.num ++;
        this.setState({
            data:this.state.data.concat({
                key:this.num,
                content:<Fieldset legend='尽调主要问题摘要'>
                    <DetailInfo
                        params={{id: 18}}
                        dataFormId="demo-MapPersonInfo"
                        dataReady={info => this.apis[this.num] = info}/>
                </Fieldset>
            })
        });
    };
    saveData = () => {
        this.apis.forEach((item) => {
            item.saveData().then(ret => {
                console.log('ret:',ret)
            })
        });
    };
    render(){
        return (
            <div>
                <Button onClick={this.addBlock}>新增</Button>
                <Button onClick={this.saveData}>保存</Button>
                {this.state.data.map((item) => {
                    return <div key={item.key}>{item.content}</div>;
                })}
            </div>
        );
    }
}
