// let config = require('./config.js');
// let r = require('../lib')(config);
// import { uuid } from './util/common';
// import assert from 'assert';
// let Readable = require('stream').Readable;
// let Stream = require('stream')
// let _util = require('util');
// let devnull = require('dev-null');

//
// let it = util.it

// let dbName, tableName, tableName2, stream, result, pks, feed, dumpTable;

// let numDocs = 100; // Number of documents in the "big table" used to test the SUCCESS_PARTIAL

// it('Init for `transform-stream.js`', async () => {
//   try {
//     dbName = uuid();
//     tableName = uuid(); // Big table to test partial sequence
//     dumpTable = uuid(); // dump table

//     result = await r.dbCreate(dbName).run()
//     assert.equal(result.dbs_created, 1);
//     //await r.db(dbName).wait().run()
//     result = await [
//       r.db(dbName).tableCreate(tableName)('tables_created').run(),
//       r.db(dbName).tableCreate(dumpTable)('tables_created').run()]
//     assert.deepEqual(result, [1, 1]);
//
//   }
//   catch(e) {
//     console.log(e);
//     throw e;
//   }
// })
// it('Inserting batch - table 1', async () => {
//   try {
//     result = await r.db(dbName).table(tableName).insert(eval('['+new Array(numDocs).join('{}, ')+'{}]')).run();
//     assert.equal(result.inserted, numDocs);
//
//   }
//   catch(e) {
//     throw e;
//   }
// })

// it('test pipe transform - fast input', async () => {
//   let stream = new Readable({objectMode: true});
//   let size = 35;
//   let value = uuid();
//   for(let i=0; i<size; i++) {
//     stream.push({field: value});
//   }
//   stream.push(null);
//   let table = r.db(dbName).table(dumpTable).toStream({transform: true, debug: true, highWaterMark: 10});
//   stream.pipe(table)
//     .on('error', done)
//     .on('end', function() {
//       r.db(dbName).table(dumpTable).filter({field: stream._value}).count().run().then(function(result) {
//         assert.deepEqual(result, size);
//         assert.deepEqual(table._sequence, [10, 10, 10, 5])
//
//       });
//     }).pipe(devnull({objectMode: true}));
// })

// it('test pipe transform - slow input - 1', async () => {
//   let stream = new Readable({objectMode: true});
//   let size = 10;
//   let values = [uuid(), uuid()];
//   let table = r.db(dbName).table(dumpTable).toStream({transform: true, debug: true, highWaterMark: 5});

//   let i = 0;
//   stream._read = function() {
//     let self = this;
//     i++;
//     if (i <= 3) {
//       self.push({field: values[0]});
//     }
//     else if (i === 4) {
//       setTimeout(function() {
//         self.push({field: values[1]});
//       }, 3000)
//     }
//     else if (i <= 10) {
//       self.push({field: values[1]});
//     }
//     else {
//       self.push(null);
//     }
//   }

//   stream.pipe(table)
//     .on('error', done)
//     .on('end', function() {
//       r.expr([
//         r.db(dbName).table(dumpTable).filter({field: values[0]}).count(),
//         r.db(dbName).table(dumpTable).filter({field: values[1]}).count()
//       ]).run().then(function(result) {
//         assert.deepEqual(result, [3, 7]);
//         assert.deepEqual(table._sequence, [3, 5, 2])
//
//       });
//     }).pipe(devnull({objectMode: true}));
// })
// it('test pipe transform - slow input - 2', async () => {
//   let stream = new Readable({objectMode: true});
//   let size = 10;
//   let values = [uuid(), uuid()];
//   let table = r.db(dbName).table(dumpTable).toStream({transform: true, debug: true, highWaterMark: 5});

//   let i = 0;
//   stream._read = function() {
//     let self = this;
//     i++;
//     if (i <= 5) {
//       self.push({field: values[0]});
//     }
//     else if (i === 6) {
//       setTimeout(function() {
//         self.push({field: values[1]});
//       }, 3000)
//     }
//     else if (i <= 10) {
//       self.push({field: values[1]});
//     }
//     else {
//       self.push(null);
//     }
//   }

//   stream.pipe(table)
//     .on('error', done)
//     .on('end', function() {
//       r.expr([
//         r.db(dbName).table(dumpTable).filter({field: values[0]}).count(),
//         r.db(dbName).table(dumpTable).filter({field: values[1]}).count()
//       ]).run().then(function(result) {
//         assert.deepEqual(result, [5, 5]);
//         assert.deepEqual(table._sequence, [5, 5])
//
//       });
//     }).pipe(devnull({objectMode: true}));
// })
// it('test pipe transform - single insert', async () => {
//   // Create a transform stream that will convert data to a string
//   //let stream = new Input();
//   let stream = new Readable({objectMode: true});
//   let size = 10;
//   let value = uuid();
//   let table = r.db(dbName).table(dumpTable).toStream({transform: true, debug: true, highWaterMark: 5});

//   let i = 0;
//   stream._read = function() {
//     i++;
//     if (i > 10) {
//       this.push(null);
//     }
//     else {
//       let self = this;
//       setTimeout(function() {
//         self.push({field: value});
//       }, 100); // suppose that each insert take less than 100 ms
//     }
//   }

//   stream.pipe(table)
//     .on('error', done)
//     .on('end', function() {
//       r.expr(r.db(dbName).table(dumpTable).filter({field: value}).count()).run().then(function(result) {
//         assert.deepEqual(result, 10);
//         assert.deepEqual(table._sequence, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
//
//       });
//     }).pipe(devnull({objectMode: true}));
// })

// it('test transform output - object', async () => {
//   let stream = new Readable({objectMode: true});
//   let i = 0;
//   let values = [uuid(), uuid()];
//   stream._read = function() {
//     let self = this;
//     i++;
//     if (i <= 3) {
//       self.push({field: values[0]});
//     }
//     else if (i === 4) {
//       setTimeout(function() {
//         self.push({field: values[1]});
//       }, 300)
//     }
//     else if (i <= 10) {
//       self.push({field: values[1]});
//     }
//     else {
//       self.push(null);
//     }
//   }

//   let table = r.db(dbName).table(dumpTable).toStream({
//     transform: true
//   });

//   let result: any = [];
//   let endStream = new Stream.Transform();
//   endStream._writableState.objectMode = true;
//   endStream._readableState.objectMode = true;
//   endStream._transform = function (data, encoding, done) {
//     result.push(data);
//     this.push(data);
//
//   }

//   stream.pipe(table)
//     .on('error', done)
//     .pipe(endStream)
//     .on('error', done)
//     .on('finish', function() {
//       assert(result.length, 10);
//       for(let i=0; i<result.length; i++) {
//         assert(Object.prototype.toString.call(result[i]), '[object Object]');
//       }
//
//     });
// })

// it('test transform output - string', async () => {
//   let stream = new Readable({objectMode: true});
//   let i = 0;
//   let values = [uuid(), uuid()];
//   stream._read = function() {
//     let self = this;
//     i++;
//     if (i <= 3) {
//       self.push({field: values[0]});
//     }
//     else if (i === 4) {
//       setTimeout(function() {
//         self.push({field: values[1]});
//       }, 300)
//     }
//     else if (i <= 10) {
//       self.push({field: values[1]});
//     }
//     else {
//       self.push(null);
//     }
//   }

//   let table = r.db(dbName).table(dumpTable).toStream({
//     transform: true,
//     format: 'primaryKey'
//   });

//   let result: any = [];
//   let endStream = new Stream.Transform();
//   endStream._writableState.objectMode = true;
//   endStream._readableState.objectMode = true;
//   endStream._transform = function (data, encoding, done) {
//     result.push(data);
//     this.push(data);
//
//   }

//   stream.pipe(table)
//     .on('error', done)
//     .pipe(endStream)
//     .on('error', done)
//     .on('finish', function() {
//       assert(result.length, 10);
//       for(let i=0; i<result.length; i++) {
//         assert(typeof result[i], 'string');
//       }
//
//     });
// })