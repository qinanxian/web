import React from "react";
import moment from 'moment';

import {
  Button, DetailInfo, Upload, DataTable, openModal, Modal, Fieldset, Message,
  Notify, TimeRangPicker,TimePicker,rest
} from '../../../src/components';
import {ImageViewer,  openMask} from 'roface';

import GeneralOpenTimeInfo from './GeneralOpenTimeInfo';
import SpecialOpenTimeInfo from './SpecialOpenTimeInfo';
import ParkManageInfo from '../ParkManage/ParkManageInfo';

export default class NetWorkInfo extends React.Component {

    constructor(props){
        super(props);
        const {netWorkId,netWorkNo} = props.params;
        //NETWORK_INFO表中的主键id
        this.netWorkId = netWorkId;
        //NETWORK_INFO表中的字段ORG_ID，该字段与AUTH_ORG表中的ID进行关联
        this.netWorkNo = netWorkNo;

        this.state = {
            hasImg : false,
            networkImg : [],
            imgId : ""
        }

    }

    componentDidMount(){
        this.getNetworkImg();
    }

    dataReadyOtherInfo = (voInfo) => {
      this.otherVoInfo = voInfo;
      this.otherVoInfo.setValue("networkNo", this.netWorkId);
      this.otherVoInfo.setItemTemplate(
        "workMorningHeightTime",
        <TimeRangPicker
            format="HH:mm"
        />
      );
      this.otherVoInfo.setItemTemplate(
        "workAfternoonHeightTime",
        <TimeRangPicker
            format="HH:mm"
        />
      );
      this.otherVoInfo.setItemTemplate(
        "holidayMorningHeightTime",
        <TimeRangPicker
            format="HH:mm"
        />
      );
      this.otherVoInfo.setItemTemplate(
        "holidayAfternoonHeightTime",
        <TimeRangPicker
            format="HH:mm"
        />
      );
    }

    dataReadyGeneralTime = (voList) => {
        this.generalTimeList = voList;
        this.generalTimeList.setColumnTemplate("startTime", (text, record, i) => {
          return (
            <div>
              {text && text.split(',').map(item => moment(item).format('HH:mm')).join('-')}
            </div>
          )
        });
        this.generalTimeList.setColumnTemplate("endTime", (text, record, i) => {
          return (
            <div>
              {text && text.split(',').map(item => moment(item).format('HH:mm')).join('-')}
            </div>
          )
        });
    }
    dataReadySpecialTime = (voList) => {
        this.specialTimeList = voList;
        this.specialTimeList.setColumnTemplate("startTime", (text, record, i) => {
          return (
            <div>
              {text && text.split(',').map(item => moment(item).format('HH:mm')).join('-')}
            </div>
          )
        });
        this.specialTimeList.setColumnTemplate("endTime", (text, record, i) => {
          return (
            <div>
              {text && text.split(',').map(item => moment(item).format('HH:mm')).join('-')}
            </div>
          )
        });
    }


    formReadyBasicInfo = (voinfo) => {
        this.basicVoInfo = voinfo;
    }

    formReadyOtherInfo = (voinfo) => {
        $('.ant-checkbox-group-item').css("margin-right","40px");
    }

    formReadyPark = (voList) => {
        this.parkList = voList;
        this.parkList.addButton([{
            name: '新增',
            onClick: this.createPark
        },
        {
            name: '删除',
            selectBind: true,
            onClick: this.deletePark
        },
        {
            name: '编辑',
            selectBind: true,
            onClick: this.editPark
        }
        ]);
    }

    createPark = (voList) => {
        const row = this.parkList.getSelectedRow();
        this.openParkInfoModal(null,"新增停车场");
    }

    editPark = (voList) => {
        const row = this.parkList.getSelectedRow();
        const parkId = row.id;
        this.openParkInfoModal(parkId,"修改停车场信息");
    }

    openParkInfoModal = (id , title) => {
        openModal(<ParkManageInfo readonly={this.props.readonly}/>, {
            title: title,
            parkId: id,
            networkId: this.netWorkId,
            defaultButton: !this.props.readonly,
            refresh: this.parkTableRefresh,
            onOk: (a, b, c) => {
              b.parkInfoSave((err, value) => {
                c.setLoading(false);
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    deletePark = (voList) => {
        const row = this.parkList.getSelectedRow();
        Modal.confirm({
            title: '删除确认',
            content: '是否确认删除',
            onOk: () => {
                this.parkList.deleteRows([row]);
            },
            onCancel: () => {
                return;
            },
        });
    };

    parkTableRefresh = () => {
        this.parkList.refresh();
    };

    formReadyGeneralTime = (voList) => {
        this.generalTimeVoList = voList;
        this.generalTimeVoList.addButton([{
            name: '新增',
            onClick: this.createGeneralOpenTime
        },
        {
            name: '删除',
            selectBind: true,
            onClick: this.deleteGeneralOpenTime
        },
        {
            name: '编辑',
            selectBind: true,
            onClick: this.editGeneralOpenTimeInfo
        }
        ]);
    };

    createGeneralOpenTime = (voList) => {
        const row = this.generalTimeVoList.getSelectedRow();
        this.openGeneralTimeInfoModal(null,"新增营业时间");
    }

    editGeneralOpenTimeInfo = (voList) => {
        const selectedRows = this.generalTimeVoList.getSelectedRows();
        const id = this.generalTimeVoList.getSelectedRows()[0].id;
        this.openGeneralTimeInfoModal(id, "修改营业时间");
    }

    openGeneralTimeInfoModal = (id, title) => {
        openModal(<GeneralOpenTimeInfo readonly={this.props.readonly}/>, {
            title: title,
            openTimeId: id,
            netWorkId : this.netWorkId,
            defaultButton: !this.props.readonly,
            refresh: this.generalTimeTableRefresh,
            onOk: (a, b, c) => {
              b.openTimeInfoSaves((err, value) => {
                c.setLoading(false);
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    formReadySpecialTime = (voList) => {
        this.specialTimeVoList = voList;
        this.specialTimeVoList.addButton([{
            name: '新增',
            onClick: this.createSpecialOpenTime
        },
        {
            name: '删除',
            selectBind: true,
            onClick: this.deleteSpecialOpenTime
        },
        {
            name: '编辑',
            selectBind: true,
            onClick: this.editSpecialOpenTimeInfo
        }
        ]);

    };

    createSpecialOpenTime = (voList) => {
        const row = this.specialTimeVoList.getSelectedRow();
        this.openSpecialTimeInfoModal(null, "新增特殊营业时间");
    }

    editSpecialOpenTimeInfo = (voList) => {
        const selectedRows = this.specialTimeVoList.getSelectedRows();
        const id = this.specialTimeVoList.getSelectedRows()[0].id;
        this.openSpecialTimeInfoModal(id, "修改特殊营业时间");
    }

    openSpecialTimeInfoModal = (id, title) => {
        openModal(<SpecialOpenTimeInfo readonly={this.props.readonly}/>, {
            title: title,
            openTimeId: id,
            netWorkId : this.netWorkId,
            defaultButton: !this.props.readonly,
            refresh: this.specialTimeTableRefresh,
            onOk: (a, b, c) => {
                b.openTimeInfoSave((err, value) => {
                  c.setLoading(false);
                      if (!err) {
                          a.close();
                      }
                  });
              },
            onCancel: (a, b) => {
            }
        });
    };

    deleteGeneralOpenTime = (voList) => {
        const row = this.generalTimeVoList.getSelectedRow();
        Modal.confirm({
            title: '删除确认',
            content: '是否确认删除',
            onOk: () => {
                this.generalTimeVoList.deleteRows([row]);
            },
            onCancel: () => {
                return;
            },
        });
    };

    deleteSpecialOpenTime = (voList) => {
        const row = this.specialTimeVoList.getSelectedRow();
        Modal.confirm({
            title: '删除确认',
            content: '是否确认删除',
            onOk: () => {
                this.specialTimeVoList.deleteRows([row]);
            },
            onCancel: () => {
                return;
            },
        });
    };

    generalTimeTableRefresh = () => {
        this.generalTimeVoList.refresh();
    }

    specialTimeTableRefresh = () => {
        this.specialTimeVoList.refresh();
    }

    saveNetWorkInfo = () => {
        this.otherVoInfo.setValue("networkNo",this.netWorkId);
        this.otherVoInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
                Notify.success({
                    message: '保存成功',
                })
            }
        });
    }

    upload = (fileStatus) => {
        if (fileStatus === "done"){
          Notify.info('上传成功');
          this.saveNetWorkInfo();
        }else if(fileStatus === "uploading"){

        } else {
          Notify.info('上传失败');
        }

    };

    getNetworkImg = () => {
        rest.get(`/api/network/getImageRecordByNetworkId/${this.netWorkId}/0001`)
                    .then((data)=>{
                        if(data.body.length > 0){
                            this.setState({
                                networkImg:data.body,
                                hasImg:true
                            });
                        }else {
                            this.setState({
                              networkImg:data.body,
                              hasImg:false
                            });
                        }
                    }).catch((error)=>{
                        Notify.error("图片加载异常");
                    })
    }

    _imageChange = (num,bigImageId) => {
      console.log("_imageChange start");
      console.log(bigImageId);
      console.log("_imageChange end");
        this.setImages([
            {
                url: `/api/network/getBigImgById/${bigImageId}`,
                thumbnailUrl: `/api/network/getBigImgById/${bigImageId}`,
                containSession: false,
                info: '网点照片',
                title: '网点照片'
            }
        ].splice(0, 11 - (11-num)), 0);
    };

    didMount = ({setImages}) => {
        this.setImages = setImages;
    };

    openImg = (bigImageId,e) => {
      console.log("openImg id:"+bigImageId);
        this.setState({imgId:bigImageId})
        openMask(<div style={{margin: '0 auto', width: document.documentElement.clientWidth, height:document.documentElement.clientHeight}}>
            <ImageViewer didMount={this.didMount} width={document.documentElement.clientWidth - 110} height={document.documentElement.clientHeight}/>
        </div>);
        this._imageChange(2,bigImageId);
    }

    deleteImg = (id,e) => {
      console.log(id);
      rest.get(`/api/network/deleteImgById/${id}`)
        .then((data)=>{
          if(data > 0){
            this.getNetworkImg();
          }
        }).catch((error)=>{
        Notify.error("图片删除异常");
      })
    }

    renderNetWorkImg = () => {
        if(this.state.hasImg){
            const networkImg = this.state.networkImg;
            console.log(networkImg);
            return (
                <div>
                    {networkImg.map((item)=>{
                        return <div>
                      <img className="ro-modal-tree-img" width='100px' height='100px'
                                    style={{marginLeft:'30px'}}
                                    src={item.imageBase}
                                    onClick={this.openImg.bind(this,item.bigImageId)} />
                                    <span className="ro-modal-tree-onblock" onClick={this.deleteImg.bind(this,item.id)}>X</span>
                                    </div>
                    })}
                </div>
            )
        }else{
            return <div></div>
        }
    }

    render() {



        return (
            <div>
                <fieldset>
                    <div>
                        <Button type='success' onClick={this.saveNetWorkInfo}>保存</Button>
                    </div>
                </fieldset>
                <Fieldset  legend="基本信息" showArrow={true}>
                    <DetailInfo
                        dataFormId="codetodo-NetWorkInfo"
                        params={{netWorkId: this.netWorkId}}
                        labelWidth={158}
                        reading = {this.props.readonly}
                        dataReady = {this.dataReady}
                        formReady = {this.formReadyBasicInfo}
                    />
                  <span style={{color:'red',marginLeft:'150px'}}>注：网点基本信息配置请到菜单"组织架构"->"机构部门"中进行配置</span>
                </Fieldset>
                <Fieldset  legend="其他信息" showArrow={true}>
                    <DetailInfo
                        dataFormId="codetodo-NetWorkOtherInfo"
                        params={{netWorkId: this.netWorkId}}
                        reading = {this.props.readonly}
                        labelWidth={158}
                        dataReady = {this.dataReadyOtherInfo}
                        formReady = {this.formReadyOtherInfo}
                    />
                </Fieldset>
                <Fieldset  legend="停车场信息配置" showArrow={true}>
                    <DataTable
                        dataFormId="codetodo-ParkList"
                        formReady={this.formReadyPark}
                        dataReady={this.dataReadyPark}
                        params = {{networkId:this.netWorkId}}
                        labelWidth={158}
                    />
                </Fieldset>
                <Fieldset  legend="一般营业时间配置" showArrow={true}>
                    <DataTable
                        dataFormId="codetodo-GeneralOpenTimeList"
                        params={{netWorkId: this.netWorkId}}
                        formReady={this.formReadyGeneralTime}
                        dataReady={this.dataReadyGeneralTime}
                        labelWidth={158}
                    />
                  <span style={{color:'red',marginLeft:'150px'}}>注：营业时间开始后半小时内和营业时间结束前一小时内禁止线上用户取号，每月的15，16，17号禁止微信取号！</span>
                </Fieldset>

              <Fieldset  legend="特殊营业时间配置" showArrow={true}>
                    <DataTable
                        dataFormId="codetodo-ParticularOpenTimeList"
                        params={{netWorkId: this.netWorkId}}
                        formReady={this.formReadySpecialTime}
                        dataReady={this.dataReadySpecialTime}
                        labelWidth={158}
                    />
                </Fieldset>
                <Fieldset  legend="网点照片" showArrow={true}>
                    <div>
                        <span>点击上传：</span>
                        <Upload
                            style={{ whiteSpace: 'nowrap', margin: '2px' }}
                            //MSB_NETWORK_INFO表中的主键id
                            action={`/api/network/uploadImg/${this.netWorkId}/0001`}
                            onChange={this.upload}
                            name={"上传"}
                            buttonType={'a'}
                            multiple={true}
                        />
                    </div>
                    {this.renderNetWorkImg()}
                </Fieldset>
            </div>
        );
    }

}
