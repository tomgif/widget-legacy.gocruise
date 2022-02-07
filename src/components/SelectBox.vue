<template>
  <div class="ces-select-box ces-search-control"
       @blur="active = false"
       v-click-outside="onClickOutside">
    <div class="ces-select-box__inner">
      <div class="ces-select-box__label" v-text="label"></div>
      <div class="ces-select-box__value"
           :class="{'ces-select-box__value--active': active}"
           @click="active = !active" v-text="selectedValuesLabel"
      ></div>
      <div class="ces-select-box__options" v-if="active">
        <div class="ces-select-box__options-inner"
             :class="{'ces-select-box__options-inner--short': filteredOptions.length < 10}">
          <div class="ces-select-box__option"
               :class="{
                  'ces-checkbox-option': isMultiple,
                  'ces-select-box__option--selected': !value
               }"
               v-if="defaultValue !== false"
               @click="onSelectDefault">
            <div :class="{
                'ces-checkbox-option__label': isMultiple,
                'ces-checkbox-option__label--checked': isMultiple ? !value.length : false
              }"
              v-text="defaultValueLabel"></div>
          </div>
          <div class="ces-select-box__option" :class="getOptionClass(option.id)"
               v-for="option in filteredOptions"
               :key="`${option.id}`"
               @click="onSelect(option.id)">
            <div :class="getOptionLabelClass(option.id)"
                 v-if="!option.description"
                 v-text="option.title"></div>
            <div :class="getOptionLabelClass(option.id)"
                 v-if="option.description"
                 :content="option.description"
                 v-text="option.title"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vClickOutside from 'v-click-outside'
import orderBy from 'lodash/orderBy'

export default {
  name: 'SelectBox',
  props: {
    value: [Number, Array, String],
    label: String,
    options: {
      type: Object,
      default: () => ({})
    },
    optionsSort: {
      type: String,
      default: 'id'
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    defaultValue: null,
    defaultValueLabel: {
      type: String,
      default: 'Не выбрано'
    },
    filters: {
      type: Array,
      default: () => ([])
    }
  },

  directives: {
    clickOutside: vClickOutside.directive
  },

  watch: {
    active(value) {
      if (value) this.$emit('focus')
    }
  },

  data() {
    return {
      active: false
    }
  },

  computed: {
    selectedValuesLabel() {
      if (this.filteredOptions.length > 0) {
        if (this.isMultiple) {
          let selected = this.value.map(id => this.options[id]['title']).join(', ')
          return selected.length ? selected : this.defaultValueLabel
        }
        if (!(!this.value || !this.options[this.value])) {
          return this.options[this.value]['title']
        }
      }
      return this.defaultValueLabel
    },

    filteredOptions() {
      let options = orderBy(this.options, [this.optionsSort], ['asc'])

      if (this.filters.length) {
        options = options.filter(option => !!~this.filters.indexOf(option.id))
      }

      return options
    }
  },

  methods: {
    onSelect(id) {
      if (this.isMultiple) {
        let value = this.value
        const index = this.value.indexOf(id)
        const args = index !== -1 ? ['splice', index, 1] : ['push', id]
        Array.prototype[args.shift()].call(value, ...args)
        this.$emit('input', value.sort((a, b) => a - b))
      } else {
        this.$emit('input', id)
        this.active = false
      }
    },

    onSelectDefault() {
      if (this.isMultiple) {
        this.$emit('input', [])
      } else {
        this.$emit('input', this.defaultValue)
        this.active = false
      }
    },

    onClickOutside() {
      this.active = false
    },

    getOptionClass(id) {
      return {
        'ces-checkbox-option': this.isMultiple,
        'ces-select-box__option--selected': !this.isMultiple && this.value === id
      }
    },

    getOptionLabelClass(id) {
      return {
        'ces-checkbox-option__label': this.isMultiple,
        'ces-checkbox-option__label--checked': this.isMultiple && !!~this.value.indexOf(id)
      }
    }
  }
}
</script>

<style lang="scss">
.ces-select-box {
  &__inner {
    padding: 8px
  }

  &__value {
    padding: 4px 24px 4px 8px;
    color: #000;
    background-color: #fff;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    position: relative;

    &:after {
      content: '';
      top: 8px;
      right: 8px;
      position: absolute;
      width: 8px;
      height: 8px;
      border-left: 2px solid #000;
      border-bottom: 2px solid #000;
      transform: rotate(-45deg);
    }

    &--active {
      &:after {
        top: 12px;
        transform: rotate(-225deg);
      }
    }
  }

  &__options {
    position: absolute;
    z-index: 10;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 0 20px rgba(0, 0, 0, .45);
    font-size: 85%;

    &-inner {
      overflow: auto;
      height: 192px;

      &--short {
        height: auto
      }
    }

    &:before {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 8px 8px 8px;
      border-color: transparent transparent #fff transparent;
      top: -8px;
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
    }
  }

  &__option {
    padding: 6px 8px;
    cursor: pointer;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    color: #000;

    &:hover {
      background-color: #e8ecef
    }

    &--selected {
      color: #999
    }
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
    margin-bottom: 4px;
  }
}

.ces-checkbox-option {
  &__label {
    display: block;
    position: relative;
    font-size: 12px;
    line-height: 16px;
    cursor: pointer;
    padding-left: 20px;

    &:before {
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      background-color: #808285;
      border-radius: 2px;
      position: absolute;
      left: -2px;
      top: 0;
    }

    &--checked {
      &:after {
        content: '';
        position: absolute;
        top: 4px;
        left: 2px;
        width: 8px;
        height: 5px;
        border-left: 1px solid #fff;
        border-bottom: 1px solid #fff;
        transform: rotate(-45deg);
      }
    }
  }
}
</style>