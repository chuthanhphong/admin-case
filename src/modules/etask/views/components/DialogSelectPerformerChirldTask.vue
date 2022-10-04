<template>
  <div
    v-if="showDialog"
    class="dialog-select-user"
  >
    <div class="dia-log-select-performer">
      <v-card-title class="d-flex justify-center flex-column">
        <h4><span class="title-dialog-select-user">{{ $t('task-manager.label.perfomer') }}</span></h4>
      </v-card-title>
      <v-container>
        <v-row class="mt-3">

        </v-row>
      </v-container>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogSelectPerformer',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    listUser: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      keyword: '',
      userSelected: null,
      isUpdating: false,
      autoUpdate: true
    }
  },
  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000)
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('user-selected', this.userSelected)
      this.$emit('close-dialog')
    },
    trimSpace(val) {
      return val ? val.trim() : null
    },
    remove() {
      this.userSelected = {}
    },
    submit() {
      this.$emit('close-dialog')
      this.$emit('user-selected', this.userSelected)
    },
  }
}
</script>

<style scoped>

</style>
