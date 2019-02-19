<template>
  <div id="app">
    <img @click="download" src="../assets/logo.png">
  </div>
</template>

<script>
import browser from "webextension-polyfill"
const FileSaver = require('file-saver');
export default {
  name: 'app',
  data () {
    return {
      msg: 'This is popup page !'
    }
  },
  methods: {
    download() {
      const xlsx = require('better-xlsx');
      const file = new xlsx.File();
      const sheet = file.addSheet('Sheet1');
      const row = sheet.addRow();
    
      const cell = row.addCell();
      cell.value = 'I am a cell!';
      cell.hMerge = 2;
      cell.vMerge = 1;
    
      const style = new xlsx.Style();
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
  mounted() {
    browser.tabs.create({
      url: '/pages/options.html',
    });

  }
}
</script>

<style lang="scss">
html, body {
  width: 600px;
  height: 600px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
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
</style>
