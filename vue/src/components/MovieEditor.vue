<script setup lang="ts">
import { ref } from 'vue';
import type { Movie } from '../movies';
const props = defineProps<{ movies: Movie[]; saveError: string }>();
const emit = defineEmits<{ save: [movies: Movie[]]; cancel: [] }>();
const draft = ref(props.movies.map(movie => ({ ...movie })));
const error = ref('');

function submit() {
  if (draft.value.some(movie => !movie.title.trim())) {
    error.value = 'Please enter a movie title for every day.';
    return;
  }
  error.value = '';
  emit('save', draft.value.map(movie => ({ ...movie, title: movie.title.trim() })));
}
</script>

<template>
  <form class="movie-editor" aria-labelledby="editor-title" @submit.prevent="submit">
    <h2 id="editor-title">Choose your Christmas movies</h2>
    <p>This list reveals every surprise. Changes stay in this browser and can be saved until November 30.</p>
    <div class="editor-grid">
      <label v-for="movie in draft" :key="movie.day"><span>December {{ movie.day }}</span><input v-model="movie.title" type="text" required maxlength="120"/></label>
    </div>
    <p v-if="error || saveError" role="alert">{{ error || saveError }}</p>
    <div class="editor-actions"><button class="save-button" type="submit">Save movies</button><button class="secondary-button" type="button" @click="emit('cancel')">Cancel</button></div>
  </form>
</template>
