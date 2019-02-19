import axios from 'axios';

class Auth {
  setPassword(password) {
    this.password = password;
  }
  clearPassword() {
    localStorage.setItem('password', '');
  }
  async checkPassword(password) {
    const res = await this.post('http://wx.shouwang.io/tuiguang/login', {
      password
    });
    console.log(res);
    if(res.errno === 0) {
      return true;
    } else {
      return false;
    }
  }
  async saveSettings({ key, value, password }) {
    const res = await this.post('http://wx.shouwang.io/tuiguang/config', {
      key, value, password
    });
    if(res.errno === 2) {
      this.clearPassword();
      document.location.reload();
    }
  }
  async loadRemoteSettings({ version, password }) {
    const url = 'http://wx.shouwang.io/tuiguang/config?version=' + encodeURIComponent(version) + '&password=' + encodeURIComponent(password)
    const res = await this.get(url);
    if(res.errno === 2) {
      this.clearPassword();
      document.location.reload();
    }
    return res;
  }
  async post(uri, data, config = {}) {
    const res = await axios.post(uri, data, config);
    return res.data;
  }
  async get(uri, config) {
    const res = await axios.get(uri, config);
    return res.data;
  }
}


export default new Auth;