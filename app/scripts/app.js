import Ajax from './core/Ajax.js';
console.log(k());
new Promise(function (resolve, reject) {
  setTimeout(() => {
    resolve();
  }, 10000);
}).then(() => {
  console.log('jjojojo');
});
