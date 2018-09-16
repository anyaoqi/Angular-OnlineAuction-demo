import { Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Comment, Product, ProductService} from "../shared/product.service";
import { WebSocketService } from "../shared/web-socket.service";
import {Subscription } from 'rxjs';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  private product:Product;
  private comments:Comment[];
  newRating:number = 5;
  newComment:string = "";
  private isCommentHidden = true;

  private currentBid:number
  private isWatched:boolean = false;

  subscription:Subscription;
  constructor(
    private wsService:WebSocketService,
    private routerInfo:ActivatedRoute,
    private productService:ProductService
  ) { }

  ngOnInit() {
      let productId = this.routerInfo.snapshot.params['productId'];
     

      this.productService.getProduct(productId)
        .subscribe(product => {
          this.product= product
          this.currentBid = product.price;
        })
      this.productService.getCommentsForproductId(productId)
        .subscribe(comments => this.comments = comments);
  }

  addComment(){
    let comment = new Comment(0,this.product.id,new Date().toISOString(), "AnYaoqi", this.newRating,this.newComment);
    this.comments.unshift(comment);
    
    let sum = this.comments.reduce((sum,comment)=>sum+comment.rating,0)
    this.product.rating = sum/this.comments.length;
    this.newRating = 5;
    this.newComment = null;
    this.isCommentHidden = true;
  }
  watchProduct(){
    if(this.subscription){
      this.subscription.unsubscribe();
      this.isWatched=false;
      this.subscription = null;
    }else{
      this.isWatched = true;
      this.subscription = this.wsService.createWsSocket('ws://localhost:8085',this.product.id)
        .subscribe((products)=>{
          console.error(products)
          let product = products.find(p => p.productId === this.product.id);
          this.currentBid = product.bid;
        }
      )
    }

  }
}
