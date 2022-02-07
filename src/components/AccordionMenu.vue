<template>
  <div>
    <div class="ces-collapse"
         v-for="(collapse, index) in data"
         :key="index">
      <div class="ces-collapse__title"
           @click="select(index)"
           v-text="collapse.subtitle"></div>
      <div class="ces-collapse__content"
           :class="{'ces-collapse__content--shown': index === selected}"
           v-html="collapse.text"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccordionMenu',
  props: {
    data: Array
  },

  data() {
    return {
      selected: null
    }
  },

  methods: {
    select(index) {
      this.selected = this.selected === index ? null : index
    }
  }
}
</script>

<style lang="scss">
.ces-collapse {
  border: 1px solid rgba(0, 0, 0, .25);

  &__title {
    display: block;
    font-weight: 500;
    padding: 16px;
    position: relative;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      top: 25px;
      right: 30px;
    }
  }

  &__content {
    max-height: 0;
    transition: 0.3s linear 0s;
    overflow: hidden;
    font-size: 12px;

    &--shown {
      max-height: 15em;
      padding: 0 16px;
    }
  }
}
</style>