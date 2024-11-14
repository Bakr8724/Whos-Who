import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';
@Component({
  selector: 'app-end-menu',
  templateUrl: './end-menu.component.html',
  styleUrls: ['./end-menu.component.css']
})
export class EndMenuComponent implements OnInit {
  totalTime: string = '';
  correctAnswers: number = 0;
  totalQuestions: number = 0;
  score: number = 0;
  playerName: string = '';
  isTwoPlayers: boolean = false;
  player1Name: string = '';
  player2Name: string = '';
  constructor(private router: Router, private gameService: GameService) {}

  ngOnInit(): void {
     // Retrieve session data from GameService
     // Retrieve session data from GameService
     const results = this.gameService.getGameResults();
     console.log('Retrieved results:', results); // Log to verify retrieval

     let configurations = this.gameService.getConfigResults();
     this.isTwoPlayers = configurations?.gameMode === "coop";


     if (results) {
       this.totalTime = results.totalTime;
       this.correctAnswers = results.correctAnswers;
       this.totalQuestions = results.totalQuestions;
       this.score = results.score;
     } else {
       console.warn('No game results found in local storage');
     }
  }
  submitName(): void {
    if (this.playerName) {
      // Call the service to add the result to the leaderboard
      this.gameService.addToLeaderboard(this.playerName, this.score, this.totalTime);

      // Navigate to the leaderboard after submission
      this.router.navigate(['/leaderboard']);
    } else {
      alert("Please enter your name!");
    }
  }


  submitTwoPlayers(): void {
    if (this.player1Name && this.player2Name) {
      // Call the service to add the result to the leaderboard
      this.gameService.addToLeaderboard(this.player1Name, this.score, this.totalTime);
      this.gameService.addToLeaderboard(this.player2Name, this.score, this.totalTime);
      // Navigate to the leaderboard after submission
      this.router.navigate(['/leaderboard']);
    } else {
      alert("Please enter players' names!");
    }
  }

  goToLeaderboard(): void {
    this.router.navigate(['/leaderboard']);
  }

  goToMainMenu(): void {
    this.router.navigate(['/']);
  }

  playAgain(): void {
    this.router.navigate(['/game']);
  }

}