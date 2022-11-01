import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})  //instead in providers in app module
export class LogginService {
    lastLog: string;

    printLog(message: string) {
      console.log(message);
      console.log(this.lastLog);
      this.lastLog = message;
    }
}