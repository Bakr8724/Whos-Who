import { Injectable } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class GameService {

  
  totalTime: number = 0;
  correctAnswers: number = 0;
  totalQuestions: number = 0;
  score: number = 0;

  gameMode: string = '';
  difficulty: string = '';
  selectBy: string = '';

  configForm = new FormGroup({
    gameMode: new FormControl('gameMode'),
    difficulty: new FormControl('difficulty'),
    selectBy: new FormControl('selectBy'),
  });

  constructor() { }

  // saves to local storage;
  setGameResults(totalTime: number, correctAnswers: number, totalQuestions: number, score: number): void {
    this.totalTime = totalTime;
    this.correctAnswers = correctAnswers;
    this.totalQuestions = totalQuestions;
    this.score = score;

    // Save to local storage
    const gameResults = {
      totalTime: this.totalTime,
      correctAnswers: this.correctAnswers,
      totalQuestions: this.totalQuestions,
      score: this.score
    };
    localStorage.setItem('gameResults', JSON.stringify(gameResults));

  }

  // reads from local storage and returns the gae results
  getGameResults(): { totalTime: string, correctAnswers: number, totalQuestions: number, score: number } | null {{
    const storedResults = localStorage.getItem('gameResults');
    if (storedResults) {
      const { totalTime, correctAnswers, totalQuestions, score } = JSON.parse(storedResults);
      return JSON.parse(storedResults);
    }
    return null;
  }
  }
   // Method to get leaderboard from localStorage (if exists)
   getLeaderboard(): { playerName: string, score: number, totalTime: string }[] {
    return JSON.parse(localStorage.getItem('leaderboard') || '[]');
  }

  // Method to add a new entry to the leaderboard
  addToLeaderboard(playerName: string, score: number, totalTime: string): void {
    const newEntry = {
      playerName: playerName,
      score: score,
      totalTime: totalTime
    };

    // Get the existing leaderboard from localStorage
    let leaderboard: { playerName: string, score: number, totalTime: string }[] = this.getLeaderboard();

    // Add the new entry to the leaderboard array
    leaderboard.push(newEntry);

    // Sort leaderboard by score (descending order)
    leaderboard.sort((a: { score: number }, b: { score: number }) => b.score - a.score);

    // Store the updated leaderboard in localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  }

  //method to set configuration
  setConfigResults(gameMode: string, difficulty: string, selectBy: string): void{
    this.gameMode = gameMode;
    this.difficulty = difficulty;
    this.selectBy = selectBy;
    console.log("diffuctly" + difficulty);

    const configResults = {
      gameMode: this.gameMode,
      difficulty: this.difficulty,
      selectBy: this.selectBy,
    };
    localStorage.setItem('configResults', JSON.stringify(configResults));
  }
  //method to get configuration
  getConfigResults(): {gameMode: string, difficulty: string, selectBy: string} | null {{
    const storedResults = localStorage.getItem('configResults');
    if(storedResults){
      const{gameMode, difficulty, selectBy} = JSON.parse(storedResults);
      return JSON.parse(storedResults);
    }
    return null;

  }}

}