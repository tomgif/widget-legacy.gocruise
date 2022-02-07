<template>
  <div class="ces-overlay">
    <div class="ces-loader"></div>
  </div>
</template>

<script>
export default {
  name: 'LoaderSpinner'
}
</script>

<style lang="scss">
.ces-overlay {
  background-color: #000;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: .75;
  transition: opacity .5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ces-loader {
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 5px solid rgba(255, 255, 255, 0.2);
  border-right: 5px solid rgba(255, 255, 255, 0.2);
  border-bottom: 5px solid rgba(255, 255, 255, 0.2);
  border-left: 5px solid #ffffff;
  transform: translateZ(0);
  animation: ces-load 1.1s infinite linear;
  border-radius: 50%;
  width: 5em;
  height: 5em;

  &:after {
    border-radius: 50%;
    width: 5em;
    height: 5em;
  }
}

@-webkit-keyframes ces-load {
  0% {
    transform: rotate(0deg)
  }

  100% {
    transform: rotate(360deg)
  }
}

@keyframes ces-load {
  0% {
    transform: rotate(0deg)
  }

  100% {
    transform: rotate(360deg)
  }
}
</style>