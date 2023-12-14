<template>
    <div id="side-nav" class="fixed min-h-screen z-10 min-w-[250px] bg-gray-800 border-r text-white">
        <div class="p-5 flex items-center justify-between text-xl">
            <span>
                <i class="bi bi-award-fill me-2 text-purple-500 shadow-sm"></i>
                <span class="text-center">Leaderboard</span>
            </span>
            <i class="bi bi-list cursor-pointer" @click="toggleNav"></i>
        </div>
        <div id="leaderboard" class="max-h-[800px] overflow-y-scroll">
            <table class="w-full">
                <thead>
                    <tr>
                        <td class="py-2 px-4 border-b">Name</td>
                        <td class="py-2 px-4 border-b">Flips</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="board in props.leaderboard" :key="board">
                        <td class="py-2 px-4 name">
                            {{ board.name }}
                        </td>
                        <td class="py-2 px-4 flips">{{ board.flips }}</td>
                    </tr>
                </tbody>

            </table>
        </div>
    </div>
</template>

<script setup>
import { useToggleNav } from "@/lib/toggleNav";

const props = defineProps(['leaderboard']);

const { toggleNav } = useToggleNav();

</script>

<style>
/* width */
#leaderboard::-webkit-scrollbar {
    width: 4px;
}

/* Track */
#leaderboard::-webkit-scrollbar-track {
    background: #f1f1f1;
}

/* Handle */
#leaderboard::-webkit-scrollbar-thumb {
    @apply bg-slate-600;
}

/* Handle on hover */
#leaderboard::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>