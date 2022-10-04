<template>
  <div class="group-avatar-signer col-12 pa-0">
    <div class="signer-avatar">
      <template>
        <v-avatar
          size="32"
          color="#00C3F9"
        >
          <img
            alt=""
            src="@/assets/icons/calendar/avatar-group.svg"
            class="cursor-pointer"
          >
        </v-avatar>
        <div class="text-ellipsis">
          <span class="name-group">{{ item.participantName }}</span>
        </div>
      </template>
      <div class="signer-tooltip">
        <div class="d-flex align-center">
          <v-avatar
            size="40"
            color="#00C3F9"
          >
            <img
              alt=""
              src="@/assets/icons/calendar/avatar-group.svg"
              class="cursor-pointer"
            >
          </v-avatar>
          <div class="d-flex flex-column pl-2 text-left col-10">
            <div class="text-ellipsis">
              <b>{{ item.participantName }}</b>
            </div>
            <div class="signer-document text-ellipsis">
              <span> {{ item.groupPathName }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AvatarCreator',
  props: {
    item: {
      type: Object,
      default: undefined
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

.name-group {
  font-weight: 800;
  font-size: 14px;
  line-height: 18px;
}

</style>
