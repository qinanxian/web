import React, { Fragment } from 'react';
import md5 from 'md5';
import { Icon, Button, Modal } from '../../../src/components/index';
import $ from 'jquery';
import './style/index.less';
import {getLocationURL, post} from "../../../src/lib/rest";
import * as cache from "../../../src/lib/cache";
import config from "../../../src/lib/config";

/* eslint-disable */

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.id = Math.uuid();
    this.state = {
      loadState: false,
      faceValidate: false,
      supportMediaDevices: false,
      title: '正在打开摄像头，请稍后...'
    }
  }
  componentDidMount() {
    window.location.hash = '';
    $(document).keyup((e) => {
      if (e.keyCode === 13) {
        $('#submit').trigger('click');
      }
    });
  }
  _submit = () => {
    if (this.state.faceValidate) {
      const inputSelector = $(':input');
      const username = inputSelector[0].value;
      if (!username) {
        alert('验证账号不能为空！');
      } else {
        this.setState({
          loadState: true
        });
        let video = document.getElementById(`video-${this.id}`);
        let canvas = document.getElementById(`canvas-${this.id}`);
        const image = this.takePhoto();
        const param = {
          'app_id': '2119025490',
          'image': image,
          'person_id': username,
          'time_stamp': new Date().getTime().toString().substr(0, 10),
          'nonce_str': Math.uuid(5),
          'sign': '',
        };
        param.sign = this.getReqSign(param, 'vpoLUdVARp1OQOP0');
        post('/face/face_faceverify', {}, {
          data: $.param(param),
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          headers: {
            "X-Requested-With":"XMLHttpRequest"
          },
        }).then((res) => {
          if (res.ret === 16417) {
            Modal.confirm({
              title: '人脸识别失败！',
              content: '未在人脸库中寻找到该账户的信息，是否需要立即创建该个体？',
              onOk: () => {
                const params = {
                  'app_id': '2119025490',
                  'group_ids': 'group0',
                  'person_id': username,
                  'image': image,
                  'person_name': username,
                  'tag': username,
                  'time_stamp': new Date().getTime().toString().substr(0, 10),
                  'nonce_str':  Math.uuid(5),
                  'sign': '',
                };
                params.sign = this.getReqSign(params, 'vpoLUdVARp1OQOP0');
                post('/face/face_newperson', {}, {
                  data: $.param(params),
                  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                  headers: {
                    "X-Requested-With":"XMLHttpRequest"
                  },
                }).then((res) => {
                  Modal.success({title: '创建成功！', content: '创建成功，请使用该人脸进行验证！'});
                }).catch((err) => {
                  Modal.error({title: '创建失败！', content: '创建失败！'});
                }).finally(() => {
                  canvas.style.display = 'none';
                  video.style.display = '';
                });
              },
              onCancel: () => {

              },
            })
          } else if(res.ret === 0) {
            const data = res.data;
            if (data.ismatch === 1) {
              Modal.success({title: '验证成功！', content: '人脸匹配正确！'});
            } else {
              Modal.success({title: '验证成功！', content: '人脸不匹配，请重新验证！'});
            }
          } else if (res.ret === 16404){
            Modal.error({title: '未检测到人脸！'})
          } else {
            Modal.error({title: '验证失败！'})
          }
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          this.setState({
            loadState: false
          });
          canvas.style.display = 'none';
          video.style.display = '';
        });
      }
    } else {
      const inputSelector = $(':input');
      const rememberMe = false;
      const param = {
        username: inputSelector[0].value,
        password: inputSelector[1].value,
        rememberMe: rememberMe,
      };
      if (param.username && param.password) {
        post('/public/logon', {}, {
          data: $.param(param),
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          headers: {
            "X-Requested-With":"XMLHttpRequest"
          },
        })
          .then((result) => {
            if (result.code === 'Success') {
              const session = 'X-SESSION-TOKEN';
              if (result[session]) {
                cache.setUser(result.user || {});
                cache.setSessionId(result[session]);
                window.location.reload();
              }
              this.setState({
                loadState: true
              });
            } else {
              $('#resultlog').css("display", "inline-block").text("账号或密码有误");
              $('#submit').attr('class', 'loginBtn-active');
              this.setState({
                loadState: false
              });
            }
          })
          .catch((reason) => {
            $('#submit').attr('class', 'loginBtn-active');
            $('#resultlog').css("display", "inline-block").text("账号或密码有误");
            this.setState({
              loadState: false
            });
          });
      } else {
        $('#submit').attr('class', 'loginBtn-active');
        $('#resultlog').css("display", "inline-block").text("账户或密码不能为空");
        this.setState({
          loadState: false
        });
      }
    }
  };
  _openNewPage = () => {
    const param = {
      noMenu: true,
      noLogin: true
    };
    const paramStr = btoa(encodeURIComponent(JSON.stringify(param)));
    window.open(getLocationURL(`/main.html#/Person/ModifyPassword/?${paramStr}`));
  };
  _loginPage = (value) => {
    this.props.loginPage&&this.props.loginPage(value);
  };
  _pageItems() {
    return [{value:1,key:'app_1'},{value:2,key:'app_2'},{value:3,key:'app_3'}]
      .map(item => <span key={item.key} onClick={() => this._loginPage(item.key)}>{item.value}</span>);
  }
  getReqSign(params, appkey) {
    // 1. 字典升序排序
    const keyArrays = Object.keys(params).sort();
    // 2. 拼按URL键值对
    let str = keyArrays.reduce((pre, next) => {
      if (params[next] !== '') {
        return pre + next + '=' + encodeURIComponent(params[next]) + '&';
      }
      return pre;
    }, '');
    // 3. 拼接app_key
    str += 'app_key=' + appkey;
    //console.log(str);
    // 4. MD5运算+转换大写，得到请求签名
    str = md5(str).toLocaleUpperCase();
    return str;
  }
  _changeValidate = () => {
    this.setState({
      faceValidate: !this.state.faceValidate,
    }, () => {
      if (this.state.faceValidate) {
        this.getMedia();
      }
    });
  };
  getMedia = () => {
    let constraints = {
      video: {
        width: 290,
        height: 100
      },
      audio: true
    };
    // 这里介绍新的方法，返回一个 Promise对象
    // 这个Promise对象返回成功后的回调函数带一个 MediaStream 对象作为其参数
    // then()是Promise对象里的方法
    // then()方法是异步执行，当then()前的方法执行完后再执行then()内部的程序
    // 避免数据没有获取到
    // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

// 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
// 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = (constraints) => {

        // 首先，如果有getUserMedia的话，就获得它
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // 否则，为老的navigator.getUserMedia方法包裹一个Promise
        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      }
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        this.setState({
          supportMediaDevices: true,
        }, () => {
          const video = document.getElementById(`video-${this.id}`);
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            // 防止在新的浏览器里使用它，应为它已经不再支持了
            video.src = window.URL.createObjectURL(stream);
          }
          video.onloadedmetadata = () => {

            video.play();
          };
        });
      })
      .catch((err) => {
        this.setState({
          supportMediaDevices: false,
          title: '当前浏览器不支持人脸登录！'
        });
      });
  };
  takePhoto = () => {
    //获得Canvas对象
    let video = document.getElementById(`video-${this.id}`);
    let canvas = document.getElementById(`canvas-${this.id}`);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 290, 100);
    video.style.display = 'none';
    canvas.style.display = '';
    return canvas.toDataURL('image/jpg').replace(/^data:image\/\w+;base64,/, "");
  };
  render() {
    const { faceValidate, supportMediaDevices, title } = this.state;
    const { logo, slogan } = config['app_1'];
    return (
      <div className="container">
        <div className="container-box">
          <div className="box-left">
            <div>{slogan.split('&')[0]}</div>
            <div>{slogan.split('&')[1]}</div>
          </div>
          <div className="box-right" style={{position: 'relative'}}>
            <div className="right-icon">
              <Icon type={logo}/>
            </div>
            <div className="right-bottom">
              {
                !faceValidate ? <Fragment>
                  <div className="accountbox">
                    <span className="accountIcon" />
                    <input className="account" type="text" name="account" placeholder="请输入账号" />
                  </div>
                  <div className="passwordbox">
                    <span className="passwordIcon" />
                    <input defaultValue='000000' className="password" type="password" name="password" placeholder="请输入密码" />
                  </div>
                  <span id="resultlog" />
                  <div className="switchbox">
                    <div className="switchgroup">
                      <input type="checkbox" name="remember" id="switch" className="switchBtn" />
                      <label htmlFor="switch" className="state" />
                      <span style={{ marginLeft: '5px' }}>记住密码</span>
                    </div>
                    <span className='forgetPassword' onClick={this._openNewPage}>忘记密码</span>
                  </div>
                </Fragment> : <div style={{textAlign: 'center'}}>
                  {
                    supportMediaDevices ? <Fragment>
                      <input style={{height: '20px'}} type="text" name="account" placeholder="请输入验证的账号" />
                      <div style={{marginTop: 10}}>
                        <video
                          id={`video-${this.id}`}
                          width="290px"
                          height="100px"
                          autoPlay="autoplay"
                        >
                          {}
                        </video>
                        <canvas
                          id={`canvas-${this.id}`}
                          width="290px"
                          height="100px"
                          style={{display: 'none', position: 'relative'}}
                        >
                          {}
                        </canvas>
                      </div>
                    </Fragment> : title
                  }

                </div>
              }
              <Button
                style={{display: supportMediaDevices || !faceValidate ? '' : 'none'}}
                type='primary'
                id='submit'
                className='loginBtn-active'
                onClick={this._submit}
                loading={this.state.loadState}
              >
                <Icon type='arrow-right' style={{ display: this.state.loadState ? 'none' : '' }}/>
              </Button>
              <Button
                style={{borderRadius: 'unset', position: 'absolute', bottom: 0, width: '100%'}}
                type='primary'
                onClick={this._changeValidate}
              >
                {faceValidate ? '切换至密码登录' : '切换至人脸登录'}
              </Button>
            </div>
          </div>
        </div>
        <div className='container-menu'>
          {this._pageItems()}
        </div>
      </div>
    );
  }
}
