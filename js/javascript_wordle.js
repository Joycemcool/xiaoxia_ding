  //Store the data in a matrix, separate the game data from the ui
  const dictionary = ['earth','plane','crane','house'];

  // DECLARE STATE CLASS 
  const state = {
      secret:dictionary[Math.floor(Math.random()*dictionary.length)],
      grid:Array(6).fill().map(() => Array(5).fill('')),
      currentRow:0,
      currentCol:0,
  }; 
  
  //Display the game state in the actual grid
  //Get the box from the dom and set the value of the text in the box
  function updateGrid() {
      for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
          const box = document.getElementById(`box${i}${j}`);
          box.textContent = state.grid[i][j];
        }
      }
    }
  
    // DEFINE A LETTER BOX
  function drawBox(container, row, col, letter = '') {
      const box = document.createElement('div');
      box.className = 'box';
      box.textContent = letter;
      box.id = `box${row}${col}`;//Don't understand here
    
      container.appendChild(box);
      return box;
    }
  
  // DRAW GAME GRID
  function drawGrid(container) {
      const grid = document.createElement('div');
      grid.className = 'grid';
    
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
          drawBox(grid, i, j);
        }
      }
    
      container.appendChild(grid);
    }
  
  
  async function registerKeyboardEvents() {
    document.body.onkeydown = async (e) => {
        const key = e.key;
        if (key === 'Enter') {
          if (state.currentCol === 5) {
            var flag;
  
              // Check if input 5 letters
              const word = getCurrentWord();
              flag = await checkWordValidity(word);
              // if(await checkWordValidity(word))
              // { 
              
                console.log(flag);
  
                // updateGrid();
              // }    
              if(flag){
                revealWord(word);//Tell the player if the position right or wrong
                state.currentRow++;
                state.currentCol = 0;
              }
              else{
                removeRow();
              }
  
          }
        }
  
        if (key === 'Backspace') {
          removeLetter();
        }
  
        if (isLetter(key)) {
          addLetter(key);
        }
        
        updateGrid();
    }
  }
  
  async function checkWordValidity(word){
    const fetchUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/'+word;
  
    try{
      const response = await fetch(fetchUrl);
      const data = await response.json();
      console.log(data);
      if(data.title === 'No Definitions Found'){
        alert('Not a valid word');
        return false;
      }
      else return true;
    }
    catch(error){
      console.error(error);
      console.log('false 1');
      return false;
    }
  }
    
  function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
  }//what's prev and curr?
  
  function isWordValid(word) {
      return dictionary.incluereredes(word);
  }
    
    
  function revealWord(guess) {
      const row = state.currentRow;
  
      //WORDLE ANNIMATION BOX HEIGHT SHRIEKING TO ZERO THEN BACK TO NORMAL
      const animation_duration = 500; // ms
  
      for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
   
  //TIMEOUT DEPENDENT ON THE INDEX OF THE CURRENT LETTER
        setTimeout(() => {
          
            if (letter === state.secret[i]) {
              box.classList.add('right');
            } else if (state.secret.includes(letter)) {
              box.classList.add('wrong');
            } else {
              box.classList.add('empty');
            }

        }, ((i + 1) * animation_duration) / 2);
  
  //ADD ANIMATED CLASS TO ANY BOX
        box.classList.add('animated');
  
  //ANIMATION DELAY DEPEND ON THE INDEX OR THE POSITON OF THE LETTER
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
      }
    
  // Check if win or lose
      const isWinner = state.secret === guess;
      const isGameOver = state.currentRow === 5;
    
  //SCHEDULE THE FUNCTION TO BE EXECUTED AFTER A SPECIFIC OF TIME
      setTimeout(() => {
          if (isWinner) {
          alert('Congratulations!');
          location.reload();
  //update grid here!
          } else if (isGameOver) {
          alert(`Better luck next time! The word was ${state.secret}.`);
          }
      }, 3 * animation_duration);
  }
    
  //CHECK IF INPUT LETTER (REGULAR EXPRESSION)
  function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
  }
    
  //ADD THE LETTER TO THE GRID
  function addLetter(letter) {
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
  }
    
  //REMOVE THE LETTER FROM THE GRID
  function removeLetter() {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
  }
  
  function removeRow(){
    for(let i=state.currentCol;i>0;i--){
      removeLetter();
    }
  }
  
  //DRWA GAME GRID 
  function startup() {
    const game = document.getElementById('game');
    drawGrid(game); //DRWA GAME GRID 
    registerKeyboardEvents();//LISTEN TO THE KEY DOWN EVENT
    console.log(state.secret);
  }
  
  //CALL GAME STARTUP FUNCTION
  startup();