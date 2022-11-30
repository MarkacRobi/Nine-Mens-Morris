import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {MessagingService} from "./singleton-services/messaging.service";
import {GameComponent} from "./components/game/game.component";

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [ // singleton services provided in global scope
    MessagingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
