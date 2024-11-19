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
        "technoName" : "Node/Express"
    },
    {
        "icon" : "array_flower",
        "technoName" : "Sql/MongoDB"
    },
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
        "technoName" : "Node/Express"
    },
    {
        "icon" : "array_flower",
        "technoName" : "Sql/MongoDB"
    },
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
        "technoName" : "Node/Express"
    },
    {
        "icon" : "array_flower",
        "technoName" : "Sql/MongoDB"
    },
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
        "technoName" : "Node/Express"
    },
    {
        "icon" : "array_flower",
        "technoName" : "Sql/MongoDB"
    }
]
</script>

<template>
    <div class="otherWrapper">
        <div class="sliderWrapper flex">
            <div v-for="techno in technos" :key="techno.icon" class="sliderItem">
                <img :src="iconMap[techno.icon]" alt="Icone techno" width="50px" />
                <p>{{ techno.technoName }}</p>
            </div> 
        </div>
    </div>
</template>

<style scoped>
.otherWrapper{
    background: linear-gradient(0.30turn, #5700EF, #FF6315);
    overflow: hidden;
}
.sliderWrapper{
    align-items: center;
    height: 104px;
    gap: 50px;
    flex-wrap: nowrap;
    animation: slide 20s linear infinite;
}
.sliderItem{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;
    font-family: 'Poppins', sans-serif;
    font-weight: 300;
    font-size: 32px;
    flex: 0 0 auto;
}

@keyframes slide {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-100%);
    }
}

</style>
