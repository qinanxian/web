import React from 'react';
import {Fieldset, Iframe} from '../../../src/components';

export default class TdReport extends React.Component{
  onLoad = (instance) => {
    // 必须要在相同的域下执行
    const fuc = instance &&
      instance.contentWindow &&
      instance.contentWindow.$ &&
      instance.contentWindow.$.showReport;
    // 参考数据
    this.data = [{
      "success": true,
      "id": "WF2017122114383015567305",
      "result_desc": {
        "INFOANALYSIS": {
          "address_detect": {
            "bank_card_address": "北京市建设银行",
            "true_ip_address": "局域网",
            "mobile_address": "北京市",
            "cell_address": "北京市中关村",
            "id_card_address": "辽宁省本溪市桓仁满族自治县"
          },
          "geoip_info": {
            "proxy_info": [{"proxyProtocol": "L2TP", "port": "8088", "proxyType": "VPN"}],
            "latitude": 42.36679,
            "position": "美国马萨诸塞州剑桥",
            "longitude": -71.10601
          },
          "device_info": {
            "deviceType": "Mac",
            "fpVersion": "3.0.9",
            "appOs": "web",
            "deviceId": "3634b931-95e5-47b9-ad40a-2882a6e74e5",
            "tokenId": "681e3b10740ef8be06313224ea83c3b8",
            "screenRes": "1440^^900^^-^^-",
            "languageRes": "zh-CN^^zh-CN,zh,en,ja,zh-TW^^-^^-^^-",
            "referer": "http://www.json.cn/#",
            "canvas": "e829b2a1468bc3561ec6abb045528fcc",
            "cookieEnabled": true,
            "acceptEncoding": "gzip, deflate",
            "os": "Mac OS",
            "flashEnabled": true,
            "screen": "1440^^900",
            "timeZone": 480,
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
            "pluginListHash": "af8faeb4a1b76191acc64218eff72766",
            "browserType": "chrome",
            "accept": "*/*",
            "webDebuggerStatus": true,
            "acceptLanguage": "zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,zh-TW;q=0.2",
            "enabledJs": true,
            "browser": "chrome",
            "browserVersion": "61.0.3163.100",
            "fontListHash": "-",
            "trueIp": "10.57.241.167",
            "smartId": "s_e7d5242b078291f76896b056846c5866"
          },
          "geotrueip_info": {"latitude": 0, "position": "局域网", "longitude": 0}
        },
        "ANTIFRAUD": {
          "output_fields": {"antifraud_decision": "Reject", "antifraud_model_score": 80},
          "final_score": 611,
          "risk_items": [{
            "rule_id": 714622,
            "score": 10,
            "decision": "Accept",
            "risk_name": "身份证归属地位于高风险较为集中地区",
            "risk_detail": [{"description": "是否命中自定义名单", "type": "custom_list", "high_risk_areas": ["浙江省杭州市"]}]
          }, {
            "rule_id": 714650,
            "score": 80,
            "decision": "Accept",
            "risk_name": "身份证命中法院失信名单",
            "risk_detail": [{
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "法院失信、法院失信、法院失信",
              "description": "身份证命中法院失信名单",
              "court_details": [{
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }, {
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }, {
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }],
              "type": "black_list"
            }]
          }, {
            "rule_id": 714686,
            "score": 80,
            "decision": "Accept",
            "risk_name": "身份证命中法院执行名单",
            "risk_detail": [{
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "法院执行、法院执行、法院执行",
              "description": "身份证命中法院执行名单",
              "court_details": [{
                "execute_subject": "82770",
                "execute_court": "南安市人民法院",
                "executed_name": "魏建华2",
                "case_date": "2010年08月02日",
                "evidence_court": "南安市人民法院",
                "execute_status": "执行中",
                "fraud_type": "courtZhixing",
                "fraud_type_display_name": "法院执行",
                "value": "330100190001019996"
              }, {
                "execute_subject": "82770",
                "execute_court": "南安市人民法院",
                "executed_name": "魏建华",
                "case_date": "2010年08月02日",
                "evidence_court": "南安市人民法院",
                "execute_status": "执行中",
                "fraud_type": "courtZhixing",
                "fraud_type_display_name": "法院执行",
                "value": "330100190001019996"
              }, {
                "execute_subject": "82770",
                "execute_court": "南安市人民法院",
                "case_date": "2010年08月02日",
                "evidence_court": "南安市人民法院",
                "execute_status": "执行中",
                "fraud_type": "courtZhixing",
                "fraud_type_display_name": "法院执行",
                "value": "330100190001019996"
              }],
              "type": "black_list"
            }]
          }, {
            "rule_id": 714696,
            "score": 105,
            "decision": "Accept",
            "risk_name": "身份证命中信贷逾期名单",
            "risk_detail": [{
              "description": "身份证命中信贷逾期名单",
              "discredit_times": 6,
              "overdue_details": [{
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(60, 90]",
                "overdue_count": 3
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(60, 90]",
                "overdue_count": 7
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(1000, 5000]",
                "overdue_day_range": "360+",
                "overdue_count": 2
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(100000, 500000]",
                "overdue_day_range": "(270, 360]",
                "overdue_count": 1
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(180, 270]",
                "overdue_count": 5
              }, {"overdue_time": "2016-07", "overdue_day_range": "(60, 90]", "overdue_count": 4}],
              "type": "discredit_count"
            }]
          }, {
            "rule_id": 714702,
            "score": 40,
            "decision": "Accept",
            "risk_name": "身份证命中高风险关注名单",
            "risk_detail": [{
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "信贷逾期名单",
              "grey_list_details": [{
                "evidence_time": 1159174064000,
                "risk_level": "高",
                "fraud_type": "creditCrack",
                "fraud_type_display_name": "信贷逾期名单",
                "value": "330100190001019996"
              }],
              "description": "身份证命中高风险关注名单",
              "type": "grey_list"
            }]
          }, {
            "rule_id": 714730,
            "score": 70,
            "decision": "Accept",
            "risk_name": "身份证命中车辆租赁违约名单",
            "risk_detail": [{
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "汽车租赁违约",
              "description": "身份证命中车辆租赁违约名单",
              "type": "black_list"
            }]
          }, {
            "rule_id": 714736,
            "score": 40,
            "decision": "Accept",
            "risk_name": "身份证命中法院结案名单",
            "risk_detail": [{
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "法院结案、法院结案",
              "description": "身份证命中法院结案名单",
              "court_details": [{
                "execute_court": "广东省紫金县人民法院",
                "case_code": "(2015)河紫法执字第00403号",
                "executed_name": "张测试22",
                "case_date": "2015年09月24日",
                "evidence_court": "广东省紫金县人民法院",
                "fraud_type": "courtClose",
                "fraud_type_display_name": "法院结案",
                "value": "330100190001019996"
              }, {
                "execute_subject": "30550",
                "execute_court": "广东省紫金县人民法院",
                "case_code": "(2015)河紫法执字第00403号",
                "executed_name": "张测试",
                "case_date": "2015年09月24日",
                "evidence_court": "广东省紫金县人民法院",
                "execute_status": "已结案",
                "fraud_type": "courtClose",
                "fraud_type_display_name": "法院结案",
                "value": "330100190001019996"
              }],
              "type": "black_list"
            }]
          }, {
            "rule_id": 714750,
            "score": 40,
            "decision": "Accept",
            "risk_name": "身份证_姓名命中信贷逾期模糊名单",
            "risk_detail": [{
              "fuzzy_list_details": [{
                "fuzzy_id_number": "33010019000101****",
                "fraud_type": "creditCrack",
                "fraud_type_display_name": "信贷逾期名单",
                "fuzzy_name": "测试"
              }],
              "fraud_type_display_name": "信贷逾期名单",
              "description": "身份证_姓名命中信贷逾期模糊名单",
              "type": "fuzzy_black_list"
            }]
          }, {
            "rule_id": 714784,
            "score": 27,
            "decision": "Accept",
            "risk_name": "3个月内身份证关联多个申请信息",
            "risk_detail": [{
              "frequency_detail_list": [{
                "data": ["123qq.com", "[fuzaa@qq.com,123qq.com]", "fuzaa@qq.com"],
                "detail": "3个月身份证关联邮箱数：3"
              }, {
                "data": ["13971111315", "13093754143", "13913524424", "2167", "13847890321", "13122446688", "13628110000", "1357273", "2178"],
                "detail": "3个月身份证关联手机号数：9"
              }], "type": "frequency_detail"
            }]
          }, {
            "rule_id": 714786,
            "score": 12,
            "decision": "Accept",
            "risk_name": "3个月内申请信息关联多个身份证",
            "risk_detail": [{
              "frequency_detail_list": [{
                "data": ["330100190001019996", "6222081610000500000", "510723199605120000", "330111190001010055"],
                "detail": "3个月手机号关联身份证数：4"
              }], "type": "frequency_detail"
            }]
          }, {
            "rule_id": 714792,
            "score": 10,
            "decision": "Accept",
            "risk_name": "3个月内申请人手机号作为联系人手机号出现的次数大于等于2",
            "risk_detail": [{
              "cross_frequency_detail_list": [{"detail": "3个月内申请人手机号作为第一联系人手机号出现的次数：44"}],
              "type": "cross_frequency_detail"
            }]
          }, {
            "rule_id": 714804,
            "score": 5,
            "decision": "Accept",
            "risk_name": "7天内设备或身份证或手机号申请次数过多",
            "risk_detail": [{
              "frequency_detail_list": [{"detail": "7天内身份证申请次数：41"}],
              "type": "frequency_detail"
            }]
          }, {
            "rule_id": 1118030,
            "score": 40,
            "decision": "Accept",
            "risk_name": "6个月内申请人在多个平台申请借款",
            "risk_detail": [{
              "platform_detail_dimension": [{
                "count": 1,
                "detail": [{"count": 1, "industry_display_name": "信用卡中心"}],
                "dimension": "手机"
              }, {
                "count": 7,
                "detail": [{"count": 5, "industry_display_name": "无行业"}, {
                  "count": 1,
                  "industry_display_name": "信用卡中心"
                }, {"count": 1, "industry_display_name": "财产险"}],
                "dimension": "身份证号码"
              }],
              "platform_detail": [{"count": 5, "industry_display_name": "无行业"}, {
                "count": 1,
                "industry_display_name": "信用卡中心"
              }, {"count": 1, "industry_display_name": "财产险"}],
              "description": "在指定时间内，主属性匹配字段下关联的合作方的个数",
              "type": "platform_detail",
              "platform_count": 7
            }]
          }, {
            "rule_id": 1118486,
            "score": 1,
            "decision": "Accept",
            "risk_name": "跨事件字段比较",
            "risk_detail": [{
              "cross_event_detail_list": [{"detail": "主属性不变，统计过去时间片内指定字段值与当前字段值相同的次数：2"}],
              "type": "cross_event_detail"
            }]
          }, {
            "rule_id": 1118032,
            "score": 10,
            "decision": "Accept",
            "risk_name": "身份证命中风险群体规则",
            "risk_detail": [{
              "suspect_team_detail_list": [{
                "group_id": "92079941",
                "dim_type": "idNumber",
                "dim_value": "6222081610000500000",
                "node_dist": "设备ID:18(64.29%);银行卡号:4(14.29%);手机号码:3(10.71%);身份证号:3(10.71%)",
                "fraud_dist": "法院结案:1(100%)",
                "black_rat": "3.57%",
                "grey_rat": "50%",
                "degree": 5,
                "total_cnt": 28,
                "black_cnt": 1,
                "grey_cnt": 14,
                "core_dst": 1,
                "black_dst": 1,
                "total_cnt_two": 7,
                "black_cnt_one": 6,
                "black_cnt_two": 7,
                "fraud_dist_one": "信贷逾期名单:1(100%)",
                "fraud_dist_two": "信贷逾期名单:2(100%)"
              }], "type": "suspected_team"
            }]
          }, {
            "rule_id": 1122546,
            "score": 50,
            "decision": "Accept",
            "risk_name": "各种类型规则集合",
            "risk_detail": [{
              "description": "身份证命中信贷逾期名单",
              "discredit_times": 6,
              "overdue_details": [{
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(60, 90]",
                "overdue_count": 3
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(60, 90]",
                "overdue_count": 7
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(1000, 5000]",
                "overdue_day_range": "360+",
                "overdue_count": 2
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(100000, 500000]",
                "overdue_day_range": "(270, 360]",
                "overdue_count": 1
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(180, 270]",
                "overdue_count": 5
              }, {"overdue_time": "2016-07", "overdue_day_range": "(60, 90]", "overdue_count": 4}],
              "type": "discredit_count"
            }, {
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "法院失信、法院失信、法院失信",
              "description": "身份证命中法院失信名单",
              "court_details": [{
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }, {
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }, {
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }],
              "type": "black_list"
            }, {
              "fuzzy_list_details": [{
                "fuzzy_id_number": "33010019000101****",
                "fraud_type": "creditCrack",
                "fraud_type_display_name": "信贷逾期名单",
                "fuzzy_name": "测试"
              }],
              "fraud_type_display_name": "信贷逾期名单",
              "description": "身份证_姓名命中信贷逾期模糊名单",
              "type": "fuzzy_black_list"
            }, {
              "description": "是否命中自定义名单",
              "type": "custom_list",
              "high_risk_areas": ["12345", "67890"]
            }, {
              "platform_detail_dimension": [{
                "count": 1,
                "detail": [{"count": 1, "industry_display_name": "信用卡中心"}],
                "dimension": "手机"
              }, {
                "count": 7,
                "detail": [{"count": 5, "industry_display_name": "无行业"}, {
                  "count": 1,
                  "industry_display_name": "信用卡中心"
                }, {"count": 1, "industry_display_name": "财产险"}],
                "dimension": "身份证号码"
              }],
              "platform_detail": [{"count": 5, "industry_display_name": "无行业"}, {
                "count": 1,
                "industry_display_name": "信用卡中心"
              }, {"count": 1, "industry_display_name": "财产险"}],
              "description": "在指定时间内，主属性匹配字段下关联的合作方的个数",
              "type": "platform_detail",
              "platform_count": 7
            }, {
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "信贷逾期名单",
              "grey_list_details": [{
                "evidence_time": 1159174064000,
                "risk_level": "高",
                "fraud_type": "creditCrack",
                "fraud_type_display_name": "信贷逾期名单",
                "value": "330100190001019996"
              }],
              "description": "身份证命中高风险关注名单",
              "type": "grey_list"
            }, {
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "汽车租赁违约",
              "description": "身份证命中车辆租赁违约名单",
              "type": "black_list"
            }, {
              "frequency_detail_list": [{
                "data": ["123qq.com", "[fuzaa@qq.com,123qq.com]", "fuzaa@qq.com"],
                "detail": "3个月身份证关联邮箱数：3"
              }], "type": "frequency_detail"
            }, {
              "cross_frequency_detail_list": [{"detail": "3个月内申请人手机号作为第一联系人手机号出现的次数：45"}, {
                "data": ["13971111315", "13093754143", "13913524424", "2167", "1357273", "2178", "18868875449"],
                "detail": "借款人身份证在借款事件中的借款人身份证关联手机号个数：7"
              }], "type": "cross_frequency_detail"
            }, {
              "cross_event_detail_list": [{"detail": "主属性不变，统计过去时间片内指定字段值与当前字段值相同的次数：2"}],
              "type": "cross_event_detail"
            }]
          }],
          "final_decision": "REJECT"
        },
        "AUTHENTICATION": {
          "output_fields": {"antifraud_decision": "Reject", "antifraud_model_score": 80},
          "final_score": 611,
          "risk_items": [{
            "rule_id": 714622,
            "score": 10,
            "decision": "Accept",
            "risk_name": "身份证归属地位于高风险较为集中地区",
            "risk_detail": [{"description": "是否命中自定义名单", "type": "custom_list", "high_risk_areas": ["浙江省杭州市"]}]
          }, {
            "rule_id": 714650,
            "score": 80,
            "decision": "Accept",
            "risk_name": "身份证命中法院失信名单",
            "risk_detail": [{
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "法院失信、法院失信、法院失信",
              "description": "身份证命中法院失信名单",
              "court_details": [{
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }, {
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }, {
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }],
              "type": "black_list"
            }]
          }, {
            "rule_id": 714686,
            "score": 80,
            "decision": "Accept",
            "risk_name": "身份证命中法院执行名单",
            "risk_detail": [{
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "法院执行、法院执行、法院执行",
              "description": "身份证命中法院执行名单",
              "court_details": [{
                "execute_subject": "82770",
                "execute_court": "南安市人民法院",
                "executed_name": "魏建华2",
                "case_date": "2010年08月02日",
                "evidence_court": "南安市人民法院",
                "execute_status": "执行中",
                "fraud_type": "courtZhixing",
                "fraud_type_display_name": "法院执行",
                "value": "330100190001019996"
              }, {
                "execute_subject": "82770",
                "execute_court": "南安市人民法院",
                "executed_name": "魏建华",
                "case_date": "2010年08月02日",
                "evidence_court": "南安市人民法院",
                "execute_status": "执行中",
                "fraud_type": "courtZhixing",
                "fraud_type_display_name": "法院执行",
                "value": "330100190001019996"
              }, {
                "execute_subject": "82770",
                "execute_court": "南安市人民法院",
                "case_date": "2010年08月02日",
                "evidence_court": "南安市人民法院",
                "execute_status": "执行中",
                "fraud_type": "courtZhixing",
                "fraud_type_display_name": "法院执行",
                "value": "330100190001019996"
              }],
              "type": "black_list"
            }]
          }, {
            "rule_id": 714696,
            "score": 105,
            "decision": "Accept",
            "risk_name": "身份证命中信贷逾期名单",
            "risk_detail": [{
              "description": "身份证命中信贷逾期名单",
              "discredit_times": 6,
              "overdue_details": [{
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(60, 90]",
                "overdue_count": 3
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(60, 90]",
                "overdue_count": 7
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(1000, 5000]",
                "overdue_day_range": "360+",
                "overdue_count": 2
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(100000, 500000]",
                "overdue_day_range": "(270, 360]",
                "overdue_count": 1
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(180, 270]",
                "overdue_count": 5
              }, {"overdue_time": "2016-07", "overdue_day_range": "(60, 90]", "overdue_count": 4}],
              "type": "discredit_count"
            }]
          }, {
            "rule_id": 714702,
            "score": 40,
            "decision": "Accept",
            "risk_name": "身份证命中高风险关注名单",
            "risk_detail": [{
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "信贷逾期名单",
              "grey_list_details": [{
                "evidence_time": 1159174064000,
                "risk_level": "高",
                "fraud_type": "creditCrack",
                "fraud_type_display_name": "信贷逾期名单",
                "value": "330100190001019996"
              }],
              "description": "身份证命中高风险关注名单",
              "type": "grey_list"
            }]
          }, {
            "rule_id": 714730,
            "score": 70,
            "decision": "Accept",
            "risk_name": "身份证命中车辆租赁违约名单",
            "risk_detail": [{
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "汽车租赁违约",
              "description": "身份证命中车辆租赁违约名单",
              "type": "black_list"
            }]
          }, {
            "rule_id": 714736,
            "score": 40,
            "decision": "Accept",
            "risk_name": "身份证命中法院结案名单",
            "risk_detail": [{
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "法院结案、法院结案",
              "description": "身份证命中法院结案名单",
              "court_details": [{
                "execute_court": "广东省紫金县人民法院",
                "case_code": "(2015)河紫法执字第00403号",
                "executed_name": "张测试22",
                "case_date": "2015年09月24日",
                "evidence_court": "广东省紫金县人民法院",
                "fraud_type": "courtClose",
                "fraud_type_display_name": "法院结案",
                "value": "330100190001019996"
              }, {
                "execute_subject": "30550",
                "execute_court": "广东省紫金县人民法院",
                "case_code": "(2015)河紫法执字第00403号",
                "executed_name": "张测试",
                "case_date": "2015年09月24日",
                "evidence_court": "广东省紫金县人民法院",
                "execute_status": "已结案",
                "fraud_type": "courtClose",
                "fraud_type_display_name": "法院结案",
                "value": "330100190001019996"
              }],
              "type": "black_list"
            }]
          }, {
            "rule_id": 714750,
            "score": 40,
            "decision": "Accept",
            "risk_name": "身份证_姓名命中信贷逾期模糊名单",
            "risk_detail": [{
              "fuzzy_list_details": [{
                "fuzzy_id_number": "33010019000101****",
                "fraud_type": "creditCrack",
                "fraud_type_display_name": "信贷逾期名单",
                "fuzzy_name": "测试"
              }],
              "fraud_type_display_name": "信贷逾期名单",
              "description": "身份证_姓名命中信贷逾期模糊名单",
              "type": "fuzzy_black_list"
            }]
          }, {
            "rule_id": 714784,
            "score": 27,
            "decision": "Accept",
            "risk_name": "3个月内身份证关联多个申请信息",
            "risk_detail": [{
              "frequency_detail_list": [{
                "data": ["123qq.com", "[fuzaa@qq.com,123qq.com]", "fuzaa@qq.com"],
                "detail": "3个月身份证关联邮箱数：3"
              }, {
                "data": ["13971111315", "13093754143", "13913524424", "2167", "13847890321", "13122446688", "13628110000", "1357273", "2178"],
                "detail": "3个月身份证关联手机号数：9"
              }], "type": "frequency_detail"
            }]
          }, {
            "rule_id": 714786,
            "score": 12,
            "decision": "Accept",
            "risk_name": "3个月内申请信息关联多个身份证",
            "risk_detail": [{
              "frequency_detail_list": [{
                "data": ["330100190001019996", "6222081610000500000", "510723199605120000", "330111190001010055"],
                "detail": "3个月手机号关联身份证数：4"
              }], "type": "frequency_detail"
            }]
          }, {
            "rule_id": 714792,
            "score": 10,
            "decision": "Accept",
            "risk_name": "3个月内申请人手机号作为联系人手机号出现的次数大于等于2",
            "risk_detail": [{
              "cross_frequency_detail_list": [{"detail": "3个月内申请人手机号作为第一联系人手机号出现的次数：44"}],
              "type": "cross_frequency_detail"
            }]
          }, {
            "rule_id": 714804,
            "score": 5,
            "decision": "Accept",
            "risk_name": "7天内设备或身份证或手机号申请次数过多",
            "risk_detail": [{
              "frequency_detail_list": [{"detail": "7天内身份证申请次数：41"}],
              "type": "frequency_detail"
            }]
          }, {
            "rule_id": 1118030,
            "score": 40,
            "decision": "Accept",
            "risk_name": "6个月内申请人在多个平台申请借款",
            "risk_detail": [{
              "platform_detail_dimension": [{
                "count": 1,
                "detail": [{"count": 1, "industry_display_name": "信用卡中心"}],
                "dimension": "手机"
              }, {
                "count": 7,
                "detail": [{"count": 5, "industry_display_name": "无行业"}, {
                  "count": 1,
                  "industry_display_name": "信用卡中心"
                }, {"count": 1, "industry_display_name": "财产险"}],
                "dimension": "身份证号码"
              }],
              "platform_detail": [{"count": 5, "industry_display_name": "无行业"}, {
                "count": 1,
                "industry_display_name": "信用卡中心"
              }, {"count": 1, "industry_display_name": "财产险"}],
              "description": "在指定时间内，主属性匹配字段下关联的合作方的个数",
              "type": "platform_detail",
              "platform_count": 7
            }]
          }, {
            "rule_id": 1118486,
            "score": 1,
            "decision": "Accept",
            "risk_name": "跨事件字段比较",
            "risk_detail": [{
              "cross_event_detail_list": [{"detail": "主属性不变，统计过去时间片内指定字段值与当前字段值相同的次数：2"}],
              "type": "cross_event_detail"
            }]
          }, {
            "rule_id": 1118032,
            "score": 10,
            "decision": "Accept",
            "risk_name": "身份证命中风险群体规则",
            "risk_detail": [{
              "suspect_team_detail_list": [{
                "group_id": "92079941",
                "dim_type": "idNumber",
                "dim_value": "6222081610000500000",
                "node_dist": "设备ID:18(64.29%);银行卡号:4(14.29%);手机号码:3(10.71%);身份证号:3(10.71%)",
                "fraud_dist": "法院结案:1(100%)",
                "black_rat": "3.57%",
                "grey_rat": "50%",
                "degree": 5,
                "total_cnt": 28,
                "black_cnt": 1,
                "grey_cnt": 14,
                "core_dst": 1,
                "black_dst": 1,
                "total_cnt_two": 7,
                "black_cnt_one": 6,
                "black_cnt_two": 7,
                "fraud_dist_one": "信贷逾期名单:1(100%)",
                "fraud_dist_two": "信贷逾期名单:2(100%)"
              }], "type": "suspected_team"
            }]
          }, {
            "rule_id": 1122546,
            "score": 50,
            "decision": "Accept",
            "risk_name": "各种类型规则集合",
            "risk_detail": [{
              "description": "身份证命中信贷逾期名单",
              "discredit_times": 6,
              "overdue_details": [{
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(60, 90]",
                "overdue_count": 3
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(60, 90]",
                "overdue_count": 7
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(1000, 5000]",
                "overdue_day_range": "360+",
                "overdue_count": 2
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(100000, 500000]",
                "overdue_day_range": "(270, 360]",
                "overdue_count": 1
              }, {
                "overdue_time": "2016-07",
                "overdue_amount_range": "(10000, 50000]",
                "overdue_day_range": "(180, 270]",
                "overdue_count": 5
              }, {"overdue_time": "2016-07", "overdue_day_range": "(60, 90]", "overdue_count": 4}],
              "type": "discredit_count"
            }, {
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "法院失信、法院失信、法院失信",
              "description": "身份证命中法院失信名单",
              "court_details": [{
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }, {
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }, {
                "value": "330100190001019996",
                "fraud_type": "court",
                "fraud_type_display_name": "法院失信",
                "executed_name": "李测试",
                "age": "41",
                "gender": "男",
                "province": "湖南",
                "case_date": "2016年10月10日",
                "execute_court": "衡南县人民法院",
                "term_duty": "被告偿还借款9万元及利息",
                "execute_subject": "25215",
                "execute_status": "已结案",
                "evidence_court": "衡南县人民法院",
                "carry_out": "全部未履行",
                "specific_circumstances": "其他有履行能力而拒不履行生效法律文书确定义务",
                "execute_code": "（2015）衡中法民四再终字第8号",
                "case_code": "(2016)湘0422执31号",
                "evidence_time": 1159174064000
              }],
              "type": "black_list"
            }, {
              "fuzzy_list_details": [{
                "fuzzy_id_number": "33010019000101****",
                "fraud_type": "creditCrack",
                "fraud_type_display_name": "信贷逾期名单",
                "fuzzy_name": "测试"
              }],
              "fraud_type_display_name": "信贷逾期名单",
              "description": "身份证_姓名命中信贷逾期模糊名单",
              "type": "fuzzy_black_list"
            }, {
              "description": "是否命中自定义名单",
              "type": "custom_list",
              "high_risk_areas": ["12345", "67890"]
            }, {
              "platform_detail_dimension": [{
                "count": 1,
                "detail": [{"count": 1, "industry_display_name": "信用卡中心"}],
                "dimension": "手机"
              }, {
                "count": 7,
                "detail": [{"count": 5, "industry_display_name": "无行业"}, {
                  "count": 1,
                  "industry_display_name": "信用卡中心"
                }, {"count": 1, "industry_display_name": "财产险"}],
                "dimension": "身份证号码"
              }],
              "platform_detail": [{"count": 5, "industry_display_name": "无行业"}, {
                "count": 1,
                "industry_display_name": "信用卡中心"
              }, {"count": 1, "industry_display_name": "财产险"}],
              "description": "在指定时间内，主属性匹配字段下关联的合作方的个数",
              "type": "platform_detail",
              "platform_count": 7
            }, {
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "信贷逾期名单",
              "grey_list_details": [{
                "evidence_time": 1159174064000,
                "risk_level": "高",
                "fraud_type": "creditCrack",
                "fraud_type_display_name": "信贷逾期名单",
                "value": "330100190001019996"
              }],
              "description": "身份证命中高风险关注名单",
              "type": "grey_list"
            }, {
              "hit_type_display_name": "身份证号码",
              "fraud_type_display_name": "汽车租赁违约",
              "description": "身份证命中车辆租赁违约名单",
              "type": "black_list"
            }, {
              "frequency_detail_list": [{
                "data": ["123qq.com", "[fuzaa@qq.com,123qq.com]", "fuzaa@qq.com"],
                "detail": "3个月身份证关联邮箱数：3"
              }], "type": "frequency_detail"
            }, {
              "cross_frequency_detail_list": [{"detail": "3个月内申请人手机号作为第一联系人手机号出现的次数：45"}, {
                "data": ["13971111315", "13093754143", "13913524424", "2167", "1357273", "2178", "18868875449"],
                "detail": "借款人身份证在借款事件中的借款人身份证关联手机号个数：7"
              }], "type": "cross_frequency_detail"
            }, {
              "cross_event_detail_list": [{"detail": "主属性不变，统计过去时间片内指定字段值与当前字段值相同的次数：2"}],
              "type": "cross_event_detail"
            }]
          }],
          "final_decision": "REJECT"
        },
        "POSTLOAN": {"final_decision": "PASS"}
      }
    }];
    // 执行显示征信报告的方法
    fuc && fuc(this.data);
  };
  render() {
    return (
      <div>
        <Fieldset headerType='gist' legend="征信报告" expanded={true}>
          <Iframe url='/asset/tdreport/tdreport.html' onLoad={this.onLoad} local/>
        </Fieldset>
      </div>
    );
  }
}