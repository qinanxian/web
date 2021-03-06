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
        // font-size		?????????????????????
        // font-family      ?????????????????????
        // line-height      ?????????????????????
        // letter-spacing	????????????????????????
        // text-color		??????????????????????????????????????????????????????
        // bold			    ??????????????????
        // italic			??????????????????
        // underline		?????????????????????
        // strike-through	?????????????????????
        // superscript		?????????????????????
        // subscript???		??????????????????
        // remove-styles	??????????????????
        // emoji			Emoji???????????????
        // text-align		????????????????????????????????????textAligns?????????????????????????????????????????????
        // text-indent		????????????????????????????????????6???link??????????????????headings?????????????????????1-6????????????
        // list-ul			????????????
        // list-ol			????????????
        // blockquote		????????????
        // code			    ?????????
        // hr				???????????????
        // media			?????????????????????
        // clear			??????????????????
        // undo			    ????????????
        // redo			    ????????????
        // separator		???????????????????????????separator???????????????1???
        // fullscreen		??????
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
                text: '??????',
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
