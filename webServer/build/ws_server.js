"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var path = require("path");
var app = express();
// 定义数据类
var Product = /** @class */ (function () {
    function Product(id, title, price, rating, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var Comment = /** @class */ (function () {
    function Comment(id, productId, user, timestamp, rating, content) {
        this.id = id;
        this.productId = productId;
        this.user = user;
        this.timestamp = timestamp;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
// 商品信息数据
var products = [
    new Product(1, '第一个商品', 1.99, 3.5, "这是第一个商品的描述", ["电子产品", "硬件产品",]),
    new Product(2, '第二个商品', 2.99, 2.5, "这是第二个商品的描述", [, "硬件产品", "软件产品"]),
    new Product(3, '第三个商品', 3.99, 3.5, "这是第三个商品的描述", ["电子产品", "硬件产品", "软件产品"]),
    new Product(4, '第四个商品', 4.99, 5.5, "这是第四个商品的描述", ["电子产品", "软件产品"]),
    new Product(5, '第五个商品', 5.99, 1.5, "这是第五个商品的描述", ["软件产品"]),
    new Product(6, '第六个商品', 65.99, 4.5, "这是第六个商品的描述", ["电子产品", "软件产品"])
];
// 评论信息数据
var comments = [
    new Comment(1, 1, "大皮球", '2018-7-8 20:04:32', 3.5, "挺不错的，必须好评！"),
    new Comment(2, 2, "小皮球", '2018-7-8 20:04:32', 1.5, "挺不错的，必须好评！"),
    new Comment(3, 2, "智障欢乐多", '2018-7-8 20:04:32', 2, "挺不错的，必须好评！"),
    new Comment(4, 1, "我真的好帅", '2018-7-8 20:04:32', 5, "挺不错的，必须好评！"),
    new Comment(5, 2, "我比吴亦凡还帅", '2018-7-8 20:04:32', 2, "挺不错的，必须好评！"),
    new Comment(6, 1, "最萌小仙女", '2018-7-8 20:04:32', 1, "挺不错的，必须好评！"),
];
app.use('/', express.static(path.join(__dirname, '..', 'client')));
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price >= parseInt(params.price); });
    }
    if (params.category && params.category !== '-1' && result.length > 0) {
        result = result.filter(function (p) { return p.categories.indexOf(params.category) !== -1; });
    }
    res.json(result);
});
app.get('/api/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/product/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("服务器:服务器已启动,地址是:localhost:8000");
});
var subscriptions = new Map();
var wsServer = new ws_1.Server({ 'port': 8085 });
wsServer.on("connection", function (websocket) {
    // websocket.send('服务器:服务器已连接，推送内容！');  
    websocket.on('message', function (message) {
        console.log('服务器:接收到客户端消息：' + message);
        var messageObj = eval('(' + message + ')');
        var productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket, productIds.concat([messageObj.productId]));
    });
});
var currentBids = new Map();
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscriptions.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 3000);
//# sourceMappingURL=ws_server.js.map