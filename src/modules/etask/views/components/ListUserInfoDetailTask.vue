<template>
  <v-layout column>
    <div class="list-customer pa-2">
      <div
        v-for="(item, ind) in items"
        :key="'user' + ind"
        class="list-item-customer pb-2"
      >
        <div class="d-flex align-center">
          <v-avatar
            :color="lstColors[ind % 5]"
            size="32"
          >
            <span class="white--text text-h6 text-uppercase">
              {{ renderAvatarText(item.userFullName) }}
            </span>
          </v-avatar>
          <v-list-item class="pl-2">
            <v-list-item-content>
              <v-list-item-title>
                {{ renderCustomerName(item) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ renderCustomerInfo(item) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-ellipsis mw-290">
                <span>
                  {{ renderCustomerContact(item) }}
                </span>
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="item.phone" class="d-flex align-center">
                <i class="app-icon icon-phone-call gray icon-size-12 mr-1"></i>
                {{ renderCustomerPhone(item) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </div>
      </div>
    </div>
  </v-layout>
</template>
<script>
import RenderInfoUser from "@/modules/etask/mixins/RenderInfoUser";

export default {
  mixins: [RenderInfoUser],
  props: {
    items: {
      type: Array,
      default: undefined
    },
    lstColors: {
      type: Array,
      default: undefined
    },
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.list-customer{
  max-height: 300px;
}
.total-customer {
  color: #9fa2b4;
}

</style>
