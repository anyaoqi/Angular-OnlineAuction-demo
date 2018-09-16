import * as express from 'express';
import { Server } from "ws";
import * as path from 'path';
const app = express();

// 定义数据类
export class Product {
    constructor(
      public id:number,
      public title:string,
      public price:number,
      public rating:number,
      public desc:string,
      public categories:Array<string>
    ){}
}
export class Comment {
  constructor(
    public id:number,
    public productId:number,
    public user:string,
    public timestamp:string,
    public rating:number,
    public content:string
  ){}
}

  // 商品信息数据
  const  products:Product[] = [
    new Product(1,'第一个商品',1.99,3.5,"这是第一个商品的描述",["电子产品","硬件产品",]),
    new Product(2,'第二个商品',2.99,2.5,"这是第二个商品的描述",[,"硬件产品","软件产品"]),
    new Product(3,'第三个商品',3.99,3.5,"这是第三个商品的描述",["电子产品","硬件产品","软件产品"]),
    new Product(4,'第四个商品',4.99,5.5,"这是第四个商品的描述",["电子产品","软件产品"]),
    new Product(5,'第五个商品',5.99,1.5,"这是第五个商品的描述",["软件产品"]),
    new Product(6,'第六个商品',65.99,4.5,"这是第六个商品的描述",["电子产品","软件产品"])
  ]
    // 评论信息数据
  const comments:Comment[] = [
    new Comment(1,1,"大皮球", '2018-7-8 20:04:32',3.5,"挺不错的，必须好评！"),
    new Comment(2,2,"小皮球", '2018-7-8 20:04:32',1.5,"挺不错的，必须好评！"),
    new Comment(3,2,"智障欢乐多", '2018-7-8 20:04:32',2,"挺不错的，必须好评！"),
    new Comment(4,1,"我真的好帅", '2018-7-8 20:04:32',5,"挺不错的，必须好评！"),
    new Comment(5,2,"我比吴亦凡还帅", '2018-7-8 20:04:32',2,"挺不错的，必须好评！"),
    new Comment(6,1,"最萌小仙女", '2018-7-8 20:04:32',1,"挺不错的，必须好评！"),
  ]


app.use('/',express.static(path.join(__dirname,'..','client')))

app.get('/api/products',(req,res)=>{
    let result = products;
    let params = req.query;

    if(params.title){
        result = result.filter( p=> p.title.indexOf(params.title)!== -1 )
    }
    if(params.price && result.length>0){
        result = result.filter( p=> p.price>=parseInt(params.price))
    }
    if(params.category && params.category !=='-1' && result.length>0){
        result = result.filter( p=> p.categories.indexOf(params.category)!==-1)
    }
 
    
    res.json(result);
})

app.get('/api/product/:id',(req,res)=>{
    res.json(products.find((product)=>product.id == req.params.id))
})
app.get('/api/product/:id/comments',(req,res)=>{
    res.json(comments.filter((comment:Comment)=> comment.productId == req.params.id));
})
const server = app.listen(8000,"localhost",()=>{
    console.log("服务器:服务器已启动,地址是:localhost:8000")
})

const subscriptions = new Map<any,number[]>();

const wsServer = new Server({'port':8085});
wsServer.on("connection", websocket =>{
    // websocket.send('服务器:服务器已连接，推送内容！');  
    websocket.on('message',(message)=>{
       console.log('服务器:接收到客户端消息：'+message)
        let messageObj = eval('('+ message +')');
        let productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket,[...productIds,messageObj.productId]);
    });
});

const currentBids = new Map<number,number>();

setInterval(()=>{
    products.forEach(p => {
        let currentBid = currentBids.get(p.id) || p.price;
        let newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id,newBid);
    })
    subscriptions.forEach((productIds:number[],ws)=>{
        if(ws.readyState===1){
            let newBids = productIds.map( pid => ({
                productId:pid,
                bid:currentBids.get(pid) 
            }));
            ws.send(JSON.stringify(newBids)); 
        }else{
            subscriptions.delete(ws)
        }
        
    })    
},3000)                