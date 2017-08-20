const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const {resolve, extname} = require('path');
const {parse: parseUrl} = require('url');

const MIME_TYPES = {
	js: 'application/javascript',
	css: 'text/css',
	html: 'text/html',
}

function indexPage(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/html',
	});

	fs.createReadStream(resolve(__dirname, './index.html')).pipe(res);
}

function notFound(req, res) {
	res.writeHead(404, {
		'Content-Type': 'text/plain',
	});

	res.end('404 Error. Page not found');
}

function sendStatic(path, req, res) {
	const staticPath = resolve(__dirname, '../../',  'dist', path.replace(/^\/public\//, ''));
	const ext = extname(staticPath).replace('.', '');
	const mime = MIME_TYPES[ext] || 'application/octet-stream';

	res.writeHead(200, {
		'Content-Type': mime,
	});

	fs.createReadStream(staticPath)
		.on('error', () => {
			notFound(req, res);
		})
		.pipe(res);
}

function verifyUser(req, res) {
	res.write('azaza');
	res.end('');
}

const server = http.createServer((request, response) => {
	const {method, statusCode, statusMessage, url} = request;
	const {path, query} = parseUrl(url);

	const testRegexp = new RegExp('^[/]public[/]*');

	switch (true) {
	case '/' === path:
		return indexPage(request, response);

	case testRegexp.test(path):
		return sendStatic(path, request, response);

	case '/verify_user' === path:
		return (request, response);

	default:
		return notFound(request, response);
	}
});

server.on('upgrade', (request, socket, head) => {

	// console.log(request.headers);


	const buffer = socket.read();
	// console.log(buffer);

	const secWebsocketKey = request.headers['sec-websocket-key'];
	const concatConstant = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

	const acceptKey = crypto
		.createHash('sha1')
		.update(secWebsocketKey + concatConstant)
		.digest('base64')
	;

	const upgradeHeaders = [
		'HTTP/1.1 101 Switching Protocols',
		'Upgrade: webSocket',
		'Connection: Upgrade',
		'Sec-WebSocket-Accept: ' + acceptKey,
	];

	socket.on('data', (data) => {
		console.log('Socket data', data.toString('utf-8'));
	});

	socket.on('end', () => {
		console.log('Socket was closed');
	})

	socket.write(
		upgradeHeaders.join('\r\n'),
		'ascii',
		(error) => {

		}
	);
	socket.pipe(socket); // echo back

	// socket.pipe(socket);



	// socket.writeContinue();
	// socket.end();
	// socket.send();
	// socket.pipe(socket);
});


server.listen(1337, () => {
	console.log(`Server listen on: http://${server.address().address.replace('::', 'localhost')}:${server.address().port}/`);
});
