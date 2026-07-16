import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const logFilePath = path.join(__dirname, 'orderTrackLog.txt');
const PORT = 3000;

// http.createServer(callback)：创建一个 HTTP 服务器实例。callback 这个函数会在每次收到请求时被自动调用
const server = http.createServer((req, res)=>{
    if(req.method === 'GET' && req.url === '/api/orders'){
        if(fs.existsSync(logFilePath)){
            const content = fs.readFileSync(logFilePath, 'utf-8');
            // res.writeHead(状态码, 响应头)
            // Content-Type: text/plain（告诉客户端返回的是纯文本）
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(content);
        }else{
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('No orders found');
        }
        return;
    }
    if(req.method === 'POST' && req.url ==='/api/orders'){
        let body = '';
        req.on('data', chunk=>{
            body += chunk.toString();
        });
        req.on('end',()=>{
            try{
                const {name, date, status} = JSON.parse(body);
                const orderLine = `${name}, ${date}, ${status}\n`;
                fs.appendFileSync(logFilePath, orderLine);

                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Order added', order: orderLine.trim()}));
            }catch(err){
                res.writeHead(400,{ 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request body' }));
            }
        });
        return;

    }

    res.writeHead(404, {'Content-type': 'text/plain'});
    res.end('Not Found');
});

server.listen(PORT,()=>{
    console.log(`Server is listening on http://localhost:${PORT}`);
})

