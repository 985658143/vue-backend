<template>
  <div :class="'swiper-container ' + noSwiper">
    <div class="swiper-wrapper">
      <div :class="'swiper-slide slide-' + index" v-for="(img, index) in imgList" :key="index"></div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
import Swiper from "swiper";

const defaultSwiperConfig = {
  resistanceRatio: 0,
  slidesPerView: "auto",
  noSwiping: true,
};

export default {
  name: "Swiper",
  components: {},
  props: {
    noSwiper: {
      type: String,
      default: "",
    },
    imgList: {
      type: Array,
    }
  },
  data() {
    return {
      swiper: null,
    };
  },
  created() {
    this.initSwiper();
  },
  methods: {
    initSwiper() {
      this.swiper = new Swiper(".swiper-container", {
        ...defaultSwiperConfig,
        pagination: ".swiper-pagination",
        paginationType: "progress",
        mousewheelControl: true,
        autoplay: true,
        speed: 5000,
        loop: true,
      });
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
</style>