const dbName = 'mapping';
const dbSize = 5 * 1024 * 1024;

class Mapping {
  constructor() {
    this.db = openDatabase(dbName, '1.0', '', dbSize);
  }
  initTable() {
    return new Promise((resolve, reject) => {
      const sql  = `CREATE TABLE IF NOT EXISTS \`mapping\` (
        \`gh_id\`	TEXT,
        \`name\`	TEXT,
        \`id\`	INTEGER,
        PRIMARY KEY(\`id\`)
      )`;
      this.db.transaction( tx => {
        tx.executeSql(sql, [], (tx, result) => {
          console.log(result);
          tx.executeSql(`CREATE INDEX \`gh_id\` ON \`mapping\` (
            \`id\`
          )`);
          resolve(result);
        });
      });
    });
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
            console.error(error);
            if (error.code === 6) {
              resolve();
            } else {
              resolve();
            }
          })
        })
      });
    }
  }
  loadMapping() {

  }
  getGhId(id) {
    return new Promise((resolve, reject) => {
      this.db.transaction( tx => {
        tx.executeSql('SELECT gh_id FROM mapping WHERE id = ?', [ id ], (tx, result) => {
           // console.log(result);
          const { rows } = result;
          if(rows.length === 0) {
            return resolve('');
          }
          resolve(rows[0].gh_id);
        });
      })
    });
  }
}

const mapping = new Mapping();
export default mapping;