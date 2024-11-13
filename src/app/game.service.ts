import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  
  totalTime: string = '00:00';
  correctAnswers: number = 0;
  totalQuestions: number = 0;
  score: number = 0;

  constructor() { }

  // saves to local storage;
  setGameResults(totalTime: string, correctAnswers: number, totalQuestions: number, score: number): void {
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
      this.totalTime = totalTime;
      this.correctAnswers = correctAnswers;
      this.totalQuestions = totalQuestions;
      this.score = score;
      return { totalTime, correctAnswers, totalQuestions, score };
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
}