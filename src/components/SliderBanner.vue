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
    <div class="sliderWrapper flex">
       <div v-for="techno in technos" :key="techno.icon" class="flex sliderElement">
        <img :src="iconMap[techno.icon]" alt="Icone techno" width="50px" />
            <p>{{ techno.technoName }}</p>
       </div> 
    </div>
</template>

<style scoped>
.sliderWrapper{
    justify-content: center;
    align-items: center;
    background: linear-gradient(0.30turn, #5700EF, #FF6315);
    height: 104px;
    gap: 40px;
}
.sliderElement{
    align-items: center;
    justify-content: center;
    gap: 40px;
    font-family: 'Poppins', sans-serif;
    font-weight: 300;
    font-size: 32px;
}

</style>
