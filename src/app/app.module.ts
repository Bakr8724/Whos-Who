import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { EndMenuComponent } from './end-menu/end-menu.component';
import { GameloopComponent } from './gameloop/gameloop.component';

const routes: Routes = [
  {path: "", component: HomeComponent }, 
  {path: "game", component:GameloopComponent},
  {path: "endGame", component:EndMenuComponent}
];

@NgModule({
  declarations: [AppComponent, HomeComponent, EndMenuComponent, GameloopComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
