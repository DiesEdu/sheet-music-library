<template>
    <div class="col-md-6 col-lg-4 mb-4 perspective-container">
        <div class="card h-100 shadow-sm music-card" @mouseenter="startTilt" @mouseleave="resetTilt"
            @mousemove="handleTilt" :style="tiltStyle">
            <!-- Header with Harmony Gradient based on difficulty -->
            <div class="card-header d-flex justify-content-between align-items-center overflow-hidden position-relative"
                :class="difficultyGradient">
                <span class="badge instrument-badge">{{ sheet.instrument }}</span>
                <small class="text-white fw-bold difficulty-text">{{ sheet.difficulty }}</small>
                <div class="shine-effect"></div>
            </div>

            <div class="card-body position-relative">
                <!-- Floating Background Notes -->
                <div class="music-notes-bg">♪ ♫ ♪</div>

                <!-- Title with Primary Color -->
                <h5 class="card-title mb-1 title-hover" style="color: var(--primary-700);">{{ sheet.title }}</h5>

                <!-- Composer with Neutral -->
                <p class="mb-2" style="color: var(--neutral-600);">{{ sheet.composer }}</p>

                <!-- Category Tags with Harmony Colors -->
                <div class="d-flex gap-2 mb-3 flex-wrap tag-container">
                    <span class="badge category-badge" :class="categoryColor">{{ sheet.category }}</span>
                    <span class="badge key-badge">{{ sheet.key }}</span>
                    <span class="badge pages-badge">{{ sheet.pages }} pages</span>
                </div>

                <!-- Tags with Tertiary Accent -->
                <div class="mb-3">
                    <small style="color: var(--neutral-500);">Tags:</small>
                    <div class="d-flex gap-1 flex-wrap mt-1">
                        <span v-for="(tag, idx) in sheet.tags" :key="tag" class="badge small tag-item" :style="{
                            animationDelay: `${idx * 100}ms`,
                            backgroundColor: 'var(--tertiary-100)',
                            color: 'var(--tertiary-700)',
                            border: '1px solid var(--tertiary-200)'
                        }">
                            {{ tag }}
                        </span>
                    </div>
                </div>

                <!-- Meta Info -->
                <div class="d-flex justify-content-between align-items-center small meta-info"
                    style="color: var(--neutral-500);">
                    <span class="year-badge">📅 {{ sheet.year }}</span>
                    <span class="date-badge">🗂️ {{ sheet.archivedDate }}</span>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="card-footer bg-transparent border-top-0 action-buttons">
                <div class="d-grid gap-2 d-md-flex">
                    <button class="btn btn-sm flex-fill btn-view" @click="$emit('view', sheet)"
                        style="background: var(--gradient-primary); color: white; border: none;">
                        <span class="btn-icon">📖</span>
                        <span class="btn-text">View Details</span>
                    </button>
                    <button class="btn btn-sm btn-edit" @click="$emit('edit', sheet)"
                        style="background: var(--neutral-100); color: var(--neutral-700); border: 1px solid var(--neutral-200);">
                        <span class="edit-icon">✏️</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    sheet: {
        type: Object,
        required: true
    }
});

defineEmits(['view', 'edit']);

const tiltStyle = ref({});
const isHovering = ref(false);

const difficultyGradient = computed(() => {
    const gradients = {
        'Beginner': 'bg-success',
        'Intermediate': 'bg-warning',
        'Advanced': 'bg-danger',
        'Virtuoso': 'bg-neutral-800'
    };
    return gradients[props.sheet.difficulty] || 'bg-neutral-600';
});

const categoryColor = computed(() => {
    // Assign colors based on category for visual harmony
    const colors = {
        'Classical': 'bg-primary-100 text-primary-700 border-primary-200',
        'Baroque': 'bg-secondary-100 text-secondary-700 border-secondary-200',
        'Romantic': 'bg-tertiary-100 text-tertiary-700 border-tertiary-200',
        'Impressionist': 'bg-info text-white',
        'Modern': 'bg-neutral-200 text-neutral-800 border-neutral-300',
        'Jazz/Classical': 'bg-warning text-white'
    };
    return colors[props.sheet.category] || 'bg-neutral-100 text-neutral-700';
});

const startTilt = () => {
    isHovering.value = true;
};

const resetTilt = () => {
    isHovering.value = false;
    tiltStyle.value = {
        transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    };
};

const handleTilt = (e) => {
    if (!isHovering.value) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    tiltStyle.value = {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'all 0.1s ease-out'
    };
};
</script>

<style scoped>
@import '../styles/colors.css';

.perspective-container {
    perspective: 1000px;
}

.music-card {
    background: white;
    border: none;
    border-radius: 16px;
    overflow: hidden;
    transition: box-shadow 0.3s ease;
    transform-style: preserve-3d;
    will-change: transform;
    border: 1px solid var(--neutral-200);
}

.music-card:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
    border-color: var(--primary-200);
}

.card-header {
    position: relative;
    border: none;
    padding: 1rem;
    overflow: hidden;
}

/* Difficulty Gradients using Harmony Colors */
.bg-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
}

.bg-warning {
    background: linear-gradient(135deg, var(--secondary-400) 0%, var(--secondary-600) 100%) !important;
}

.bg-danger {
    background: linear-gradient(135deg, var(--tertiary-400) 0%, var(--tertiary-600) 100%) !important;
}

.bg-neutral-800 {
    background: linear-gradient(135deg, var(--neutral-700) 0%, var(--neutral-900) 100%) !important;
}

.shine-effect {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 70%);
    transform: translateX(-100%) rotate(45deg);
    transition: transform 0.6s;
}

.music-card:hover .shine-effect {
    animation: shine 0.6s ease-in-out;
}

@keyframes shine {
    to {
        transform: translateX(100%) rotate(45deg);
    }
}

.instrument-badge {
    background: rgba(255, 255, 255, 0.95);
    color: var(--neutral-800);
    font-weight: 500;
    animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.difficulty-text {
    animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
    opacity: 0;
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.music-notes-bg {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 2rem;
    color: var(--primary-200);
    opacity: 0.3;
    pointer-events: none;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-10px) rotate(5deg);
    }
}

.title-hover {
    position: relative;
    display: inline-block;
    transition: color 0.3s ease;
}

.title-hover::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-500), var(--secondary-500));
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.music-card:hover .title-hover::after {
    width: 100%;
}

/* Category Badge Styling */
.category-badge,
.key-badge,
.pages-badge {
    background: var(--neutral-100);
    color: var(--neutral-700);
    border: 1px solid var(--neutral-200);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-badge {
    background: var(--primary-50);
    color: var(--primary-700);
    border-color: var(--primary-200);
}

.music-card:hover .category-badge {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.15);
}

.music-card:hover .key-badge {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transition-delay: 0.05s;
}

.music-card:hover .pages-badge {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transition-delay: 0.1s;
}

.tag-item {
    animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
    transition: all 0.2s ease;
}

@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.tag-item:hover {
    transform: scale(1.1) rotate(3deg);
    cursor: pointer;
    background: var(--tertiary-200) !important;
}

.meta-info {
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.music-card:hover .meta-info {
    opacity: 1;
}

.year-badge,
.date-badge {
    transition: transform 0.3s ease;
}

.music-card:hover .year-badge {
    transform: translateX(-3px);
}

.music-card:hover .date-badge {
    transform: translateX(3px);
}

.action-buttons {
    transform: translateY(10px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.music-card:hover .action-buttons {
    transform: translateY(0);
    opacity: 1;
}

.btn-view {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-view:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-primary);
}

.btn-icon {
    display: inline-block;
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.btn-view:hover .btn-icon {
    transform: scale(1.2) rotate(-10deg);
}

.btn-edit {
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.btn-edit:hover {
    transform: rotate(15deg) scale(1.1);
    background: var(--secondary-100) !important;
    border-color: var(--secondary-300) !important;
    color: var(--secondary-700) !important;
}

.edit-icon {
    display: inline-block;
    transition: transform 0.3s ease;
}

.btn-edit:hover .edit-icon {
    transform: rotate(-360deg);
}
</style>