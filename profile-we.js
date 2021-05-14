module.exports = {
  // baseUrl: 'http://3141143vy6.zicp.vip/crops',
  baseUrl: 'http://localhost:8080/crops',
    // 如果此处不配置则使用系统默认的登录页面
    // 此处为自定义登录界面的配置入口，可以将登陆页面定制为app目录下的任何组件
    // 默认为空
    loginPage: 'Login/WeLive',
    waterMark: {
        path: 'WaterMark/TextMarkDemo',
        config: {
            watermarkX:20,//水印起始位置x轴坐标
            watermarkY:20,//水印起始位置Y轴坐标
            rows:15,//水印行数
            cols:11,//水印列数
            xSpace:100,//水印x轴间隔
            ySpace:50,//水印y轴间隔
            color:'#AAA',//水印字体颜色
            alpha:0.2,//水印透明度
            fontsize:'16px',//水印字体大小
            font:'微软雅黑',//水印字体
            width:120,//水印宽度
            height:80,//水印长度
            angle:30,//水印倾斜度数
        },
    },
    brand: {
        banner: {
            logoShort: 'Header/WeLive/LogoShort',
            logoFull: 'Header/WeLive/LogoFull',
            title: 'Header/WeLive/Title',
        },
        quickCreateEnable: true, /*顶部区域的快速创建按钮区*/
        messageSummaryEnable: true, /*顶部区域的消息提示区*/
    },
    icons: [{name: 'crops', path: '/icon/crops/index.html', prefix: 'iconfont icon-'}],
    surface: {
        customizeEnable: true, /*是否允许用户自定义，如果关了，就使用默认配置(defaultOptions)*/
        defaultOptions: {
            layout: 'navTree', /*默认布局 navTree、megaMenu、megaTree */
            skin: '#8362d6&#4a89dc', /*默认皮肤颜色*/
            openModel: 'MultiTab', /*默认选择什么方式：SPA,MultiTab,BrowserTab */
            menuItemLayout: 'horizontal', /*菜单项文字和图标的排列方式，vertical---垂直排列，horizontal---水平排列*/
            menuWidth: '', /*设置左侧菜单宽(layout值为navTree时有效)，未设置默认250px*/
            pageStyle: 'v3', /*版面风格 默认为空，v2:二次版面 v3:v3风格*/
        },
        switcher: {
            enableOpenModel: false, /*是否启用SPA切换开关*/
            EnableCustomizeLayout: true, /*控制布局是否可选*/
            EnableCustomizeSkin: true, /*控制皮肤颜色是否可选*/
        },
        primaryColor: '#1890ff', /* 框架颜色，参考颜色值查看roface/src/style/index.less文件 */
        userHeaderNavMenuAddons: [
            // {key:'cst1',name:'代为办理',component:'Person/UserAgentSetting',param:{}}
            // /*Person是app下的目录,pageStyle='v3*/
        ],
    },
    layoutLevel: {
        L: {
            fontSize: '12px',
            tableCellPadding: '5px',
            tableHeadFontSize: '13px',
            cusFontSizeText: '12px',
            inputHeightBase: '27px',
            btnHeight: '26px',
            btnPadding: '8px',
            lineHeight: 1,
            menuHeight: '33px',
            formItemBottom: '-5px',
            legendBottom: '0',
        },
        M: {
            fontSize: '14px',
            tableCellPadding: '7px',
            tableHeadFontSize: '15px',
            cusFontSizeText: '14px',
            inputHeightBase: '32px',
            btnHeight: '32px',
            btnPadding: '15px',
            lineHeight: 1.5,
            menuHeight: '35px',
            formItemBottom: 0,
            legendBottom: '5px',
        },
    },
    layoutLevelDefault: 'L',
    uploadAllowedSuffix: [],  //允许上传的文档格式，eg.['.ppt','.docx']，为空数组时表示接受所有文档
    exportExcel: true, // 默认导出该列表所有数据
    dataTableNowrap: true,
    dataTableLineNumber: false,
    showBreadcrumb: false,
};
