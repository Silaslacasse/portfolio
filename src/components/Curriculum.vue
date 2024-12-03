<script setup lang="ts">
import { ref } from 'vue';
import SkillsTag from './SkillsTag.vue';

const selectedVersion = ref("Compétences"); 

</script>

<template>
    <div class="selectInfos">
        <div class="radio-group">
            <label class="radio-tab">
                <input type="radio" value="Compétences" v-model="selectedVersion" />
                <div>Compétences</div>
            </label>
            <label class="radio-tab">
                <input type="radio" value="Expériences" v-model="selectedVersion" />
                <div>Expériences</div>
            </label>
            <label class="radio-tab">
                <input type="radio" value="Formation" v-model="selectedVersion" />
                <div>Formation</div>
            </label>
        </div> 
    </div>
    <div class="curriculumWrapper">
        <div class="leftWrapper">
            <div class="languages">
                <SkillsTag label="Français" :star=5></SkillsTag>
                <SkillsTag label="Anglais" :star=4></SkillsTag>
                <SkillsTag label="Allemand" :star=2></SkillsTag>
            </div>
            <div class="softSkills">
                Développeur web full stack junior passionné, je suis spécialisé en front-end & back-end.<br>
                Avec une approche axée sur l’innovation & la performance, je suis prêt à relever de nouveaux défis & à apporter ma créativité dans le développement web.
            </div>
        </div>
        <div class="rightWrapper">
            <div class="selectContent">
                <div class="skillsTab" v-if="selectedVersion === 'Compétences'">
                    <div class="">
                        <img src="../assets/images/pink_pasta.webp" width="194px" alt="pink decoration" />
                    </div>
                    <div class="skillsWrapper">
                        <SkillsTag label="HTML/CSS"></SkillsTag>
                        <SkillsTag label="Php/Synfony"></SkillsTag>
                        <SkillsTag label="Javascript/VueJS/React"></SkillsTag>
                        <SkillsTag label="Node/express"></SkillsTag>
                        <SkillsTag label="Sql/MongoDB"></SkillsTag>
                    </div>
                </div>
                <div class="xpTab" v-if="selectedVersion === 'Expériences'">
                    <div class="infoWrapper" >
                        <div class="skillWrapper">
                            <SkillsTag label="Developpeur Full Stack chez JetPulp - Alt " display="inline"></SkillsTag>
                            <p>De septembre 2022 à septembre 2024</p>
                        </div>
                        <div class="skillWrapper">
                            <SkillsTag label="Developpeur Front End chez SiteW - Alt "  display="inline"></SkillsTag>
                            <p>De septembre 2021 à septembre 2022</p>
                        </div>
                        <div class="skillWrapper">
                            <SkillsTag label="Confection de site web chez Arclim - Stage & contrat étudiant "  display="inline"></SkillsTag>
                            <p>De mai à août 2021 - Confection de site web pour superviser des installations de stockage alimentaire</p>
                        </div>
                        <div class="skillWrapper">
                            <SkillsTag label="Réparation de matériel informatique - Indépendant "  display="inline"></SkillsTag>
                            <p>2015-2021 - Réparation de smartphones & ordinateurs</p>
                        </div>
                        <div class="skillWrapper">
                            <SkillsTag label="Saisonnier fruitier"  display="inline"></SkillsTag>
                            <p>2016-2020 - Cueillette & tri des cerises - Vendanges</p>
                        </div>
                    </div>
                </div>

                <div class="formationTab" v-if="selectedVersion === 'Formation'">
                    <div class="infoWrapper">
                        <div class="skillWrapper">
                            <SkillsTag label="Master Expert Développement Web Ynov Lyon" display="inline"></SkillsTag>
                            <p>Septembre 2022-2024 - Alternance chez JetPulp</p>
                        </div>
                        <div class="skillWrapper">
                            <SkillsTag label="Licence Pro Application Web Clermont" display="inline"></SkillsTag>
                            <p>Septembre 2021-2022 - Alternance ches sitew.com</p>
                        </div>
                        <div class="skillWrapper">
                            <SkillsTag label="IUT Lyon 1 informatique" display="inline"></SkillsTag>
                            <p>Septembre 2019-2021 - Stage de fin d’année chez ARCLIM</p>
                        </div>
                        <div class="skillWrapper">
                            <SkillsTag label="Lycée René CASSIN" display="inline"></SkillsTag>
                            <p>Septembre 2017 - Juin 2019 - Baccalauréat STI2D mention très bien</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.curriculumWrapper {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 24px;
    width: 100%;
    max-width: 1352px;
    margin: 80px auto;
    font-family: 'Poppins', sans-serif;
    font-weight: 300;
    font-style: light;
}

.leftWrapper{
    display: grid;
    grid-template-rows: 1fr 2fr;
    gap: 24px;
}

.rightWrapper{
    background: linear-gradient(0.30turn, #5700EF, #FF6315);
    padding: 4px;
    border-radius:  16px;
}

.languages{
    background-color: #27272A;
    border-radius:  16px;
    display: flex;
    align-items: center;
    padding: 32px;
    flex-wrap: wrap;
    gap: 24px;
}

.softSkills{
    background-color: #27272A;
    border-radius: 16px;
    color: #A1A1AA;
    font-size: 24px;
    padding: 32px 24px;
}

.selectContent{
    background-color: #27272A;
    height: 100%;
    border-radius: 16px;
    padding: 40px;
}

.skillsWrapper{
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
}

.skillsTab{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.infoWrapper{
    display: flex;
    gap: 10px;
    flex-direction: column;
}

.selectInfos {
    height: 60px;
    display: flex;
    justify-content: center;
    gap: 16px; /* Espacement entre les boutons */
}

.radio-group{
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #27272A;
    border-radius: 16px;
}

/* Masque les vrais boutons radio */
.radio-tab input[type="radio"] {
    display: none;
}

/* Style par défaut des labels (onglets) */
.radio-tab div {
    padding: 8px 14px;
    font-size: 16px;
    font-weight: 500;
    color: #ccc;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.8s ease-in-out;
    text-align: center;
}

/* Onglet sélectionné */
.radio-tab input[type="radio"]:checked + div {
    color: #fff;
    background: linear-gradient(90deg, #9b00ff, #ff4500);
}

/* Effet au survol */
.radio-tab:hover div {
    color: #fff;
    background: #333;
}

.skillWrapper{
    margin-bottom: 15px;
}

.skillWrapper p{
    margin-top: 15px;
    margin-left: 2px;
}


</style>