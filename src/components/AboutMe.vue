<script setup lang="ts">
import { ref } from 'vue';
import Button from './Button.vue';

const comingSoon = ref(false);

</script>

<template>
    <div class="container">
        <div class="left">
            <div class="presentationWraper">
                <div class="titleWrapper">
                    <h2 class="littleTitle">
                        À propos de moi
                    </h2>
                    <h2>
                        Hey, moi c’est <br>Jocelyn ✌️
                    </h2>
                </div>
                <div class="avatar">
                    <img src="../assets/images/avatar.webp" />
                </div>
            </div>
            <div class="presentationContent">
                <p>Passionné par l’informatique, je suis développeur full stack avec une expertise solide en PHP, JavaScript, et une maîtrise des frameworks comme Symfony, Vue.js, React, et Express.</p>
            </div>
        </div>
        <div class="right-top" @mouseover="comingSoon = true" @mouseleave="comingSoon = false">
            <div class="flex justify-between items-center">
                <h2>Mes projets</h2>
                <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.8953 9.03763L9.7433 1.88561L11.6289 0L21.9998 10.371L11.6289 20.7418L9.7433 18.8562L16.8953 11.7043H0.666504V9.03763H16.8953Z" fill="white"/>
                </svg>
            </div>
            <img class="" src="../assets/icons/orange_flower.webp" width="70px" alt="Mail Icon" />
            <transition name="fade">
                <div v-if="comingSoon" class="comingSoon flex justify-center items-center"> Coming Soon ...</div>
            </transition>
        </div>
        <div class="right-bottom">
            <div class="flex flex-col-reverse p-[20px] ">
                <div class="flex justify-between items-center">
                    <h2>On discute ?</h2>
                    <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.8953 9.03763L9.7433 1.88561L11.6289 0L21.9998 10.371L11.6289 20.7418L9.7433 18.8562L16.8953 11.7043H0.666504V9.03763H16.8953Z" fill="white"/>
                    </svg>
                </div>
            </div>
            <Button color="white" size="custom"><img class="mailIcon" src="../assets/icons/mail_send.webp" width="45px" alt="Mail Icon" /> </Button>

        </div>
    </div>


</template>

<style scoped>

.avatar{
    background-color: #FF6315;
    border-radius: 16px;
    max-width: 250px;
}

.presentationWraper{
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}

.presentationContent{
    color: #A1A1AA;
    font-size: 24px;
}

.titleWrapper{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.titleWrapper .littleTitle{
    font-weight: 400;
    font-size: 32px;
}

.titleWrapper h2{
    font-weight: 400;
    font-size: 48px;
}

.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 24px;
    width: 100%;
    max-width: 1352px;
    margin: 80px auto;
    font-family: 'Poppins', sans-serif;
    font-weight: 300;
    font-style: light;
}

.left {
    grid-column: 1;       
    grid-row: 1 / span 2; 
    padding: 24px;
    border-radius: 10px;
    background-color: #27272A;
    border-radius: 24px;
}

.right-top, .right-bottom {
    grid-column: 2;
    background: #2e2e42;
    border-radius: 10px;
    font-weight: 300;
    font-size: 32px;
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
}

.right-top {
    background-color: #5700EF;
    border-radius: 24px;
    grid-row: 1;
    padding: 24px;
    position: relative;
}

.comingSoon{
    position: absolute;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-radius: 24px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.right-bottom {
    grid-row: 2;
    border-radius: 16px;
    background: linear-gradient(0.30turn, #5700EF, #FF6315);
    padding: 4px;
    display: grid;
    grid-template-columns: 5fr 1fr;
}

.mailIcon{
    filter: invert(1) brightness(0);
}

@media screen and (max-width: 1400px) {
    .container{
        max-width: 1200px;
    }
}
@media screen and (max-width: 1240px) {
    .container{
        display: flex;
        flex-direction: column;
        padding: 80px;
    }
}

@media screen and (max-width: 750px) {
    .presentationWraper{
        flex-wrap: wrap;
        justify-content: center;
    }
    .container{
        margin: 40px auto;
        padding: 40px;
    }
}

@media screen and (max-width: 520px) {
    .container{
        margin: 20px auto;
        padding: 20px;
    }
}

</style>