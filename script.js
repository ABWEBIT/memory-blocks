var dir,hint,menu,buttons,difficulty,block,session,time,tNew,timeout,unique,mismatch,cArr = [],bArr = [];

let timer = () => {
  let tNow = new Date().getTime();
  time = setInterval(function(){
    let tUpd = new Date().getTime();
    let tDif = tUpd - tNow;

    let hrs = Math.floor((tDif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let min = Math.floor((tDif % (1000 * 60 * 60)) / (1000 * 60));
    let sec = Math.floor((tDif % (1000 * 60)) / 1000);

    if(hrs.toString().length === 1){hrs = '0'+hrs;};
    if(min.toString().length === 1){min = '0'+min;};
    if(sec.toString().length === 1){sec = '0'+sec;};
    tNew = hrs+':'+min+':'+sec;
    document.getElementById('timer').innerHTML = tNew;
  },1000);
};

let reset = () => {
  clearTimeout(hint);
  clearTimeout(time);
  difficulty = '';
  mismatch = 0;
  session = 'off';
  bArr = [];
  document.getElementById('mismatch').innerHTML = '0';
  document.getElementById('timer').innerHTML = '00:00:00';
  document.getElementById('blocks').innerHTML = '';
};
reset();

let render = () => {
  dir = 'img/';
  cArr = [
    'bear.png',
    'beaver.png',
    'cat.png',
    'deer.png',
    'dog.png',
    'elephant.png',
    'lion.png',
    'mouse.png',
    'panda.png',
    'pig.png',
    'rabbit.png',
    'walrus.png'
  ];

  if     (difficulty === 'easy')  {unique = 4; hintTime = 4000;}
  else if(difficulty === 'normal'){unique = 8; hintTime = 5000;}
  else if(difficulty === 'hard')  {unique = 12;hintTime = 8000;}
  else                            {unique = 4; hintTime = 4000;};

  // generate array
  for(let b = 0;unique - b > 0; b++){
    let r = Math.floor(Math.random() * cArr.length);
    bArr.push(cArr[r]);
    cArr.splice(r, 1);
  };
  // duplicate array
  bArr = [...bArr,...bArr];

  // generate blocks
  while(bArr.length > 0){
    let r = Math.floor(Math.random() * bArr.length);
    let str = bArr[r].split('.');

    let bTemplate = `
      <div class="block open" data-name="`+str[0]+`">
        <div class="blockWrap">
          <img class="blockImage" src="`+dir+bArr[r]+`" />
        </div>
      </div>
    `;
    document.getElementById('blocks').innerHTML += bTemplate;
    bArr.splice(r, 1);
  };

  block = Array.from(document.getElementsByClassName('block'));
  block.forEach(function(e){
    e.addEventListener('click',check);
  });

  document.getElementById('header').classList.add('on');

  hint = setTimeout(function(){
    block.forEach(function(e){
        e.classList.remove('open');
      });
    },hintTime);

};

let results = () => {
  let rDifficulty;
  if     (difficulty === 'easy')  {rDifficulty = 'Легко'}
  else if(difficulty === 'normal'){rDifficulty = 'Нормально'}
  else if(difficulty === 'hard')  {rDifficulty = 'Сложно'}

  let template = `
    <section id="results">
      <div class="title">Все блоки открыты.</div>
      <div class="text">
        <div>Сложность: `+rDifficulty+`</div>
      </div>
    </section>
  `;
  document.getElementById('blocks').innerHTML = template;
};

function check(){
  if(session === 'off'){session = 'on';timer();};

  let autoHide = () => {
    unmatched = Array.from(document.getElementsByClassName('unmatched'));

    timeout = setTimeout(function(){
      unmatched.forEach(function(e){
        e.classList.remove('open', 'unmatched');
      });
    },1500);

  };
  
  if(!this.classList.contains('open') && !this.classList.contains('match')){
    if(bArr.length === 2){
      bArr.forEach(function(e){
        e.classList.remove('open', 'unmatched');
      });
      bArr = [];
      clearTimeout(timeout);
    };
    this.classList.add('open');
    bArr.push(this);
  };
  
  if(bArr.length === 2){
    if(bArr[0].dataset.name === bArr[1].dataset.name){
      bArr.forEach(function(e){e.classList.add('match');});
      bArr = [];
    }
    else if(bArr[0].dataset.name !== bArr[1].dataset.name){
      bArr.forEach(function(e){e.classList.add('unmatched');});
      mismatch += 1;
      autoHide();
      document.getElementById('mismatch').innerHTML = mismatch;
    };
  };

  matched = Array.from(document.getElementsByClassName('match'));
  if(matched.length == block.length){
    clearInterval(time);
    setTimeout(() => {
      results();
      document.getElementById('results').classList.add('on');
    },1000);
  };

};

document.getElementById('menu').addEventListener('click',function(){
  reset();
  start();
});

let start = () => {
  document.getElementById('header').classList.remove('on');
  let template = `
    <section id="start">
      <div class="title">Выбрать сложность</div>
      <div id="difficulty">
        <div class="button" data-difficulty="easy">Легко</div>
        <div class="button" data-difficulty="normal">Нормально</div>
        <div class="button" data-difficulty="hard">Сложно</div>
      </div>
    </section>
  `;
  document.getElementById('blocks').innerHTML = template;

  buttons = Array.from(document.getElementById('difficulty').getElementsByClassName('button'));
  buttons.forEach(function(e){
    e.addEventListener('click',function(){
      reset();
      difficulty = this.dataset.difficulty;
      render();
    });
  });
};
start();