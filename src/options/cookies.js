class Cookies {

  async get({ url, name }) {
    const cookie = await this.getAll({
      url,
      name
    });
    return cookie;
  }

  getAll({ url, name }) {
    return new Promise((resolve, reject) => {
      chrome.cookies.get({
        url,
        name
      }, resolve)
    });
  }
}

export default new Cookies();
