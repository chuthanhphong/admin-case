<template>
  <v-breadcrumbs :items="items" :class="clazz">
    <template v-slot:divider>
      <v-icon color="#7FDDF1" size="20">mdi-chevron-right</v-icon>
    </template>
    <v-breadcrumbs-item
      slot="item"
      slot-scope="{ item }"
      large
      :to="item.href"
      :disabled="item.disabled"
      active-class="active"
      class="text-capitalize"
      :replace="true"
      :class="item.disabled ? `disabled` : ``"
      :style="item.disabled && !item.tooltip ? 'pointer-events: none' : ''"
    >
      <v-tooltip v-if="item.tooltip" bottom>
        <template v-slot:activator="{ on }">
          <h4 v-on="on">{{ item.text }}</h4>
        </template>
        <span>{{ item.text }}</span>
      </v-tooltip>
      <h4 v-else>{{ $t(item.text) }}</h4>
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  props: {
    items: {
      type: Array,
      default: undefined
    },
    clazz: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.v-breadcrumbs__item {
  h4 {
    color: #7fddf1 !important;
  }
  &.active {
    h4 {
      color: #fff !important;
    }
  }
}
.breadcrumb-text-calendar {
  .v-breadcrumbs__item {
    h4 {
      color: #A7A7AB !important;
    }
    &.active {
      h4 {
        color: #00C3F9 !important;
      }
    }
  }
}
</style>
