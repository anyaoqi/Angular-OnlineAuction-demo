import { Component, OnInit } from '@angular/core';
import {Product, ProductService} from "../shared/product.service";
import {FormControl} from "@angular/forms";
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  private products:Observable<Product[]>;
  private imgSrc = 'http://placehold.it/320x150';
  constructor(private productService:ProductService) {

  }

  ngOnInit() {
    this.products = this.productService.getProducts();
    this.productService.productSerachEvent.subscribe( params => {
      this.products = this.productService.serach(params);
    })
  }

}



