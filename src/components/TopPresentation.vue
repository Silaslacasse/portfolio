<script setup lang="ts">
import Button from './Button.vue';
</script>

<template>
    <div class="topPresentationWraper">
        <h1 class="mainTitleWrapper">
            <span class="mainTitle">Jocelyn duperret, <span class="decoTitle1 orangeTwick"></span></span>
            <span class="mainTitle">développeur <span class="decoTitle2"></span> full-stack</span>
        </h1>
        <h1 class="mainTitleWrapperMobile">
            <span class="">Jocelyn duperret,</span>
            <span class="flex">développeur<span class="decoTitle1 orangeTwick2"></span></span>
            <span class="flex"><span class="decoTitle2"></span> full-stack</span>
        </h1>
        <Button link="#letsTalk" class="contactButton orangeTwick" color="primary" size="veryLarge">On discute ? <img src="../assets/icons/mail_send.webp" width="22px" alt="Mail Icon" /> </Button>
    </div>

</template>

<style scoped>
.mainTitleWrapperMobile{
    display: none
}

.topPresentationWraper{
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.topPresentationWraper::before{
    content: ''; 
    position: absolute; 
    width: 245px;
    height: 256px;
    background-image: url('../assets/images/star.webp');
    background-size: cover;
    background-repeat: no-repeat;
    top: 150px;
    right: 667px;
}

.topPresentationWraper::after{
    content: ''; 
    position: absolute; 
    width: 273px;
    height: 269px;
    background-image: url('../assets/images/abstract.webp');
    background-size: cover;
    background-repeat: no-repeat;
    bottom: 150px;
    left: 600px;
}

.mainTitleWrapper{
    font-size: 90px;
    text-transform: uppercase;
    line-height: 100px;
    font-family: 'PlusJakartaSans', sans-serif;
}

.contactButton{
    position: absolute;
    bottom: 40px;
    right: 40px;
}

.orangeTwick::before {
    content: ''; 
    position: absolute; 
    width: 40px;
    height: 40px;
    top: -15px;
    left: -15px;
    background-image: url('../assets/icons/orange_deco.webp');
    background-size: cover;
    background-repeat: no-repeat;
}

.decoTitle1::before{
    top: -20px;
    left: -5px;
}

.decoTitle1{
    display: block;
    width: 185px;
    height: 76px;
    border-radius: 100px;
    background-image: url('../assets/images/deco1.webp');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transform: rotate(-7deg);
}

.decoTitle2{
    display: block;
    width: 185px;
    height: 76px;
    border-radius: 100px;
    background-image: url('../assets/images/deco2.webp');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transform: rotate(10deg);
}

.decoTitle2::before{
    content: ''; 
    position: absolute; 
    width: 70px;
    height: 70px;
    top: 35px;
    left: -10px;
    background-image: url('../assets/icons/frame.webp');
    background-size: cover;
    background-repeat: no-repeat;
    transform: rotate(-10deg);
}

.mainTitle{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    gap: 20px;
    color: white;
}

@media screen and (max-width: 1920px) {
    .topPresentationWraper::before{
        top: 120px;
        right: 450px;
    }

    .topPresentationWraper::after{
        bottom: 70px;
        left: 450px;
    }
}

@media screen and (max-width: 1700px) {
    .topPresentationWraper::before{
        top: 130px;
        right: 350px;
        width: 215px;
        height: 226px;
    }

    .topPresentationWraper::after{
        bottom: 70px;
        left: 350px;
        width: 244px;
        height: 240px;
    }
}

@media screen and (max-width: 1500px) {
    .topPresentationWraper::before{
        top: 100px;
        right: 250px;
        width: 190px;
        height: 200px;
    }

    .topPresentationWraper::after{
        bottom: 70px;
        left: 250px;
        width: 213px;
        height: 210px;
    }

    .mainTitleWrapper{
        font-size: 75px;
        text-transform: uppercase;
        line-height: 100px;
        font-family: 'PlusJakartaSans', sans-serif;
    }
}

@media screen and (max-width: 1250px) {
    .mainTitleWrapper{
        font-size: 54px;
        text-transform: uppercase;
        line-height: 68px;
        font-family: 'PlusJakartaSans', sans-serif;
    }
    .topPresentationWraper::before{
        top: 100px;
        right: 150px;
    }

    .topPresentationWraper::after{
        bottom: 70px;
        left: 150px;
    }
}

@media screen and (max-width: 960px) {
    .mainTitleWrapper{
        font-size: 45px;
        text-transform: uppercase;
        line-height: 55px;
        font-family: 'PlusJakartaSans', sans-serif;
    }
    .topPresentationWraper::before{
        top: 100px;
        right: 150px;
        width: 190px;
        height: 200px;
    }

    .topPresentationWraper::after{
        bottom: 70px;
        left: 150px;
        width: 213px;
        height: 210px;
    }
}

@media screen and (max-width: 850px) {
    .mainTitleWrapper{
        display: none;
    }
    .topPresentationWraper::before{
        top: 150px;
        right: 100px;
        width: 125px;
        height: 130px;
    }

    .topPresentationWraper::after{
        bottom: 100px;
        left: 100px;
        width: 121px;
        height: 120px;
    }

    .mainTitleWrapperMobile{
        display: flex;
        flex-direction: column;
        font-size: 28px;
        text-transform: uppercase;
        line-height: 55px;
        font-family: 'PlusJakartaSans', sans-serif;
    }
    .decoTitle1{
        width: 80px;
        height: 40px;
    }
    .decoTitle2{
        width: 80px;
        height: 40px;
    }

    .decoTitle2::before{
        width: 35px;
        height: 35px;
        top: 20px;
        left: -10px;
    }
    .orangeTwick2::before {
        content: ''; 
        position: absolute; 
        width: 20px;
        height: 20px;
        top: -5px;
        left: -5px;
        background-image: url('../assets/icons/orange_deco.webp');
        background-size: cover;
        background-repeat: no-repeat;
    }
}

@media screen and (max-width: 550px) {

    .topPresentationWraper::before{
        right: 40px;
    }

    .topPresentationWraper::after{
        left: 40px;
        bottom: 150px;
    }
}
</style>
