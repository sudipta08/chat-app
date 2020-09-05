import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private appService: AppService){}

  message: string = '';
  private messageFromServerSub = new Subscription();
  private locationFromServerSub = new Subscription();
  
  ngOnInit(){
    this.messageFromServerSub = this.appService.getMessages().subscribe();
    this.locationFromServerSub = this.appService.getLocation().subscribe();
  }

  sendMessage(){
    this.appService.sendMessage(this.message);
    this.message = '';
  }

  sendLocation(){
    this.appService.sendLocation();
  }

  ngOnDestroy(){
    this.messageFromServerSub.unsubscribe();
    this.locationFromServerSub.unsubscribe();
  }
}
