<script setup lang="ts">


</script>

<template>
    <footer>
        <div class="footerWrapper">
            <img src="../assets/images/JOSS2.webp"  alt="Joss logo" /> 
            <ul>
                <li>Gestion des cookies</li>
                <li>Mentions légales</li>
                <li>© 2024 JOSS tous droits réservés</li>
            </ul>
        </div>
    </footer>
</template>

<style scoped>
footer{
    display: flex;
    justify-content: center;
}

.footerWrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, #9b00ff, #ff4500);
    max-width: 1352px;
    border-radius: 24px;
    padding: 80px 0px 20px 0px;
    flex-direction: column;
    gap: 50px;
    margin: 0px 80px 40px 80px;
}

.footerWrapper ul{
    display: flex;
    gap: 40px;
}

@media screen and (max-width: 700px) {
    .footerWrapper{
        margin: 0px 40px 40px 40px;
    }
}

</style>