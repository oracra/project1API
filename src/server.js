const http = require('http');
const url = require('url');
const query = require('querystring');
const jsonHandler = require('./jsonResponses');
const htmlHandler = require('./htmlResponses');
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/getSummoner': jsonHandler.getSummoner,
    '/getMastery': jsonHandler.getMastery,
    '/getChampionList' : jsonHandler.getChampionList,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUserMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      console.dir(bodyParams);
      jsonHandler.addUser(request, response, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  console.dir(parsedUrl.pathname);
  //console.dir("Method" + request.method);
  

  if (request.method === 'POST') {
    console.dir("Method" + request.method);

    handlePost(request, response, parsedUrl);
  } else if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct.GET.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listenting on 127.0.0.1: ${port}`);
