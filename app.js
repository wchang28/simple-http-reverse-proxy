// can use the following env. vars. to control the reverse proxy
// 1. PROXY_TARGET (required)
// 2. PORT (optional)
// 3. HOST {optional}
// 4. SSL_PRIVATE_KEY (optional)
// 5. SSL_FULLCHAIN_CERT (optional)
const httpProxy = require('http-proxy');
const fs = require('fs');

const port = process.env.PORT || 8080;
const hostname = process.env.HOST || "0.0.0.0";
const target = process.env.PROXY_TARGET;

if (!target) {
	console.error("env. var. PROXY_TARGET is not set");
	process.exit(1);
}

console.log(`[${new Date().toISOString()}]: listening on ${hostname}:${port}`);
console.log(`[${new Date().toISOString()}]: proxy target=${target}`);

let options = {
	target
	,changeOrigin: true
	,xfwd: true
	,ws: true
};

let secure = (process.env.SSL_PRIVATE_KEY && process.env.SSL_FULLCHAIN_CERT ? true : false);

if (secure) {
	options.ssl = {
		key: fs.readFileSync(process.env.SSL_PRIVATE_KEY, 'utf8')
		,cert: fs.readFileSync(process.env.SSL_FULLCHAIN_CERT, 'utf8')		
	};
}

httpProxy.createServer(options)
.listen(port, hostname, (err) => {
	if (err) {
		console.error(`[${new Date().toISOString()}]: !!! Error: ${JSON.stringify(err)} !!!`);
	} else {
		console.log(`[${new Date().toISOString()}]: reverse proxy is listening on ${hostname}:${port}, protocol=${secure? "https": "http"}, proxy-target=${target}`);
	}
}).on("error", (err) => {
	console.error(`[${new Date().toISOString()}]: !!! Error: ${JSON.stringify(err)} !!!`);
}).on("proxyReq", (proxyReq, req, res, options) => {
	console.log(`[${new Date().toISOString()}]: incoming request, url=${req.url}`);
});
