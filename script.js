'use strict';
let dir,menu,buttons,difficulty,block,timeout,unique,mismatch,arr = [],cArr = [],bArr = [];

dir = 'img/';
arr = [
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

/* timer */
let TimerGame,GameTime = 0,msSec,msMin,msHrs,msDay;
msSec = 1000;
msMin = 60000;
msHrs = 3600000;
msDay = 86400000;

let TimerGameFunc =()=>{
  GameTime = 1;
  let timeOld,timeNew,timeDif,sec,min,hrs;
  timeOld = new Date().getTime();
  TimerGame = setInterval(function(){
    timeNew = new Date().getTime();
    timeDif = timeNew - timeOld;
    GameTime = timeDif;

    hrs = Math.floor((timeDif % msDay) / msHrs);
    min = Math.floor((timeDif % msHrs) / msMin);
    sec = Math.floor((timeDif % msMin) / msSec);

    if(hrs.toString().length === 1){hrs = '0'+hrs;};
    if(min.toString().length === 1){min = '0'+min;};
    if(sec.toString().length === 1){sec = '0'+sec;};
    
    document.getElementById('time').innerHTML = hrs+':'+min+':'+sec;
  },1000);
};

let TimerHint,HintTime = 0,HintTimeCounter;
let TimerHintFunc =()=>{
  HintTime = unique * 750;
  let sec = HintTime / 1000;

  let count =()=>{
    if(sec.toString().length === 1) sec = '0'+sec;
    document.getElementById('time').innerHTML = '00:00:'+sec;
    sec -= 1;
  };
  count();

  HintTimeCounter = setInterval(function(){
    if(sec >= 0) count()
    else clearTimeout(HintTimeCounter);
  },1000);


  block = Array.from(document.getElementsByClassName('block'));
  TimerHint = setTimeout(function(){
    block.forEach(function(e){
      e.classList.remove('open');
      HintTime = 0;
    });
  },HintTime);
};

let reset =()=>{
  clearTimeout(TimerGame);
  clearTimeout(TimerHint);
  clearTimeout(HintTimeCounter);
  difficulty = '';
  mismatch = 0;
  GameTime = 0;
  bArr = [];
  document.getElementById('mismatch').innerHTML = '0';
  document.getElementById('time').innerHTML = '00:00:00';
  document.getElementById('blocks').innerHTML = '';
  document.getElementById('results').classList.remove('on');
};
reset();

let render =()=>{
  cArr = [...arr];

  switch (difficulty){
    case 'easy': unique = 4; break;
    case 'norm': unique = 8; break;
    case 'hard': unique = 12;break;
  };

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
      <div class="block open" data-name="${str[0]}">
        <div class="blockWrap">
          <img class="blockImage" src="${dir+bArr[r]}" />
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
  TimerHintFunc();
};

let results =()=>{
  let d;
  switch (difficulty){
    case 'easy': d = 'Легко';break;
    case 'norm': d = 'Нормально';break;
    case 'hard': d = 'Сложно';break;
  };
  document.getElementById('dif').innerHTML = d;
  document.getElementById('results').classList.add('on');
};

let matched,unmatched;
function check(){
  if(GameTime === 0 && HintTime === 0) TimerGameFunc();
  if(GameTime > 0){

    let autoHide = () => {
      unmatched = Array.from(document.getElementsByClassName('unmatched'));

      timeout = setTimeout(function(){
        unmatched.forEach(function(e){
          e.classList.remove('open', 'unmatched');
        });
      },400);

    };
    
    if(
      !this.classList.contains('open') &&
      !this.classList.contains('match') &&
      !this.classList.contains('unmatched')){

      if(bArr.length < 2){
        this.classList.add('open');
        bArr.push(this);
      };
      checkFunc();
    };

    function checkFunc(){
      if(bArr.length === 2){
        if(bArr[0].dataset.name === bArr[1].dataset.name){
          bArr.forEach(function(e){e.classList.add('match');});
          bArr = [];
        }
        else if(bArr[0].dataset.name !== bArr[1].dataset.name){
          bArr.forEach(function(e){e.classList.add('unmatched');});
          mismatch += 1;
          document.getElementById('mismatch').innerHTML = mismatch;
          bArr = [];
          autoHide();
        };
      };
    };

    matched = Array.from(document.getElementsByClassName('match'));
    if(matched.length == block.length){
      clearInterval(TimerGame);
      setTimeout(()=>{
        document.getElementById('blocks').innerHTML = '';
        results();      
      },500);
    };
  };
};

document.getElementById('menu').addEventListener('click',function(){
  reset();
  start();
});

let start =()=>{
  document.getElementById('header').classList.remove('on');
  document.getElementById('start').classList.add('on');

  buttons = Array.from(document.getElementById('difficulty').getElementsByClassName('button'));
  buttons.forEach(function(e){
    e.addEventListener('click',function(){
      reset();
      difficulty = this.dataset.difficulty;
      document.getElementById('start').classList.remove('on');
      render();
    });
  });
};
start();
