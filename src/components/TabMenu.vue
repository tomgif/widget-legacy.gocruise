<template>
  <div>
    <div class="ces-tabs">
      <ul class="ces-tabs__list">
        <li class="ces-tabs__nav" v-for="(tab, index) in tabs" :key="`${index}`"
            :class="{'ces-tabs__nav_active': tab.isActive}">
          <div class="ces-tabs__item" @click="selectTab(tab)" v-text="tab.name"></div>
        </li>
      </ul>
    </div>
    <div class="ces-tabs-details">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabMenu',
  data() {
    return {
      tabs: []
    }
  },

  created() {
    this.tabs = this.$children
  },

  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach(tab => {
        tab.isActive = (tab.name === selectedTab.name)
      })
    }
  }
}
</script>

<style lang="scss">
.ces-tabs {
  margin-bottom: 16px;
  padding: 8px;

  &__nav {
    display: inline-block;
    margin-top: 14px;
    color: rgba(0, 0, 0, .5);
    border-bottom: 1px dotted rgba(0, 0, 0, .5);
    cursor: pointer;
    user-select: none;
    transition: color 70ms, border-color 70ms;
    will-change: color, border-color;
    margin-right: 28px;
    position: relative;
    min-width: 16px;
    min-height: 16px;

    @media (max-width: 413px) {
      margin-right: 8px
    }

    &:hover {
      color: rgba(0, 0, 0, 1);
      border-bottom: 1px solid rgba(0, 0, 0, 1);
    }

    &_active {
      color: rgba(0, 0, 0, 1);
      border-bottom: 1px dotted rgba(0, 0, 0, 1);
    }
  }

  &-details {
    padding: 8px
  }

  &__item {
    font-size: 16px
  }

  &__list {
    margin: 0;
    padding: 0;

    @media (max-width: 413px) {
      white-space: nowrap;
      overflow-x: auto;
    }
  }

  &__back {
    content: '';
    top: 8px;
    left: 0;
    position: absolute;
    width: 8px;
    height: 8px;
    border-left: 2px solid #000;
    border-bottom: 2px solid #000;
    transform: rotate(45deg);
  }
}
</style>