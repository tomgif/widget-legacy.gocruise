<template>
  <div class="ces-cabin">
    <div class="ces-cabin__gallery">
      <lin-gallery :items="photos"></lin-gallery>
      <small class="ces-cabin__description" v-html="note"></small>
    </div>
    <div class="ces-cabin__description" v-html="description"></div>
  </div>
</template>

<script>
import LinGallery from 'lingallery'

export default {
  name: 'CabinDetail',
  components: {LinGallery},
  props: {
    photos: Array,
    note: String,
    description: String
  }
}
</script>

<style lang="scss">
.ces-cabin {
  display: flex;
  flex-flow: row;

  @media (max-width: 575px) {
    flex-flow: column
  }

  &__gallery {
    flex: 50%;
    margin-right: 8px;
  }

  &__description {
    flex: 50%
  }

  .lingallery_thumbnails {
    img {
      width: 64px
    }
  }
}
</style>