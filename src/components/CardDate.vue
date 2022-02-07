<template>
  <div class="ces-card-date">
    <div v-for="(yearCollection, year) in dictionary"
         :key="`${prefix}-${year}`">
      <div class="ces-card-date__row"
           v-for="(monthCollection, month) in yearCollection"
           :key="`${prefix}-${year}-${month}`">
        <div class="ces-card-date__title"
             v-text="getMonthName(year, month)"></div>
        <div class="ces-card-date__buttons">
          <div class="ces-card-date__button"
               v-for="(index, day) in monthCollection"
               :key="`${prefix}-${year}-${month}-${day}`"
               :class="{'ces-card-date__button--selected': index === value}"
               @click="$emit('input', index)">
            <div v-text="day"></div>
            <div class="ces-card-date__options">
              <div class="ces-card-date__option"
                   v-for="option in getOptions({year, month, day})"
                   :key="`${prefix}-${year}-${month}-${day}-${option}`"
                   :style="{'background-color': option}"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayJs from 'dayjs'

require('dayjs/locale/ru')

export default {
  name: 'CardDate',
  props: {
    value: Number,
    dates: Array,
    prefix: {
      type: String,
      default: null
    },
    extra: Object
  },

  computed: {
    dictionary() {
      let obj = {}
      this.dates.map((item, index) => {
        let date = dayJs(item), [year, month] = [date.year(), date.month()]
        if (!(year in obj)) obj[year] = {}
        if (!(month in obj[year])) obj[year][month] = {}
        obj[year][month][date.date()] = index
      })
      return obj
    }
  },

  methods: {
    getMonthName(year, month) {
      return dayJs()
        .locale('ru')
        .set('year', year)
        .set('month', month)
        .format('MMMM YYYY')
    },

    getOptions({year, month, day}) {
      let result = [], date = dayJs(new Date(year, month, day)).format('YYYY-MM-DD')
      Object.keys(this.extra).map(option => {
        if (this.extra[option].value.length && ~this.extra[option].value.indexOf(date)) {
          result.push(this.extra[option].color)
        }
      })
      return result
    }
  }
}
</script>

<style lang="scss">
.ces-card-date {
  &__row {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  &__title {
    width: 130px;
    text-align: right;
    padding-right: 10px;

    @media (max-width: 959px) {
      width: 50px
    }
  }

  &__button {
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, .25);
    color: #fff;
    text-align: center;
    line-height: 30px;
    margin: 2px;
    cursor: pointer;
    transition: background-color .3s ease;
    position: relative;

    &--selected, &:hover {
      background-color: rgba(0, 0, 0, 1)
    }
  }

  &__options {
    position: absolute;
    bottom: 0;
    left: 0;
    line-height: 12px;
    height: 12px;
    width: 100%;
  }

  &__option {
    width: 4px;
    height: 4px;
    margin: 1px;
    display: inline-block;
    border-radius: 50%;
  }
}
</style>