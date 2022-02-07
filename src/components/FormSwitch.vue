<template>
  <div class="ces-form-switch">
    <div class="ces-form-switch__control">
      <span class="ces-form-switch__slider" :class="{'ces-form-switch__slider_checked': value}" @click="onClick"></span>
    </div>
    <div class="ces-form-switch__label" v-text="label"></div>
  </div>
</template>

<script>
export default {
  name: 'FormSwitch',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    disabled(value) {
      if (value) {
        this.$emit('input', false)
      }
    }
  },

  methods: {
    onClick() {
      if (!this.disabled) {
        this.$emit('input', !this.value)
      }
    }
  }
}
</script>

<style lang="scss">
.ces-form-switch {
  width: 50%;
  display: flex;
  flex-flow: row nowrap;

  @media (min-width: 320px) and (max-width: 374px) {
    padding: 8px
  }

  @media (min-width: 375px) {
    flex-flow: column-reverse;
    justify-content: center;
    padding: 0 8px;
  }

  &__control {
    position: relative;
    display: inline-block;
    width: 52px;
    height: 24px;
  }

  &__label {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 9px;
    color: #000;
    text-transform: uppercase;
    user-select: none;
    cursor: default;
    letter-spacing: -.3px;
    margin: 0 4px 4px 0;

    @media (min-width: 320px) and (max-width: 374px) {
      margin: 0 4px 4px
    }

    @media (min-width: 320px) and (max-width: 374px) {
      width: calc(100% - 60px)
    }

    @media (min-width: 375px) {
      width: 100%
    }
  }

  &__slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    transition: .4s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: '';
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: #000;
      transition: .4s;
      border-radius: 50%;
      opacity: .25;
    }

    &_checked {
      &:before {
        opacity: 1;
        transform: translateX(26px);
      }
    }
  }
}
</style>