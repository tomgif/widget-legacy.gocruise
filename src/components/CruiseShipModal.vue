<template>
  <tiny-modal @close="$emit('input', false)">
    <template #header>Информация о лайнере</template>
    <template #body>
      <loader-spinner v-if="isLoading"></loader-spinner>
      <tab-menu id="ces-tabs">
        <tab-menu-item name="Описание лайнера" :selected="true">
          <div class="ces-ship__content">
            <div class="ces-ship__gallery" v-if="gallery.length">
              <lin-gallery :items="gallery"></lin-gallery>
            </div>
            <div class="ces-ship__spec">
              <div class="ces-ship__title">Описание лайнера:</div>
              <div class="ces-ship__row">
                <div class="ces-bold">Лайнер:</div>
                <span v-text="ship.title"></span>
              </div>
              <div class="ces-ship__row" v-for="(spec, index) in ship.spec" :key="`${index}`">
                <div class="ces-bold">
                  {{ spec.name }}:
                </div>
                <span v-text="spec.value"></span>
              </div>
            </div>
          </div>
          <div class="ces-ship__description" v-html="ship.description"></div>
        </tab-menu-item>
        <tab-menu-item name="Каюты">
          <div class="ces-cabins" v-for="(category, key, index) in categories" :key="`${index}`">
            <div class="ces-cabins__category" v-text="`${key}`"></div>
            <div class="ces-cabins__experience-list">
              <div class="ces-cabins__experience-item"
                   v-for="experience in category"
                   :key="`${experience.id}`">
                <span class="ces-cabins__code" v-text="experience.vendorCode"></span>
                <span class="ces-cabins__title"
                      @click="show('CruiseCabinModal', getCabinByCode(experience.vendorCode))">
                  <span v-text="experience.experience"></span>
                </span>
              </div>
            </div>
          </div>
        </tab-menu-item>
      </tab-menu>
      <component :is="component" v-model="content"></component>
    </template>
  </tiny-modal>
</template>

<script>
import {mapState} from 'vuex'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import omit from 'lodash/omit'
import modal from '../mixins/modal'
import LoaderSpinner from '../components/LoaderSpinner.vue'
import TinyModal from '../components/TinyModal.vue'
import TabMenu from '../components/TabMenu.vue'
import TabMenuItem from '../components/TabMenuItem.vue'
import LinGallery from 'lingallery'

export default {
  name: 'CruiseShipModal',
  props: ['value'],
  mixins: [modal],
  components: {LoaderSpinner, TinyModal, TabMenu, TabMenuItem, LinGallery},
  data() {
    return {
      content: false,
      component: false
    }
  },

  computed: {
    ...mapState({
      isLoading: state => state.main.isLoading,
      ship: state => state.cruises.ship
    }),

    gallery() {
      let gallery = [];
      if (this.ship.gallery.length) {
        this.ship.gallery.map(item => {
          gallery.push({src: item.url, thumbnail: item.url, caption: item.title})
        })
      }
      return gallery
    },

    categories() {
      return mapValues(
        groupBy(this.ship.cabinCategories, 'type'),
        list => list.map(category => omit(category, 'type'))
      )
    }
  }
}
</script>

<style lang="scss">
.ces-ship {
  font-size: 14px;

  &__title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__content {
    display: flex;
    flex-flow: row;

    @media (max-width: 767px) {
      flex-flow: column
    }
  }

  &__gallery {
    margin-right: 16px;
    flex: 50%;
  }

  &__spec {
    flex: 50%
  }

  &__description {
    margin: 16px 0;

    ul {
      list-style: unset;
      padding-left: 16px;
    }
  }

  .lingallery_thumbnails {
    img {
      width: 64px
    }
  }
}

.ces-cabins {
  display: flex;
  flex-flow: column;
  margin-bottom: 8px;
  cursor: pointer;

  &__title {
    display: inline-block;
    border-bottom: 1px dotted rgba(0, 0, 0, 1);

    &:hover {
      border-bottom: 1px solid rgba(0, 0, 0, .5)
    }
  }

  &__code {
    display: inline-block;
    text-align: center;
    line-height: 24px;
    border-radius: 50%;
    font-size: 12px;
    font-weight: bold;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    background-color: rgba(0, 0, 0, .25);
  }

  &__category {
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__experience-list {
    display: inline-flex;
    flex-flow: row;
  }

  &__experience-item {
    margin: 0 4px;
    white-space: nowrap;
  }
}
</style>