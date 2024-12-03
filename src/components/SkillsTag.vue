<script setup lang="ts">
import { defineProps, computed } from 'vue';


const props = defineProps({
    label: {
        type: String,
        default: 'Button',
    },
    star: {
        type: Number,
        required: false,
        validator: (value: number) => value >= 1 && value <= 5,
    },
    display: {
        type: String,
        default: 'flex',
    },
});

const stars = computed(() => {
  if (props.star === undefined || props.star === null) return [];
  const filledStars = Array(props.star).fill("filled");
  const emptyStars = Array(5 - props.star).fill("empty");
  return [...filledStars, ...emptyStars];
});

const computedStyle = computed(() => ({
  display: props.display === 'inline' ? 'inline' : 'flex',
}));


</script>

<template>
    <div class="tagWrapper" :style="computedStyle" >
        <slot>{{ label }}</slot>
        <div class="stars" v-if="stars.length > 0">
            <span 
                v-for="(type, index) in stars" 
                :key="index" 
                :class="type === 'filled' ? 'star-filled' : 'star-empty'"
            >
            <i v-if="type === 'filled'" class="fa fa-star">
                <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.08155 1.13274C8.42863 0.326779 9.57137 0.326779 9.91845 1.13274L11.469 4.73316C11.6137 5.06934 11.9306 5.29956 12.2951 5.33336L16.1984 5.69538C17.0722 5.77642 17.4253 6.86323 16.766 7.44239L13.821 10.0296C13.546 10.2712 13.4249 10.6437 13.5054 11.0007L14.3673 14.8249C14.5602 15.6809 13.6357 16.3526 12.8812 15.9046L9.51056 13.9032C9.19584 13.7163 8.80416 13.7163 8.48944 13.9032L5.11879 15.9046C4.36426 16.3526 3.43976 15.6809 3.6327 14.8249L4.49459 11.0007C4.57506 10.6437 4.45403 10.2712 4.17904 10.0296L1.23398 7.44239C0.574713 6.86323 0.92784 5.77642 1.80161 5.69538L5.70494 5.33336C6.0694 5.29956 6.38627 5.06934 6.53105 4.73316L8.08155 1.13274Z" fill="white"/>
                </svg></i>
                <i v-else class="fa fa-star-o">
                <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.08155 1.13274C8.42863 0.326779 9.57137 0.326779 9.91845 1.13274L11.469 4.73316C11.6137 5.06934 11.9306 5.29956 12.2951 5.33336L16.1984 5.69538C17.0722 5.77642 17.4253 6.86323 16.766 7.44239L13.821 10.0296C13.546 10.2712 13.4249 10.6437 13.5054 11.0007L14.3673 14.8249C14.5602 15.6809 13.6357 16.3526 12.8812 15.9046L9.51056 13.9032C9.19584 13.7163 8.80416 13.7163 8.48944 13.9032L5.11879 15.9046C4.36426 16.3526 3.43976 15.6809 3.6327 14.8249L4.49459 11.0007C4.57506 10.6437 4.45403 10.2712 4.17904 10.0296L1.23398 7.44239C0.574713 6.86323 0.92784 5.77642 1.80161 5.69538L5.70494 5.33336C6.0694 5.29956 6.38627 5.06934 6.53105 4.73316L8.08155 1.13274Z" fill="white" fill-opacity="0.2"/>
                </svg></i>
            </span>
        </div>
    </div>
</template>

<style scoped>
.tagWrapper{
    background-color: #18181B;
    border-radius: 12px;
    padding: 10px 18px;
    gap: 10px;
    align-items: center;
}
.stars{
    display: flex;
    padding-bottom: 3px;
}

</style>