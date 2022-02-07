<template>
  <tiny-modal @close="$emit('input', false)">
    <template #header>
      Бронирование
    </template>
    <template #body>
      <div class="ces-book" v-if="!response">
        <div class="ces-book__title">Круиз &laquo;{{ value.title }}&raquo;</div>
        <div class="ces-cruise-row ces-cruise-modal">
          <ul class="ces-book__list">
            <li>
              <label>Дата круиза:</label>
              <span>
                <strong class="ces-bold" v-text="value.date"></strong>
              </span>
            </li>
            <li>
              <label>Каюта категории</label>
              <span>
                <strong class="ces-bold" v-text="value.category"></strong>
                ({{ value.type }} ({{ value.experience }}))
              </span>
            </li>
            <li>
              <label>Стоимость:</label> <span>
              <strong class="ces-bold" v-text="value.price"></strong>
            </span>
            </li>
            <li>
              <label>Взрослых:</label>
              <span>
                <strong class="ces-bold" v-text="value.occupancy.adults"></strong>
              </span>
            </li>
            <li v-if="value.occupancy.children.length">
              <label>Детей:</label>
              <span>
                <strong class="ces-bold" v-text="value.occupancy.children.length"></strong>
                ({{ value.occupancy.children.join(', ') }} лет)
              </span>
            </li>
          </ul>
        </div>

        <div class="ces-book__title">Контактные данные</div>
        <div class="ces-cruise-row ces-cruise-modal">
          <div class="ces-cruise-row ces-book__row">
            <label class="ces-book__label" for="name">Имя</label>
            <div class="ces-book__control">
              <input id="name" class="ces-book__field" type="text" v-model="name">
              <div class="ces-book__error" v-if="!name">Поле не заполнено</div>
            </div>
          </div>

          <div class="ces-cruise-row ces-book__row">
            <label class="ces-book__label" for="contact">Телефон или e-mail</label>
            <div class="ces-book__control">
              <input id="contact" class="ces-book__field" type="text" v-model="contact">
              <div class="ces-book__error" v-if="!contact">Поле не заполнено</div>
            </div>
          </div>
        </div>

        <div class="ces-cruise-row ces-book__row">
          <label class="ces-book__label" for="note">Примечание</label>
          <div class="ces-book__control">
            <textarea id="note" class="ces-book__textarea" v-model="note"></textarea>
          </div>
        </div>
      </div>

      <div v-if="response">Заявка на бронирование отправлена</div>
    </template>

    <template #footer v-if="!response && name && contact && value.email">
      <button class="ces-modal-footer__button" type="button" @click="submit">
        Забронировать
      </button>
    </template>
  </tiny-modal>
</template>

<script>
import TinyModal from './TinyModal.vue'

export default {
  name: 'CruiseBookForm',
  components: {TinyModal},
  props: ['value'],
  data() {
    return {
      response: false
    }
  },

  computed: {
    name: {
      get() {
        return this.$store.state.main.name
      },

      set(value) {
        this.$store.commit('main/SET_NAME', value)
      }
    },

    contact: {
      get() {
        return this.$store.state.main.contact
      },

      set(value) {
        this.$store.commit('main/SET_CONTACT', value)
      }
    },

    note: {
      get() {
        return this.$store.state.main.note
      },

      set(value) {
        this.$store.commit('main/SET_NOTE', value)
      }
    },

    info() {
      let {value, name, contact, note} = this
      return {...value, name, contact, note}
    }
  },

  methods: {
    submit() {
      if (this.name && this.contact) {
        this.send()
      }
    },

    async send() {
      this.post().then(response => {
        this.response = response
      }).catch(() => {
        alert('Произошла непредвиденная ошибка. Перезагрузите страницу или попробуйте позднее.')
      })
    },

    async post() {
      this.$store.commit('main/SET_LOADING', true)
      let response = await fetch(process.env.VUE_APP_MAILER_HOST, {
        method: 'POST',
        body: JSON.stringify(this.info)
      })

      this.$store.commit('main/SET_LOADING', false)

      return response.json();
    }
  }
}
</script>

<style lang="scss">
.ces-book {
  &__row {
    padding: 0 4px;
  }

  &__error {
    position: absolute;
    top: 100%;
    width: 100%;
    left: 0;
    margin-top: -1px;
    padding: 0 5px;
    border-radius: 2px;
    background-color: #ff4425;
    color: #fff;
    font: 11px/15px Roboto, sans-serif;
    z-index: 20;
  }

  &__list {
    font: 12px/16px Arial, sans-serif;
    padding-bottom: 4px;
    color: #000;
    position: relative;
    display: block;
    width: 100%;
    min-height: 9px;
    vertical-align: top;
    white-space: nowrap;

    li {
      display: flex;
      flex-flow: row nowrap;
      padding: 2px 0;
    }

    span {
      border-bottom: 1px solid;
      padding-left: 20px;
      width: 100%;
    }

    label, span {
      float: left;
    }
  }

  &__title {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
  }

  &__control, &__label {
    width: 100%;
    display: block;
    clear: both;
  }

  &__control {
    position: relative
  }

  &__label {
    font: 9px/9px Arial, sans-serif;
    padding-bottom: 4px;
    color: #000;
    text-transform: uppercase;
    position: relative;
    display: block;
    width: 100%;
    min-height: 9px;
    vertical-align: top;
    white-space: nowrap;
  }

  &__field {
    border: none;
    border-radius: 2px;
    font: 700 14px/18px Arial, sans-serif;
    color: #000;
    width: 100%;
    height: 26px;
    padding: 0 8px;
    box-shadow: inset 0 0 1px 0 #666;
  }

  &__textarea {
    display: block;
    padding: 4px 8px;
    border: none;
    border-radius: 2px;
    font: 700 14px/18px Arial, sans-serif;
    color: #000;
    width: 100%;
    height: 78px;
    box-shadow: inset 0 0 1px 0 #666;
  }
}
</style>