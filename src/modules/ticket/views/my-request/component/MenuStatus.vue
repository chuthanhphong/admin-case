<template>
  <v-menu
    ref="menuStatus"
    bottom
    origin="center center"
    transition="scale-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined class="text--normal" v-bind="attrs" v-on="on">
        {{ computedTextMenuName }}
        <i class="app-icon icon-select-checked gray ml-1"></i>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, index) in menuItems"
        :key="index"
        @click="changeMenu(item)"
      >
        <v-menu
          v-if="item.child"
          offset-x
          right
          bottom
          origin="center center"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-content v-bind="attrs" v-on="on">
              <v-list-item-title v-text="$t(item.name)" />
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-icon>
          </template>
          <v-list>
            <v-list-item
              v-for="(itemChild, idx) in item.child"
              :key="idx"
              @click="changeMenuChild(itemChild)"
            >
              <v-list-item-title>{{ $t(itemChild.name) }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-list-item-title v-else>
          {{ $t(item.name) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  props: {
    menu: {
      type: Object,
      default: undefined,
    },
    menuChild: {
      type: Object,
      default: undefined,
    },
    menuItems: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {};
  },
  computed: {
    computedTextMenuName() {
      if (this.menuChild) {
        return `${this.$t(this.menu.name)} (${this.$t(this.menuChild.name)})`;
      }
      return this.$t(this.menu.name);
    },
  },
  methods: {
    changeMenu(item) {
      this.$emit("change-menu", item, false);
    },
    changeMenuChild(item) {
      this.$refs.menuStatus.isActive = false;
      this.$emit("change-menu", item, true);
    },
  },
};
</script>
