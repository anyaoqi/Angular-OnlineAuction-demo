import { Injectable,EventEmitter} from '@angular/core';
import { Http,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductService {
  /* moke 数据 */
  productSerachEvent:EventEmitter<productSerachParams> = new EventEmitter();

  constructor(private http:Http) { }

  getProducts():Observable<Product[]>{
    return this.http.get("/api/products").map(res => res = res.json() )
  }
  getProduct(id:number):Observable<Product>{
    return this.http.get('/api/product/'+id).map(res => res = res.json())
  }
  getCommentsForproductId(id:number):Observable<Comment[]>{
    return this.http.get('/api/product/'+id+'/comments').map(res => res = res.json())
  } 
  getAllCategories():string[]{
    return ['图书','电子设备','硬件设备']
  }
  serach(params:productSerachParams):Observable<Product[]>{
    return this.http.get('/api/products',{search:this.encodeParams(params)}).map(res=>res = res.json())
  }
  private encodeParams(params:productSerachParams){
    return Object.keys(params)
            .filter(key => params[key])
            .reduce((sum:URLSearchParams, key:string)=>{
              sum.append(key,params[key]);
              return sum
            },new URLSearchParams());
  }
}

export class productSerachParams {
  constructor (
    public title:string,
    public price:number,
    public category:string,
  ){}
} 
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
