"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
// 定义数据类
var Person = /** @class */ (function () {
    function Person(id, name, age, job) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.job = job;
    }
    return Person;
}());
exports.Person = Person;
var persons = [
    new Person(1, '杨奇', 18, 'web前端'),
    new Person(2, '孙录喜', 19, '美工'),
    new Person(3, '安耀奇', 17, '经理'),
];
app.get('/', function (req, res) {
    res.send("Hello Expressssavss");
});
app.get('/api/products', function (req, res) {
    res.json(persons);
});
app.get('/api/product/:id', function (req, res) {
    res.json(persons.find(function (product) { return product.id == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("服务器已启动,地址是:localhost:8000");
});
//# sourceMappingURL=express_server.js.map