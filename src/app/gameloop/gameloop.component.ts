import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Howl } from 'howler';
import fetchFromSpotify, { request } from 'src/services/api';
import { GameService } from '../game.service';

const AUTH_ENDPOINT = "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: 'app-gameloop',
  templateUrl: './gameloop.component.html',
  styleUrls: ['./gameloop.component.css']
})
export class GameloopComponent implements OnInit {
  
  constructor(private router: Router, private gameService: GameService) {}
  
  //hold the playlist songs with their preview urls
  songs: any[] = [];
  currentSongIndex: number = 0;
  player: Howl | null = null; //audio instance for playback
  token: string = ''; //spotify api access token
  
  //game variables
  timer: number = 0;
  interval: any;
  choices: string[] = [];
  selectedChoice: string = '';
  score: number = 0;
  correctChoice: string = 'choice 1';
  showChoices: boolean = false;
  isLastQuestion: boolean = false;
  questionIndex: number = 0;
  totalQuestions: number = 5;
  totalCorrectAnswers: number = 0;
  questionData: any[] = []; // Array to hold question data
  playDisabled: boolean = false;
  isPaused: boolean = false;
  
  playerScores: { [player: string]: number } = {}; // For coop mode
  currentPlayer: string = 'Player 1';  // Track current player
  
  
  replaysAvailable: number = 5;
  playBackDuration: number = 5; //hardcoded for now, 5 seconds of audio

  gameMode: string = 'single';  // Default to single player
  difficulty: string = 'easy';
  selectBy: string = 'artist'; 
  addedScore: boolean = false;
  
  hasPlayed: boolean = false; //tracker to make sure the song doesnt get replayed
  
  //load token and the playlist songs, initializer.
  ngOnInit(): void {
    this.initializeTokenAndSongs();

    this.gameConfiguration();

    this.loadQuestions();
  }
  
  gameConfiguration(){

    const configSettings = this.gameService.getConfigResults();
    console.log('New Game Mode:', configSettings);
    if(configSettings){
      this.gameMode = configSettings.gameMode;
      this.difficulty = configSettings.difficulty;
      this.selectBy = configSettings.selectBy;
      console.log("Game Mode:", this.gameMode);
      console.log("Difficulty:", this.difficulty);
      console.log("SelectBy:", this.selectBy);
      console.log(`Here gameConfiguration() difficulty: ${this.difficulty}`);

      //setting duration and replays available
      if (this.difficulty === "easy") {
        this.playBackDuration = 5; // 5 seconds for easy
        this.replaysAvailable = 3; // 3 replays for easy
      } else if (this.difficulty === "medium") {
        console.log("Here in medium");
        this.playBackDuration = 3; // 3 seconds for medium
        this.replaysAvailable = 2; // 2 replays for medium
      } else if (this.difficulty === 'hard') {
        this.playBackDuration = 1.5; // 1.5 seconds for hard
        this.replaysAvailable = 1; // 1 replay for hard
      }
    }else{
      console.log('No config settings found in local storage');
    }


  }
  
  //retrieve the stored token or get a new one, then load playlist
  async initializeTokenAndSongs() {
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        this.token = storedToken.value;
        await this.loadPlaylistSongs();
        return;
      }
    }
    const newToken = await this.requestNewToken();
    if (newToken) {
      this.token = newToken.value;
      await this.loadPlaylistSongs();
    }
  }
  
  //if the current token is expired/missing get one from the auth endpoint
  async requestNewToken() {
    try {
      const { access_token, expires_in } = await request(AUTH_ENDPOINT);
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      return newToken;
    } catch (error) {
      console.error("Failed to retrieve token", error);
      return null;
    }
  }


  
  //get the songs from the spotify playlist, filter the songs using their previewUrl, and then shuffle them.
  //Today's Top Hits: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=d6b96150eca8454c
  //Hot Hits USA: https://open.spotify.com/playlist/37i9dQZF1DX0kbJZpiYdZl?si=a3ff6be02ab84ae9
  async loadPlaylistSongs() {
    const playlistId = '37i9dQZF1DX0kbJZpiYdZl'; // Hot Hits USA
    const endpoint = `playlists/${playlistId}/tracks`;
    try {
      const response = await fetchFromSpotify({ token: this.token, endpoint });
      
      // Filter songs to only include those with a valid previewUrl
      this.songs = response.items
      .map((item: any) => ({
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        previewUrl: item.track.preview_url,
      }))
      .filter((song: { previewUrl: null; }) => song.previewUrl !== null);
      
      //shuffle the songs array
      this.songs = this.shuffleSongs(this.songs);
      
      console.log("Filtered loaded songs:", this.songs);
      
      if (this.songs.length === 0) {
        console.error("No songs with valid previews were loaded.");
      } else {
        console.log("Songs successfully loaded.");
        this.loadQuestions();
      }
    } catch (error) {
      console.error("Failed to load playlist songs", error);
    }
  }
  
  //refactored to work with anything being passed and not just songs, to be used for both the loadPlaylistSongs() method & the loadQuestions() method
  //shuffle algorithm (fisher-yates)
  //pick an index j between 0 and i, swap the song  at index i with song at index j
  shuffleSongs(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      //swapping positions of two elements in the array via destructuring
      //swap i with j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  
  //timer starts when clicking the play button i.e when the game begins
  startTimer() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.timer++;
      }, 1000);
    }
  }
  
  //keeps track of the players choice, and adds to the score if its correct.
  selectChoice(choice: string) {
    this.selectedChoice = choice;
    console.log("Selected choice:", choice, " | correct choice:", this.correctChoice);
    if (choice === this.correctChoice && !this.addedScore) {
      this.score++;
      this.totalCorrectAnswers++;
      this.addedScore = true;
      console.log("correct answer, score is: ", this.score);
    }else{
      console.log("wrong answer :(");
    }
  }
  
  playAudio(index: number) {
    if (this.songs.length === 0) {
      console.error("No songs loaded.");
      return;
    }
    
    const song = this.songs[index];
    if (!song || !song.previewUrl) {
      console.error("No preview for this song or invalid index.");
      return;
    }
    
    // stops previous audio
    if (this.player) {
      this.player.stop();
    }
    
    // checks if the song has been played or not before
    if (!this.hasPlayed) {
      this.hasPlayed = true;
      this.startTimer();
      this.showChoices = true;
    }
    
    this.playDisabled = true;
    // initialize Howler with the selected song preview
    this.player = new Howl({
      src: [song.previewUrl],
      html5: true,
      volume: 0.6,
      
      onend: () => {
        this.hasPlayed = false; // reset play state when song ends
        this.isPaused = false;
      }
    });
    this.player.play();
    
    
    
    //timer to stop the song after x seconds
    setTimeout(() => {
      if(this.player && this.player.playing()){
        this.player.stop();
      }
    }, this.playBackDuration * 1000);
    
    
  }

  canPlay(): boolean {
    return !this.hasPlayed || this.isPaused;
  }

  //pausing audio if its being played
  pauseAudio() {
    if (this.player && this.player.playing()) {
      this.player.pause();
      this.isPaused = true;
    }

  }
  //WIP
  resumeAudio(){
    if(this.player && this.isPaused){
      this.player.play();
      this.isPaused = false;
    }
    setTimeout(() => {
      if(this.player && this.player.playing()){
        this.player.stop();
      }
    }, this.playBackDuration * 1000);
  }
  
  //as long as the replay available is more than 0 it replays, else it shouldnt. also -- replays
  replayAudio() {
    if (this.replaysAvailable > 0 && this.player) {
      this.replaysAvailable--;
      this.player.stop();
      this.player.play();
    }

    setTimeout(() => {
      if(this.player && this.player.playing()){
        this.player.stop();
      }
    }, this.playBackDuration * 1000);
  }



  loadQuestions(): void {
    // Load the question data based on selection method (Artist or Album)
    if (this.selectBy === 'artist') {
      
      //check if the songs are loaded
      if(this.songs.length > 0 && this.currentSongIndex < this.songs.length){
        const currentSong = this.songs[this.currentSongIndex];
        const correctArtist = currentSong.artist;
  
        //get other artist names not including the correct one
        const otherArtists = this.songs
          .map(song => song.artist)
          .filter(artist => artist != correctArtist);
        
        //pick three random artists
        const shuffledOtherArtists = this.shuffleSongs(otherArtists);
        const randomArtist = shuffledOtherArtists.slice(0,3);
  
        //combine correct artist with other random artists, shuffle them, and set choices
        this.choices = this.shuffleSongs([correctArtist, ...randomArtist]);
        this.correctChoice = correctArtist;
        this.showChoices = true;
  
      }

    }
    else if (this.selectBy === 'album') {
      if(this.songs.length > 0 && this.currentSongIndex < this.songs.length){
        const currentSong = this.songs[this.currentSongIndex];
        const correctAlbum = currentSong.album;
  
        //get other artist names not including the correct one
        const otherAlbums = this.songs
          .map(song => song.album)
          .filter(album => album != correctAlbum);
        
        //pick three random artists
        const shuffledOtherAlbums = this.shuffleSongs(otherAlbums);
        const randomAlbum = shuffledOtherAlbums.slice(0,3);
  
        //combine correct artist with other random artists, shuffle them, and set choices
        this.choices = this.shuffleSongs([correctAlbum, ...randomAlbum]);
        this.correctChoice = correctAlbum;
        this.showChoices = true;
      }
    }
  
 
  }
  
  loadNextQuestion(): void {
    if (this.questionIndex < this.totalQuestions) {
      this.loadQuestions();
      const currentQuestion = this.questionData[this.questionIndex];

      if(currentQuestion){
        this.choices = currentQuestion.options;
        this.correctChoice = currentQuestion.answer;
        this.showChoices = true;
      }
    } else{
      console.error("no current questions available")
    }
  }
  
  
  //moves to the next question, resets the state, and stops the audio
  nextQuestion() {
    if (this.player) {
      this.player.stop();
      this.player = null;
    }
    this.addedScore = false;
    this.questionIndex++;
    this.selectedChoice = '';
    this.showChoices = true;
    this.hasPlayed = false;
    this.playDisabled = false;
    
    // Switch player in coop mode after each question
    if (this.gameMode === 'coop') {
      this.currentPlayer = this.currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
    }


    //updates index for the shuffled list
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    
    //checks if its the last question
    if (this.questionIndex >= this.totalQuestions - 1) {
      this.isLastQuestion = true;
    } else {
      this.isLastQuestion = false;
      console.log("Next song index:", this.currentSongIndex);
      this.loadQuestions();
    }
  }

  //completion of the game
  completeGame() {
    if (this.player) {
      this.player.stop();
    }

    clearInterval(this.interval);
    this.gameService.setGameResults(
      this.timer,
      this.totalCorrectAnswers,
      this.totalQuestions,
      this.score,
      
    );
    this.router.navigate(['/endGame']);
  }
}
