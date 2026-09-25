<script setup lang="ts">
import Button from "./Button.vue";
import { onMounted, ref } from "vue";
import { setCookie, getCookie } from "../../utils/cookie";
import type { ContactErrorResponse, ContactMessageInput } from "#shared/schemas/message";

/**
 * Ported from v1 unchanged in markup and styling.
 *
 * Posts same-origin now that the API lives in this app, so there is no base URL to
 * configure and no CORS involved. The payload type comes from the same schema the server
 * validates against, so the two cannot drift.
 */
const formData = ref<ContactMessageInput>({
  name: "",
  firstName: "",
  society: "",
  email: "",
  linkedIn: "",
  mobile: "",
  message: "",
});

const isSubmitting = ref(false);
const errorMessage = ref("");
const isOverlayVisible = ref(false);

const handleSubmit = async () => {
  if (isSubmitting.value || isOverlayVisible.value) return;

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await $fetch("/api/messages", { method: "POST", body: formData.value });
    isOverlayVisible.value = true;
    setCookie("messageSent", "true", 1);
  } catch (error) {
    const data = (error as { data?: ContactErrorResponse })?.data;

    switch (data?.type) {
      case "rateLimit":
        errorMessage.value = data.error;
        // Mirror the server limit client-side so the form stays closed on reload.
        setCookie("messageSent", "true", 1);
        break;
      case "validation":
      case "payloadTooLarge":
      case "serverError":
        errorMessage.value = data.error;
        break;
      default:
        errorMessage.value = "L\u2019envoi a échoué. Merci de réessayer.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  if (getCookie("messageSent")) {
    isOverlayVisible.value = true;
  }
});
</script>

<template>
    <div id="letsTalk" class="contactWrapper">
      <h2>On discute ?</h2>
      <form class="formWrapper" @submit.prevent="handleSubmit" >
        <div class="inputWrapper">
          <label for="name">Nom <span class="required">*</span></label>
          <input id="name" v-model="formData.name" type="text" name="name" required />
        </div>
        <div class="inputWrapper">
          <label for="firstName">Prénom <span class="required">*</span></label>
          <input id="firstName" v-model="formData.firstName" type="text" name="firstName" required />
        </div>
        <div class="inputWrapper">
          <label for="society">Société <span class="required">*</span></label>
          <input id="society" v-model="formData.society" type="text" name="society" required />
        </div>
        <div class="inputWrapper">
          <label for="email">Email <span class="required">*</span></label>
          <input id="email" v-model="formData.email" type="email" name="email" required />
        </div>
        <div class="inputWrapper">
          <label for="linkedIn">Linkedin</label>
          <input id="linkedIn" v-model="formData.linkedIn" type="text" name="linkedIn" />
        </div>
        <div class="inputWrapper">
          <label for="mobile">Téléphone</label>
          <input id="mobile" v-model="formData.mobile" type="text" name="mobile" />
        </div>
        <div class="inputWrapper">
          <label for="message">Message <span class="required">*</span></label>
          <textarea id="message" v-model="formData.message" name="message" required></textarea>
        </div>
  
        <div class="bottomButtons">
          <div>
            <Button color="primaryReverse" :new-tab="true" link="https://www.linkedin.com/in/jocelyn-duperret/">
              Linkedin <img src="../../assets/icons/linkedin_orange.webp" width="18px" alt="Linkedin Icon" />
            </Button>
          </div>
          <div>
            <Button :disabled="isOverlayVisible" color="primary" size="large">Envoyer</Button>
          </div>
        </div>
  
        <div v-if="isOverlayVisible" class="overlay">
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
    /* v1 relied on the UA default white field background. Tailwind v4's preflight
       resets form controls to transparent, which made these invisible on the dark
       panel — so the colours are explicit now rather than inherited from the browser. */
    background-color: #ffffff;
    color: #18181B;
    border-radius: 12px;
    height: 44px;
    padding: 2px 20px;
}

.inputWrapper textarea{
    background-color: #ffffff;
    color: #18181B;
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