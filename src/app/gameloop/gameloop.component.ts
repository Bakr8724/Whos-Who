import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-gameloop',
  templateUrl: './gameloop.component.html',
  styleUrls: ['./gameloop.component.css']
})
export class GameloopComponent implements OnInit {

  constructor(private router: Router) { }

  replaysAvailable: number = 5; //hc
  timer: number = 0;
  interval: any;
  choices: string[] = ['choice 1', 'choice 2', 'choice 3', 'choice 4'];
  selectedChoice: string = '';
  score: number = 0;
  correctChoice: string = 'choice 1'; //hc to test
  showChoices: boolean = false;
  isLastQuestion: boolean = false;
  questionIndex: number = 0; //tracking the question
  totalQuestions: number = 5; //number of questions in total

  ngOnInit(): void {
  }

  //timer
  startTimer(){
    this.interval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  //start timer & show choices upon clicking the play audio button. 
  playAudio(){
    if(!this.interval){
      this.startTimer();
    }
    this.showChoices = true;
    //logic to play the audio
  }

  pauseAudio(){
    //logic to pause audio
  }

  //subtracting the available replays along with logic of replaying the audio.
  replayAudio(){
    if(this.replaysAvailable > 0){
      this.replaysAvailable--;

      //TODO: replaying the audio logic
    }
  }

  selectChoice(choice: string){
    this.selectedChoice = choice;
    if( choice === this.correctChoice){
      this.score++;
    }
  }

  nextQuestion(){
    this.questionIndex++;
    this.selectedChoice = '';
    this.showChoices = false;

    this.replaysAvailable = this.replaysAvailable;
    //logic to load next question & check if its the last question
      //if last question set isLastQuestion to true
    if(this.questionIndex >= this.totalQuestions - 1){
      this.isLastQuestion = true;
    }else{
      this.isLastQuestion = false;
    }
    //load the next question
  }

  completeGame(){
    clearInterval(this.interval);
    this.interval = null;
    //saving the score
    localStorage.setItem('gameScore', JSON.stringify(this.score));
    //navigate to end screen
    this.router.navigate(['/endGame'])
  }

}
