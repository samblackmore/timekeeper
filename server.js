const http = require('http');
var admin = require('firebase-admin');
var serviceAccount = require('./three-words-cec8e-firebase-adminsdk-fyd5t-72296c0595.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://three-words-cec8e.firebaseio.com/'
});

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

var db = admin.database();
var ref = db.ref("bad-words");

ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});
