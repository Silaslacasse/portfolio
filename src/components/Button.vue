<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: 'Button',
  },
  type: {
    type: String,
    default: 'button',
  },
  size: {
    type: String,
    default: 'medium',
  },
  color: {
    type: String,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

const buttonClass = computed(() => [
  'btn',
  `btn--${props.color}`,
  `btn--${props.size}`,
  { 'btn--disabled': props.disabled },
]);

function handleClick(event: Event) {
  if (!props.disabled) {
    emit('click', event);
  }
}
</script>

<style scoped>
/* Base button styles */
.btn {
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  font-style: light;
}
.btn--primary {
  background: linear-gradient(0.30turn, #5700EF, #FF6315);
  color: white;
  border-radius: 24px;
}
.btn--secondary {
  background-color: transparent;
  color: white;
}
.btn--danger {
  background-color: #dc3545;
  color: white;
}
/* Size variants */
.btn--small {
  font-size: 0.75rem;
}
.btn--medium {
  font-size: 1rem;
}
.btn--large {
  font-size: 1rem;
  padding: 12px 24px;
}
.btn--veryLarge {
  font-size: 1rem;
  width: 190px;
  height: 76px;
  border-radius: 37.5px;
}
/* Disabled styles */
.btn--disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
}
</style>
