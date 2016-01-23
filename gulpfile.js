'use strict';

let gulp = require('gulp'),
  fs = require('fs'),
  path = require('path');

const gulpDir = path.join(__dirname, 'tasks'),
  //load all files in task dir
  jsFiles = new RegExp('^.*\.(js)$', 'i');

fs.readdirSync(gulpDir).forEach(fileName => {
  if(jsFiles.test(fileName)) require(path.join(gulpDir, fileName));
});

gulp.task('js', ['lint', 'build:js']);
gulp.task('watch', ['watch:lint', 'js']);
gulp.task('default', ['js']);
//chrome://flags/#enable-javascript-harmony
//enable and restart chrome
/*

		class Company {
			constructor() {
				this.employees = [];
			}

			addEmployees(...names) {
				this.employees = this.employees.concat(names);
			}
			[Symbol.iterator]() {
				return new ArrayIterator(this.employees);
			}
		}

		class ArrayIterator {
			constructor(array) {
				this.array = array;
				this.index = 0;
			}
			next() {
				var result = { value: undefined, done: true };
				if(this.index < this.array.length) {
					result.value = this.array[this.index];
					result.done = false;
					this.index += 1;
				}
				return result;

			}
		}

		let count = 0;
		let company = new Company();
		company.addEmployees("Tim", "Sue", "Joy", "Tom");

		for(let employee of company) {
			count += 1;
		}

		expect(count).toBe(4);

*/

/*


		class Company {
			constructor() {
				this.employees = [];
			}

			addEmployees(...names) {
				this.employees = this.employees.concat(names);
			}
			*[Symbol.iterator]() {
				for(let e of this.employees) {
					//console.log(e);
					yield e;
				}
			}
		}

		let filter = function*(items, predicate) {
			for(let item of items) {
				//console.log("filter", item);
				if(predicate(item)) {
					yield item;
				}
			}
		}

		let take = function*(items, number) {
			let count = 0;
			if(number < 1) return;
			for(let item of items) {
				//console.log("take", item);
				yield item;
				count += 1;
				if(count >= number) {
					return;
				}
			}
		}

		let count = 0;
		let company = new Company();
		company.addEmployees("Tim", "Sue", "Joy", "Tom");

		for(let employee of take(filter(company, e => e[0] == 'T'),1)) {
			count += 1;
		}

		expect(count).toBe(1);
*/

/*
function strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
            // We don’t escape the key '__proto__'
            // which can cause problems on older engines
            obj[k] = v;
        }
        return obj;
    }
    function objToStrMap(obj) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }

*/
