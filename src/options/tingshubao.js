
import axios from 'axios';
import XLSX from 'xlsx';

class Tingshubao {

  async initRate() {
    const url = `https://college.xiaoxiafm.com/mp/goods/list`;
    const res = await axios.get(url);
    let goods_list = [];
    if(!res.data || res.data.code !== 0) {
      throw new Error(`请检查听书宝登录状态`);
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
  
  async downloadTingshubao({ date = null, timestamp = 0 }) {
    if (!date) {
      date = new Date();
    }
    if (timestamp === 0) {
      timestamp = (new Date).getTime();
    }
    
    const start = this.dateToUrl(date);
    const startUrl = `https://college.xiaoxiafm.com/mp/source/download?start_time=${start}&end_time=${start}&timestamp=${timestamp}`;

    let shouldContinue = false;
    let downloadUrl = '';
    do {
      const res = await axios.get(startUrl);
      if(res.status !== 200) {
        throw new Error(`请检查听书宝登录状态！`);
      }
      const { data, code } = res.data;
      if(code === 0 && data.process === 'downloading') {
        shouldContinue = true;
        downloadUrl = '';
      } else if(code === 0 && data.process === 'done') {
        shouldContinue = false;
        downloadUrl = data.url;
        break;
      } else {
        console.error(`听书宝下载返回了未知的数据`, res.data);
        throw new Error(`听书宝数据导出异常，请检查`);
      }
      // 听书宝使用的是短轮询
      const sleepSeconds = 2;
      await this.sleep(sleepSeconds);
    } while(shouldContinue);
    return await this.exportTingshubao({ url: downloadUrl });
  }

  async exportTingshubao({ url }) {
    const result = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    const data = new Uint8Array(result.data);
    const workbook = XLSX.read(data, {type:"array"});
    let tingshubao = {};

    const resultData = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet).map(row => {
      const rate = this.getRate(row.产品名称);
      const paid = parseInt(row.支付金额.replace('.', '')) * rate / 100;
      row.paid = paid;
      return row;
    });
    return resultData;

    let idCell, nameCell, payCell, productCell;

    console.log();
    for(let key in workbook.Sheets.Sheet) {
      if(key.startsWith('!')) {
        continue;
      }
      const row = workbook.Sheets.Sheet[key];
      const [ , cellCode , cellPos ] = key.match(/([A-Z]+)([0-9]+)/);
      if(cellPos === '1') {
        switch(row.v) {
          case '渠道ID':
            idCell = cellCode;
            break;
          case '渠道昵称':
            nameCell = cellCode
            break;
          case '支付金额':
            payCell = cellCode;
            break;
          case '产品名称':
            productCell = cellCode;
            break;
        }
        continue;
      }
      switch(cellCode) {
        case idCell:
          tingshubao[row.v] = {}
        break;
        case payCell:
          const id = workbook.Sheets.Sheet[idCell+cellPos].v;
          const product = workbook.Sheets.Sheet[productCell+cellPos].v;
          const name = workbook.Sheets.Sheet[nameCell+cellPos].v;
          const rate = this.getRate(product);
          // 单位为分，分成比例未除100，所以最后的金额要 / 100
          const paid = parseInt(row.v.replace('.', '')) * rate / 100;
          Object.assign(tingshubao[id], { paid, name });
        break;
      }
    }
    return tingshubao;
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