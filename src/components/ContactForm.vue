<script setup lang="ts">
import axios from 'axios';
import Button from './Button.vue';
import { onMounted, ref } from 'vue';
import { setCookie, getCookie } from '../utils/cookie';
import { log } from 'console';

const formData = ref({
  name: '',
  firstName: '',
  society: '',
  email: '',
  linkedIn: '',
  mobile: '',
  message: '',
});

const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const isOverlayVisible = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await axios.post(`${import.meta.env.VITE_APIURL}/api/messages`, formData.value);
    isOverlayVisible.value = true;
    setCookie('messageSent', 'true', 1)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { type, error: message } = error.response?.data || {};
      console.log(type);
      console.log(message);
      if (type === 'rateLimit') {
        errorMessage.value = message;
        setCookie('messageSent', 'true', 1)
      } else if (type === 'serverError') {
        errorMessage.value = 'We are currently experiencing technical issues. Please try again later.';
      } else {
        errorMessage.value = 'Failed to send the message. Please try again.';
      }
    } else {
      errorMessage.value = 'Failed to send the message. Please try again.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
    if (getCookie('messageSent')) {
        isOverlayVisible.value = true;
    }
});
</script>

<template>
    <div class="contactWrapper" id="letsTalk">
      <h2>On discute ?</h2>
      <form class="formWrapper" @submit.prevent="handleSubmit" >
        <div class="inputWrapper">
          <label for="name">Nom <span class="required">*</span></label>
          <input v-model="formData.name" type="text" name="name" id="name" required />
        </div>
        <div class="inputWrapper">
          <label for="firstName">Prénom <span class="required">*</span></label>
          <input v-model="formData.firstName" type="text" name="firstName" id="firstName" required />
        </div>
        <div class="inputWrapper">
          <label for="society">Société <span class="required">*</span></label>
          <input v-model="formData.society" type="text" name="society" id="society" required />
        </div>
        <div class="inputWrapper">
          <label for="email">Email <span class="required">*</span></label>
          <input v-model="formData.email" type="email" name="email" id="email" required />
        </div>
        <div class="inputWrapper">
          <label for="linkedIn">Linkedin</label>
          <input v-model="formData.linkedIn" type="text" name="linkedIn" id="linkedIn" />
        </div>
        <div class="inputWrapper">
          <label for="mobile">Téléphone</label>
          <input v-model="formData.mobile" type="text" name="mobile" id="mobile" />
        </div>
        <div class="inputWrapper">
          <label for="message">Message <span class="required">*</span></label>
          <textarea v-model="formData.message" name="message" id="message" required></textarea>
        </div>
  
        <div class="bottomButtons">
          <div>
            <Button color="primaryReverse" :newTab="true" link="https://www.linkedin.com/in/jocelyn-duperret/">
              Linkedin <img src="../assets/icons/linkedin_orange.webp" width="18px" alt="Linkedin Icon" />
            </Button>
          </div>
          <div>
            <Button :disabled="isOverlayVisible" color="primary" size="large">Envoyer</Button>
          </div>
        </div>
  
        <div class="overlay" v-if="isOverlayVisible">
            <p>Message envoyé avec succès ! Merci de votre intérêt.</p>
        </div>
      </form>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

    </div>
  </template>

<style scoped>

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
    display: flex;
    pointer-events: all;
    justify-content: center;
    border-radius: 16px;
    align-items: center;
    transition: opacity 0.5s ease, background-color 0.5s ease;
    font-size: 24px;
    backdrop-filter: blur(6px);
}


.contactWrapper{
    position: relative;
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
    position: relative;
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

.inputWrapper textarea{
    border-radius: 12px;
    height: 88px;
    padding: 10px 10px;
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

.error-message {
  color: red;
  font-size: 16px;
  margin-top: 10px;
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

@media screen and (max-width: 520px) {
    .bottomButtons{
        flex-direction: column-reverse;
    }
    .contactWrapper{
        padding: 0px 20px;
    }
}


</style>