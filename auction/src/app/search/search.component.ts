import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import { ProductService } from '../shared/product.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  formModel:FormGroup;
  categories:string[];
  constructor(private fb:FormBuilder,private productService:ProductService) { }

  ngOnInit() {
    this.createFormModel();
    this.categories = this.productService.getAllCategories();
  }
  postiveValidtor(control:FormControl):any{
    if (!control.value){
      return null
    }

    let price = parseInt(control.value);
    if(price>0){
      return null;
    }else{
      return {postive:true}
    }
  }
  createFormModel(){
    this.formModel = this.fb.group({
      title:['',[Validators.minLength(3)]],
      price:['',this.postiveValidtor],
      category:[-1],
    })
  }
  onSearch(){
    if(this.formModel.valid){
      console.error(this.formModel.value)
      this.productService.productSerachEvent.emit(this.formModel.value)
    }
  }

}
