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
var ref = db.ref('/poll/');

ref.on("child_added", function(snapshot, prevChildKey) {
  var chapters = snapshot.val();
  var storyId = snapshot.key;
  console.log("story: " + storyId);

  for (var chapter = 0; chapter < chapters.length; chapter++) {
    var rounds = chapters[chapter];

    for (var round = 0; round < rounds.length; round++) {
      var poll = rounds[round];

      if (poll.timeEnding === undefined) {
        var timer = 1000 * 60;
        var endTime = poll.timeCreated + timer;
        var updateRef = ref.child(storyId).child(chapter).child(round);

        console.log("setting end time to " + endTime + " on " + updateRef);

        updateRef.update({
          "timeEnding": endTime
        });

        setTimeout(function() {
          console.log("setting finished " + updateRef);
          updateRef.update({
            "finished": true
          });
        }, timer);
      }
    }
  }

});
