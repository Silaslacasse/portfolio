<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    @click="handleClick"
  >
  <div>
    <slot>{{ label }}</slot>
  </div>
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
  link: {
    type: String,
    default: null,
  },
  newTab: {
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
  if (props.disabled) return;

  if (props.link) {
    const target = props.newTab ? '_blank' : '_self';
    window.open(props.link, target);
  } else {
    emit('click', event);
  }
}
</script>

<style scoped>
/* Base button styles */
.btn div{
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
.btn:hover{
  opacity: 80%;
}
.btn--primary {
  background: linear-gradient(0.30turn, #5700EF, #FF6315);
  color: white;
  border-radius: 24px;
}
.btn--primaryReverse {
  background: linear-gradient(0.30turn, #5700EF, #FF6315);
  color: #FF6315;
  border-radius: 24px;
  padding: 2px;
}

.btn--primaryReverse .btn--large {
  padding: 0;
}

.btn--primaryReverse div {
  background: #18181B;
  padding: 10px 22px;
  border-radius: 24px;
}

.btn--secondary {
  background-color: transparent;
  color: white;
}
.btn--white {
  background-color: white;
  color: #1E1E1E;
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

.btn--custom {
  border-radius: 16px;
}
/* Disabled styles */
.btn--disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
}

</style>
