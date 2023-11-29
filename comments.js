// Create web server 
// Start: node comments.js
// Test: curl -X POST -H "Content-Type: application/json" -d '{"body":"Hello World!"}' http://localhost:3000/comments
// Test: curl http://localhost:3000/comments
// Test: curl -X PUT -H "Content-Type: application/json" -d '{"body":"Hello World!"}' http://localhost:3000/comments/0
// Test: curl -X DELETE http://localhost:3000/comments/0
// Test: curl -X DELETE http://localhost:3000/comments/1

const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method.toLowerCase();

    if (path === '/comments') {
        if (method === 'get') {
            handleGetComments(req, res);
        } else if (method === 'post') {
            handlePostComments(req, res);
        } else {
            handleNotFound(req, res);
        }
    } else if (path.match(/^\/comments\/(\d+)$/)) {
        if (method === 'get') {
            handleGetComment(req, res);
        } else if (method === 'put') {
            handlePutComment(req, res);
        } else if (method === 'delete') {
            handleDeleteComment(req, res);
        } else {
            handleNotFound(req, res);
        }
    } else {
        handleNotFound(req, res);
    }
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
});

const comments = [];
const handleGetComments = (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(comments));
};

const handlePostComments = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        const comment = JSON.parse(body);
        comments.push(comment);
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(comment));
    });
};

const handleGetComment = (req, res) => {
    const commentId = Number(req
