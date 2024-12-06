<script setup lang="ts">
import Button from './Button.vue';


</script>

<template>
    <div class="container">
        <div class="left">
            <div class="presentationWraper">
                <div class="titleWrapper">
                    <h3>
                        À propos de moi
                    </h3>
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
        <div class="right-top">
            <div class="flex justify-between items-center">
                <p>Mes projets</p>
                <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.8953 9.03763L9.7433 1.88561L11.6289 0L21.9998 10.371L11.6289 20.7418L9.7433 18.8562L16.8953 11.7043H0.666504V9.03763H16.8953Z" fill="white"/>
                </svg>
            </div>
            <img class="" src="../assets/icons/orange_flower.webp" width="70px" alt="Mail Icon" />
        </div>
        <div class="right-bottom">
            <div class="flex flex-col-reverse p-[20px] ">
                <div class="flex justify-between items-center">
                    <p>On discute ?</p>
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

.titleWrapper h3{
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

@media screen and (max-width: 700px) {
    .container{
        margin: 40px auto;
        padding: 40px;
    }
}

</style>