<template>
  <transition name="ces-modal-fade">
    <div class="ces-modal-backdrop">
      <div :class="{'ces-modal-overlay': backdrop}" @click="close"></div>
      <div class="ces-modal" role="dialog">
        <header class="ces-modal-header">
          <slot name="header"></slot>
          <button type="button" class="ces-modal-close" @click="close">
            <span class="ces-icon ces-icon-close"></span>
          </button>
        </header>
        <section class="ces-modal-body">
          <slot name="body"></slot>
        </section>
        <footer class="ces-modal-footer">
          <slot name="footer"></slot>
          <button type="button" class="ces-modal-footer__button ces-modal-footer__button--close" @click="close">
            Закрыть
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'TinyModal',
  props: {
    backdrop: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.ces-modal-backdrop {
  position: fixed;
  z-index: 10;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ces-modal-overlay {
  position: fixed;
  z-index: 10;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
}

.ces-modal {
  background-color: #fff;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  max-height: 90%;
  z-index: 20;
}

.ces-modal-header,
.ces-modal-footer {
  padding: 8px;
  display: flex;
}

.ces-modal-header {
  border-bottom: 1px solid #eee;
  justify-content: space-between;
  font-size: 20px;
}

.ces-modal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;

  &__button {
    border: 0;
    background: 0;
    font-size: 16px;
    margin: 0 8px;
    text-transform: uppercase;
    cursor: pointer;

    &--close {
      opacity: .25;
      will-change: opacity;
      transition: opacity .3s ease;
    }

    &:focus, &:hover, &:active {
      outline: 0;
      opacity: 1;
    }
  }
}

.ces-modal-body {
  position: relative;
  padding: 8px;
  overflow: auto;
}

.ces-modal-close {
  border: 0;
  background: 0;
  cursor: pointer;
  margin-left: auto;
  opacity: .25;
  transition: opacity .3s ease;
  will-change: opacity;
  width: 16px;
  height: 16px;

  &:focus {
    outline: 0
  }

  &:focus, &:hover, &:active {
    opacity: 1
  }
}

.ces-modal-fade-enter,
.ces-modal-fade-leave-active {
  opacity: 0
}

.ces-modal-fade-enter-active,
.ces-modal-fade-leave-active {
  transition: opacity .5s ease
}
</style>