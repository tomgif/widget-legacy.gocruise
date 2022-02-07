<template>
  <div class="ces-person-control">
    <div class="ces-person-control__label" v-if="label" v-text="label"></div>
    <div class="ces-person-control__buttons">
      <div class="ces-person-control__button" @click="decrease">
        <div class="ces-icon ces-icon-minus"></div>
      </div>
      <div class="ces-person-control__value" v-text="value"></div>
      <div class="ces-person-control__button" @click="increase">
        <div class="ces-icon ces-icon-plus"></div>
      </div>
    </div>
    <div class="ces-person-control__ages" :class="{'ces-person-control__ages--hovered': over}" v-if="ages.length">
      <div class="ces-person-character" v-for="(age, index) in ages" :key="`${index}-${age}`">
        <div class="ces-person-character__icon">
          <div class="ces-icon ces-icon-user"></div>
        </div>
        <div class="ces-person-character__age" v-text="age"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonControl',
  props: {
    value: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: null
    },
    minValue: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 10
    },
    ages: {
      type: Array,
      default: () => ([])
    }
  },

  data() {
    return {
      over: true
    }
  },

  methods: {
    decrease() {
      let {value, minValue} = this
      if (value > minValue) {
        this.$emit('input', --value)
      }
    },

    increase() {
      let {value, maxValue} = this
      if (value < maxValue) {
        this.$emit('input', ++value)
      }
    }
  }
}
</script>

<style lang="scss">
.ces-person-control {
  position: relative;
  padding: 8px;

  & + & {
    margin-left: -4px
  }

  &__label {
    font-weight: 400;
    font-size: 9px;
    line-height: 9px;
    color: #000;
    text-transform: uppercase;
    user-select: none;
    cursor: default;
    position: relative;
  }

  &__value {
    padding: 3px 0;
    color: #000;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    position: relative;
    text-align: center;
    width: 24px;
    height: 24px;
  }

  &__buttons {
    margin-top: 4px;
    display: flex;
    flex-flow: row nowrap;
  }

  &__button {
    cursor: pointer;
    width: 24px;
    height: 24px;
    padding: 0 4px;
    background-color: #fff;
    font-size: 16px;
    line-height: 25px;
    font-weight: bold;
  }

  &__ages {
    position: absolute;
    width: 100%;
    top: 0;
    z-index: -1;
    display: flex;
    flex-flow: row nowrap;

    &--hovered {
      top: 48px;
      z-index: 1;

      @media (min-width: 320px) and (max-width: 374px) {
        top: 50%;
        left: 100%;
      }
    }
  }
}

.ces-person-character {
  display: flex;
  flex-flow: column;

  &__icon {
    margin: 0 1px;
    width: 10px;
    height: 10px;
  }

  &__age {
    font-size: 8px;
    text-align: center;
  }
}
</style>