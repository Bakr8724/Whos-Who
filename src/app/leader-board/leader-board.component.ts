import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Importing Router for navigation

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderboardComponent {
  leaderboard: any[] = [];

  ngOnInit(): void {
    // Retrieve the leaderboard from localStorage
    const storedLeaderboard = localStorage.getItem('leaderboard');
    if (storedLeaderboard) {
      // Parse and set the leaderboard data
      this.leaderboard = JSON.parse(storedLeaderboard);
    }
  }

  
  constructor(private router: Router) {}

  goToMainMenu() {
    this.router.navigate(['/']);  // Navigate to the main page
  }
}