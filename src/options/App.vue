<template>
  <div id="app">
    <div class="container">
      <div>
        <h1 id="logo">
          <img src="../assets/logo.png">投放数据监控台
        </h1>
      </div>
      <input type="file" name="file" @change="openFile" />
      <el-button @click="reload">刷新</el-button>
      <el-table
        :expand-row-keys="expended"
        :data="tableData"
        row-key="gh_id"
        @row-dblclick="toggleExpended"
        show-summary
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row class="ad--header">
              <el-col :span="3">
                广告类型
              </el-col>
              <el-col :span="3">
                总消耗
              </el-col>
              <el-col :span="3">
                曝光次数
              </el-col>
              <el-col :span="3">
                点击次数
              </el-col>
              <el-col :span="3">
                点击率
              </el-col>
              <el-col :span="3">
                转化指标
              </el-col>
              <el-col :span="3">
                转化成本
              </el-col>
            </el-row>
            <el-row class="ad--row" v-if="Object.keys(props.row.momentAd).length > 0">
              <el-col :span="3">
                朋友圈
              </el-col>
              <el-col :span="3">
                {{ props.row.momentAd['总消耗(元)'] }}
              </el-col>
              <el-col :span="3">
                {{ parseInt(props.row.momentAd['曝光次数']).toLocaleString() }}
              </el-col>
              <el-col :span="3">
                {{ parseInt(props.row.momentAd['点击次数']).toLocaleString() }}
              </el-col>
              <el-col :span="3">
                {{ props.row.momentAd['点击率'] }}
              </el-col>
              <el-col :span="3">
                {{ parseInt(props.row.momentAd['转化指标(次)']).toLocaleString() }}
              </el-col>
              <el-col :span="3">
                {{ props.row.momentAd['转化成本(元)'] }}
              </el-col>
            </el-row>
            <el-row class="ad--row" v-if="Object.keys(props.row.mpAd).length > 0">
              <el-col :span="3">
                公众号
              </el-col>
              <el-col :span="3">
                {{ props.row.mpAd['总消耗(元)'] }}
              </el-col>
              <el-col :span="3">
                {{ parseInt(props.row.mpAd['曝光次数']).toLocaleString() }}
              </el-col>
              <el-col :span="3">
                {{ parseInt(props.row.mpAd['点击次数']).toLocaleString() }}
              </el-col>
              <el-col :span="3">
                {{ props.row.mpAd['点击率'] }}
              </el-col>
              <el-col :span="3">
                {{ parseInt(props.row.mpAd['转化指标(次)']).toLocaleString() }}
              </el-col>
              <el-col :span="3">
                {{ props.row.mpAd['转化成本(元)'] }}
              </el-col>
            </el-row>
            <el-row class="tingshubao--header" v-if="props.row.tingshubao">
              <el-col :span="3">渠道ID</el-col>
              <el-col :span="3">渠道昵称</el-col>
              <el-col :span="3">产品名称</el-col>
              <el-col :span="3">uv</el-col>
              <el-col :span="3">点击转化率</el-col>
              <el-col :span="3">付费转化率</el-col>
              <el-col :span="3">支付人数</el-col>
              <el-col :span="3">支付金额</el-col>
            </el-row>
            <el-row class="tingshubao--row" v-for="item in props.row.tingshubao" :key="item.渠道ID">
              <el-col :span="3">{{item.渠道ID}}</el-col>
              <el-col :span="3">{{item.渠道昵称}}</el-col>
              <el-col :span="3">{{item.产品名称}}</el-col>
              <el-col :span="3">{{item.uv}}</el-col>
              <el-col :span="3">{{item.点击转化率}}</el-col>
              <el-col :span="3">{{item.付费转化率}}</el-col>
              <el-col :span="3">{{item.支付人数}}</el-col>
              <el-col :span="3">{{item.支付金额}}</el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="广告主名称"
          width="180">
          <template slot-scope="scope">
            {{ scope.row.name}}
            <div class="gh_id">原始ID: {{scope.row.gh_id}}</div>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="总消耗(元)"
          label="总消耗(元)"
          width="180">
          <template slot-scope="scope">
            {{ (scope.row['总消耗(元)'] / 100 ).toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="曝光次数"
          label="曝光次数">
          <template slot-scope="scope">
            {{scope.row['曝光次数'].toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="点击次数"
          label="点击次数">
          <template slot-scope="scope">
            {{scope.row['点击次数'].toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="点击率"
          label="点击率">
          <template slot-scope="scope">
            <span v-if="scope.row['点击率'] > 0">
              {{(scope.row['点击率'] * 100).toFixed(2)}}%
            </span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="转化指标(次)"
          label="转化指标(次)">
        </el-table-column>
        <el-table-column
          sortable
          prop="转化成本(元)"
          label="转化成本(元)">
          <template slot-scope="scope">
            {{ (scope.row['转化成本(元)'] / 100 ).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          :sort-method="sortPrice"
          prop="paid"
          label="回本金额">
          <template slot-scope="scope">
            <span v-if="Number.isInteger(scope.row.paid)">
            {{ (scope.row.paid / 100 ).toFixed(2)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          :sort-method="sortRate"
          prop=""
          label="回本率">
          <template slot-scope="scope">
            <span v-if="scope.row.paid">
              {{ ((scope.row.paid / scope.row['总消耗(元)']) * 100).toFixed(2) }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <footer>
      &copy; 2018
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
import gdt from './gdt';
import tingshubao from './tingshubao';
import XLSX from 'xlsx'
import mapping from './mapping';

export default {
  name: 'app',
  data () {
    return {
      mapping: {
        '智慧妈咪有妙招': [ 13380, 13379, 12939, 12938, 12936 ]
      },
      tableData: [],
      tableIndexedData: {},
      expended: []
    }
  },
  methods: {

    openFile(e) {
      const file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = async e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type:"array"});
        for(let sheetName in workbook.Sheets) {
          const sheet = workbook.Sheets[sheetName];
          if(!sheet['!ref']) {
            continue;
          }
          const rows = XLSX.utils.sheet_to_json(sheet);
          for(let row of rows) {
          console.log(row);
            const name = row.广告主名称;
            const gh_id = row.gh_id;
            delete row.广告主名称;
            delete row.gh_id;
            const idList = [];
            for(let key in row) {
              if(key === '渠道ID' || key.startsWith('__EMPTY')) {
                idList.push(row[key]);
              }
            }
            await mapping.addRecords({
              idList,
              gh_id,
              name 
            });
            console.log('done');
          }
          return;
        }
      };
      reader.readAsArrayBuffer(file);
    },

    async reload() {
      try {
        const adAccount = await gdt.checklogin();
        const tableData = await gdt.loadAd();
        for(let row of tableData) {
          const gh_id = row.gh_id;
          const index = this.tableIndexedData[gh_id];
          if (Number.isInteger(index)) {
            Object.assign(this.tableData[index], row);
          } else {
            const insertedIndex = this.tableData.length;
            this.tableData.push(row);
            this.tableIndexedData[row.gh_id] = insertedIndex;
          }
        }
        this.mergeTingshubaoData();
      } catch(e) {
        this.$message.error(e.message);
      }
    },

    async loadMergedTable() {
      try {
        const adAccount = await gdt.checklogin();
        // console.log(adAccount);
        const tableData = await gdt.loadAd();
        this.tableData = tableData;
        this.setIndexedData(tableData);
        this.mergeTingshubaoData();
      } catch (e) {
        this.$message.error(e.message);
      }
    },

    setIndexedData(tableData) {
      for(let index in tableData) {
        this.tableIndexedData[tableData[index].gh_id] = parseInt(index);
      }
    },

    async mergeTingshubaoData() {
      await tingshubao.initRate();
      const tingshubaoData = await tingshubao.downloadTingshubao({});
      // console.log(tingshubaoData);
      const initialized = [];
      for(let row of tingshubaoData) {
        const id = row.渠道ID;
        //console.log(id);
        const gh_id = await mapping.getGhId(id);
        if(!gh_id) {
          continue;
        }
        const isFirsttime = (initialized.indexOf(gh_id) === -1);
        if (this.tableIndexedData.hasOwnProperty(gh_id)) {
          const index = this.tableIndexedData[gh_id];
          if(isFirsttime) {
            this.$set(this.tableData[index], 'tingshubao', [ row ]);
          } else {
            this.tableData[index]['tingshubao'].push(row);
          }
          if(isFirsttime) {
            this.$set(this.tableData[index], 'paid', row.paid);
          } else {
            this.$set(this.tableData[index], 'paid', this.tableData[index]['paid'] + row.paid);
          }
        }
        initialized.push(gh_id);
      }
    },

    getSummaries(param) {
      const { columns, data } = param;
      // 广告主名称，总消耗，曝光次数，点击次数，点击率，转化指标，转化成本，回本金额，回本率
      const sums = [
        '', '汇总', 0, 0, 0, '', 0, 0, 0, ''
      ];
      for(let row of data) {
        sums[2] += row['总消耗(元)'];
        sums[3] += row['曝光次数'];
        sums[4] += row['点击次数'];

        sums[6] += row['转化指标(次)'];
        sums[7] += row['转化成本(元)'];
        if(row['paid']) {
          sums[8] += row['paid'];
        }
      }
      sums[5] = ((sums[4] / sums[3]) * 100).toFixed(2) + '%';
      if(sums[2]) {
        sums[9] = (sums[8] / sums[2] * 100).toFixed(2) + '%';
      }

      sums[2] = (sums[2] / 100).toLocaleString() + '元';
      sums[3] = sums[3].toLocaleString();
      sums[4] = sums[4].toLocaleString();

      sums[6] = sums[6].toLocaleString();
      sums[7] = (sums[7] / 100).toFixed(2);
      sums[8] = (sums[8] / 100).toLocaleString() + '元';;
      return sums;
    },
    sortRate(a, b) {
      let rate1 = 0;
      let rate2 = 0;
      if(a.paid) {
        rate1 = parseInt(a.paid / a['总消耗(元)'] * 10000);
      } else if(a.paid !== 0) {
        rate1 = -1;
      }
      if(b.paid) {
        rate2 = parseInt(b.paid / b['总消耗(元)'] * 10000);
      } else if(b.paid !== 0) {
        rate2 = -1;
      }
      return rate1 - rate2;
    },
    sortPrice(a, b) {
      let price1 = 0;
      let price2 = 0;
      if(a.paid) {
        price1 = a.paid;
      } else if(a.paid !== 0) {
        price1 = -1;
      }
      if(b.paid) {
        price2 = b.paid;
      } else if(b.paid !== 0) {
        price2 = -1;
      }
      return price1 - price2;
    },
    toggleExpended(row, event) {
      const index = this.expended.indexOf(row.gh_id);
      if(index > -1) {
        this.expended.splice(index, 1);
      } else {
        this.expended.push(row.gh_id);
      }
    }
  },
  async mounted() {
    await mapping.initTable();
    await this.loadMergedTable();
  }
}
</script>

<style lang="scss">
body, html{
  margin: 0;
}
body, .el-table{
  color: #24262e;
  font-size: 14px;
}
.el-table .cell{
  line-height: 1;
}
.el-table th > .cell{
  color:rgb(101, 103, 110);
}
.gh_id {
  font-size: 12px;
  color: #8f9196;
  cursor: pointer;
  padding-top: 5px;
  line-height: 1.2;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
.container{
  max-width: 1600px;
  margin: 0 auto;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
#logo{
  float: left;
  line-height: 50px;
  img {
    width: 50px;
    vertical-align: middle;
  }
}
.el-table__expanded-cell,
.expanded .el-table__expand-column{
  border-left: solid 3px #5eceb4;
}
.el-table__row.expanded {
  td {
    border-bottom: 0;
  }
}
.el-table__footer-wrapper .cell{
  font-size: 18px;
}
.tingshubao--header{
  margin-top: 2em;
  color: #909399;
  padding: 5px;
  font-weight: 600;
}
.tingshubao--row {
  color: #303133;
  padding:5px 8px;
  font-size: 12px;
}
.tingshubao--row:nth-child(even){
  background: #fafafa;
}
.ad--header {
  color: #909399;
}
.ad--row{
  font-size: 21px;
  color: #303133;
}
footer{
  background: #f0f2f5;
  margin-top: 80px;
  padding: 40px;
}
</style>
