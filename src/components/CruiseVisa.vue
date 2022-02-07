<template>
  <tiny-modal @close="$emit('input', false)">
    <template #header>
      {{ `Требования по визам: ${value.title}` }}
    </template>
    <template #body>
      <accordion-menu :data="value.options"></accordion-menu>
    </template>
  </tiny-modal>
</template>

<script>
import TinyModal from './TinyModal.vue'
import AccordionMenu from './AccordionMenu.vue'

export default {
  name: 'CruiseVisa',
  components: {TinyModal, AccordionMenu},
  props: ['value']
}
</script>