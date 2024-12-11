const AppStorage = {
  getItem: function (key) {
    let item = localStorage.getItem(key);
    return JSON.parse(item);
  },
  setItem: function (key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: function (key) {
    return localStorage.removeItem(key);
  },
  clear: function () {
    return localStorage.clear();
  },
};
export default AppStorage;
