import { Component, OnInit } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  READONLY_MINUTE = 2;
  playerCount = 0;
  playerText = '';
  teamGlad = [];
  teamSad = [];
  teamGladScore = 0;
  teamSadScore = 0;
  hidePlayerInput = false;

  isTeamGladTurn = true;
  teamGladIndex = 0;
  teamSadIndex = 0;

  minute = this.READONLY_MINUTE;
  second = 0;
  timer;
  isTimerStarted = false;
  gameOverMessage = 'WINNER: TEAM GLAD!';
  isTimesUp = false;
  isGameOver = false;
  isTimerSet = false;

  constructor() { }

  ngOnInit(): void {
  }

  onPlayersInput($event) {
    let players = this.playerText.split('\n');
    players = players.filter((p) => p !== '');
    this.playerCount = players.length;
  }

  randomTeam() {
    let players = this.playerText.split('\n');
    players = players.filter((p) => p !== '');
    this.splitTeams(players);
    this.hidePlayerInput = true;
  }

  splitTeams(players) {
    players = this.shuffle(players);
    let middle = players.length / 2;
    for (let i=0; i<players.length; i++) {
      if (i < middle) {
        this.teamGlad.push(players[i]);
      } else {
        this.teamSad.push(players[i]);
      }
    }
  }

  get isGameSet() {
    return this.hidePlayerInput && this.isTimerSet;
  }

  setTimer(value) {
    this.READONLY_MINUTE = value;
    this.minute = value;
    this.isTimerSet = true;
  }

  startTimer() {
    this.isTimesUp = false;
    this.timer = setInterval(function() {
      this.second--;
      if (this.second < 0) {
        this.minute --;
        this.second = 59;
        if (this.minute < 0) {
          this.isTimesUp = true;
          this.checkIfGameEnd();
          this.resetTimer();
        }
      }
    }.bind(this), 1000);
    this.isTimerStarted = true;
  }

  stopTimer() {
    clearInterval(this.timer);
    this.isTimerStarted = false;
  }

  resetTimer() {
    if (!!this.timer) {
      clearInterval(this.timer);
    }
    this.minute = this.READONLY_MINUTE;
    this.second = 0;
    this.isTimerStarted = false;
  }

  modifyGladPoints(points) {
    this.teamGladScore += points;
  }

  modifySadPoints(points) {
    this.teamSadScore += points;
  }

  nextTurn() {
    if (this.isTeamGladTurn) {
      this.teamGladIndex++;
    } else {
      this.teamSadIndex++;
    }
    this.isTeamGladTurn = !this.isTeamGladTurn;
    this.isTimesUp = false;
  }

  checkIfGameEnd() {
    if (this.teamGladIndex + this.teamSadIndex >= (this.teamGlad.length + this.teamSad.length - 1)) {
      if (this.teamGladIndex !== this.teamGlad.length) {
        this.teamGladIndex++;
      } else {
        this.teamSadIndex++;
      }
      this.markGameOver();
    }
  }

  markGameOver() {
    if (this.teamGladScore === this.teamSadScore) {
      this.gameOverMessage = 'IT\'S A DRAW!';
    } else if (this.teamGladScore > this.teamSadScore) {
      this.gameOverMessage = 'WINNER: TEAM GLAD!';
    } else {
      this.gameOverMessage = 'WINNER: TEAM SAD!';
    }
    this.isGameOver = true;
  }

  resetAndRandomize() {
    let players = [...this.teamGlad, ...this.teamSad];
    this.teamGlad = [];
    this.teamSad = [];
    this.splitTeams(players);
    this.resetScore();
    this.resetTimer();
  }

  resetScore() {
    this.teamGladScore = 0;
    this.teamSadScore = 0;
    this.isGameOver = false;
    this.teamGladIndex = 0;
    this.teamSadIndex = 0;
    if (!!this.timer) {
      clearInterval(this.timer);
    }
    this.isTimerStarted = false;
    this.isTimesUp = false;
    this.isTeamGladTurn = true;
  }

  resetCompletely() {
    this.teamGlad = [];
    this.teamSad = [];
    this.resetScore();
    this.resetTimer();
    this.onPlayersInput
    this.hidePlayerInput = false;
    this.playerText = '';
    this.isTimerSet = false;
  }

  shuffle(array) {
    let currentIndex = array.length, randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

}
