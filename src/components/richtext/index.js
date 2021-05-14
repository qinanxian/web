import React from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

import './style/index.less';

import {compose} from '../compose';

@compose
export default class RichText extends React.Component {
    static defaultProps = {
        reading: false,
        readOnly: false,
    };
    handleEditorChange = (value) => {
        const data = value.toHTML();
        const {onBlur, onChange, onValueChange, item = {}} = this.props;
        item.onNoValidateChange && item.onNoValidateChange({[item.code]: value});
        if (data === '') {
            onBlur && onBlur(null);
            onChange && onChange(null);
            onValueChange && onValueChange(null);
        } else {
            onBlur && onBlur(data);
            onChange && onChange(data);
            onValueChange && onValueChange(data);
        }
    };

    preview = () => {
        if (window.previewWindow) {
            window.previewWindow.close();
        }

        window.previewWindow = window.open();
        window.previewWindow.document.write(this.buildPreviewHtml());
        window.previewWindow.document.close();

    };

    buildPreviewHtml() {
        const { value } = this.props;
        return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${(value || '')}</div>
        </body>
      </html>
    `;

    }

    render() {
        const {style, reading, value, readOnly, placeholder} = this.props;
        if (reading) {
            return (<div dangerouslySetInnerHTML={{__html: value}}>{}</div>); // eslint-disable-line
        }
        /* eslint-disable */
        // font-size		文字字号选择器
        // font-family      文字字体选择器
        // line-height      文字行高选择器
        // letter-spacing	文字字间距选择器
        // text-color		文字颜色选择器，包含文字背景颜色设置
        // bold			    设置文字加粗
        // italic			设置文字斜体
        // underline		设置文字下划线
        // strike-through	设置文字删除线
        // superscript		设置文字为上标
        // subscript设		置文字为下标
        // remove-styles	清除文字样式
        // emoji			Emoji表情选择器
        // text-align		文字对齐方式工具，可通过textAligns属性来指定可以使用哪些对齐方式
        // text-indent		段落缩进工具，最多可缩进6级link链接插入工具headings段落类型（标题1-6、常规）
        // list-ul			无序列表
        // list-ol			有序列表
        // blockquote		引用段落
        // code			    代码块
        // hr				水平线工具
        // media			多媒体插入工具
        // clear			内容清除工具
        // undo			    撤销操作
        // redo			    重做操作
        // separator		分割线，连续的多个separator将只显示为1个
        // fullscreen		全屏
        const controls = [
            'separator','font-size', 'line-height', 'separator',
            'text-color', 'bold', 'underline', 'separator',
            'separator', 'text-indent', 'text-align', 'separator',
            'list-ul', 'list-ol', 'blockquote','hr', 'separator',
            'fullscreen','separator',
        ];
        const extendControls = [
            {
                key: 'custom-button',
                type: 'button',
                text: '预览',
                onClick: this.preview,
            },
        ];

        return (<BraftEditor
            readOnly={readOnly}
            controls={controls}
            extendControls={extendControls}
            style={style}
            value={value}
            onChange={this.handleEditorChange}
            placeholder={placeholder}
            className='ro-editor'
        />);
    }
}
