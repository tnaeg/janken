import {app} from './Server.js';

var port = 3000;
if (process.argv.length > 2) {
  port = process.argv[2];
  console.log("Using arugment port");
}

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});


