<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import Calendar from './components/Calendar.vue';
import Countdown from './components/Countdown.vue';
import MovieEditor from './components/MovieEditor.vue';
import type { Movie } from './movies';
import { getCalendarDate, getAvailableDay, isSimulated } from './date';
import { readOpenedDays, storageKey, readMovies, moviesKey } from './storage';

const date = ref(getCalendarDate());
const year = computed(() => date.value.getFullYear());
const availableDay = computed(() => getAvailableDay(date.value));
const canEdit = computed(() => date.value.getMonth() < 11);
const today = computed(() => date.value.getMonth() === 11 ? date.value.getDate() : null);
const openDay = ref<number | null>(null);
const openedDays = ref(readOpenedDays(year.value));
const movies = ref(readMovies(year.value));
const editing = ref(false);
const movieMessage = ref('');
const saveError = ref('');
const storageFailed = ref(false);
const visibleDay = computed(() => openDay.value !== null && openDay.value <= availableDay.value ? openDay.value : null);
let timer: number;
onMounted(() => { timer = window.setInterval(() => { date.value = getCalendarDate(); }, 30_000); });
onUnmounted(() => window.clearInterval(timer));

watch(year, newYear => {
  openedDays.value = readOpenedDays(newYear);
  movies.value = readMovies(newYear);
  openDay.value = null;
  editing.value = false;
  movieMessage.value = '';
  saveError.value = '';
});
watch(openedDays, days => {
  try {
    localStorage.setItem(storageKey(year.value), JSON.stringify(days));
    storageFailed.value = false;
  } catch {
    storageFailed.value = true;
  }
}, { immediate: true });

function toggleDoor(day: number) {
  if (day > availableDay.value) return;
  openDay.value = openDay.value === day ? null : day;
  if (!openedDays.value.includes(day)) openedDays.value = [...openedDays.value, day];
}
function startEditing() {
  editing.value = true;
  movieMessage.value = '';
  saveError.value = '';
}
function saveMovies(nextMovies: Movie[]) {
  if (getCalendarDate().getMonth() === 11) {
    editing.value = false;
    movieMessage.value = 'Editing is closed for December. Your saved movies are unchanged.';
    return;
  }
  try {
    localStorage.setItem(moviesKey(year.value), JSON.stringify(nextMovies));
    movies.value = nextMovies;
    editing.value = false;
    movieMessage.value = 'Movies saved in this browser. Your Christmas surprises are ready.';
  } catch {
    saveError.value = 'Your movies could not be saved. Check that browser storage is available and try again.';
  }
}
</script>

<template>
  <main>
    <header class="masthead"><span class="brand"><span aria-hidden="true">✳</span> THE CHRISTMAS COLLECTION</span><span class="edition">DECEMBER · {{ year }}</span></header>
    <section class="intro" aria-labelledby="page-title">
      <p class="eyebrow">24 DOORS. 24 MOVIE NIGHTS.</p>
      <h1 id="page-title">A very merry<br/><em>movie countdown.</em></h1>
      <p class="intro-copy">Get cozy. Pick a door. Let a little Christmas magic in.</p>
      <Countdown :date="date"/>
    </section>
    <section class="calendar-section" aria-label="Christmas movie advent calendar">
      <div class="calendar-heading"><div><h2>Your advent calendar</h2><p>One surprise a day, December 1–24.</p></div><div class="legend"><span><i class="available-dot"/> Available</span><span>✓ Opened</span><span><i class="lock"/> Locked</span></div></div>
      <div class="movie-settings"><p>{{ canEdit ? 'Make it your own: choose your movies before December 1.' : 'The movie list is set. Editing is closed during December.' }}</p><button v-if="canEdit && !editing" class="secondary-button" @click="startEditing">Edit movies</button></div>
      <MovieEditor v-if="editing && canEdit" :movies="movies" :save-error="saveError" @save="saveMovies" @cancel="editing = false"/>
      <p v-if="movieMessage" role="status">{{ movieMessage }}</p>
      <Calendar :movies="movies" :available-day="availableDay" :today="today" :open-day="visibleDay" :opened-days="openedDays" @toggle="toggleDoor"/>
      <div class="calendar-foot"><span>{{ openedDays.length }} of 24 surprises discovered</span><span>Good films. Warm blankets. Christmas together.</span></div>
      <p v-if="storageFailed" role="status">Your browser couldn’t save opened days. You can still use the calendar.</p>
    </section>
    <footer><span aria-hidden="true">✧</span> A little tradition. A lot of Christmas.</footer>
    <p v-if="isSimulated" class="development-note">Development preview · {{ date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) }} · Change DEVELOPMENT_MODE in src/date.ts to test editing or use today.</p>
  </main>
</template>
