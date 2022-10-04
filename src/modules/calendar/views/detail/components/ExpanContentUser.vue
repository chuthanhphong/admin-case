<template>
  <div class="row position-relative">
    <div class="col-4 d-flex align-center ma-auto" style="gap: 5px">
      <v-avatar
        size="32"
        class="signer-avatar"
        color="#00C3F9"
      >
        <span class="text-uppercase white--text">
          {{ getFirstCharacter(item.participantName) }}
        </span>
      </v-avatar>
      <span>{{ item.participantName }}</span>
    </div>
    <div class="col-4 ma-auto">
      <span>{{ item.email }}</span>
    </div>
    <div class="col-4 ma-auto">
      <span>{{ item.phone }}</span>
    </div>
    <span v-show="expandedParent === 0" class="icon-award"></span>
  </div>
</template>
<script>

export default {
  props: {
    item: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {}
  }
}
</script>
