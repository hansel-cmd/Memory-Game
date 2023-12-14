<template>
    <div class="min-h-screen fixed top-0 left-0 w-full bg-black bg-opacity-75">
        <div
            class="rounded-lg p-5 w-[370px] lg:w-[500px] min-h-[250px] absolute z-20 mt-20 top-0 left-1/2 -translate-x-1/2 bg-slate-800 border border-gray-400 text-white">
            <header>
                <h1 class="text-2xl font-semibold">Congratulations!</h1>
            </header>
            <div class="mt-4">
                <p class="text-lg mb-4">
                    An atonishing feat! With <span class="font-semibold text-purple-400">{{ props.flips }}</span> flips, you
                    have sucessfully unveiled all pairs!
                </p>
                <p class="pt-2 mb-2 text-center">Input your name to join the ranks on the leaderboard.</p>
                <form @submit.prevent="handleSubmit">
                    <div>
                        <input v-model="name" type="text"
                            class="block mx-auto w-3/4 bg-transparent border-b outline-none text-2xl text-purple-400">
                        <span class="text-sm text-red-600 block mx-auto w-3/4 mt-2">{{ error }}</span>
                    </div>
                    <button type="submit"
                        class="border border-white bg-purple-800 hover:bg-purple-900 p-2 mt-4 mx-auto block w-3/4">Submit
                        Name</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const props = defineProps(['flips', 'show', 'leaderboard']);
const emit = defineEmits(['hideModal'])
const name = ref('');
const error = ref(null);

function generateShortUUID() {
    return 'xxxx'.replace(/x/g, function () {
        return (Math.random() * 16 | 0).toString(16);
    });
}

function insertSorted(arr, element) {
    const index = arr.findIndex(
        (el) => el.flips > element.flips ||
            (el.flips === element.flips && el.name.localeCompare(element.name) > 0));

    // If index is -1, it means the element is greater than all existing elements, so push it to the end.
    const insertIndex = index !== -1 ? index : arr.length;

    // Use splice to insert the element at the found index
    arr.splice(insertIndex, 0, element);
    return [...arr];
}

const handleSubmit = () => {
    if (name.value === '') {
        error.value = 'This field is required.'
        return;
    }
    error.value = null;
    let user = {
        id: generateShortUUID(),
        name: name.value,
        flips: props.flips
    };
    const lb = insertSorted([...props.leaderboard], user);
    emit('hideModal', lb);

    setTimeout(() => {
        name.value = '';
    }, 500);
}

</script>

<style lang="scss" scoped></style>