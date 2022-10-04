export default {
  data() {
    return {
      animated: false
    }
  },
  methods: {
    startAnimated() {
      setTimeout(() => {
        this.animated = true
      }, 50)
    }
  }
}
