<template>
    <div class="card mb-4 shadow-sm filter-card">
        <div class="card-body">
            <div class="row g-3">
                <!-- Search Input -->
                <div class="col-md-3 input-group-animated">
                    <label class="form-label fw-semibold label-float" style="color: var(--neutral-700);">
                        <span class="label-icon">🔍</span> Search
                    </label>
                    <div class="input-group custom-input-group">
                        <span class="input-group-text input-icon">🔎</span>
                        <input v-model="filters.search" @input="updateFilters" type="text"
                            class="form-control custom-input" placeholder="Title or composer...">
                        <div class="input-focus-border"></div>
                    </div>
                </div>

                <!-- Category Select -->
                <div class="col-md-3 select-animated">
                    <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                        <span class="label-icon">🏷️</span> Category
                    </label>
                    <div class="select-wrapper">
                        <select v-model="filters.category" @change="updateFilters" class="form-select custom-select">
                            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                        <div class="select-arrow">▼</div>
                    </div>
                </div>

                <!-- Instrument Select -->
                <div class="col-md-2 select-animated">
                    <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                        <span class="label-icon">🎹</span> Instrument
                    </label>
                    <div class="select-wrapper">
                        <select v-model="filters.instrument" @change="updateFilters" class="form-select custom-select">
                            <option v-for="inst in instruments" :key="inst" :value="inst">{{ inst }}</option>
                        </select>
                        <div class="select-arrow">▼</div>
                    </div>
                </div>

                <!-- Difficulty Select -->
                <div class="col-md-2 select-animated">
                    <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                        <span class="label-icon">📊</span> Difficulty
                    </label>
                    <div class="select-wrapper">
                        <select v-model="filters.difficulty" @change="updateFilters" class="form-select custom-select">
                            <option v-for="diff in difficulties" :key="diff" :value="diff">{{ diff }}</option>
                        </select>
                        <div class="select-arrow">▼</div>
                    </div>
                </div>

                <!-- Reset Button -->
                <div class="col-md-2 d-flex align-items-end">
                    <button @click="resetFilters" class="btn w-100 reset-btn"
                        :class="{ 'has-filters': hasActiveFilters }"
                        style="background: var(--neutral-100); color: var(--neutral-600); border: 1px solid var(--neutral-200);">
                        <span class="reset-icon">↺</span>
                        <span class="reset-text">Reset</span>
                    </button>
                </div>
            </div>

            <!-- Quick Tags -->
            <div class="mt-3 d-flex gap-2 flex-wrap align-items-center tag-section">
                <span class="small fw-medium" style="color: var(--neutral-500);">Quick tags:</span>
                <TransitionGroup name="tag-bounce" tag="div" class="d-flex gap-2 flex-wrap">
                    <span v-for="tag in commonTags" :key="tag" @click="toggleTag(tag)" class="badge quick-tag"
                        :class="filters.tags.includes(tag) ? 'active-tag' : 'inactive-tag'">
                        {{ tag }}
                        <span v-if="filters.tags.includes(tag)" class="check-mark">✓</span>
                    </span>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { categories, instruments, difficulties } from '../data/sheetMusicData.js';

const emit = defineEmits(['update:modelValue']);

const commonTags = ["Famous", "Teaching", "Romantic", "Wedding", "Atmospheric", "Jazz"];

const filters = reactive({
    search: '',
    category: 'All',
    instrument: 'All',
    difficulty: 'All',
    tags: []
});

const hasActiveFilters = computed(() => {
    return filters.search !== '' ||
        filters.category !== 'All' ||
        filters.instrument !== 'All' ||
        filters.difficulty !== 'All' ||
        filters.tags.length > 0;
});

const updateFilters = () => {
    emit('update:modelValue', { ...filters });
};

const toggleTag = (tag) => {
    const index = filters.tags.indexOf(tag);
    if (index > -1) {
        filters.tags.splice(index, 1);
    } else {
        filters.tags.push(tag);
    }
    updateFilters();
};

const resetFilters = () => {
    filters.search = '';
    filters.category = 'All';
    filters.instrument = 'All';
    filters.difficulty = 'All';
    filters.tags = [];
    updateFilters();
};
</script>

<style scoped>
@import '../styles/colors.css';

.filter-card {
    background: white;
    border: 1px solid var(--neutral-200);
    border-radius: 16px;
    animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: top;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.label-float {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: fadeInLeft 0.5s ease-out forwards;
    opacity: 0;
}

.label-icon {
    display: inline-block;
    animation: bounce 2s infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-3px);
    }
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.input-group-animated,
.select-animated {
    animation: fadeInUp 0.5s ease-out forwards;
    opacity: 0;
}

.input-group-animated:nth-child(1) {
    animation-delay: 0.1s;
}

.select-animated:nth-child(2) {
    animation-delay: 0.2s;
}

.select-animated:nth-child(3) {
    animation-delay: 0.3s;
}

.select-animated:nth-child(4) {
    animation-delay: 0.4s;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.custom-input-group {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
}

.custom-input {
    border: 2px solid var(--neutral-200);
    transition: all 0.3s ease;
    background: var(--neutral-50);
    position: relative;
    z-index: 1;
}

.custom-input:focus {
    background: white;
    border-color: var(--primary-400);
    box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
}

.input-focus-border {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-500), var(--secondary-500));
    transition: all 0.3s ease;
    transform: translateX(-50%);
}

.custom-input:focus~.input-focus-border {
    width: 100%;
}

.input-icon {
    transition: all 0.3s ease;
    background: var(--neutral-100);
    color: var(--neutral-500);
    border: 2px solid var(--neutral-200);
    border-right: none;
}

.custom-input:focus~.input-icon {
    background: var(--primary-500);
    color: white;
    border-color: var(--primary-500);
}

.select-wrapper {
    position: relative;
}

.custom-select {
    appearance: none;
    border: 2px solid var(--neutral-200);
    border-radius: 10px;
    padding-right: 2rem;
    transition: all 0.3s ease;
    cursor: pointer;
    background: var(--neutral-50);
    color: var(--neutral-700);
}

.custom-select:hover {
    border-color: var(--primary-400);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.1);
    background: white;
}

.custom-select:focus {
    border-color: var(--primary-500);
    box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.1);
    background: white;
}

.select-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    transition: all 0.3s ease;
    color: var(--neutral-400);
    font-size: 0.7rem;
}

.select-wrapper:hover .select-arrow {
    color: var(--primary-500);
    transform: translateY(-50%) rotate(180deg);
}

.reset-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 10px;
    font-weight: 500;
}

.reset-btn.has-filters {
    background: linear-gradient(135deg, var(--tertiary-500) 0%, var(--tertiary-600) 100%) !important;
    color: white !important;
    border-color: var(--tertiary-500) !important;
    animation: pulse 2s infinite;
}

@keyframes pulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4);
    }

    50% {
        box-shadow: 0 0 0 10px rgba(244, 63, 94, 0);
    }
}

.reset-icon {
    display: inline-block;
    transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.reset-btn:hover .reset-icon {
    transform: rotate(360deg);
}

.tag-section {
    animation: fadeIn 0.5s ease-out 0.5s forwards;
    opacity: 0;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}

.quick-tag {
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: relative;
    overflow: hidden;
    padding: 0.5em 1em;
    border: none;
    font-weight: 500;
}

.quick-tag.inactive-tag {
    background: var(--neutral-100);
    color: var(--neutral-600);
}

.quick-tag.inactive-tag:hover {
    background: var(--primary-100);
    color: var(--primary-700);
    transform: translateY(-2px) scale(1.05);
}

.quick-tag.active-tag {
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    color: white;
    padding-right: 2em;
    box-shadow: var(--shadow-primary);
}

.quick-tag:hover {
    transform: translateY(-2px);
}

.check-mark {
    position: absolute;
    right: 0.5em;
    top: 50%;
    transform: translateY(-50%);
    animation: checkPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes checkPop {
    from {
        opacity: 0;
        transform: translateY(-50%) scale(0);
    }

    to {
        opacity: 1;
        transform: translateY(-50%) scale(1);
    }
}

/* Tag Transition Group */
.tag-bounce-enter-active,
.tag-bounce-leave-active {
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.tag-bounce-enter-from,
.tag-bounce-leave-to {
    opacity: 0;
    transform: scale(0) rotate(180deg);
}

.tag-bounce-move {
    transition: transform 0.4s ease;
}
</style>