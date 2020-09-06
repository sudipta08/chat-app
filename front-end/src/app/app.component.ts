import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AppService } from './app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private appService: AppService){}

  @ViewChild('message') message: ElementRef;
  sendMessageStatus: boolean = false;
  sendLocationStatus: boolean = false;

  private messageFromServerSub = new Subscription();
  private locationFromServerSub = new Subscription();

  private messageAcknowledgementSub = new Subscription();
  private locationAcknowledgementSub = new Subscription();
  
  ngOnInit(){
    this.messageFromServerSub = this.appService.getMessages().subscribe();
    this.locationFromServerSub = this.appService.getLocation().subscribe();
    this.messageAcknowledgementSub = this.appService.getMessageAcknowledgementListener().subscribe(() => {
      this.message.nativeElement.value = '';
      this.message.nativeElement.focus();
      this.sendMessageStatus = false;
    });
    this.locationAcknowledgementSub = this.appService.getLocationAcknowledgementListener().subscribe(() => {
      this.message.nativeElement.focus();
      this.sendLocationStatus = false;
    });
  }

  sendMessage(){
    this.sendMessageStatus = true;
    const message = this.message.nativeElement;
    if (!message.value) {
      message.focus();
      this.sendMessageStatus = false;
      return;
    }
    this.appService.sendMessage(message.value);
  }

  sendLocation(){
    this.sendLocationStatus = true;
    this.appService.sendLocation();
  }

  ngOnDestroy(){
    this.messageFromServerSub.unsubscribe();
    this.locationFromServerSub.unsubscribe();
    this.messageAcknowledgementSub.unsubscribe();
    this.locationAcknowledgementSub.unsubscribe();
  }
}
