<template>
  <div class="ces-date-picker">
    <div class="ces-date-picker__label" v-text="label"></div>
    <div class="ces-date-picker__value">
      <flat-picker class="ces-date-picker__input"
                   ref="date-field"
                   :value="value"
                   :config="newConfig"
                   @input="$emit('input', $event)"
                   @on-change="$emit('change', $event)">
      </flat-picker>
    </div>
  </div>
</template>

<script>
import FlatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import {Russian} from 'flatpickr/dist/l10n/ru.js'
import Cleave from 'cleave.js'

export default {
  name: 'DatePicker',
  components: {FlatPicker},
  props: {
    value: String,
    label: {
      type: String,
      default: null
    },

    config: {
      type: Object,
      default: () => ({})
    },

    onChange: {
      type: Function,
      default: () => false
    }
  },

  computed: {
    newConfig() {
      return {
        ...this.config,
        dateFormat: 'd.m.Y',
        locale: Russian,
        allowInput: true,
        static: true
      }
    }
  },

  data() {
    return {
      cleave: null
    }
  },

  mounted() {
    this.cleave = new Cleave(this.$refs['date-field'].$el, {
      date: true,
      delimiter: '.',
      datePattern: ['d', 'm', 'Y'],
    })
  },

  destroyed() {
    this.cleave.destroy()
  }
}
</script>

<style lang="scss">
.ces-date-picker {
  width: 50%;
  padding: 8px 0 8px 8px;

  &_is-left {
    .flatpickr-calendar {
      left: 0
    }
  }

  &_is-right {
    .flatpickr-calendar {
      right: 0
    }
  }

  &__label {
    font-weight: 400;
    font-size: 9px;
    height: 9px;
    line-height: 9px;
    color: #000;
    text-transform: uppercase;
    user-select: none;
    cursor: default;
    position: relative;
    margin-bottom: 4px;
  }

  &__input {
    color: #000;
    background-color: #fff;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: 700;
    line-height: 18px;
    border: 0;
    width: 100%;
    text-align: center;
    padding: 4px 0;

    @media (min-width: 320px) {
      font-size: 12px;
      width: 92%;
    }

    &::-webkit-calendar-picker-indicator {
      display: none
    }
  }
}

</style>