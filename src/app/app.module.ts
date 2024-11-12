import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { EndMenuComponent } from './end-menu/end-menu.component';
import { GameloopComponent } from './gameloop/gameloop.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';

const routes: Routes = [
  {path: "", component: HomeComponent }, 
  {path: "game", component:GameloopComponent},
  {path: "endGame", component:EndMenuComponent},
  { path: "settings", component: ConfigurationComponent },
  { path: 'leaderboard', component: LeaderBoardComponent }
];

@NgModule({
  declarations: [AppComponent, HomeComponent, EndMenuComponent, GameloopComponent, ConfigurationComponent, LeaderBoardComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes), ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
