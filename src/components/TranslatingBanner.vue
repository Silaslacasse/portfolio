<script setup lang="ts">
import starFlower from '../assets/icons/star_flower.png';
import dottsFlower from '../assets/icons/dotts_flower.png';
import roundFlower from '../assets/icons/round_flower.png';
import abstractFlower from '../assets/icons/abstract_flower.png';
import arrayFlower from '../assets/icons/array_flower.png';

const iconMap: Record<string, string> = {
    star_flower: starFlower,
    dotts_flower: dottsFlower,
    round_flower: roundFlower,
    abstract_flower: abstractFlower,
    array_flower: arrayFlower
};

const technos = [
    {
        "icon" : "star_flower",
        "technoName" : "HTML/CSS"
    },
    {
        "icon" : "dotts_flower",
        "technoName" : "Php/Synfony"
    },
    {
        "icon" : "round_flower",
        "technoName" : "Javascript/VueJS/React"
    },
    {
        "icon" : "abstract_flower",
        "technoName" : "Node/express"
    },
    {
        "icon" : "array_flower",
        "technoName" : "Sql/MongoDB"
    }
]
</script>

<template>
    <div class="sliderWrapper">
       <div v-for="techno in technos" :key="techno.icon" class="flex">
        <img :src="iconMap[techno.icon]" alt="Icone techno" />
            <p>{{ techno.technoName }}</p>
       </div> 
    </div>
</template>

<style scoped>
.sliderWrapper{
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>
