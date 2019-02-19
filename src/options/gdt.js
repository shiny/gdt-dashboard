import axios from 'axios';
import cookies from './cookies';
import neatCsv from 'neat-csv';
import XLSX from 'xlsx';

class Gdt {

  async getCSRFToken() {
    const baseUrl = 'https://a.weixin.qq.com/client';
    const cookieTicket = await cookies.get({
      url: baseUrl,
      name: 'MMAD_TICKET'
    });
    if(!cookieTicket) {
      return;
    }
    const ticket = cookieTicket.value;
    if(!ticket){
      return;
    }
    let tmp = 5381;
    for (let i = 0; i < ticket.length; i++) {
      tmp += (tmp << 5) + ticket[i].charCodeAt(0);
    }
    return 2147483647 & tmp
  }

  async checklogin() {
    const token = await this.getCSRFToken();
    const url = `https://a.weixin.qq.com/cgi-bin/agency/check_login?g_tk=${token}&_=${Date.now()}`;
    const result = await axios.get(url);
    if(result.status !== 200) {
      const error =  new Error(`请检查广点通登录状态`);
      error.name = 'https://a.weixin.qq.com/';
      throw error;
    }
    const { ret, msg, data } = result.data;
    if(ret > 0) {
      const error =  new Error(`请检查广点通登录状态: ${msg}`);
      error.name = 'https://a.weixin.qq.com/';
      throw error;
    }
    return data[0];
  }

  // 获取指定日期 0 点 0 分 0 秒时的 timestamp
  getStartTimestamp(date) {
    if (!date) {
      date = new Date();
    }
    // date.setHours(0, 0, 0, 0);
    const time = date.getTime() / 1000;
    console.log(time);
    return parseInt(time);
  }

  ab2str(buffer) {
    return new Buffer(buffer, 'binary').toString()
  }

  // 朋友圈广告
  async loadMotionAd() {
    const time = this.getStartTimestamp();
    const token = await this.getCSRFToken();
    const url = `https://a.weixin.qq.com/cgi-bin/agency/get_report?args={%22query_index%22:[%22paid%22,%22exp_pv%22,%22clk_pv%22,%22ctr%22,%22comindex%22,%22cpa%22],%22agency_id%22:%22spid37a67b6f53%22,%22begin_time%22:${time},%22end_time%22:${time},%22report_type%22:2,%22dimension%22:1,%22time_level%22:3,%22contract_flag%22:[],%22product_type%22:[],%22adpos%22:[],%22secondcategoryid%22:[],%22order_by_field%22:[{%22order_by%22:%22ds%22,%22ascending%22:0}],%22page_info%22:{%22page%22:1,%22page_size%22:10}}&g_tk=${token}&download=1&report_tab=ader_sns`;
    const result = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    if(result.headers['content-disposition'].endsWith('.csv')) {
      return this.ab2str(result.data);
    } else {
      const data = new Uint8Array(result.data);
      const workbook = XLSX.read(data, {type:"array"});
      return XLSX.utils.sheet_to_csv(workbook.Sheets['数据统计']);
    }
  }

  //公众号广告
  async loadMpAd() {
    const time = this.getStartTimestamp();
    const token = await this.getCSRFToken();
    const url = `https://a.weixin.qq.com/cgi-bin/agency/get_report?args={%22query_index%22:[%22paid%22,%22exp_pv%22,%22clk_pv%22,%22ctr%22,%22comindex%22,%22cpa%22],%22agency_id%22:%22spid37a67b6f53%22,%22begin_time%22:${time},%22end_time%22:${time},%22report_type%22:1,%22dimension%22:1,%22time_level%22:3,%22contract_flag%22:[],%22product_type%22:[],%22adpos%22:[],%22secondcategoryid%22:[],%22order_by_field%22:[{%22order_by%22:%22ds%22,%22ascending%22:0}],%22page_info%22:{%22page%22:1,%22page_size%22:10}}&g_tk=${token}&download=1&report_tab=ader_mp`;
    const result = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    if(result.headers['content-disposition'].endsWith('.csv')) {
      return this.ab2str(result.data);
    } else {
      const data = new Uint8Array(result.data);
      const workbook = XLSX.read(data, {type:"array"});
      return XLSX.utils.sheet_to_csv(workbook.Sheets['数据统计']);
    }
  }

  // 获取合并后的广告
  async loadAd() {
    const [ momentAdCSV, mpAdCSV ] = await Promise.all([ this.loadMotionAd(), this.loadMpAd() ]);
    const [ momentAds, mpAds ] = await Promise.all([ neatCsv(momentAdCSV), neatCsv(mpAdCSV) ]);
console.log(momentAds);
    const ads = momentAds;
    const mpAdsObj = {};
    for(let ad of mpAds) {
      mpAdsObj[ad.原始ID] = ad 
    }
    const resultData = [];
    for(let ad of ads) {
      let row = {};
      // 需要合并
      if(mpAdsObj[ad.原始ID]) {
        row = this.mergeAds(ad, mpAdsObj[ad.原始ID]);
        delete mpAdsObj[ad.原始ID];
      } else {
        row = this.mergeAds(ad, {});
      }
      resultData.push(row);
    }
    // 合并剩下无交集的数据
    for(let gh_id of Object.keys(mpAdsObj)) {
      resultData.push(this.mergeAds({}, mpAdsObj[gh_id]));
    }
    return resultData;
  }

  /**
   * 合并广告数据
   * 总消耗：累加
   * 曝光次数：累加
   * 点击次数：累加
   * 点击率：总点击次数 / 总曝光数
   * 转化成本：总消耗 / 转化指标
   * 转化指标：累加
   * 
   * @param {*} momentAd 
   * @param {*} mpAd 
   * 
   */
  mergeAds(momentAd, mpAd) {
    const total = this.parsePrice(momentAd['总消耗(元)']) + this.parsePrice(mpAd['总消耗(元)']);
    const 曝光次数 = this.sum(momentAd.曝光次数, mpAd.曝光次数);
    const 点击次数 = this.sum(momentAd.点击次数, mpAd.点击次数);
    const 转化指标 =  this.sum(momentAd['转化指标(次)'], mpAd['转化指标(次)']);
    let 点击率 = 0;
    if(曝光次数 > 0) {
      点击率 = 点击次数 / 曝光次数;
    }
    let 转化成本 = 0;
    if(转化指标 > 0) {
      转化成本 = total / 转化指标;
    }

    const name = momentAd.广告主名称 || mpAd.广告主名称;
    const gh_id = momentAd.原始ID || mpAd.原始ID;
    
    return {
      name,
      gh_id,
      mpAd,
      momentAd,
      '总消耗(元)': total,
      曝光次数,
      点击次数,
      点击率,
      '转化指标(次)': 转化指标,
      '转化成本(元)': 转化成本
    }
  }

  sum(a, b) {
    if(!a) {
      return parseInt(b);
    }
    if(!b) {
      return parseInt(a);
    }
    return parseInt(a) + parseInt(b);
  }

  /**
   * 把 string 金额转化成 int 形式，单位：分
   */
  parsePrice(price) {
    if(!price) {
      return 0;
    }
    return parseInt(parseFloat(price) * 100);
  }

}
const gdt = new Gdt();
export default gdt;