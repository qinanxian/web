import React from "react";
import {DataTable,rest, Message,Modal} from '../../../src/components';


export default class CustomInfoLabelInfo extends React.Component {
  constructor(props) {
    super(props);
    const {id} = props;
    this.id = id;
    this.state = {
      selectionType:'multiple',
      arrAys : [],
    };
  }


  dataReady = (voInfo) => {
    this.voInfo = voInfo;
  };

  LabelInfoadd = () => {
    const {arrAys}=this.state
    console.log(arrAys+'这是选中的list')
    this.addkhbq(arrAys);
  };

  addkhbq = (array) => {
    // const { rest } = this.props;
      Modal.confirm({
        title: '',
        content: '是否确认客户标签',
        onOk: () => {
          rest.post('/Label/insterLabel', {orgIdArray: array,id:this.id})
            .then((res) => {
              if (res == 0) {
                Message.success("跑批数据成功");
                const {refresh} = this.props;
                refresh && refresh();
              } else {
                Message.success("数据正在跑批中......请稍后再试！！！！！请勿重复点击。");
              }
            })
        },
        onCancel: () => {
        },
      });
  }

  refreshTable = () => {
    this.voList.refresh();
  }

  onSelectRow=(keys,rows)=>{
    const {arrAys} =this.state;
    this.setState({
      arrAys: rows.map(item=>item.fullName)
    })

  }


  render() {
    return (
      <div>
        <DataTable
          dataFormId="othapplications-CustomInfoLabelInfo"
          params={{id: this.id}}
          dataReady={this.dataReady}
          formReady={this.formReady}
          reading={this.props.readonly}
          labelWidth={158}
          onSelectRow={this.onSelectRow}
          selectionType={this.state.selectionType}
        />
      </div>
    );
  }

}

