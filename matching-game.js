let audioContext;
let gainNode;

let audio_start, audio_go, audio_restart, audio_click, audio_select, audio_correct, audio_wrong, audio_win, audio_exit, audio_pause, audio_resume;


const start_button = document.querySelector('.start');
const play_button = document.querySelector('.play');

const pause_mute_button = document.querySelector('.pause-mute-button');
const pause_button = document.querySelector('.topbar-element.pause');
const fullscreen_button = document.querySelector('.pause-fullscreen-button');

const pause_menu_button = document.querySelector('.pause-menu-button');
const pause_restart_button = document.querySelector('.pause-restart-button');
const pause_resume_button = document.querySelector('.pause-resume-button');
const win_menu_button = document.querySelector('.win-menu-button');
const win_restart_button = document.querySelector('.win-restart-button');


play_button.addEventListener('touchstart', PlayGame);
play_button.addEventListener('click', PlayGame);
start_button.addEventListener('touchstart', StartGame);
start_button.addEventListener('click', StartGame);


pause_mute_button.addEventListener('touchstart', ToggleMuted, false);
pause_mute_button.addEventListener('click', ToggleMuted, false);
pause_button.addEventListener('touchstart', ShowPauseMenu, false);
pause_button.addEventListener('click', ShowPauseMenu, false);
fullscreen_button.addEventListener('click', ToggleFullscreen, false);

pause_menu_button.addEventListener('touchstart', ShowMenu, false);
pause_menu_button.addEventListener('click', ShowMenu, false);
pause_restart_button.addEventListener('touchstart', RestartGame, false);
pause_restart_button.addEventListener('click', RestartGame, false);
pause_resume_button.addEventListener('touchstart', ResumeGame, false);
pause_resume_button.addEventListener('click', ResumeGame, false);
win_menu_button.addEventListener('touchstart', ShowMenu, false);
win_menu_button.addEventListener('click', ShowMenu, false);
win_restart_button.addEventListener('touchstart', RestartGame, false);
win_restart_button.addEventListener('click', RestartGame, false);


const title_wrapper = document.querySelector('.title-wrapper');
const menu_wrapper = document.querySelector('.menu-wrapper');
const PauseMenuWrapper = document.querySelector('.pause-menu-wrapper');
const cards_wrapper = document.querySelector('.cards-wrapper');
const pause_menu = document.querySelector('.pause-menu-wrapper');
const win_menu = document.querySelector('.win-menu-wrapper');
var documentElement = document.documentElement;

let total_cards;
let theme;
let cards = [];

let muted = true;
let isStarting = false;
let startingTimeout;


// CARD INTERACTION

let lockTopbar = true;
let lockBoard = true;
let unmatchedCards;
let fails;
let isPhase_A = true;
let justFlipped = false;


let cardPairA = {
      firstCard: null,
      secondCard: null,
      hasFlippedCard: false,
};
let cardPairB = {
      firstCard: null,
      secondCard: null,
      hasFlippedCard: false,
};



function flipCard(event) {
      event.preventDefault();
      
      if (lockBoard) return;
      
      if (this.classList.contains('red')) return;

      if (isPhase_A) {
            if (this === cardPairB.firstCard || this === cardPairB.secondCard) return;
            addSelectedCard(this, cardPairA);
      }
      else {
            if (this === cardPairA.firstCard || this === cardPairA.secondCard) return;
            addSelectedCard(this, cardPairB);
      }
}

function addSelectedCard(selectedCard, cardPair) {
      if (selectedCard === cardPair.firstCard) return;
      
      if (!justFlipped){
            PlaySample(audio_select);
            justFlipped = true;
            setTimeout(() => {
                  justFlipped = false;
      
            }, 100);
      }

      selectedCard.classList.add('flip');
      
      selectedCard.classList.add('highlighted');
      setTimeout(() => {
            selectedCard.classList.remove('highlighted');

      }, 100);

      if (!cardPair.hasFlippedCard) {
            cardPair.hasFlippedCard = true;
            cardPair.firstCard = selectedCard;

            return;
      }

      cardPair.secondCard = selectedCard;
      checkForMatch(cardPair);
}

function checkForMatch(cardPair) {
      let isMatch = cardPair.firstCard.querySelector('h2').innerText === cardPair.secondCard.querySelector('h2').innerText;

      lockBoard = true;
      cards_wrapper.classList.remove('selectable');

      isMatch ? disableCards(cardPair) : unflipCards(cardPair);
}

function disableCards(cardPair) {

      cardPair.firstCard.removeEventListener('touchstart', flipCard);
      cardPair.firstCard.removeEventListener('click', flipCard);
      cardPair.secondCard.removeEventListener('touchstart', flipCard);
      cardPair.secondCard.removeEventListener('click', flipCard);

      setTimeout(() => {
            cardPair.firstCard.classList.remove('selectable');
            cardPair.secondCard.classList.remove('selectable');

            PlaySample(audio_correct);

            checkForWin();
            resetBoard(cardPair);
      }, 800);
}

function unflipCards(cardPair) {

      
      let firstCard = cardPair.firstCard;
      let secondCard = cardPair.secondCard;

      setTimeout(() => {
            firstCard.classList.add('red');
            secondCard.classList.add('red');
            
            fails += 1;
            SetFails(fails);

            PlaySample(audio_wrong);

            resetBoard(cardPair);
      }, 800);

      setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');

            firstCard.classList.remove('selectable');
            secondCard.classList.remove('selectable');
      }, 1200);

      setTimeout(() => {
            firstCard.classList.remove('red');
            secondCard.classList.remove('red');

            firstCard.classList.add('selectable');
            secondCard.classList.add('selectable');

      }, 1800);
}


function resetBoard(cardPair) {
      [cardPair.hasFlippedCard, lockBoard] = [false, false];
      [cardPair.firstCard, cardPair.secondCard] = [null, null];

      cards_wrapper.classList.add('selectable');
      isPhase_A = !isPhase_A;
}

function checkForWin() {
      unmatchedCards -= 2;
      if (unmatchedCards == 0) {
            
            PlaySample(audio_win);
            
            lockTopbar = true;
            Topbar.classList.add('locked');
            
            win_menu.classList.remove('hidden');
            FinalFails.innerHTML = 'fails ' + fails;
            FinalTime.innerHTML = 'total time ' + minutes + ':' + seconds + 's ';
            TimerStop();
      }
}



// OPTIONS



const all_option_cards = document.querySelectorAll('.option-cards');
let selected_option_cards = document.querySelector('.option-cards');

const all_option_theme = document.querySelectorAll('.option-theme');
let selected_option_theme = document.querySelector('.option-theme');

selected_option_cards.classList.add('selected');
selected_option_theme.classList.add('selected');

all_option_cards.forEach(option => option.addEventListener('touchstart', SelectOptionCards));
all_option_cards.forEach(option => option.addEventListener('click', SelectOptionCards));
all_option_theme.forEach(option => option.addEventListener('touchstart', SelectOptionTheme));
all_option_theme.forEach(option => option.addEventListener('click', SelectOptionTheme));


function SelectOptionCards(event) {
      event.preventDefault();
      
      selected_option_cards.classList.remove('selected');
      this.classList.add('selected');

      PlaySample(audio_click);

      selected_option_cards = this;
}

function SelectOptionTheme(event) {
      event.preventDefault();
      
      selected_option_theme.classList.remove('selected');

      this.classList.add('selected');

      PlaySample(audio_click);

      selected_option_theme = this;
}

// PLAY GAME

function PlayGame(event) {
      event.preventDefault();
      
      audioContext = new AudioContext();
      gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = 0;
      
      SetupSamples();

      title_wrapper.classList.add('hidden');
}

// START GAME

function StartGame(event) {
      event.preventDefault();
      
      PlaySample(audio_start);

      CreateGame();
}

// RESTART GAME

function RestartGame(event) {
      event.preventDefault();

      PlaySample(audio_restart);

      CreateGame();
}


// CREATE GAME

function CreateGame() {

      // hide menus
      menu_wrapper.classList.add('hidden');
      pause_menu.classList.add('hidden');
      win_menu.classList.add('hidden');

      // unset old display
      cards_wrapper.classList.remove('cards-' + total_cards);

      // lock board
      lockBoard = true;
      
      // restart stats
      fails = 0;
      SetFails();

      // fetch options
      total_cards = document.querySelector('.option-cards.selected').dataset.cards;
      theme = document.querySelector('.option-theme.selected').dataset.theme;

      // set display
      cards_wrapper.classList.add('cards-' + total_cards);

      // create cards
      CreateCards();

      // select emojis and asign to cards
      AsignEmojis();

      // unflip all cards
      cards.forEach(card =>

            setTimeout(() => {
                  card.classList.remove('flip');
            }, 3000)
      );


      // set starting, reset board and unlock topbar
      clearTimeout(startingTimeout);
      if (!isStarting) {
            isStarting = true;
            cards_wrapper.classList.add('starting')
      }

      startingTimeout = setTimeout(() => {
            isStarting = false;
            cards_wrapper.classList.remove('starting');
            
            PlaySample(audio_go);

            lockBoard = false;
            [cardPairA.firstCard, cardPairA.secondCard, cardPairA.hasFlippedCard] = [null, null, false];
            [cardPairB.firstCard, cardPairB.secondCard, cardPairB.hasFlippedCard] = [null, null, false];

            lockTopbar = false;
            Topbar.classList.remove('locked'); 
            
      }, 3800)



      // start timer
      TimerReset();

      setTimeout(() => {
            timerController = setInterval(TimerStart, 10);
      }, 4400)

      // set unmatched cards
      unmatchedCards = total_cards;


}

function SetFails() {
      Fails.innerHTML = 'FAILS: ' + fails;
}


function CreateCards() {

      const CreateCard = () =>

            cards_wrapper.insertAdjacentHTML('beforeend', `
            <div class="card selectable flip">
                  <div class="card-wrapper">
                        <div class="card-shadow">
                        </div>            
                        <div class="card-back">
                              <div class="card-square">
                                    <h2 class="card-emoji"></h2>
                              </div>
                        </div>
                        <div class="card-front">
                              <div class="card-square">
                                    <img src="images/front.png" alt="" draggable="false">
                              </div>
                        </div>
                  </div>
            </div>
            `)
            ;

      cards_wrapper.innerHTML = '';

      Array.from({ length: total_cards }, () => CreateCard());

      cards = document.querySelectorAll('.card');

      cards.forEach(card => card.addEventListener('touchstart', flipCard, false));
      cards.forEach(card => card.addEventListener('click', flipCard, false));
}



// PAUSE MENU

function ShowPauseMenu(event) {
      event.preventDefault();
      
      if (lockTopbar) return;
      lockTopbar = true;
      Topbar.classList.add('locked');
      
      TimerStop();

      PlaySample(audio_pause);

      PauseMenuWrapper.classList.remove('hidden');
}

function ResumeGame(event) {
      event.preventDefault();
      
      lockTopbar = false;
      Topbar.classList.remove('locked');

      timerController = setInterval(TimerStart, 10);

      PlaySample(audio_resume);

      PauseMenuWrapper.classList.add('hidden');
}

function ShowMenu(event) {
      event.preventDefault();
      menu_wrapper.classList.remove('hidden');

      PlaySample(audio_exit);
}



function AsignEmojis() {

      // populate array with all emojis
      let selected_emojis;

      switch (theme) {
            case 'smileys':
                  selected_emojis = ['😁', '😆', '😅', '😂', '🥲', '😇', '🙂', '🙃', '😉', '😌', '😍', '😘', '😗', '😚', '😋', '😛', '😜', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '😏', '😔', '😟', '😕', '😖', '😩', '🥺', '😢', '😭', '😤', '🤬', '🤯', '😳', '🥵', '🥶', '😶‍🌫️', '😱', '😓', '🤔', '😶', '😑', '😬', '🙄', '😮', '🥱', '😴', '🤤', '😪', '😮‍💨', '😵', '😵‍💫', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '😈', '💩', '🤖', '👽', '😸'];
                  break;
            case 'food':
                  selected_emojis = ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🍞', '🥖', '🧀', '🥚', '🧈', '🥩', '🍗', '🍖', '🥫', '🦪', '🌰', '🥜', '🍯', '🥛', '🦐', '🦞', '🦀', '🐟'];
                  break;
            case 'desserts':
                  selected_emojis = ['🥐', '🥯', '🥨', '🥞', '🧇', '🥮', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🥤', '🧋'];
                  break;
            case 'international-dishes':
                  selected_emojis = ['🍳', '🥓', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🍢'];
                  break;
            case 'animal-faces':
                  selected_emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐙', '🐥'];
                  break;
            case 'hands':
                  selected_emojis = ['👍🏻', '👎🏻', '👊🏻', '✊🏻', '🤛🏻', '🤜🏻', '🤞🏻', '✌🏻', '🤟🏻', '🤘🏻', '👌🏻', '🤌🏻', '🤏🏻', '👈🏻', '👉🏻', '👆🏻', '👇🏻', '☝🏻', '🤚🏻', '🖐🏻', '🖖🏻', '👋🏻', '🤙🏻'];
                  break;
            case 'architecture':
                  selected_emojis = ['🏰', '🏯', '🏠', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪️', '🕌', '🕍', '🛕', '🎡'];
                  break;
            case 'medical':
                  selected_emojis = ['💀', '🫀', '🫁', '🧠', '🦷', '👅', '👂🏻', '👃🏻', '👁️', '⚗️', '🔬', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🦾', '🦶🏻', '🦿', '🥼', '🔍', '📋', '🗄️', '🖥️', '📚', '⏱️', '🧴', '💼', '🥽', '🐁'];
                  break;
            case 'jobs':
                  selected_emojis = ['👮🏻‍♂️', '👷🏽‍♂️', '🕵🏻‍♂️', '🧑🏽‍⚕️', '👩🏼‍🌾', '👨🏼‍🍳', '👨🏾‍🎓', '👩🏿‍🎤', '🧑🏼‍🏫', '👩🏻‍🏭', '👨🏻‍💻', '🧑🏿‍💼', '👨🏻‍💼', '👩🏻‍🔧', '👩🏽‍🔬', '👨🏼‍🎨', '🧑🏼‍🚒', '👩🏻‍✈️', '🧑🏽‍🚀', '🧑🏻‍⚖️', '🤵🏼‍♀️'];
                  break;
            case 'animals':
                  selected_emojis = ['🦆', '🦅', '🦇', '🦗', '🐢', '🐍', '🦎', '🦑', '🐬', '🐋', '🦈', '🐅', '🐆', '🦓', '🦍', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🐈', '🐈‍⬛', '🐓', '🦃', '🦤', '🦜', '🦢', '🦩', '🐇', '🦝', '🦨', '🦡', '🦫', '🐿️', '🦔'];
                  break;
            case 'vehicles':
                  selected_emojis = ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛵', '🏍️', '🛺', '🚟', '🚃', '🚂', '🚁'];
                  break;
            case 'faces':
                  selected_emojis = ['👧🏻', '🧒🏼', '👦🏾', '👩🏾', '🧑🏻', '👨🏽', '👩🏾‍🦱', '🧑🏿‍🦱', '👨🏾‍🦱', '👩🏻‍🦰', '🧑🏼‍🦰', '👨🏻‍🦰', '👱🏽‍♀️', '👱🏼', '👱🏽‍♂️', '👩🏻‍🦳', '🧑🏽‍🦳', '👨🏼‍🦳', '👨🏿‍🦲', '🧔🏽‍♀️', '🧔🏾', '🧔🏻‍♂️', '👵🏻', '🧓🏼', '👴🏼'];
                  break;
            case 'nature':
                  selected_emojis = ['⛰', '🌲', '🌳', '🌱', '🌿', '🍀', '🍂', '🍁', '🍄', '🪨', '🌾', '🌷', '🌹', '🌺', '🌸', '🌼', '🏵️', '🌻', '🪱', '🦋', '🐌', '🐞', '🪰', '🪲', '🪳', '🕷️', '🦂'];
                  break;
            case 'activities':
                  selected_emojis = ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🪃', '🥊', '⛸️', '🏹', '🪁', '🤿', '🥌', '🏆', '🎧', '🎹', '🎲', '♟️', '🎯', '🎳', '🎮', '🧩', '🃏', '🀄️', '🛼', '🎭', '🩰', '🎨', '🎬', '🎤', '🔫', '🏁'];
                  break;
            case 'objects':
                  selected_emojis = ['⌚️', '📱', '💻', '🖨️', '🕹️', '🗜️', '💾', '💿', '📼', '📷', '📹', '🎥', '☎️', '📺', '📻', '🧭', '⏲️', '⏰', '🕰️', '⏳', '🔋', '💡', '🔦', '🕯️', '🧯', '⚖️', '🪛', '🔧', '🔨', '🪚', '🔩', '⚙️', '🧲', '🪓', '🔪', '🔭', '🧹', '🪠', '🧻', '🧼', '🪥', '🪒', '🧽', '🪣', '🔑', '🗝️', '🧸', '🎁', '✉️', '📦', '🏷️', '🗒️', '📆', '🗑️', '📁', '📰', '📖', '🧷', '📎', '📐', '🧮', '📌', '✂️', '🖊️', '✒️', '🖌️', '🖍️', '✏️', '🔒', '🧤', '💍', '🎒', '🧳', '🕶️', '🌂', '📢', '🍼'];
                  break;
            case 'families':
                  selected_emojis = ['👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👦‍👦', '👩‍👧‍👧', '👨‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👦‍👦', '👨‍👧‍👧'];
                  break;
            case 'time':
                  selected_emojis = ['🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦'];
                  break;
            case 'flags':
                  selected_emojis = ['🇺🇳', '🇦🇫', '🇦🇱', '🇩🇪', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇸🇦', '🇮🇴', '🇩🇿', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇩', '🇧🇧', '🇧🇭', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇾', '🇧🇴', '🇧🇦', '🇧🇼', '🇧🇷', '🇧🇳', '🇧🇬', '🇧🇫', '🇧🇮', '🇧🇹', '🇨🇻', '🇰🇭', '🇨🇲', '🇨🇦', '🇮🇨', '🇧🇶', '🇶🇦', '🇹🇩', '🇨🇿', '🇨🇱', '🇨🇳', '🇨🇾', '🇻🇦', '🇨🇴', '🇰🇲', '🇨🇬', '🇰🇵', '🇰🇷', '🇨🇷', '🇨🇮', '🇭🇷', '🇨🇺', '🇨🇼', '🇩🇰', '🇩🇲', '🇪🇨', '🇪🇬', '🇸🇻', '🇦🇪', '🇪🇷', '🇸🇰', '🇸🇮', '🇪🇸', '🇺🇸', '🇪🇪', '🇸🇿', '🇪🇹', '🇵🇭', '🇫🇮', '🇫🇯', '🇫🇷', '🇬🇦', '🇬🇲', '🇬🇪', '🇬🇭', '🇬🇮', '🇬🇩', '🇬🇷', '🇬🇱', '🇬🇵', '🇬🇺', '🇬🇹', '🇬🇫', '🇬🇬', '🇬🇳', '🇬🇶', '🇬🇼', '🇬🇾', '🇭🇹', '🇭🇳', '🇭🇰', '🇭🇺', '🇮🇳', '🇮🇩', '🇮🇶', '🇮🇷', '🇮🇪', '🇮🇲', '🇨🇽', '🇳🇫', '🇮🇸', '🇦🇽', '🇰🇾', '🇨🇨', '🇨🇰', '🇫🇴', '🇬🇸', '🇫🇰', '🇲🇵', '🇲🇭', '🇵🇳', '🇸🇧', '🇹🇨', '🇻🇬', '🇻🇮', '🇮🇱', '🇮🇹', '🇯🇲', '🇯🇵', '🎌', '🇯🇪', '🇯🇴', '🇰🇿', '🇰🇪', '🇰🇬', '🇰🇮', '🇽🇰', '🇰🇼', '🇱🇦', '🇱🇸', '🇱🇻', '🇱🇧', '🇱🇷', '🇱🇾', '🇱🇮', '🇱🇹', '🇱🇺', '🇲🇴', '🇲🇰', '🇲🇬', '🇲🇾', '🇲🇼', '🇲🇻', '🇲🇱', '🇲🇹', '🇲🇦', '🇲🇶', '🇲🇺', '🇲🇷', '🇾🇹', '🇲🇽', '🇫🇲', '🇲🇩', '🇲🇨', '🇲🇳', '🇲🇪', '🇲🇸', '🇲🇿', '🇲🇲', '🇳🇦', '🇳🇷', '🇳🇵', '🇳🇮', '🇳🇪', '🇳🇬', '🇳🇺', '🇳🇴', '🇳🇨', '🇳🇿', '🇴🇲', '🇳🇱', '🇵🇰', '🇵🇼', '🇵🇦', '🇵🇬', '🇵🇾', '🇵🇪', '🇵🇫', '🇵🇱', '🇵🇹', '🇵🇷', '🇬🇧', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🏴󠁧󠁢󠁷󠁬󠁳󠁿', '🇨🇫', '🇨🇩', '🇩🇴', '🇷🇪', '🇷🇼', '🇷🇴', '🇷🇺', '🇪🇭', '🇼🇸', '🇦🇸', '🇧🇱', '🇰🇳', '🇸🇲', '🇵🇲', '🇻🇨', '🇸🇭', '🇱🇨', '🇸🇹', '🇸🇳', '🇷🇸', '🇸🇨', '🇸🇱', '🇸🇬', '🇸🇽', '🇸🇾', '🇸🇴', '🇱🇰', '🇿🇦', '🇸🇩', '🇸🇸', '🇸🇪', '🇨🇭', '🇸🇷', '🇹🇭', '🇹🇼', '🇹🇿', '🇹🇯', '🇹🇫', '🇵🇸', '🇹🇱', '🇹🇬', '🇹🇰', '🇹🇴', '🇹🇹', '🇹🇳', '🇹🇲', '🇹🇷', '🇹🇻', '🇺🇦', '🇺🇬', '🇪🇺', '🇺🇾', '🇺🇿', '🇻🇺', '🇻🇪', '🇻🇳', '🇼🇫', '🇾🇪', '🇩🇯', '🇿🇲', '🇿🇼'];
                  break;
            /* case '':
                  selected_emojis = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
                  break;    */

      }

      // random select emojis from total    
      while (selected_emojis.length > total_cards / 2) {
            let random_index = Math.floor(Math.random() * selected_emojis.length);
            selected_emojis.splice(random_index, 1);
      }

      // duplicate emojis      
      selected_emojis = selected_emojis.concat(selected_emojis);

      // asign emojis to cards    
      cards.forEach(card => asignEmoji(card));

      function asignEmoji(_card) {
            let random_index = Math.floor(Math.random() * selected_emojis.length);

            _card.querySelector('h2').innerText = selected_emojis.splice(random_index, 1);
      }

}

function ToggleMuted(event) {
      event.preventDefault();
      
      if (muted) {
            document.body.classList.remove('muted')
            gainNode.gain.value = 1;
            muted = false;
      }
      else {
            document.body.classList.add('muted')
            gainNode.gain.value = 0;
            muted = true;
      }

}

function ToggleFullscreen() {

      if (document.fullscreenElement == null) {
            // open fullscreen
            setTimeout(() => {
                  document.body.classList.add('fullscreen')
            }, 500);

            if (documentElement.requestFullscreen) {
                  documentElement.requestFullscreen();
            } else if (documentElement.webkitRequestFullscreen) { /* Safari */
                  elem.webkitRequestFullscreen();
            } else if (documentElement.msRequestFullscreen) { /* IE11 */
                  elem.msRequestFullscreen();
            }
      }
      else {
            // exit fullscreen
            setTimeout(() => {
                  document.body.classList.remove('fullscreen')
            }, 500);

            if (document.exitFullscreen) {
                  document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                  document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                  document.msExitFullscreen();
            }
      }

}




/* const emojis_raw = '😁 😆 😅 😂 🥲 ☺️ 😇 🙂 🙃 😉 😌 😍 😘 😗 😚 😋 😛 😜 🤨 🧐 🤓 😎 🥸 🤩 😏 😔 😟 😕 😖 😩 🥺 😢 😭 😤 🤬 🤯 😳 🥵 🥶 😶‍🌫️ 😱 😓 🤔 😶 😑 😬 🙄 😮 🥱 😴 🤤 😪 😮‍💨 😵 😵‍💫 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 😈 💩 🤖 👽 😸';

let emojis_formatted = '"';

for (let index = 0; index < emojis_raw.length * 2; index++) {
      
      let string_char = emojis_raw.slice(index, index + 1);
      if (string_char != ' ') {
            emojis_formatted += string_char;
      }
      else {
            emojis_formatted += '", "';
      }
}

emojis_formatted += '"';


console.log(emojis_formatted);

const show_string = document.querySelector('body');

show_string.innerHTML = emojis_formatted; */






let timerController;
let seconds;
let minutes;

function TimerReset() {
      clearInterval(timerController);
      hundredths = 0;
      seconds = 0;
      minutes = '00';
      Seconds.innerHTML = ':00s';
      Minutes.innerHTML = '00';
}

function TimerStop() {
      clearInterval(timerController);
}

function TimerStart() {
      if (hundredths < 100) {
            hundredths++;
      }
      if (hundredths == 99) {
            hundredths = -1;
      }
      if (hundredths == 0) {
            seconds++;
            if (seconds < 10) { seconds = '0' + seconds }
            Seconds.innerHTML = ':' + seconds + 's';
            if (seconds == 59) {
                  seconds = -1;
            }
            if (seconds == 0) {
                  minutes++;
                  if (minutes < 10) { minutes = '0' + minutes }
                  Minutes.innerHTML = minutes;
                  if (minutes == 59) {
                        minutes = -1;
                  }
            }
      }
}




function watchForHover() {

      let lastTouchTime = 0

      function enableHover() {
            if (new Date() - lastTouchTime < 500) return
            document.body.classList.add('hasHover')
      }

      function disableHover() {
            document.body.classList.remove('hasHover')
      }

      function updateLastTouchTime() {
            lastTouchTime = new Date()
      }

      document.addEventListener('touchstart', updateLastTouchTime, true)
      document.addEventListener('touchstart', disableHover, true)
      document.addEventListener('mousemove', enableHover, true)

      enableHover()
}

watchForHover()


function isMobile() {
      const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;
      return regex.test(navigator.userAgent);
}


// AUDIO 

async function SetupSamples() {
      
      audio_start = await GetFile('audio/start.wav');
      audio_go = await GetFile('audio/go.wav');
      audio_restart = await GetFile('audio/restart.wav');
      audio_click = await GetFile('audio/click.wav');
      audio_select = await GetFile('audio/select.wav');
      audio_correct = await GetFile('audio/correct.wav');
      audio_wrong = await GetFile('audio/wrong.wav');
      audio_win = await GetFile('audio/win.wav');
      audio_exit = await GetFile('audio/exit.wav');
      audio_pause = await GetFile('audio/pause.wav');
      audio_resume = await GetFile('audio/resume.wav');
}

async function GetFile(filePath) {
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      return audioBuffer;
}

function PlaySample(audioBuffer) {
      const sampleSource = audioContext.createBufferSource();
      sampleSource.buffer = audioBuffer;
      sampleSource.connect(gainNode);
      sampleSource.start(0);
      return(sampleSource);
}