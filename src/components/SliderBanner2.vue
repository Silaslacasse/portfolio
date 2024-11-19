<template>
    <div class="tag-scrollers">
      <div class="tag-scroller" ref="tagScroller">
        <ul class="tag-list">
          <li>
            <img src="../assets/icons/star_flower.png" alt="Icone techno" width="50px" />
            <p>HTML/CSS</p>
          </li>
          <li>
            <img src="../assets/icons/dotts_flower.png" alt="Icone techno" width="50px" />
            <p>Php/Synfony</p>
          </li>
          <li>
            <img src="../assets/icons/round_flower.png" alt="Icone techno" width="50px" />
            <p>Javascript/VueJS/React</p>
          </li>
          <li>
            <img src="../assets/icons/abstract_flower.png" alt="Icone techno" width="50px" />
            <p>Node/Express</p>
          </li>
          <li>
            <img src="../assets/icons/array_flower.png" alt="Icone techno" width="50px" />
            <p>Sql/MongoDB</p>
          </li>
          <li>
            <img src="../assets/icons/star_flower.png" alt="Icone techno" width="50px" />
            <p>HTML/CSS</p>
          </li>
          <li>
            <img src="../assets/icons/dotts_flower.png" alt="Icone techno" width="50px" />
            <p>Php/Synfony</p>
          </li>
          <li>
            <img src="../assets/icons/round_flower.png" alt="Icone techno" width="50px" />
            <p>Javascript/VueJS/React</p>
          </li>
          <li>
            <img src="../assets/icons/abstract_flower.png" alt="Icone techno" width="50px" />
            <p>Node/Express</p>
          </li>
          <li>
            <img src="../assets/icons/array_flower.png" alt="Icone techno" width="50px" />
            <p>Sql/MongoDB</p>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, nextTick } from "vue";
  
  const tagScroller = ref<HTMLDivElement | null>(null);
  
  const addScrolling = async () => {
    const scroller = tagScroller.value;
    if (!scroller) return;
  
    const tagList = scroller.querySelector(".tag-list") as HTMLUListElement;
    if (!tagList) return;
  
    const scrollContent = Array.from(tagList.children);
  
    // Clone the list items for infinite scrolling
    scrollContent.forEach((listItem) => {
      const clonedItem = listItem.cloneNode(true) as HTMLLIElement;
      clonedItem.setAttribute("aria-hidden", "true");
      tagList.appendChild(clonedItem);
    });
  
    // Wait for DOM updates before applying styles
    await nextTick();
  
    // Set CSS variable for animation duration
    tagList.style.setProperty("--duration", `${tagList.clientWidth / 100}s`);
    console.log(tagList.clientWidth/100);
  
    // Add the scrolling class to activate the animation
    scroller.classList.add("scrolling");
  };
  
  onMounted(() => {
    addScrolling();
  });
  </script>
  
  <style scoped>
  /* Parent container */
  .tag-scrollers {
    width: 100%;
    overflow: hidden;
    background: linear-gradient(0.30turn, #5700EF, #FF6315);
  }
  
  /* Scroller container */
  .tag-scroller {
    display: grid;
    gap: 50px;
  }
  
  /* Tag list styles */
  .tag-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 50px;
    font-family: 'Poppins', sans-serif;
    font-weight: 300;
    font-size: 32px;
  }
  
  /* Tag list items */
  .tag-list li {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;
    font-weight: 300;
    font-size: 32px;
    flex: 0 0 auto;
  }
  
  /* Apply animation when .scrolling is active */
  .tag-scroller.scrolling .tag-list {
    width: max-content;
    flex-wrap: nowrap;
    animation: horizontal-scroll 36.1s linear infinite;
  }

.tag-scroller:hover .tag-list {
  animation-play-state: paused;
}
  
  /* Keyframes for horizontal scroll */
  @keyframes horizontal-scroll {
    to {
    transform: translateX(calc(-50% - .75rem));
    }
  }
  </style>