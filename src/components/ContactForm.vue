<script setup lang="ts">
import Button from './Button.vue';


</script>

<template>
    <div class="contactWrapper">
        <h2>On discute ?</h2>
        <form class="formWrapper">
            <div class="inputWrapper">
                <label for="name">Nom <span class="required">*</span></label>
                <input type="text" name="name" id="name" required />
            </div>
            <div class="inputWrapper">
                <label for="firstName">Prénom <span class="required">*</span></label>
                <input type="text" name="firstName" id="firstName" required />
            </div>
            <div class="inputWrapper">
                <label for="firm">Société <span class="required">*</span></label>
                <input type="text" name="firm" id="firm" required />
            </div>
            <div class="inputWrapper">
                <label for="email">Email <span class="required">*</span></label>
                <input type="email" name="email" id="email" required />
            </div>
            <div class="inputWrapper">
                <label for="linkedin">Linkedin</label>
                <input type="text" name="linkedin" id="linkedin" />
            </div>
            <div class="inputWrapper">
                <label for="phone">Téléphone</label>
                <input type="text" name="phone" id="phone" />
            </div>
            <div></div>
            
            <div class="bottomButtons">
                <div class="">
                    <Button color="primaryReverse" :newTab=true link="https://www.linkedin.com/in/jocelyn-duperret/">Linkedin <img src="../assets/icons/linkedin_orange.webp" width="18px" alt="Linkedin Icon" /> </Button>
                </div>

                <div class="">
                    <Button color="primary" size="large">Envoyer </Button>
                </div>
            </div>
        </form>
    </div>

</template>

<style scoped>
.contactWrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 40px;
    margin-bottom: 60px;
    padding: 0px 80px;
}
.contactWrapper h2{
    font-size: 32px;
    font-weight: 400;
}

.formWrapper{
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 300;
    background-color: #27272A;
    border-radius: 16px;
    padding: 40px;
    max-width: 832px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    width: 100%;
}

.inputWrapper{
    display: flex;
    flex-direction: column;
}

.inputWrapper input{
    border-radius: 12px;
    height: 44px;
    padding: 2px 20px;
}
.required {
    color: #FF6315;
}
.bottomButtons{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
}

@media screen and (max-width: 800px) {
    .formWrapper{
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
}

@media screen and (max-width: 700px) {
    .formWrapper{
        padding: 20px;
    }
    .contactWrapper{
        padding: 0px 40px;
    }
}

@media screen and (max-width: 510px) {
    .bottomButtons{
        flex-direction: column-reverse;
    }
}


</style>