<template>
    <div class="modal fade" id="addSheetModal" tabindex="-1" ref="modal">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content modal-animated border-0">
                <!-- Header with Primary Gradient -->
                <div class="modal-header text-white position-relative overflow-hidden"
                    style="background: var(--gradient-primary);">
                    <h5 class="modal-title d-flex align-items-center gap-2 fw-semibold">
                        <span class="modal-icon">🎼</span>
                        <span class="title-text">Add New Sheet Music</span>
                    </h5>
                    <button type="button" class="btn-close btn-close-white close-animated"
                        data-bs-dismiss="modal"></button>
                    <div class="header-shine"></div>
                </div>

                <!-- Body -->
                <div class="modal-body" style="background: var(--neutral-50);">
                    <form @submit.prevent="submitForm" class="form-animated">
                        <div class="row g-3">
                            <!-- Title -->
                            <div class="col-md-6 form-group" style="animation-delay: 0.1s">
                                <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                                    <span class="field-icon">🎵</span> Title *
                                </label>
                                <input v-model="form.title" type="text" class="form-control form-input" required
                                    placeholder="Enter piece title...">
                                <div class="input-line"></div>
                            </div>

                            <!-- Composer -->
                            <div class="col-md-6 form-group" style="animation-delay: 0.15s">
                                <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                                    <span class="field-icon">👤</span> Composer *
                                </label>
                                <input v-model="form.composer" type="text" class="form-control form-input" required
                                    placeholder="Enter composer name...">
                                <div class="input-line"></div>
                            </div>

                            <!-- Category -->
                            <div class="col-md-4 form-group" style="animation-delay: 0.2s">
                                <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                                    <span class="field-icon">🏷️</span> Category
                                </label>
                                <select v-model="form.category" class="form-select form-select-animated">
                                    <option v-for="cat in categories.filter(c => c !== 'All')" :key="cat" :value="cat">
                                        {{ cat }}
                                    </option>
                                </select>
                            </div>

                            <!-- Instrument -->
                            <div class="col-md-4 form-group" style="animation-delay: 0.25s">
                                <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                                    <span class="field-icon">🎹</span> Instrument
                                </label>
                                <select v-model="form.instrument" class="form-select form-select-animated">
                                    <option v-for="inst in instruments.filter(i => i !== 'All')" :key="inst"
                                        :value="inst">
                                        {{ inst }}
                                    </option>
                                </select>
                            </div>

                            <!-- Difficulty -->
                            <div class="col-md-4 form-group" style="animation-delay: 0.3s">
                                <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                                    <span class="field-icon">📊</span> Difficulty
                                </label>
                                <select v-model="form.difficulty" class="form-select form-select-animated">
                                    <option v-for="diff in difficulties.filter(d => d !== 'All')" :key="diff"
                                        :value="diff">
                                        {{ diff }}
                                    </option>
                                </select>
                            </div>

                            <!-- Year -->
                            <div class="col-md-3 form-group" style="animation-delay: 0.35s">
                                <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                                    <span class="field-icon">📅</span> Year
                                </label>
                                <input v-model.number="form.year" type="number" class="form-control form-input"
                                    placeholder="2024">
                                <div class="input-line"></div>
                            </div>

                            <!-- Key -->
                            <div class="col-md-3 form-group" style="animation-delay: 0.4s">
                                <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                                    <span class="field-icon">🎼</span> Key
                                </label>
                                <input v-model="form.key" type="text" class="form-control form-input"
                                    placeholder="C Major">
                                <div class="input-line"></div>
                            </div>

                            <!-- Pages -->
                            <div class="col-md-3 form-group" style="animation-delay: 0.45s">
                                <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                                    <span class="field-icon">📄</span> Pages
                                </label>
                                <input v-model.number="form.pages" type="number" class="form-control form-input"
                                    min="1">
                                <div class="input-line"></div>
                            </div>

                            <!-- Tags -->
                            <div class="col-md-6 form-group" style="animation-delay: 0.5s">
                                <label class="form-label fw-semibold" style="color: var(--neutral-700);">
                                    <span class="field-icon">🏷️</span> Tags
                                    <small class="fw-normal ms-1" style="color: var(--neutral-400);">(comma
                                        separated)</small>
                                </label>
                                <input v-model="tagsInput" type="text" class="form-control form-input"
                                    placeholder="Romantic, Sonata, etc.">
                                <div class="input-line"></div>

                                <!-- Tag Preview -->
                                <div class="tag-preview mt-2" v-if="tagPreview.length">
                                    <TransitionGroup name="tag-fade" tag="div" class="d-flex gap-1 flex-wrap">
                                        <span v-for="(tag, idx) in tagPreview" :key="tag" class="badge preview-tag"
                                            :style="{
                                                animationDelay: `${idx * 50}ms`,
                                                backgroundColor: 'var(--tertiary-100)',
                                                color: 'var(--tertiary-700)',
                                                border: '1px solid var(--tertiary-200)'
                                            }">
                                            {{ tag }}
                                        </span>
                                    </TransitionGroup>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Footer -->
                <div class="modal-footer bg-white border-top-0">
                    <button type="button" class="btn btn-cancel" data-bs-dismiss="modal"
                        style="background: var(--neutral-100); color: var(--neutral-600);">
                        <span class="btn-icon">✕</span> Cancel
                    </button>
                    <button type="button" class="btn btn-save" @click="submitForm" :disabled="!isValid"
                        :class="{ 'btn-disabled': !isValid }"
                        style="background: var(--gradient-primary); color: white;">
                        <span class="save-icon">💾</span>
                        <span class="save-text">Save Sheet Music</span>
                        <div class="save-shine"></div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { Modal } from 'bootstrap';
import { categories, instruments, difficulties } from '../data/sheetMusicData.js';

const emit = defineEmits(['add']);

const modal = ref(null);
const tagsInput = ref('');

const form = reactive({
    title: '',
    composer: '',
    category: 'Classical',
    instrument: 'Piano',
    difficulty: 'Intermediate',
    year: new Date().getFullYear(),
    key: '',
    pages: 1,
    tags: []
});

const tagPreview = computed(() => {
    return tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
});

const isValid = computed(() => {
    return form.title.trim() !== '' && form.composer.trim() !== '';
});

const submitForm = () => {
    if (!isValid.value) return;

    form.tags = tagPreview.value;
    emit('add', {
        ...form,
        id: Date.now(),
        archivedDate: new Date().toISOString().split('T')[0]
    });

    // Reset form
    Object.assign(form, {
        title: '',
        composer: '',
        category: 'Classical',
        instrument: 'Piano',
        difficulty: 'Intermediate',
        year: new Date().getFullYear(),
        key: '',
        pages: 1,
        tags: []
    });
    tagsInput.value = '';

    // Close modal
    const bsModal = Modal.getInstance(modal.value);
    bsModal.hide();
};
</script>

<style scoped>
@import '../styles/colors.css';

.modal-animated {
    animation: modalSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

@keyframes modalSlideUp {
    from {
        opacity: 0;
        transform: translateY(50px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.header-shine {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
            transparent 40%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 60%);
    transform: translateX(-100%) rotate(45deg);
    animation: headerShine 3s infinite;
}

@keyframes headerShine {
    0% {
        transform: translateX(-100%) rotate(45deg);
    }

    100% {
        transform: translateX(100%) rotate(45deg);
    }
}

.modal-icon {
    display: inline-block;
    animation: wiggle 2s ease-in-out infinite;
}

@keyframes wiggle {

    0%,
    100% {
        transform: rotate(-5deg);
    }

    50% {
        transform: rotate(5deg);
    }
}

.close-animated {
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 10;
}

.close-animated:hover {
    transform: rotate(90deg) scale(1.1);
}

.form-animated {
    perspective: 1000px;
}

.form-group {
    opacity: 0;
    animation: formFieldEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: left;
}

@keyframes formFieldEnter {
    from {
        opacity: 0;
        transform: translateX(-20px) rotateY(-10deg);
    }

    to {
        opacity: 1;
        transform: translateX(0) rotateY(0);
    }
}

.field-icon {
    display: inline-block;
    margin-right: 0.25rem;
    animation: iconPop 0.5s ease-out backwards;
}

@keyframes iconPop {
    from {
        opacity: 0;
        transform: scale(0) rotate(-180deg);
    }

    to {
        opacity: 1;
        transform: scale(1) rotate(0);
    }
}

.form-input {
    border: 2px solid var(--neutral-200);
    border-radius: 10px;
    padding: 0.75rem;
    transition: all 0.3s ease;
    background: white;
    position: relative;
}

.form-input:focus {
    border-color: var(--primary-400);
    box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
}

.input-line {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-500), var(--secondary-500));
    transition: all 0.3s ease;
    transform: translateX(-50%);
}

.form-input:focus~.input-line {
    width: calc(100% - 1.5rem);
}

.form-select-animated {
    border: 2px solid var(--neutral-200);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;
    color: var(--neutral-700);
}

.form-select-animated:hover {
    border-color: var(--primary-400);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.form-select-animated:focus {
    border-color: var(--primary-500);
    box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.1);
}

.tag-preview {
    min-height: 30px;
}

.preview-tag {
    animation: tagPreviewPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
}

@keyframes tagPreviewPop {
    from {
        opacity: 0;
        transform: scale(0) translateY(10px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.tag-fade-enter-active,
.tag-fade-leave-active {
    transition: all 0.3s ease;
}

.tag-fade-enter-from,
.tag-fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.btn-cancel {
    transition: all 0.3s ease;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    border: none;
}

.btn-cancel:hover {
    transform: translateY(-2px);
    background: var(--neutral-200) !important;
    color: var(--neutral-800) !important;
}

.btn-icon {
    display: inline-block;
    transition: transform 0.3s ease;
}

.btn-cancel:hover .btn-icon {
    transform: rotate(90deg);
}

.btn-save {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    padding: 0.75rem 1.5rem;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    border: none;
    font-weight: 500;
}

.btn-save:hover:not(.btn-disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-primary);
}

.btn-save:active:not(.btn-disabled) {
    transform: translateY(0);
}

.btn-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.5);
}

.save-icon {
    display: inline-block;
    margin-right: 0.5rem;
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.btn-save:hover .save-icon {
    transform: scale(1.2) rotate(-10deg);
}

.save-shine {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
            transparent 40%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 60%);
    transform: translateX(-100%) rotate(45deg);
    transition: transform 0.6s;
}

.btn-save:hover .save-shine {
    transform: translateX(100%) rotate(45deg);
}
</style>