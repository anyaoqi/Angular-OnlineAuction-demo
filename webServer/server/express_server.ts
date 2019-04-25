import * as express from 'express';

const app = express();

// 定义数据类
export class Person {
    constructor(
      public id:number,
      public name:string,
      public age:number,
      public job:string
    ){}
  }
  
  const persons:Person[] = [
    new Person(1,'杨奇',18,'web前端'),
    new Person(2,'孙录喜',19,'美工'),
    new Person(3,'安耀奇',17,'经理'),
  ]

app.get('/',(req,res)=>{
    res.send("Hello Expressssavss");
})

app.get('/api/products',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*"); //同意全部域名訪问
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081"); 
    res.json(persons);
})

app.get('/api/product/:id',(req,res)=>{
    res.json(persons.find((product)=>product.id == req.params.id))
})

const server = app.listen(8000,"localhost",()=>{
    console.log("服务器已启动,地址是:localhost:8000")
})