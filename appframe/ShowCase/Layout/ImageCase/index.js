import React from 'react';

import {ImageViewer, Button, openMask} from 'roface';

export default class ImageCase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: ''
        }
    }

    _buttonClick = () => {
        const {style} = this.state;
        this.setState({
            style: style === '' ? 'none' : ''
        })
    };
    _imageChange = (num) => {
        this.setImages([
            {
                url: '/showcase/pageoffice/show/caifutong.jpg',
                thumbnailUrl: '/showcase/pageoffice/show/caifutong.jpg',
                containSession: false,
                info: '财富通-身份证',
                title: '身份证'
            },
            {
                url: '/showcase/pageoffice/show/zhifubao.jpg',
                thumbnailUrl: '/showcase/pageoffice/show/zhifubao.jpg',
                containSession: false,
                info: '支付宝-身份证',
                title: '身份证'
            },
            {
                url: '/showcase/pageoffice/show/fancanzheng1.jpeg',
                thumbnailUrl: '/showcase/pageoffice/show/fancanzheng1.jpeg',
                containSession: false,
                info: '房产证-扫描件1',
                title: '房产证1'
            },
            {
                url: '/showcase/pageoffice/show/fancanzheng2.jpeg',
                thumbnailUrl: '/showcase/pageoffice/show/fancanzheng2.jpeg',
                containSession: false,
                info: '房产证-扫描件2',
                title: '房产证2'
            },
            {
                url: '/showcase/pageoffice/show/gouchefapiao.jpeg',
                thumbnailUrl: '/showcase/pageoffice/show/gouchefapiao.jpeg',
                containSession: false,
                info: '购车发票-扫描件',
                title: '购车发票'
            },
            {
                url: '/showcase/pageoffice/show/goufanghetong1.jpeg',
                thumbnailUrl: '/showcase/pageoffice/show/goufanghetong1.jpeg',
                containSession: false,
                info: '购房合同-扫描件',
                title: '购房合同'
            },
            {
                url: '/showcase/pageoffice/show/shouruzhengmin.jpeg',
                thumbnailUrl: '/showcase/pageoffice/show/shouruzhengmin.jpeg',
                containSession: false,
                info: '收入证明-扫描件',
                title: '收入证明'
            },
            {
                url: '/showcase/pageoffice/show/shouruzhengmin.jpeg',
                thumbnailUrl: '/showcase/pageoffice/show/shouruzhengmin.jpeg',
                containSession: false,
                info: '收入证明-扫描件',
                title: '收入证明'
            },
            {
                url: '/showcase/pageoffice/show/一带一路1.jpg',
                thumbnailUrl: '/showcase/pageoffice/show/一带一路1.jpg',
                containSession: false,
                info: '一带一路',
                title: '一带一路'
            },
            {
                url: '/showcase/pageoffice/show/世界地图.jpg',
                thumbnailUrl: '/showcase/pageoffice/show/世界地图.jpg',
                containSession: false,
                info: '世界地图',
                title: '世界地图'
            },
            {
                url: '/showcase/pageoffice/show/帮你跳.gif',
                thumbnailUrl: '/showcase/pageoffice/show/帮你跳.gif',
                containSession: false,
                info: '帮你跳-一张动图',
                title: '帮你跳'
            }
        ].splice(0, 11 - (11-num)), 0);
    };
    didMount = ({setImages}) => {
        this.setImages = setImages;
    };
    _openMask = () => {
        openMask(<div style={{margin: '0 auto', width: document.documentElement.clientWidth, height:document.documentElement.clientHeight}}>
            <ImageViewer didMount={this.didMount} width={document.documentElement.clientWidth - 110} height={document.documentElement.clientHeight}/>
        </div>);
        this._imageChange(2);
    };
    render() {
        return (
            <div>
                <Button onClick={this._buttonClick}>显示/隐藏</Button>
                <Button onClick={() => this._imageChange(11)}>获取图片</Button>
                <Button onClick={() => this._imageChange(1)}>获取一张图片</Button>
                <Button onClick={() => this._imageChange(2)}>获取两张图片</Button>
                <Button onClick={this._openMask}>弹窗打开</Button>
                <div>
                    {
                        this.state.style === '' ? <ImageViewer didMount={this.didMount} width={800} height={600}/> : null
                    }
                </div>
            </div>
        );
    }
}
