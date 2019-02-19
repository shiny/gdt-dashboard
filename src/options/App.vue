<template>
  <div id="app">
    <div class="container">
      <el-row>
        <el-col :span="20">
          <h1 id="logo">
            <img @click="test" src="../assets/logo.png"> 广点通投放数据监控台
          </h1>
        </el-col>
        <el-col :span="4">
          <el-button-group style="margin-top:20px; float:right">
          <el-button type="primary" size="small" @click="exportTableData()"  plain icon="el-icon-download">导出报表</el-button>
          <el-button type="primary" size="small" @click="fileDialogVisible = true"><i class="el-icon-setting"></i> 设置</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <input style="display: none;" type="file" name="file" id="upload" @change="openFile" />
      <el-table
        header-row-class-name="pin"
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
            <span>
            {{ (scope.row['转化成本(元)'] / 100 ).toFixed(2)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          label="实际成本">
          <template slot-scope="scope">
            <span v-if="Number.isInteger(scope.row.paid) && scope.row['总消耗(元)'] > 0"
              :class="{ warning: !!warningForm['实际成本(元)'] && ((scope.row['转化成本(元)'] - (scope.row['转化成本(元)'] * (scope.row.paid / scope.row['总消耗(元)']))) / 100) > warningForm['实际成本(元)'] }">
            {{ ((scope.row['转化成本(元)'] - (scope.row['转化成本(元)'] * (scope.row.paid / scope.row['总消耗(元)']))) / 100).toFixed(2)}}
            </span>
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
            <span v-if="scope.row.paid && scope.row['总消耗(元)'] > 0"
             :class="{ warning: !!warningForm['回本率'] && (((scope.row.paid / scope.row['总消耗(元)']) * 100) < warningForm['回本率']) }">
              {{ ((scope.row.paid / scope.row['总消耗(元)']) * 100).toFixed(2) }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 60px; line-height: 60px; padding-bottom:60px; color:#909399">- 已经到最底部 - </div>
    </div>
    <div class="progress-container" v-if="uploadedProgress > 0 && uploadedProgress < 100">
      <el-progress type="circle" :percentage="uploadedProgress"></el-progress>
    </div>
    <el-dialog
      title="设置"
      :before-close="clearInputWarningForm"
      :visible.sync="fileDialogVisible"
      width="50%"
      center>
        <el-row style="width: 80%; margin: 40px auto;" type="flex" class="row-bg" justify="space-between">
          <el-col :span="6">
            <el-button plain type="success" class="btn__upload"><label for="upload">
              <svg class="icon" aria-hidden="true"><use xlink:href="#icon-user-excel"></use></svg> 上传 Excel
            </label></el-button>
            <div style="margin:10px 0 0 10px; ">
              <a download href="https://shiguanglu.com/public/对照表.xlsx">下载示范Excel</a>
            </div>
          </el-col>
          <el-col :span="6">
            <el-button @click="downloadXLSX" plain type="primary" class="btn__download" icon="el-icon-download">下载对照表</el-button>
          </el-col>
          <el-col :span="6">
            <el-button class="btn__clear" @click="dropTable" icon="el-icon-delete" type="danger">清空对照表</el-button>
          </el-col>
        </el-row>
        <el-row style="width: 80%; margin: 40px auto;" type="flex" class="row-bg" justify="space-between">
          <el-col>
            <div style="margin: 40px 0 20px 0; padding:0 0 10px 10px; border-bottom: solid #F2F6FC 1px; font-weight:600;">标红设置</div>
            <el-form size="mini" ref="form" label-width="120px">
              <el-form-item label="实际成本(元)">
                <el-input v-model="inputWarningForm['实际成本(元)']" placeholder="例如：5，高于 5 元即标红"></el-input>
              </el-form-item>
              <el-form-item label="回本率(%)">
                <el-input v-model="inputWarningForm['回本率']" placeholder="例如：25，低于 25% 即标红"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveWarningSettings">保存选项</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
    </el-dialog>
    <div id="statusbar">
      <i v-if="!loaded" class="el-icon-loading"></i>
      <i v-else class="el-icon-check"></i> 
      {{ statusText }} 
      <a href="#" v-if="loaded" @click="reload">刷新一下</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import gdt from './gdt';
import tingshubao from './tingshubao';
import XLSX from 'xlsx'
import betterXlsx from './xlsx'
import mapping from './mapping';
import icon from './icon';
const FileSaver = require('file-saver');
import auth from './auth'

export default {
  name: 'app',
  data () {
    return {
      mapping: {
        '智慧妈咪有妙招': [ 13380, 13379, 12939, 12938, 12936 ]
      },
      tableData: [],
      tableIndexedData: {},
      expended: [],
      uploadedProgress: 0,
      fileDialogVisible: false,
      statusText: '',
      loaded: true,
      headerY: 0,
      scrollTimer: 0,
      warningForm: {
        '实际成本(元)': '',
        '回本率': ''
      },
      inputWarningForm: {
        '实际成本(元)': '',
        '回本率': ''
      },
      currentPassword: '',
      password: '',
      version: 0
    }
  },
  methods: {

    openFile(e) {
      this.fileDialogVisible = false;
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
          const total = rows.length;
          let index = 0;
          let succeed = 0, failed = 0;
          for(let row of rows) {
            const name = row.广告主名称;
            const gh_id = row.gh_id;
            delete row.广告主名称;
            delete row.gh_id;
            const idList = [];
            for(let key in row) {
              if(key === '渠道ID' || key.startsWith('__EMPTY')) {
                let hasSucceed = mapping.addRow({
                  gh_id,
                  id: row[key],
                  name
                });
                index++;
                if(hasSucceed) {
                  succeed++;
                } else {
                  failed++;
                }
              }
            }
            index++;
            this.uploadedProgress = parseInt((index / total) * 100);
            console.log(this.uploadedProgress);
          }
          if(succeed === 0) {
            this.$message.info(`Excel 内容全部忽略。`);
          } else {
            let mappingTableData = mapping.syncToStorage();
            auth.saveSettings({
              key: 'mapping-table',
              value: mappingTableData,
              password: this.password
            });
            this.$message.success(`Excel 内容已导入，新增：${succeed}, 忽略：${failed}`);
            // 上传
          }
          return;
        }
      };
      reader.readAsArrayBuffer(file);
    },

    async dropTable() {
      await this.$confirm('此操作将清空插件内的对照表, 是否继续?', '警告', {
        confirmButtonText: '确定清空',
        confirmButtonClass: 'el-button el-button--danger',
        cancelButtonText: '取消',
        type: 'warning'
      });
      
      const emptytMappingTable = await mapping.dropTable();
      await auth.saveSettings({
        key: 'mapping-table',
        value: JSON.stringify(emptytMappingTable),
        password: this.password
      });
      document.location.reload();
    },

    dateString() {
      return `${(new Date).getFullYear()}年${((new Date).getMonth()+ 1)}月${(new Date).getDate()}日`;
    },

    async exportTableData() {
      const headers = [ 'gh_id', '广告主名称', '消耗', '曝光次数', '点击次数', '点击率', '转化', '转化成本', '实际成本', '回本金额', '回本率' ];
      const 消耗idx = 2;
      const 曝光次数idx = 3;
      const 点击次数idx = 4;
      const 点击率idx = 5;
      const 转化idx = 6;
      const 转化成本idx = 7;
      const 实际成本idx = 8;
      const 回本金额idx = 9;
      const 回本率idx = 10;
      const data = this.tableData.map(row => {
        return [ 
          row.gh_id, 
          row.name,
          row['总消耗(元)'],
          row['曝光次数'],
          row['点击次数'],
          row['点击率'],
          row['转化指标(次)'],
          row['转化成本(元)'],
          row.finalUnitCost,
          row.paid,
          row.recoveryRate,
        ];
      });

      const hightCell = cell => {
        const style = new betterXlsx.Style();
        style.font.color = 'EA3323';
        style.fill.f
        cell.style = style;
      }
      const file = new betterXlsx.File();
      const sheet = file.addSheet('Sheet1');
      const header = sheet.addRow();
      header.setHeightCM(0.8);
      for(let i=0;i < headers.length; i++) {
        const cell = header.addCell();
        cell.style.fill.patternType = 'solid';
        cell.style.fill.fgColor = 'FFFF54';
        cell.style.align.h = 'center';
        cell.style.align.v = 'center';
        cell.style.font.size = 16;
        cell.style.font.bold = true;
        cell.value = headers[i];
      }
      for(let i=0;i < data.length; i++) {
        const line = data[i];
        const row = sheet.addRow();
        for(let j = 0; j < data[i].length; j++) {
          const cell = row.addCell();
          cell.value = data[i][j];
          cell.style.font.size = 14;
          if(cell.value === '') {
            continue;
          }
          switch(j) {
            case 回本率idx:
            case 点击率idx:
              cell.setNumber(data[i][j]);
              cell.numFmt = '0.00%';
            break;
            case 转化成本idx:
            case 实际成本idx:
            case 回本金额idx:
            case 消耗idx:
              cell.setNumber(data[i][j] / 100);
              cell.numFmt = '#,##0.00';
            break;
            case 曝光次数idx:
            case 点击次数idx:
            case 转化idx:
              cell.setNumber(data[i][j]);
              cell.numFmt = '#,##0';
            break;
          }
          switch(j) {
            case 实际成本idx:
              if(this.warningForm['实际成本(元)'] === '') {
                continue;
              }
              if(parseFloat(cell.value) > this.warningForm['实际成本(元)']) {
                hightCell(cell);
              }
            break;
            case 回本率idx:
              if(this.warningForm['回本率'] === '') {
                continue;
              }
              if(parseFloat(cell.value) < (this.warningForm['回本率'] / 100)) {
                hightCell(cell);
              }
            break;
          }
        }
      }
      const content = await file.saveAs('blob');
      saveAs(content, "报表" + this.dateString() + ".xlsx");
      return;
    },

    async downloadXLSX() {
      this.fileDialogVisible = false;
      const loading = this.$loading({});
      await mapping.download();
      loading.close();
    },

    async reload() {
      try {
        if(this.loaded === false) {
          return;
        }
        this.loaded = false;
        this.statusText = '检查广点通登录状态';
        const adAccount = await gdt.checklogin();
        this.statusText = '下载广点通报表';
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
        this.loaded = false;
        this.statusText = '检查广点通登录状态';
        const adAccount = await gdt.checklogin();
        // console.log(adAccount);
        this.statusText = '下载广点通报表';
        const tableData = await gdt.loadAd();
        this.tableData = tableData;
        this.setIndexedData(tableData);
        this.mergeTingshubaoData();
      } catch (e) {
        await this.$confirm(e.message, '提示');
        if(e.name) {
          document.location.href = e.name;
        }
      }
    },

    setIndexedData(tableData) {
      for(let index in tableData) {
        this.tableIndexedData[tableData[index].gh_id] = parseInt(index);
      }
    },

    async mergeTingshubaoData() {
      this.statusText = '下载听书宝费率';
      try {
        await tingshubao.initRate();
      } catch (e) {
        await this.$confirm(e.message, '提示');
        document.location.href = e.name;
      }
      this.statusText = '下载听书宝报表';
      const tingshubaoData = await tingshubao.downloadTingshubao({});
      this.statusText = '数据处理中';
      console.log(tingshubaoData);
      for(let row of tingshubaoData) {
        const id = row.渠道ID;
        //console.log(id);
        const gh_id = await mapping.getGhId(id);
        if(!gh_id) {
          continue;
        }
        if (this.tableIndexedData.hasOwnProperty(gh_id)) {
          const index = this.tableIndexedData[gh_id];
          if(!this.tableData[index]['tingshubao']) {
            this.$set(this.tableData[index], 'tingshubao', [ row ]);
          } else {
            let updated = false;
            for(let i = 0; i < this.tableData[index]['tingshubao'].length; i++) {
              if(this.tableData[index]['tingshubao'][i].渠道ID === id) {
                this.tableData[index]['tingshubao'][i] = row;
                updated = true;
                break;
              }
            }
            if(!updated) {
              this.tableData[index]['tingshubao'].push(row);
            }
          }
        }
      }
      const sum = (val, row) => row.paid + val;
      for(let idx in this.tableData) {
        const row = this.tableData[idx];
        let paid = '';
        let finalUnitCost = '';
        let recoveryRate = '';

        if(row.tingshubao) {
          paid = row.tingshubao.reduce(sum, 0);
          finalUnitCost = row['转化成本(元)'] - (row['转化成本(元)'] * recoveryRate);
          if(row['总消耗(元)'] > 0) {
            recoveryRate = paid / row['总消耗(元)'];
          }
        }
        this.$set(this.tableData[idx], 'paid', paid);
        this.$set(this.tableData[idx], 'recoveryRate', recoveryRate);
        this.$set(this.tableData[idx], 'finalUnitCost', finalUnitCost);
      }
      this.statusText = '数据已刷新';
      this.loaded = true;
    },

    getSummaries(param) {
      const { columns, data } = param;
      let 总消耗 = 0;
      let 曝光次数 = 0;
      let 点击次数 = 0;
      let 点击率 = '';
      let 转化指标 = 0;
      let 转化成本 = '';
      let 实际成本 = 0;
      let 回本金额 = 0;
      let 回本率 = '';


      for(let row of data) {
        总消耗 += row['总消耗(元)'];
        曝光次数 += row['曝光次数'];
        点击次数 += row['点击次数'];

        转化指标 += row['转化指标(次)'];
        if(row['paid']) {
          回本金额 += row['paid'];
        }
      }
      回本率 = 回本金额 / 总消耗;
      点击率 = 点击次数 / 曝光次数;
      转化成本 = 总消耗 / 转化指标;

      实际成本 = 转化成本 * (1 - 回本率);
      // 1         2      3       4       5      6       7        8       9       10
      // 广告主名称，总消耗，曝光次数，点击次数，点击率，转化指标，转化成本，实际成本，回本金额，回本率
      return [
        '', '汇总', this.toPrice(总消耗), 曝光次数.toLocaleString(), 
        点击次数.toLocaleString(), this.toPecent(点击率), 转化指标.toLocaleString(), 
        this.toPrice(转化成本), this.toPrice(实际成本), this.toPrice(回本金额), this.toPecent(回本率)
        ];
    },
    toPrice(val, withUnit=true) {
      if(val === '') {
        return val;
      }
      let unit = withUnit ? '元' : '';
      return (val / 100).toFixed(2).toLocaleString() + unit;
    },
    toPecent(val, withUnit=true) {
      if(val === '') {
        return val;
      }
      let unit = withUnit ? '%' : '';
      return (val * 100).toFixed(2) + unit;
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
    },
    async startMonitor() {
      setTimeout(async () => {
        await this.reload();
        this.startMonitor();
      }, 60000);
    },
    loadWarningSettings() {
      const settings = localStorage.getItem('warning-settings');
      if(!settings) {
        return;
      }
      this.warningForm = JSON.parse(settings);
      this.inputWarningForm = JSON.parse(settings);
    },
    saveWarningSettingsLocally(settings) {
      localStorage.setItem('warning-settings', settings);
    },
    saveWarningSettings() {
      this.warningForm = this.inputWarningForm;
      const settings = JSON.stringify(this.warningForm);
      auth.saveSettings({
        key: 'warning-settings',
        value: settings,
        password: this.password
      });
      this.saveWarningSettingsLocally(settings);
      this.fileDialogVisible = false;
      this.$message.success('已保存');
    },
    clearInputWarningForm(done) {
      this.inputWarningForm = this.warningForm;
      done();
    },
    async appScroll(e) {
      if(this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.scrollTimer = setTimeout(() => {
        const dom = document.querySelector('.el-table__header-wrapper');
        if(window.pageYOffset > this.headerY) {
          if(!dom.classList.contains('pin')) {
            dom.classList.add('pin');
          }
        } else {
          if(dom.classList.contains('pin')) {
            dom.classList.remove('pin');
          }
        }
        this.scrollTimer = 0;
      }, 30);
    },
    initHeaderPosition() {
      const dom = document.querySelector('.el-table__header-wrapper');
      const { top } = dom.getBoundingClientRect();
      this.headerY = top;
    },
    async loadPassword() {
      const password = localStorage.getItem('password');
      if(!password) {
        try {
          const result =await this.$prompt('请输入暗号', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          });
          const userPassword = result.value;
          const verified = await auth.checkPassword(userPassword);
          if(verified) {
            localStorage.setItem('password', userPassword);
            this.password = userPassword;
            return true;
          } else {
            this.$message.error('口令错误');
            return await this.loadPassword();
          }
        } catch (e) {
          console.log(e);
          return await this.loadPassword();
        }
      } else {
        this.password = password;
        auth.setPassword(password);
        return true;
      }
    },
    async loadCfgVersion() {
      const version = localStorage.getItem('version');
      await this.loadCfg(version);
    },
    async loadCfg(version) {
      const cfg = await auth.loadRemoteSettings({
        version,
        password: this.password
      });
      if(cfg.cfg) {
        this.loaded = false;
        this.statusText = '正在同步云端配置文件';
        for(let item of cfg.cfg) {
          let settings = JSON.parse(item.value);
          let settingsData = item.value;
          switch(item.name) {
            case 'warning-settings':
              this.warningForm = settings;
              this.inputWarningForm = settings;
              this.saveWarningSettingsLocally(settingsData);
            break;
            case 'mapping-table':
              await mapping.syncMappingTable(settings);
            break;
          }
        }
        localStorage.setItem('version', cfg.version);
        this.statusText = '配置已同步';
        this.loaded = true;
      }
    },
    async saveWarningForm() {

    },
    async test() {
  const file = new betterXlsx.File();
  const sheet = file.addSheet('Sheet1');
  const row = sheet.addRow();

  const cell = row.addCell();
  cell.value = 'I am a cell!';
  cell.hMerge = 2;
  cell.vMerge = 1;

  const style = new betterXlsx.Style();
  style.fill.patternType = 'solid';
  style.fill.fgColor = '00FF0000';
  style.fill.bgColor = 'FF000000';
  style.align.h = 'center';
  style.align.v = 'center';

  cell.style = style;

  file
    .saveAs('blob')
    .then(function(content) {
      saveAs(content, "example.xlsx");
    });
    }
  },
  async mounted() {
    if(!await this.loadPassword()) {
      return;
    }
    await this.loadCfgVersion();
    icon(window);
    this.loadWarningSettings();
    await mapping.load();
    await this.loadMergedTable();
    await this.startMonitor();
    this.initHeaderPosition();
    window.addEventListener('scroll', this.appScroll)
  }
}
</script>

<style lang="scss">
#statusbar{
  color: #909399;
  position: absolute;
  top: 20px;
  left: 50%;
}
body, html{
  margin: 0;
}
body, .el-table{
  color: #24262e;
  font-size: 14px;
}
.el-table__header-wrapper.pin {
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
}
.el-table__footer-wrapper{
  position: fixed;
  bottom: 0;
  z-index: 1;
  width: 100%;
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
.progress-container{
  position: fixed;
  top:50%;
  left: 50%;
  background: #fff;
  border-radius: 50%;

}    .icon {
       width: 1em; height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }
.btn__upload {
  .icon {
    display: block;
    width: 50px;
    height: 50px;
    margin:0 auto 10px auto;
  }
  font-weight: 600;
}
.btn__download,
.btn__clear
 {
  .el-icon-delete,
  .el-icon-download{
    width: 60px;
    display: block;
    height: 60px;
    font-size: 60px;
    overflow: hidden;
    margin:0 auto 10px auto;
  }
}
.warning{
  font-weight: 600;
  color: #EA3323;
}
</style>
