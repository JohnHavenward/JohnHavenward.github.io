


var audio_correct = new Audio('ui_correct_button2-103167.mp3');
var audio_wrong = new Audio('error-3-125761.mp3');

audio_correct.muted = true;
audio_wrong.muted = true;

const mute_button = document.querySelector('.mute');
const menu_button = document.querySelector('.menu');
const win_banner_menu_button = document.querySelector('.menu-button');
const reset_button = document.querySelector('.reset');
const win_banner_restart_button = document.querySelector('.restart-button');
const fullscreen_button = document.querySelector('.fullscreen');

mute_button.addEventListener('click', ToggleMuted);
menu_button.addEventListener('touchstart', ShowMenu);
menu_button.addEventListener('click', ShowMenu);
win_banner_menu_button.addEventListener('click', ShowMenu);
reset_button.addEventListener('click', CreateGame);
win_banner_restart_button.addEventListener('click', CreateGame);
fullscreen_button.addEventListener('click', ToggleFullscreen);

let firstCardTemp;
let secondCardTemp;

const menu_wrapper = document.querySelector('.menu-wrapper');
const cards_wrapper = document.querySelector('.cards-wrapper');
const win_banner = document.querySelector('.win-banner-wrapper');
var documentElement = document.documentElement;

let total_cards;
let theme;
let cards = [];

let muted = true;


// CARD INTERACTION FUNCTIONS

let hasFlippedCard = false;
let lockBoard = true;
let firstCard, secondCard;
let unmatchedCards;
let isFlipping = false;


function flipCard() {
      if (lockBoard) return;
      if (this === firstCard) return;
      if (isFlipping && (this === firstCardTemp || this === secondCardTemp)) return;

      this.classList.add('flip');

      if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;

            return;
      }

      secondCard = this;
      checkForMatch();
}

function checkForMatch() {
      let isMatch = firstCard.querySelector('h2').innerText === secondCard.querySelector('h2').innerText;

      lockBoard = true
      cards_wrapper.classList.remove('selectable');

      isMatch ? disableCards() : unflipCards();
}

function disableCards() {

      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);

      setTimeout(() => {
            firstCard.classList.remove('selectable');
            secondCard.classList.remove('selectable');

            audio_correct.load();
            audio_correct.play();

            checkForWin();
            resetBoard();
      }, 800);



}

function unflipCards() {
      isFlipping = true;
      
      firstCardTemp = firstCard;
      secondCardTemp = secondCard;
      
      redBackground();

      setTimeout(() => {
            firstCardTemp.classList.remove('flip');
            secondCardTemp.classList.remove('flip');
            
            firstCardTemp.classList.remove('selectable');
            secondCardTemp.classList.remove('selectable');
      }, 1200);
}

function redBackground() {

      setTimeout(() => {
            firstCard.classList.add('red');
            secondCard.classList.add('red');

            audio_wrong.load();
            audio_wrong.play();
            
            resetBoard();
      }, 800);

      setTimeout(() => {
            firstCardTemp.classList.remove('red');
            secondCardTemp.classList.remove('red');
            
            firstCardTemp.classList.add('selectable');
            secondCardTemp.classList.add('selectable');
            
            isFlipping = false;
      }, 1800);
}

function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false];
      [firstCard, secondCard] = [null, null];

      cards_wrapper.classList.add('selectable');
}

function checkForWin() {
      unmatchedCards -= 2;
      if (unmatchedCards == 0) {
            win_banner.classList.remove('hidden');
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

all_option_cards.forEach(option => option.addEventListener('click', SelectOptionCards));
all_option_theme.forEach(option => option.addEventListener('click', SelectOptionTheme));


function SelectOptionCards() {
      selected_option_cards.classList.remove('selected');
      this.classList.add('selected');
      selected_option_cards = this;
}

function SelectOptionTheme(option) {
      selected_option_theme.classList.remove('selected');
      this.classList.add('selected');
      selected_option_theme = this;
}

let start_button = document.querySelector('.start');

start_button.addEventListener('click', CreateGame);


// CREATE GAME

function CreateGame() {

      // hide win-banner
      win_banner.classList.add('hidden');

      // hide menu
      menu_wrapper.classList.add('hidden');

      // unset old display
      cards_wrapper.classList.remove('cards-' + total_cards);

      // lock board
      lockBoard = true;

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
                  resetBoard();
            }, 3000)       
      );
      
      // set starting
      cards_wrapper.classList.add('starting')
      
      setTimeout(() => {
            cards_wrapper.classList.remove('starting');
      }, 3800)  
      
      
      
      // start timer
      TimerReset();
      
      setTimeout(() => {
            TimerReset();
            timerController = setInterval(TimerStart,1000);
      }, 4400)

      // set unmatched cards
      unmatchedCards = total_cards;
}


function CreateCards() {

      const CreateCard = () =>

            cards_wrapper.insertAdjacentHTML('beforeend', `
            <div class="card selectable flip starting">
                  <div class="card-wrapper">
                        <div class="card-shadow">
                        </div>            
                        <div class="card-front">
                              <div class="card-square">
                                    <img src="Front.png" alt="" draggable="false">
                              </div>
                        </div>
                        <div class="card-back">
                              <div class="card-square">
                                    <h2 class="card-emoji"></h2>
                              </div>
                        </div>
                  </div>
            </div>
            `)
            ;

      cards_wrapper.innerHTML = '';

      Array.from({ length: total_cards }, () => CreateCard());

      cards = document.querySelectorAll('.card');

      cards.forEach(card => card.addEventListener('click', flipCard));
}

function ShowMenu(event) {
      event.preventDefault();
      TimerStop();
      menu_wrapper.classList.remove('hidden');
}

function AsignEmojis() {

      // populate array with all emojis
      let selected_emojis;

      switch (theme) {
            case 'smileys':
                  selected_emojis = ["😁", "😆", "😅", "😂", "🥲", "☺️", "😇", "🙂", "🙃", "😉", "😌", "😍", "😘", "😗", "😚", "😋", "😛", "😜", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "😏", "😔", "😟", "😕", "😖", "😩", "🥺", "😢", "😭", "😤", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😓", "🤔", "😶", "😑", "😬", "🙄", "😮", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "😈", "💩", "🤖", "👽", "😸"];
                  break;
            case 'food':
                  selected_emojis = ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🍞", "🥖", "🧀", "🥚", "🧈", "🥩", "🍗", "🍖", "🥫", "🦪", "🌰", "🥜", "🍯", "🥛", "🦐", "🦞", "🦀", "🐟"];
                  break;
            case 'desserts':
                  selected_emojis = ["🥐", "🥯", "🥨", "🥞", "🧇", "🥮", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🥤", "🧋"];
                  break;
            case 'international-dishes':
                  selected_emojis = ["🍳", "🥓", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🍢"];
                  break;
            case 'animal-faces':
                  selected_emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐙", "🐥"];
                  break;
            case 'hands':
                  selected_emojis = ["👍🏻", "👎🏻", "👊🏻", "✊🏻", "🤛🏻", "🤜🏻", "🤞🏻", "✌🏻", "🤟🏻", "🤘🏻", "👌🏻", "🤌🏻", "🤏🏻", "👈🏻", "👉🏻", "👆🏻", "👇🏻", "☝🏻", "✋🏻", "🤚🏻", "🖐🏻", "🖖🏻", "👋🏻", "🤙🏻"];
                  break;
            case 'architecture':
                  selected_emojis = ["🏰", "🏯", "🏠", "🏭", "🏢", "🏬", "🏣", "🏤", "🏥", "🏦", "🏨", "🏪", "🏫", "🏩", "💒", "🏛️", "⛪️", "🕌", "🕍", "🛕", "🎡"];
                  break;
            case 'medical':
                  selected_emojis = ["💀", "🫀", "🫁", "🧠", "🦷", "👅", "👂🏻", "👃🏻", "👁️", "⚗️", "🔬", "🩹", "🩺", "💊", "💉", "🩸", "🧬", "🦠", "🧫", "🧪", "🌡️", "🦾", "🦶🏻", "🦿", "🥼", "🔍", "📋", "🗄️", "🖥️", "📚", "⏱️", "🧴", "💼", "🥽", "🐁"];
                  break;
            case 'jobs':
                  selected_emojis = ["👮🏻‍♂️", "👷🏽‍♂️", "🕵🏻‍♂️", "🧑🏽‍⚕️", "👩🏼‍🌾", "👨🏼‍🍳", "👨🏾‍🎓", "👩🏿‍🎤", "🧑🏼‍🏫", "👩🏻‍🏭", "👨🏻‍💻", "🧑🏿‍💼", "👨🏻‍💼", "👩🏻‍🔧", "👩🏽‍🔬", "👨🏼‍🎨", "🧑🏼‍🚒", "👩🏻‍✈️", "🧑🏽‍🚀", "🧑🏻‍⚖️", "🤵🏼‍♀️"];
                  break;
            case 'animals':
                  selected_emojis = ["🦆", "🦅", "🦇", "🦗", "🐢", "🐍", "🦎", "🦑", "🐬", "🐋", "🦈", "🐅", "🐆", "🦓", "🦍", "🦣", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🦬", "🐃", "🐂", "🐄", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🐈", "🐈‍⬛", "🐓", "🦃", "🦤", "🦜", "🦢", "🦩", "🐇", "🦝", "🦨", "🦡", "🦫", "🐿️", "🦔"];
                  break;
            case 'vehicles':
                  selected_emojis = ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛵", "🏍️", "🛺", "🚟", "🚃", "🚂", "🚁"];
                  break;
            case 'faces':
                  selected_emojis = ["👧🏻", "🧒🏼", "👦🏾", "👩🏾", "🧑🏻", "👨🏽", "👩🏾‍🦱", "🧑🏿‍🦱", "👨🏾‍🦱", "👩🏻‍🦰", "🧑🏼‍🦰", "👨🏻‍🦰", "👱🏽‍♀️", "👱🏼", "👱🏽‍♂️", "👩🏻‍🦳", "🧑🏽‍🦳", "👨🏼‍🦳", "👨🏿‍🦲", "🧔🏽‍♀️", "🧔🏾", "🧔🏻‍♂️", "👵🏻", "🧓🏼", "👴🏼"];
                  break;
            case 'nature':
                  selected_emojis = ["🏔️", "🌲", "🌳", "🌱", "🌿", "🍀", "🍂", "🍁", "🍄", "🪨", "🌾", "🌷", "🌹", "🌺", "🌸", "🌼", "🏵️", "🌻", "🪱", "🦋", "🐌", "🐞", "🪰", "🪲", "🪳", "🕷️", "🦂"];
                  break;
            case 'activities':
                  selected_emojis = ["⚽️", "🏀", "🏈", "⚾️", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🪃", "🥊", "⛸️", "🏹", "🪁", "🤿", "🥌", "🏆", "🎧", "🎹", "🎲", "♟️", "🎯", "🎳", "🎮", "🧩", "🃏", "🀄️", "🛼", "🎭", "🩰", "🎨", "🎬", "🎤", "🔫", "🏁"];
                  break;
            case 'objects':
                  selected_emojis = ["⌚️", "📱", "💻", "🖨️", "🕹️", "🗜️", "💾", "💿", "📼", "📷", "📹", "🎥", "☎️", "📺", "📻", "🧭", "⏲️", "⏰", "🕰️", "⏳", "🔋", "💡", "🔦", "🕯️", "🧯", "⚖️", "🪛", "🔧", "🔨", "🪚", "🔩", "⚙️", "🧲", "🪓", "🔪", "🔭", "🧹", "🪠", "🧻", "🧼", "🪥", "🪒", "🧽", "🪣", "🔑", "🗝️", "🧸", "🎁", "✉️", "📦", "🏷️", "🗒️", "📆", "🗑️", "📁", "📰", "📖", "🧷", "📎", "📐", "🧮", "📌", "✂️", "🖊️", "✒️", "🖌️", "🖍️", "✏️", "🔒", "🧤", "💍", "🎒", "🧳", "🕶️", "🌂", "📢", "🍼"];
                  break;
            case 'families':
                  selected_emojis = ["👨‍👩‍👦", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👩‍👩‍👧‍👧", "👨‍👨‍👦", "👨‍👨‍👧", "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👦‍👦", "👩‍👧‍👧", "👨‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👦‍👦", "👨‍👧‍👧"];
                  break;
            case 'time':
                  selected_emojis = ['🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦'];
                  break;
            case 'flags':
                  selected_emojis = ["🇺🇳", "🇦🇫", "🇦🇱", "🇩🇪", "🇦🇩", "🇦🇴", "🇦🇮", "🇦🇶", "🇦🇬", "🇸🇦", "🇮🇴", "🇩🇿", "🇦🇷", "🇦🇲", "🇦🇼", "🇦🇺", "🇦🇹", "🇦🇿", "🇧🇸", "🇧🇩", "🇧🇧", "🇧🇭", "🇧🇪", "🇧🇿", "🇧🇯", "🇧🇲", "🇧🇾", "🇧🇴", "🇧🇦", "🇧🇼", "🇧🇷", "🇧🇳", "🇧🇬", "🇧🇫", "🇧🇮", "🇧🇹", "🇨🇻", "🇰🇭", "🇨🇲", "🇨🇦", "🇮🇨", "🇧🇶", "🇶🇦", "🇹🇩", "🇨🇿", "🇨🇱", "🇨🇳", "🇨🇾", "🇻🇦", "🇨🇴", "🇰🇲", "🇨🇬", "🇰🇵", "🇰🇷", "🇨🇷", "🇨🇮", "🇭🇷", "🇨🇺", "🇨🇼", "🇩🇰", "🇩🇲", "🇪🇨", "🇪🇬", "🇸🇻", "🇦🇪", "🇪🇷", "🇸🇰", "🇸🇮", "🇪🇸", "🇺🇸", "🇪🇪", "🇸🇿", "🇪🇹", "🇵🇭", "🇫🇮", "🇫🇯", "🇫🇷", "🇬🇦", "🇬🇲", "🇬🇪", "🇬🇭", "🇬🇮", "🇬🇩", "🇬🇷", "🇬🇱", "🇬🇵", "🇬🇺", "🇬🇹", "🇬🇫", "🇬🇬", "🇬🇳", "🇬🇶", "🇬🇼", "🇬🇾", "🇭🇹", "🇭🇳", "🇭🇰", "🇭🇺", "🇮🇳", "🇮🇩", "🇮🇶", "🇮🇷", "🇮🇪", "🇮🇲", "🇨🇽", "🇳🇫", "🇮🇸", "🇦🇽", "🇰🇾", "🇨🇨", "🇨🇰", "🇫🇴", "🇬🇸", "🇫🇰", "🇲🇵", "🇲🇭", "🇵🇳", "🇸🇧", "🇹🇨", "🇻🇬", "🇻🇮", "🇮🇱", "🇮🇹", "🇯🇲", "🇯🇵", "🎌", "🇯🇪", "🇯🇴", "🇰🇿", "🇰🇪", "🇰🇬", "🇰🇮", "🇽🇰", "🇰🇼", "🇱🇦", "🇱🇸", "🇱🇻", "🇱🇧", "🇱🇷", "🇱🇾", "🇱🇮", "🇱🇹", "🇱🇺", "🇲🇴", "🇲🇰", "🇲🇬", "🇲🇾", "🇲🇼", "🇲🇻", "🇲🇱", "🇲🇹", "🇲🇦", "🇲🇶", "🇲🇺", "🇲🇷", "🇾🇹", "🇲🇽", "🇫🇲", "🇲🇩", "🇲🇨", "🇲🇳", "🇲🇪", "🇲🇸", "🇲🇿", "🇲🇲", "🇳🇦", "🇳🇷", "🇳🇵", "🇳🇮", "🇳🇪", "🇳🇬", "🇳🇺", "🇳🇴", "🇳🇨", "🇳🇿", "🇴🇲", "🇳🇱", "🇵🇰", "🇵🇼", "🇵🇦", "🇵🇬", "🇵🇾", "🇵🇪", "🇵🇫", "🇵🇱", "🇵🇹", "🇵🇷", "🇬🇧", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "🇨🇫", "🇨🇩", "🇩🇴", "🇷🇪", "🇷🇼", "🇷🇴", "🇷🇺", "🇪🇭", "🇼🇸", "🇦🇸", "🇧🇱", "🇰🇳", "🇸🇲", "🇵🇲", "🇻🇨", "🇸🇭", "🇱🇨", "🇸🇹", "🇸🇳", "🇷🇸", "🇸🇨", "🇸🇱", "🇸🇬", "🇸🇽", "🇸🇾", "🇸🇴", "🇱🇰", "🇿🇦", "🇸🇩", "🇸🇸", "🇸🇪", "🇨🇭", "🇸🇷", "🇹🇭", "🇹🇼", "🇹🇿", "🇹🇯", "🇹🇫", "🇵🇸", "🇹🇱", "🇹🇬", "🇹🇰", "🇹🇴", "🇹🇹", "🇹🇳", "🇹🇲", "🇹🇷", "🇹🇻", "🇺🇦", "🇺🇬", "🇪🇺", "🇺🇾", "🇺🇿", "🇻🇺", "🇻🇪", "🇻🇳", "🇼🇫", "🇾🇪", "🇩🇯", "🇿🇲", "🇿🇼"];
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

function ToggleMuted() {
      if (muted) {
            mute_button.firstElementChild.innerHTML = 'AUDIO: ON';
            audio_correct.muted = false;
            audio_wrong.muted = false;
            muted = false;
      }
      else {
            mute_button.firstElementChild.innerHTML = 'AUDIO: OFF';
            audio_correct.muted = true;
            audio_wrong.muted = true;
            muted = true;
      }

}

function ToggleFullscreen() {
      console.log(document.fullscreenElement);

      if (document.fullscreenElement == null) {
            // open fullscreen
            setTimeout(() => {
                  fullscreen_button.firstElementChild.innerHTML = 'EXIT FULLSCREEN';
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
                  fullscreen_button.firstElementChild.innerHTML = 'ENTER FULLSCREEN';
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
let seconds = 0;
let minutes = 0;

function TimerReset() {
      clearInterval(timerController);
	seconds = 0;
	minutos = 0;
	Seconds.innerHTML = ":00s";
	Minutes.innerHTML = "00";
}

function TimerStop() {
      clearInterval(timerController);
}

function TimerStart() {
	if (seconds < 59) {
		seconds ++;
		if (seconds < 10) { seconds = "0"+seconds }
		Seconds.innerHTML = ":"+seconds+"s";
	}
	if (seconds == 59) {
		seconds = -1;
	}
	if (seconds == 0) {
		minutes++;
		if (minutes < 10) { minutes = "0"+minutes }
		Minutes.innerHTML = minutes;
	}
	if (minutes == 59) {
		minutes = -1;
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