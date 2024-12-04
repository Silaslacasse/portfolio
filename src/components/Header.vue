<script setup lang="ts">
import Button from './Button.vue';
</script>

<template>
    <header class="flex">
        <img src="../assets/icons/joss.webp" width="90px" alt="JOSS Icon" />
        <nav>
            <Button color="secondary">Accueil</Button>
            <Button color="secondary">Ils m'ont fait confiance</Button>
            <Button color="secondary">Mes compétences</Button>
            <Button color="secondary">Mes projets</Button>
            <Button color="secondary">On discute ?</Button>
            <Button color="primary" size="large" :newTab=true link="https://www.linkedin.com/in/jocelyn-duperret/">Linkedin <img src="../assets/icons/linkedin.webp" width="18px" alt="Linkedin Icon" /> </Button>
        </nav>
    </header>
</template>

<style scoped>
header {
    background-color: #27272A;
    gap: 30px;
    border-radius: 50px;
    height: 96px;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    width: 85vw;
    margin: 0 auto;
    margin-top: 50px;
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}

nav {
    display: flex;
    gap: 50px;
}

@media screen and (max-width: 1400px) {
    header{

    }
    nav{
        gap: 30px;
    }
}

</style>
