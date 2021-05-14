import React from 'react';
import {Fieldset, EmbedBlock,Button} from '../../../../src/components';


export default class EmbedBlockCase extends React.Component {
    constructor(){
        super();

    }

    ready1 = (block) =>{
        this.block1 = block;
    }

    ready2 = (block) =>{
        this.block2 = block;
    }

    doFunc1 = () =>{
        this.block1.func1('FIRST');
    }
    doFunc2 = () =>{
        this.block2.func1('SECOND');
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.doFunc1}>调用第一个组件的方法</Button>
                <Fieldset legend="第一次链接">
                    <EmbedBlock url={'ShowCase/Guide/HelloWord'} param={{title:'--->第一：这不是一个IFRAME<---'}} ready={this.ready1}/>
                </Fieldset>
                <br/>
                <Button type="primary" onClick={this.doFunc2}>调用第二个组件的方法</Button>
                <Fieldset legend="第二次链接">
                    <EmbedBlock url={'ShowCase/Guide/HelloWord'} param={{title:'--->第二：这仍然不是一个IFRAME<---'}} ready={this.ready2}/>
                </Fieldset>
            </div>

        );
    }
}

