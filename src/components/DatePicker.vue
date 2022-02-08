<template>
  <div class="ces-date-picker"
       :class="{
        'ces-date-picker__is-right': isRight,
        'ces-date-picker__is-left': !isRight,
       }"
       v-click-outside="onClickOutside" ref="component">
    <div class="ces-date-picker__label" v-text="label"></div>
    <div class="ces-date-picker__value">
      <input ref="date" class="ces-date-picker__input" type="text" :value="current" @focus="active = true">
    </div>
  </div>
</template>

<script>
import Cleave from 'cleave.js'
import datepicker from 'js-datepicker'
import dayJs from 'dayjs'
import vClickOutside from "v-click-outside";

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayJs.extend(customParseFormat)

const format = process.env.VUE_APP_DATE_FORMAT
const months = 'Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'

export default {
  name: 'DatePicker',
  props: {
    value: String,
    label: {
      type: String,
      default: null
    },
    minDate: {
      type: Date
    },
    events: {
      type: Array,
      default: () => ([])
    }
  },

  data() {
    return {
      active: false,
      cleave: null,
      datepicker: null,
      isRight: false
    }
  },

  watch: {
    active(value) {
      if (value) {
        const left = this.$refs.component.getBoundingClientRect().left
        this.isRight = (window.innerWidth - left) < 186

        this.datepicker = datepicker(this.$refs['date'], {
          startDay: 1,
          customMonths: months.split('_'),
          overlayPlaceholder: 'Введите 4-значный год',
          overlayButton: 'Подтвердить',
          minDate: this.minDate,
          dateSelected: this.today.toDate(),
          alwaysShow: true,
          position: this.isRight ? 'br' : 'bl',
          formatter: (input, date) => {
            const value = dayJs(date)
            this.$emit('input', value.format(format))
            input.value = value.format(process.env.VUE_APP_DATE_FORMAT_LOCAL)
          },
          onSelect: instance => {
            this.$emit('on-select', instance.dateSelected)
            this.active = false
          },
          events: this.events.map(timestamp => new Date(timestamp))
        })
      } else {
        this.datepicker.remove()
      }
    }
  },

  directives: {
    clickOutside: vClickOutside.directive
  },

  computed: {
    today() {
      return dayJs(this.value, format)
    },

    current() {
      return this.today.format(process.env.VUE_APP_DATE_FORMAT_LOCAL)
    }
  },

  mounted() {
    this.cleave = new Cleave(this.$refs['date'], {
      date: true,
      delimiter: '.',
      datePattern: ['d', 'm', 'Y'],
    })
  },

  destroyed() {
    this.cleave.destroy()
  },

  methods: {
    onClickOutside() {
      this.active = false
    }
  }
}
</script>

<style lang="scss">
.ces-date-picker {
  width: 50%;
  padding: 8px 0 8px 8px;

  &__is-right {
    .qs-datepicker-container {
      &:before {
        right: 35px;
      }
    }
  }

  &__is-left {
    .qs-datepicker-container {
      &:before {
        left: 35px;
      }
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
    letter-spacing: -.4px;
    font-weight: 700;
    line-height: 18px;
    border: 0;
    width: 100%;
    padding: 4px 1px;
    text-align: center;

    @media (min-width: 320px) {
      font-size: 12px;
      width: 92%;
    }

    &::-webkit-calendar-picker-indicator {
      display: none
    }
  }
}

.qs-datepicker-container {
  position: absolute;
  width: 186px;
  z-index: 9001;
  user-select: none;
  background-color: #fff;
  padding: 0 2px 5px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .45);

  &:before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent #fff transparent;
    top: -5px;
    position: absolute;
    margin: auto;
  }
}

.qs-datepicker {
  overflow: hidden;
}

.qs-centered {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.qs-hidden {
  display: none;
}

.qs-controls {
  width: 175px;
  height: 37px;
  position: relative;
  margin: 0 auto;
  padding: 3px 0;
  border-bottom: 1px solid #eee;
  user-select: none;
}

.qs-overlay {
  display: none;
}

.qs-arrow {
  height: 30px;
  width: 30px;
  top: 4px;
  position: absolute;
  cursor: pointer;
  margin: 0 1px;
  color: #000;

  &:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    margin: 10px;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
    mask-position: center center;
  }

  &:hover {
    opacity: .25;
  }

  &.qs-left {
    left: 0;

    &:after {
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 306 306'%3E%3Cpath d='M247.35 35.7L211.65 0l-153 153 153 153 35.7-35.7L130.05 153z'/%3E%3C/svg%3E");
    }
  }

  &.qs-right {
    right: 0;

    &:after {
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 306 306'%3E%3Cpath d='M58.65 267.75L175.95 153 58.65 35.7 94.35 0l153 153-153 153z'/%3E%3C/svg%3E");
    }
  }
}

.qs-month-year {
  pointer-events: none;
  margin: 0 32px;
  line-height: 28px;
  text-align: center;
}

.qs-month, .qs-year {
  font-weight: 100;
  font-size: 12px;
  line-height: 14px;
  color: #000;
  margin: 0 2px;
}

.qs-squares {
  display: flex;
  flex-wrap: wrap;
  margin-top: 6px;
}

.qs-square {
  width: 26px;
  height: 26px;
  color: #90a4ae;
  font-weight: 100;
  text-align: center;
  font-size: 12px;
  line-height: 26px;
  cursor: pointer;
  border-radius: 50%;

  &:not(.qs-empty):not(.qs-disabled):not(.qs-day):not(.qs-active) {
    &:hover {
      background-color: #e5e5e5;
    }
  }

  &.Sat {
    color: #d45e5e;
  }

  &.Sun {
    color: #d45e5e;
  }
}

.qs-current {
  font-weight: bold;
}

.qs-active {
  background-color: #2e2e2e;
  color: #fff;
  border-radius: 50%;
  pointer-events: none;
}

.qs-disabled,
.qs-outside-current-month {
  opacity: .2;
}

.qs-disabled {
  cursor: not-allowed;
}

.qs-empty {
  cursor: default;
}

.qs-day {
  display: none;
}

.qs-event {
  text-decoration: underline;
  color: #000;
  font-weight: 700;

  &.qs-active {
    color: #fff;
  }

  &.Sun, &.Sat {
    color: #c91313;

    &.qs-active {
      color: #d45e5e
    }
  }
}
</style>