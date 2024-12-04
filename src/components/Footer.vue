<script setup lang="ts">


</script>

<template>
    <div class="footerWrapper">
        <img src="../assets/images/JOSS.webp"  alt="Joss logo" /> 
        <ul>
            <li>Gestion des cookies</li>
            <li>Mentions légales</li>
            <li>© 2024 JOSS tous droits réservés</li>
        </ul>
    </div>
</template>

<style scoped>
.footerWrapper{
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, #9b00ff, #ff4500);
    max-width: 1352px;
    border-radius: 24px;
    padding: 80px 40px 20px 40px;
    overflow: hidden;
    flex-direction: column;
    gap: 50px;
    margin-bottom: 40px;
}

.footerWrapper img{
    min-width: 112%;
}

.footerWrapper ul{
    display: flex;
    gap: 40px;
}

@media screen and (max-width: 1400px) {
    .footerWrapper{
        max-width: 1200px;
    }
}
</style>