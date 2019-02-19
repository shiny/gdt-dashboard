
import axios from 'axios';
import XLSX from 'xlsx';

class Tingshubao {
  async initRate() {
    if(Array.isArray(this.tablePercert) && this.tablePercert.length > 0) {
      return this.tablePercert;
    }
    const url = `https://college.xiaoxiafm.com/mp/goods/list`;
    let res;
    try {
      res = await axios.get(url);
    } catch(e) {
      console.log(e);
      const error =  new Error(`请检查听书宝登录状态`);
      error.name = 'https://college.xiaoxiafm.com/';
      throw error;
    }
    let goods_list = [];
    if(!res.data || res.data.code !== 0) {
      const error =  new Error(`请检查听书宝登录状态`);
      error.name = 'https://college.xiaoxiafm.com/';
      throw error;
    }
    if(res.data.data) {
      goods_list = res.data.data.goods_list;
      const table = {};
      for(let lesson of goods_list) {
        table[lesson.name] = parseInt(lesson.percent);
      }
      this.tablePercert = table;
      return table;
    } else {
      throw new Error(`听书宝提示：${res.data.msg}`);
    }
  }

  getRate(productName) {
    return this.tablePercert[productName];
  }
  
  async downloadTingshubao({ date = null }) {
    if (!date) {
      date = new Date();
    }
    const dateUrl = this.dateToUrl(date);
    const startUrl = `https://college.xiaoxiafm.com/mp/source/download_api?start_time=${dateUrl}&end_time=${dateUrl}`;

    let shouldContinue = false;
    let orders = [];
    do {
      const res = await axios.get(startUrl);
      if(res.status !== 200) {
        throw new Error(`请检查听书宝登录状态！`);
      }
      const { data, code } = res.data;
      if(code === 0 && data.process === 'calculating') {
        shouldContinue = true;
      } else if(code === 0 && data.process === 'done') {
        shouldContinue = false;
        orders = data.source_list;
        break;
      } else {
        console.error(`听书宝下载返回了未知的数据`, res.data);
        throw new Error(`听书宝数据导出异常，请检查`);
      }
      // 听书宝使用的是短轮询
      const sleepSeconds = 3;
      await this.sleep(sleepSeconds);
    } while(shouldContinue);
    return this.exportTingshubao({ orders });
  }

  async exportTingshubao({ orders }) {
    // const orders = [{
    //   "id": 14974,
    //   "name": "女人说话有一手-ale-课程2",
    //   "goods_name": "180天读书计划",
    //   "price": "99.00",
    //   "url": "https://wxf4aa16343cfcc434.college.xiaoxiafm.com/event/14974/?skin=deposit&goods_id=1",
    //   "uv": 0,
    //   "click_rate": "0.00",
    //   "pay_rate": "0.00",
    //   "not_pay_count": 0,
    //   "not_pay_fee": 0.0,
    //   "pay_count": 0,
    //   "pay_fee": 0.0,
    //   "create_time": "2018-11-27"
    // }]
    return orders.map(order => {
      const rate = this.getRate(order.goods_name);
      const rowPrice = parseFloat(order.pay_fee);
      return {
        rate,
        rowPrice,
        paid: parseInt(rowPrice * 100) * rate / 100,
        渠道ID: order.id,
        渠道昵称: order.name,
        产品名称: order.goods_name,
        价格: order.price,
        推广链接: order.url,
        uv: order.uv,
        点击转化率: order.click_rate,
        付费转化率: order.pay_rate,
        未支付数: order.not_pay_count,
        未支付金额: order.not_pay_fee,
        支付人数: order.pay_count,
        支付金额: order.pay_fee,
        创建时间: order.create_time
      }
    });
    const result = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    const data = new Uint8Array(result.data);
    const workbook = XLSX.read(data, {type:"array"});
    let tingshubao = {};

    const resultData = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet).map(row => {
      const rate = this.getRate(row.产品名称);
      const rowPrice = parseFloat(row.支付金额);
      const paid = parseInt(rowPrice * 100) * rate / 100;
      row.paid = paid;
      return row;
    });
    
    return resultData;
  }

  dateToUrl(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  sleep(seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, seconds * 1000);
    });
  }
}

export default new Tingshubao;