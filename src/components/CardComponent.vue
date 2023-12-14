<template>
    <div :class="['card-holder flex-grow flex justify-center cursor-pointer relative w-[200px] h-[240px]', props.flipped ? 'flipped' : '']">
        <img class="card-img front w-[200px] h-[240px]" :src="props.card.src" alt="front" />
        <img class="card-img back w-[200px] h-[240px] bg-[#111]" :src="props.cover" alt="cover" @click="handleClick"/>
    </div>
</template>

<script setup>
const props = defineProps(['card', 'cover', 'flipped', 'isDisabled'])
const emit = defineEmits(['handleClick'])

const handleClick = () => {
    if (props.isDisabled) return;
    emit('handleClick', props.card)
}


</script>

<style>
.card-holder:hover {
    animation: enlarge 1s infinite;
}

@keyframes enlarge {
  0%, 100% {
    transform: scale(1);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  25% {
    transform: scale(0.98);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(1.01);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }

  75% {
    transform: scale(0.98);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
}


.card-img {
    width: 100%;
    display: block;
    border: 2px solid #fff;
    border-radius: 6px;
    object-fit: cover;
}

.card-img.front {
    transform: rotateY(90deg);
    transition: all ease-in 0.2s;
    position: absolute;
}

.card-img.back {
    transition: all ease-in 0.2s;
    transition-delay: 0.2s;
}

.flipped .front {
    transform: rotateY(0deg);
    transition-delay: 0.2s;
}

.flipped .back {
    transform: rotateY(90deg);
    transition-delay: 0s;
}
</style>