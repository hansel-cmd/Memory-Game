<template>
  <div class="flex">
    <SideNav :leaderboard="leaderboard"></SideNav>
    <div class="flex-grow">
      <div class="flex flex-col items-center justify-center p-5">
        <div class="flex items-center justify-center w-full">
          <i class="bi bi-list text-white cursor-pointer text-3xl" @click="toggleNav"></i>
          <h1 class="text-white text-3xl flex-grow text-center me-7">Mæmory Game</h1>
        </div>

        <div v-if="isPickingGenre">
          <h1 class="text-white flex-grow text-center mt-2">Choose Round Genre: </h1>
          <button class="bg-purple-800 hover:bg-purple-900 p-2 mt-3 text-white border border-white mx-2"
            @click="startGame(AESPA)">
            aespa cards
          </button>
          <button class="bg-purple-800 hover:bg-purple-900 p-2 mt-3 text-white border border-white mx-2"
            @click="startGame(TALES_SERIES)">
            tales series
          </button>
          <button class="bg-purple-800 hover:bg-purple-900 p-2 mt-3 text-white border border-white mx-2"
            @click="startGame(GAME_ITEM)">
            game items
          </button>
        </div>

        <button v-if="!isPickingGenre && !start"
          class="bg-purple-800 hover:bg-purple-900 p-2 mt-4 text-white border border-white" @click="pickGenre">
          PICK GENRE TO START GAME
        </button>
        <button v-else-if="!isPickingGenre && start"
          class="bg-purple-800 hover:bg-purple-900 p-2 mt-4 text-white border border-white" @click="restartGame">
          Restart Game
        </button>
      </div>
      <transition-group name="bounce">
        <div v-if="start" class="flex flex-wrap gap-5 m-auto lg:w-[1000px] min-h-[500px] p-5  text-white">
          <Card v-for="card in cards" :key="card" :card="card" :flipped="isFlipped(card)" :cover="cover"
            :isDisabled="isDisabled" @handleClick="handleClick"></Card>
        </div>
      </transition-group>

      <div v-if="start" class="flex items-center justify-center p-5">
        <h1 class="text-white text-3xl">Number of Flips: {{ flips }}</h1>
      </div>
      <Transition name="fade">
        <Modal v-if="show" :flips="flips" :leaderboard="leaderboard" @hideModal="hideModal"></Modal>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import Card from "@/components/CardComponent.vue";
import Modal from "@/components/ModalComponent.vue";
import SideNav from "@/components/SideNavComponent.vue";
import {
  AESPA_CARDS,
  GAME_ITEM_CARDS,
  TALES_SERIES_CARDS,
  COVERS,
  AESPA,
  GAME_ITEM,
  TALES_SERIES,
} from "@/lib/cards";
import { ref, watch } from "vue";
import { useToggleNav } from "@/lib/toggleNav";

const shuffleCards = (cards) => {
  const shuffledCards = [...cards, ...cards].sort(() => Math.random() - 0.5)
    .map(card => ({ ...card, id: Math.random() }));
  return shuffledCards;
}

const cover = ref(COVERS[AESPA])
const cards = ref(shuffleCards(AESPA_CARDS));
const totalCards = cards.value.length;

const { toggleNav } = useToggleNav();


const leaderboard = ref(JSON.parse(localStorage.getItem('leaderboard')) || []);

watch(leaderboard, () => {
  // every time leaderboard changes, we update local storage.
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard.value));
})

const choiceOne = ref(null);
const choiceTwo = ref(null);
const flips = ref(0);
const show = ref(false);
const isDisabled = ref(true);
const start = ref(false);
const isPickingGenre = ref(false);


const pickGenre = () => {
  isPickingGenre.value = true;
}

const startGame = (value = GAME_ITEM) => {
  if (value === AESPA) {
    cards.value = shuffleCards(AESPA_CARDS);
    cover.value = COVERS[AESPA];
  } else if (value === GAME_ITEM) {
    cards.value = shuffleCards(GAME_ITEM_CARDS);
    cover.value = COVERS[GAME_ITEM];
  } else if (value === TALES_SERIES) {
    cards.value = shuffleCards(TALES_SERIES_CARDS);
    cover.value = COVERS[TALES_SERIES];
  }
  isPickingGenre.value = false;
  isDisabled.value = false;
  start.value = true;
}

const restartGame = () => {
  choiceOne.value = null;
  choiceTwo.value = null;
  flips.value = 0;
  show.value = false;
  start.value = false;
  isPickingGenre.value = true;
}

const hideModal = (board) => {
  leaderboard.value = board;
  show.value = false;
}

const handleClick = (card) => {
  // if the same card is clicked, do nothing
  if (card.id === choiceOne.value?.id) return;

  // disable click
  isDisabled.value = true;

  // enable click after a delay so we avoid clicking multiple items
  setTimeout(() => {
    isDisabled.value = false;
  }, 1000);

  // if choice one is null
  if (!choiceOne.value) choiceOne.value = card;
  else choiceTwo.value = card;
}

const resetTurn = () => {
  choiceOne.value = null;
  choiceTwo.value = null;
}

const isFlipped = (card) => {
  if (card.id === choiceOne.value?.id) return true;
  if (card.id === choiceTwo.value?.id) return true;
  return card.matched;
}


watch(cards, () => {
  // check how many are matched and update
  const total = cards.value.reduce((acc, card) => {
    if (card.matched) return acc + 1;
    return acc;
  }, 0);

  if (total === totalCards) {
    show.value = true;
  }
})


watch([choiceOne, choiceTwo], () => {

  // both needs to be clicked before we check matches.
  if (choiceOne.value && choiceTwo.value) {

    // check if both are matched.
    if (choiceOne.value.name === choiceTwo.value?.name) {
      console.log('THEY ARE MATCH, WOAW');

      // add delay so second card has time to be flipped
      setTimeout(() => {
        cards.value = cards.value.map(card => {
          if (card.name === choiceOne.value.name) {
            return { ...card, matched: true };
          }
          return card;
        });

        resetTurn();
      }, 1000);
    } else {
      // add delay before we flip both cards
      setTimeout(() => {
        resetTurn();
      }, 1000);
    }

    flips.value += 1;
  }


})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}


.shuffle-enter-active,
.shuffle-leave-active {
  transition: transform 20000ms ease;
}

.shuffle-enter,
.shuffle-leave-to {
  transform: translateY(100);
}

.name,
.flips {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;

}
</style>