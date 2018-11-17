module.exports = {
  name: '广点通投放数据监控台',
  version: '1.0.0',
  description: '广点通投放数据监控台',
  author: '',
  manifest_version: 2,
  icons: {
    '16': 'icons/main.png',
    '48': 'icons/main.png',
    '128': 'icons/main.png'
  },
  permissions: [
    '*://*/',
    'storage',
    'fileSystem', 
    'contextMenus',
    'clipboardWrite',
    'clipboardRead',
    "cookies",
    "https://a.weixin.qq.com/",
    "https://college.xiaoxiafm.com/"
  ],
  browser_action: {
    default_icon: {
      '19': 'icons/main.png',
      '38': 'icons/main.png',
      '128': 'icons/main.png'
    },
    default_title: "default title",
    default_popup: "pages/popup.html"
  },
  background: {
    persistent: false,
    scripts: ['js/background.js']
  },
  // devtools_page: 'pages/devtools.html',
  options_page: 'pages/options.html',
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  web_accessible_resources: ['js/content.js']
}
