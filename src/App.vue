<template>
  <div class="min-vh-100 bg-neutral-50 overflow-hidden">
    <!-- Animated Navbar with Primary Gradient -->
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top slide-down" style="background: var(--gradient-primary);">
      <div class="container">
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2 brand-link" href="#">
          <span class="music-icon">🎼</span>
          <span class="brand-text">Sheet Music Archive</span>
        </a>
        <div class="d-flex gap-2">
          <button class="btn btn-light btn-sm pulse-hover text-primary fw-semibold" data-bs-toggle="modal"
            data-bs-target="#addSheetModal" style="background: white; border: none;">
            <span class="plus-icon">+</span> Add New
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container py-4">
      <!-- Animated Stats Row with Harmony Accents -->
      <div class="row mb-4 stagger-children">
        <div class="col-md-3" v-for="(stat, index) in stats" :key="stat.label">
          <div class="card text-center border-0 shadow-sm stat-card float-hover" :class="`accent-border-${index}`"
            :style="{ animationDelay: `${index * 100}ms` }">
            <div class="card-body">
              <h3 class="mb-0 counter-animation" :class="`text-accent-${index}`">{{ stat.value }}</h3>
              <small class="text-neutral-500 text-uppercase letter-spacing fw-semibold">{{ stat.label }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Animated Filter Bar -->
      <div class="filter-wrapper slide-up">
        <FilterBar v-model="filters" />
      </div>

      <!-- Results Header -->
      <div class="d-flex justify-content-between align-items-center mb-3 fade-in">
        <h5 class="mb-0 d-flex align-items-center gap-2 text-neutral-800">
          <span class="library-icon">📚</span>
          <span class="fw-semibold">Library</span>
        </h5>
        <span class="badge badge-harmony badge-pulse">{{ filteredSheets.length }} items</span>
      </div>

      <!-- Animated Sheet Music Grid -->
      <TransitionGroup name="card-list" tag="div" class="row" appear>
        <SheetMusicCard v-for="(sheet, index) in filteredSheets" :key="sheet.id" :sheet="sheet"
          :style="{ animationDelay: `${index * 50}ms` }" @view="viewDetails" @edit="editSheet" class="card-enter" />
      </TransitionGroup>

      <!-- Empty State -->
      <Transition name="fade-scale">
        <div v-if="filteredSheets.length === 0" class="text-center py-5 empty-state">
          <div class="empty-icon bounce">🎵</div>
          <h4 class="text-neutral-600 slide-up-text">No sheet music found</h4>
          <p class="text-neutral-400 fade-in-text">Try adjusting your filters or add new pieces to your library.</p>
          <button class="btn btn-harmony-primary mt-3 btn-hover-lift" @click="resetFilters">
            Clear Filters
          </button>
        </div>
      </Transition>
    </div>

    <!-- Modals -->
    <AddSheetModal @add="addNewSheet" />

    <!-- View Details Modal -->
    <div class="modal fade" id="viewModal" tabindex="-1" ref="viewModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-enter border-0" v-if="selectedSheet">
          <div class="modal-header text-white position-relative overflow-hidden"
            :class="difficultyClass(selectedSheet.difficulty)">
            <h5 class="modal-title fw-semibold">{{ selectedSheet.title }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body bg-neutral-50">
            <div class="row slide-up-content">
              <div class="col-md-6">
                <p class="text-neutral-700"><strong class="text-neutral-900">Composer:</strong> {{
                  selectedSheet.composer }}</p>
                <p class="text-neutral-700"><strong class="text-neutral-900">Year:</strong> {{ selectedSheet.year }}</p>
                <p class="text-neutral-700"><strong class="text-neutral-900">Key:</strong>
                  <span class="badge bg-neutral-200 text-neutral-700 ms-1">{{ selectedSheet.key }}</span>
                </p>
              </div>
              <div class="col-md-6">
                <p class="text-neutral-700"><strong class="text-neutral-900">Instrument:</strong>
                  <span class="text-secondary-600 fw-semibold">{{ selectedSheet.instrument }}</span>
                </p>
                <p class="text-neutral-700"><strong class="text-neutral-900">Difficulty:</strong>
                  <span :class="`text-${difficultyColor(selectedSheet.difficulty)}`">{{ selectedSheet.difficulty
                  }}</span>
                </p>
                <p class="text-neutral-700"><strong class="text-neutral-900">Pages:</strong> {{ selectedSheet.pages }}
                </p>
              </div>
            </div>
            <hr class="border-neutral-200">
            <div class="fade-in-tags">
              <p class="text-neutral-700"><strong class="text-neutral-900">Category:</strong>
                <span class="badge bg-primary-100 text-primary-700 border border-primary-200">{{ selectedSheet.category
                }}</span>
              </p>
              <p class="text-neutral-700"><strong class="text-neutral-900">Tags:</strong>
                <span v-for="(tag, idx) in selectedSheet.tags" :key="tag"
                  class="badge bg-tertiary-100 text-tertiary-700 border border-tertiary-200 me-1 tag-pop"
                  :style="{ animationDelay: `${idx * 50}ms` }">
                  {{ tag }}
                </span>
              </p>
            </div>
            <p class="text-neutral-400 small mt-3 archived-date">Archived: {{ selectedSheet.archivedDate }}</p>
          </div>
          <div class="modal-footer bg-white border-top-0">
            <button type="button" class="btn btn-neutral-200 text-neutral-700" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-harmony-primary btn-hover-lift">Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { Modal } from 'bootstrap';
import FilterBar from './components/FilterBar.vue';
import SheetMusicCard from './components/SheetMusicCard.vue';
import AddSheetModal from './components/AddSheetModal.vue';
import { sheetMusicCollection } from './data/sheetMusicData.js';

const sheets = ref([...sheetMusicCollection]);
const filters = reactive({
  search: '',
  category: 'All',
  instrument: 'All',
  difficulty: 'All',
  tags: []
});
const selectedSheet = ref(null);

const filteredSheets = computed(() => {
  return sheets.value.filter(sheet => {
    const matchesSearch = !filters.search ||
      sheet.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      sheet.composer.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory = filters.category === 'All' || sheet.category === filters.category;
    const matchesInstrument = filters.instrument === 'All' || sheet.instrument === filters.instrument;
    const matchesDifficulty = filters.difficulty === 'All' || sheet.difficulty === filters.difficulty;

    const matchesTags = filters.tags.length === 0 ||
      filters.tags.every(tag => sheet.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesInstrument && matchesDifficulty && matchesTags;
  });
});

const stats = computed(() => [
  { label: 'Total Pieces', value: sheets.value.length },
  { label: 'Composers', value: new Set(sheets.value.map(s => s.composer)).size },
  { label: 'Categories', value: new Set(sheets.value.map(s => s.category)).size },
  { label: 'Instruments', value: new Set(sheets.value.map(s => s.instrument)).size }
]);

const addNewSheet = (newSheet) => {
  sheets.value.unshift(newSheet);
};

const viewDetails = (sheet) => {
  selectedSheet.value = sheet;
  const modal = new Modal(document.getElementById('viewModal'));
  modal.show();
};

const editSheet = (sheet) => {
  alert(`Edit functionality for "${sheet.title}" would open here`);
};

const resetFilters = () => {
  filters.search = '';
  filters.category = 'All';
  filters.instrument = 'All';
  filters.difficulty = 'All';
  filters.tags = [];
};

const difficultyClass = (diff) => {
  const classes = {
    'Beginner': 'bg-success',
    'Intermediate': 'bg-warning',
    'Advanced': 'bg-danger',
    'Virtuoso': 'bg-neutral-800'
  };
  return classes[diff] || 'bg-neutral-600';
};

const difficultyColor = (diff) => {
  const colors = {
    'Beginner': 'success',
    'Intermediate': 'warning',
    'Advanced': 'danger',
    'Virtuoso': 'neutral-800'
  };
  return colors[diff] || 'neutral-600';
};
</script>

<style>
@import './styles/colors.css';

/* Harmony Color Utilities */
.text-accent-0 {
  color: var(--primary-600) !important;
}

.text-accent-1 {
  color: var(--secondary-600) !important;
}

.text-accent-2 {
  color: var(--tertiary-600) !important;
}

.text-accent-3 {
  color: var(--info) !important;
}

.accent-border-0 {
  border-top: 4px solid var(--primary-500) !important;
}

.accent-border-1 {
  border-top: 4px solid var(--secondary-500) !important;
}

.accent-border-2 {
  border-top: 4px solid var(--tertiary-500) !important;
}

.accent-border-3 {
  border-top: 4px solid var(--info) !important;
}

.bg-primary-50 {
  background-color: var(--primary-50) !important;
}

.bg-primary-100 {
  background-color: var(--primary-100) !important;
}

.bg-primary-200 {
  background-color: var(--primary-200) !important;
}

.bg-primary-700 {
  background-color: var(--primary-700) !important;
}

.bg-secondary-100 {
  background-color: var(--secondary-100) !important;
}

.bg-secondary-600 {
  background-color: var(--secondary-600) !important;
}

.bg-tertiary-100 {
  background-color: var(--tertiary-100) !important;
}

.bg-tertiary-700 {
  background-color: var(--tertiary-700) !important;
}

.bg-neutral-50 {
  background-color: var(--neutral-50) !important;
}

.bg-neutral-100 {
  background-color: var(--neutral-100) !important;
}

.bg-neutral-200 {
  background-color: var(--neutral-200) !important;
}

.bg-neutral-800 {
  background-color: var(--neutral-800) !important;
}

.text-primary-700 {
  color: var(--primary-700) !important;
}

.text-secondary-600 {
  color: var(--secondary-600) !important;
}

.text-tertiary-700 {
  color: var(--tertiary-700) !important;
}

.text-neutral-400 {
  color: var(--neutral-400) !important;
}

.text-neutral-500 {
  color: var(--neutral-500) !important;
}

.text-neutral-600 {
  color: var(--neutral-600) !important;
}

.text-neutral-700 {
  color: var(--neutral-700) !important;
}

.text-neutral-800 {
  color: var(--neutral-800) !important;
}

.text-neutral-900 {
  color: var(--neutral-900) !important;
}

.border-primary-200 {
  border-color: var(--primary-200) !important;
}

.border-tertiary-200 {
  border-color: var(--tertiary-200) !important;
}

.border-neutral-200 {
  border-color: var(--neutral-200) !important;
}

/* Harmony Buttons */
.btn-harmony-primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: var(--shadow-primary);
}

.btn-harmony-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  color: white;
}

.btn-neutral-200 {
  background-color: var(--neutral-200);
  border: none;
  color: var(--neutral-700);
  transition: all 0.3s ease;
}

.btn-neutral-200:hover {
  background-color: var(--neutral-300);
  color: var(--neutral-800);
}

/* Badge Harmony */
.badge-harmony {
  background: var(--gradient-warm);
  color: white;
  font-weight: 500;
  padding: 0.5em 1em;
  border-radius: 20px;
}

/* Success/Warning/Danger with harmony */
.bg-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
}

.bg-warning {
  background: linear-gradient(135deg, var(--secondary-400) 0%, var(--secondary-600) 100%) !important;
  color: white !important;
}

.bg-danger {
  background: linear-gradient(135deg, var(--tertiary-500) 0%, var(--tertiary-700) 100%) !important;
}

/* Navbar Animation */
.slide-down {
  animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-shadow: 0 4px 20px rgba(30, 64, 175, 0.3);
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.brand-text {
  background: linear-gradient(90deg, #fff, #bfdbfe, #fff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: 200% center;
  }
}

/* Stats Cards */
.stat-card {
  background: white;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.float-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}

/* Filter Animation */
.filter-wrapper {
  animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

@keyframes slideUpFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Card List Transitions */
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.card-list-move {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-enter {
  animation: cardEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(40px) rotateX(10deg);
  }

  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

/* Empty State */
.empty-icon {
  font-size: 4rem;
  display: inline-block;
  animation: bounce 2s infinite;
  color: var(--primary-300);
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

/* Modal */
.modal-enter {
  animation: modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  border-radius: 16px;
  overflow: hidden;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.tag-pop {
  animation: tagPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
}

@keyframes tagPop {
  from {
    opacity: 0;
    transform: scale(0) rotate(-10deg);
  }

  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

/* Button Effects */
.btn-hover-lift {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.btn-hover-lift::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-hover-lift:hover {
  transform: translateY(-2px);
}

.btn-hover-lift:hover::before {
  left: 100%;
}

/* Pulse Animation */
.badge-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
  }

  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--neutral-100);
}

::-webkit-scrollbar-thumb {
  background: var(--neutral-400);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-500);
}
</style>