class Cookies {

  async get({ url, name }) {
    const cookies = await this.getAll({
      url,
      name
    });
    if (cookies.length > 0) {
      return cookies[0];
    } else {
      return false;
    }
  }

  getAll({ url, name }) {
    return new Promise((resolve, reject) => {
      chrome.cookies.getAll({
        url,
        name
      }, cookies => {
        resolve(cookies);
      })
    });
  }
}

export default new Cookies();
