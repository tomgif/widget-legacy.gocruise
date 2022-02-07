<template>
  <tiny-modal @close="$emit('input', false)">
    <template #header>
      {{ `${title} ${experience} ${code}` }}
    </template>
    <template #body>
      <div>
        <p v-if="!value.photos.length">Изображения отсутствуют</p>
        <cabin-detail :photos="value.photos.map(item => ({src: item, thumbnail: item}))"
                      :description="value.description"
                      :note="value.note"
                      v-if="value.photos.length"
        ></cabin-detail>
      </div>
    </template>
  </tiny-modal>
</template>

<script>
import TinyModal from './TinyModal.vue'
import CabinDetail from './CabinDetail.vue'

export default {
  name: 'CruiseCabinModal',
  components: {TinyModal, CabinDetail},
  props: ['value'],
  computed: {
    title() {
      return this.value.title
    },

    experience() {
      return this.value.experience
    },

    code() {
      return this.value.vendorCode
    }
  }
}
</script>