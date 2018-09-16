import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import 'rxjs/Rx';
@Injectable()
export class WebSocketService {
  ws:WebSocket;
  constructor() { }

  // 接收服务器推送消息 （返回类型：Observerable）
  createWsSocket(url:string,id:number) : Observable<any>{
    this.ws = new WebSocket(url); 
    return new Observable<string>(
      observer=>{
        this.ws.onmessage = (event)=> observer.next(event.data);
        this.ws.onerror = (event)=> observer.error(event);
        this.ws.onclose = (event)=> observer.complete();
        this.ws.onopen = (event) => this.sendWsMessage({productId:id});
        return ()=> this.ws.close();
      }
    ).pipe(map(r=> r = JSON.parse(r)))
  }
  // 向服务器发送消息 
  sendWsMessage(message:any){
    this.ws.send(JSON.stringify(message));
  }
}
