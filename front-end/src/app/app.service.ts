import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppService {
    private url = environment.apiUrl;
    private socket;

    private messageFromServerListener = new Subject<string>();
    private locationFromServerListener = new Subject<string>();

    private messageAcknowledgementListener = new Subject<string>();
    private locationAcknowledgementListener = new Subject<string>();

    constructor() {
        this.socket = io(this.url);
    }

    getMessages() {
        this.socket.on('messageFromServer', (message: string) => {
            console.log(message)
            this.messageFromServerListener.next(message);
        });
        return this.messageFromServerListener.asObservable();
    }

    getMessageAcknowledgementListener(){
        return this.messageAcknowledgementListener.asObservable();
    }

    sendMessage(message: string) {        
        this.socket.emit('messageFromClient', message, (message: string) => {
            this.messageFromServerListener.next(message);
        });
    }

    getLocation() {
        this.socket.on('locationFromServer', (location: string) => {
            console.log(location);
            this.locationFromServerListener.next(location);
        });
        return this.locationFromServerListener.asObservable();
    }

    getLocationAcknowledgementListener(){
        return this.locationAcknowledgementListener.asObservable();
    }

    sendLocation() {
        const location = navigator.geolocation;
        if (!location) {
            return alert('Browser does not support this feature');
        }
        location.getCurrentPosition((position: any) => {
            this.socket.emit('locationFromClient',
                { latitude: position.coords.latitude, longitude: position.coords.longitude },
                (message: string) => {
                    this.locationAcknowledgementListener.next(message);
                });
        });
    }
}