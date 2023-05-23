const moves = process.argv;
let crypto = require("crypto");
const prompt = require("prompt-sync")();
let table = require("cli-table");
class GAME {
  constructor() {
    let moves;
    let userMove;
    let pcMove;
    let winner;
  }

  // SETTERS
  setMoves(moves) {
    this.moves = moves;
    // console.log(this.moves[Math.floor(Math.random() * this.moves.length - 1)]);
  }
  setUserMove(move) {
    this.userMove = move;
  }

  getRandomMove() {
    let index = Math.floor(Math.random() * this.moves.length);
    // console.log(this.moves[index]);
    return this.moves[index];
  }

  rounds(num, key) {
    console.log("HMAC: " + key().toUpperCase());
    if (num > moves.length) {
      console.log(
        "There is no such option! Please, choose something less than " +
          (moves.length + 1) +
          " and more than -1"
      );
      return;
    }
    console.log("Your move: " + moves[num - 1]);
    let pcmove = this.getRandomMove();
    console.log("Computer move: " + pcmove);
    this.getWinner(moves[num - 1], moves, pcmove, key);
  }
  getWinner(u, moves, pc, key) {
    let reducedArr = [];
    let ctr = 0;
    while (moves[ctr] != u) {
      ctr++;
    }
    for (let i = ctr + 1; i < moves.length + ctr; i++) {
      if (i == moves.length) {
        i = 0;
      }
      if (moves[i] == u) break;
      reducedArr.push(moves[i]);
    }
    for (let i = 0; i < reducedArr.length; i++) {
      if (i < reducedArr.length / 2 && reducedArr[i] == pc) {
        console.log("Winner is user");
        console.log("HMAC: " + key().toUpperCase());
        return;
      }
      if (i >= reducedArr.length / 2 && reducedArr[i] == pc) {
        console.log("Winner is pc");
        console.log("HMAC: " + key().toUpperCase());
        return;
      }
    }
    console.log("Draft!");
  }
}
class Output {
  menu(moves, rounds, key) {
    console.log("Avaible moves: ");
    for (let i = 0; i < moves.length; i++) {
      console.log(i + 1 + " - " + moves[i]);
    }
    console.log("0 - exit");
    console.log("? - help");
  }
  getWinnerOutput(moves, t, u) {
    let reducedArr = [];
    let ctr = 0;
    while (moves[ctr] != u) {
      ctr++;
    }
    for (let i = ctr + 1; i < moves.length + ctr; i++) {
      if (i == moves.length) {
        i = 0;
      }
      if (moves[i] == u) break;
      reducedArr.push(moves[i]);
    }
    for (let i = 0; i < reducedArr.length; i++) {
      if (i < reducedArr.length / 2 && reducedArr[i] == t) {
        return "Winner";
      }
      if (i >= reducedArr.length / 2 && reducedArr[i] == t) {
        return "Loser";
      }
    }
    return "Draft!";
  }
  help(moves) {
    console.table(
      "Logic of the game doesnt depends on the meaning of words, it depends on its location in queue  "
    );
    let outputTable = new table({
      head: ["Movement:", ...moves],
    });
    for (let i = 0; i < moves.length; i++) {
      let row = [moves[i]];
      for (let g = 0; g < moves.length; g++) {
        row.push(this.getWinnerOutput(moves, moves[g], moves[i]));
      }
      outputTable.push(row);
    }
    console.log(outputTable.toString());
    console.log("0 - Exit");
    console.log("1 - Go back to Main menu");
  }
}

class Input {
  constructor() {
    let moves;
    let pickedMove;
  }

  setMoves(u) {
    {
      u.shift();
      u.shift();
      this.moves = u;
    }
  }
  getMoves() {
    return this.moves;
  }
  validateInputs(a) {
    if (a.length < 3) {
      console.log("Вы должны вводить не меньше 3-ех аргументов");
      console.log("Пример: Камень Ножницы Бумага - 3 аргумента");
      return;
    }
    if (a.length % 2 == 0) {
      console.log("Вы должны ввести нечетное количество аргументов");
      console.log("Пример: Камень Ножница Бумага, 3 нечетное число");
      return;
    }
    this.setMoves(a);
  }
}

class Hash {
  constructor() {
    let USER_HASH;
  }
  recreateHash() {
    return crypto
      .createHmac("sha256", "secret")
      .update("" + Math.random() * 10000)
      .digest("hex");
  }
  printHash() {
    console.log(this.USER_HASH);
  }
}

let hash = new Hash();
let game = new GAME();
let inputs = new Input();
let output = new Output();
inputs.validateInputs(process.argv);
game.setMoves(inputs.moves);
output.menu(inputs.moves);
let choice = prompt("Enter your move: ");
while (choice != 0) {
  if (choice == "?") {
    output.help(inputs.moves);
    let helpChoice = prompt("");
    if (helpChoice == 0) return;
  }
  game.rounds(choice, hash.recreateHash);
  output.menu(inputs.moves);
  choice = prompt("Enter your move: ");
}

// game.rounds(prompt("Enter your move: "), hash.recreateHash);
// game.getWinner("спек", inputs.moves, "ножницы");
// console.log(inputs.getMoves());
// inputs.rounds(prompt("Enter your move: "));
