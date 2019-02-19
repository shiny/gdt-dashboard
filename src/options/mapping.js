const dbName = 'mapping';
const dbSize = 5 * 1024 * 1024;
const FileSaver = require('file-saver');
import XLSX from 'xlsx';

class Mapping {
  constructor() {
    // this.db = openDatabase(dbName, '1.0', '', dbSize);
    this.mappingTable = [
      [],
      [],
      []
    ];
    try {
      this.load();
    } catch (e) {
      console.log(e);
    }
  }
  initTable() {
  }

  async dropTable() {
    this.mappingTable = [
      [],
      [],
      []
    ];
    localStorage.setItem('mapping-table', '');
  }

  async syncMappingTable(settings) {
    this.mappingTable = settings;
    localStorage.setItem('mapping-table', JSON.stringify(settings));
    return true;
  }

  getAccounts() {
    const gh_id_list = [];
    const results = [];
    for(let i=0; i < this.mappingTable[0].length; i++) {
      const gh_id = this.mappingTable[0][i];
      if(gh_id_list.indexOf(gh_id) > -1) {
        continue;
      }
      const name = this.mappingTable[2][i];
      gh_id_list.push(gh_id);
      results.push({
        gh_id,
        name
      });
    }
    return results;
  }

  getIdByGhId(gh_id, name) {
    const idxList = [];
    let pos = -1;
    do {
      pos = this.mappingTable[0].indexOf(gh_id, pos+1);
      if(pos > -1) {
        idxList.push(pos);
      } else {
        break;
      }
    } while(pos > -1);
    
    const idList = idxList.map( pos => this.mappingTable[1][pos] );
    return [ gh_id, name ].concat(idList);
  }

  dateString() {
    return `${(new Date).getFullYear()}年${((new Date).getMonth()+ 1)}月${(new Date).getDate()}日`;
  }

  download() {
    // FileSaver
    const headers = [ 'gh_id', '广告主名称', '渠道ID' ];
    const accounts = this.getAccounts();
    const results = [];
    for(let row of accounts) {
      results.push(this.getIdByGhId(row.gh_id, row.name));
    }
    results.unshift(headers);
    const ws = XLSX.utils.aoa_to_sheet(results);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '对照表');
    const wbout = XLSX.write(wb, { bookType:'xlsx', bookSST:false, type:'array' });
    console.log(wb);
    saveAs(new Blob([ wbout ],{type:"application/octet-stream"}), "对照表" + this.dateString() + ".xlsx");
    console.log(results);
  }

  addRow({ gh_id, id, name }) {
    const pos = this.mappingTable[1].indexOf(id);
    if(pos > -1) {
      return false;
    }
    this.mappingTable[0].push(gh_id);
    this.mappingTable[1].push(id);
    this.mappingTable[2].push(name);
    return true;
  }

  syncToStorage() {
    const mappingTableData = JSON.stringify(this.mappingTable);
    localStorage.setItem('mapping-table', mappingTableData);
    return mappingTableData;
  }

  async addRecords({ gh_id, name, id, idList = [] }) {
    if (idList.length > 0) {
      const funcs = idList.map(row => {
        return this.addRecords({ gh_id, name, id: row });
      });
      return await Promise.all(funcs);
    } else {
      if(!id) {
        return false;
      }
      console.log([ gh_id, name, id ]);
      return new Promise((resolve, reject) => {
        this.db.transaction( tx => {
          tx.executeSql('INSERT INTO mapping (gh_id, name, id) VALUES (?, ?, ?)', [ gh_id, name, id ], (tx, result) => {
            console.log(result);
            resolve(result);
          }, (tx, error) => {
            console.log(error);
            return resolve(false);
          })
        })
      });
    }
  }
  load() {
    const data = localStorage.getItem('mapping-table');
    if(!data) {
      return [
        [], [], []
      ];
    } else {
      this.mappingTable = JSON.parse(data);
      return this.mappingTable;
    }
  }
  getGhId(id) {
    const pos = this.mappingTable[1].indexOf(id);
    if(pos > -1) {
      return this.mappingTable[0][pos];
    } else {
      return '';
    }
  }
}

const mapping = new Mapping();
export default mapping;