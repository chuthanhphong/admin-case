<template>
  <v-menu
    v-model="menuDate"
    bottom
    origin="center center"
    offset-y
    transition="scale-transition"
    attach
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="menuComplete ? $t(menuComplete.name) : $t(menu)"
        outlined
        dense
        v-bind="attrs"
        class="text--body-5"
        name="txtSearch"
        readonly
        hide-details="auto"
        v-on="on"
        @click:append="menuDate = !menuDate"
      >
        <template v-slot:append>
          <img
            src="@/assets/icons/task/icon-check-date.svg"
            alt=""
            class="hover--pointer"
            @click="menuDate = !menuDate"
          >
        </template>
      </v-text-field>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, index) in menuTask"
        :key="index"
        @click="changeMenuTask(item)"
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
            <label
              class="v-list-item__title label-complete"
              dark
              v-bind="attrs"
              v-on="on"
            >
              {{ $t(item.name) }}
            </label>
          </template>
          <v-list>
            <v-list-item
              v-for="(itemChild, idx) in item.child"
              :key="idx"
              @click="changeMenuComplete(itemChild)"
            >
              <v-list-item-title>{{ $t(itemChild.value) }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-list-item-title
          v-else
        >
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
      type: String,
      default: undefined
    },
    menuComplete: {
      type: Object,
      default: undefined
    },
    menuTask: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      menuDate: null,
      dateRangeText: null
    }
  },
  methods: {
    changeMenuTask(item) {
      this.$emit('change-menu-task', item)
    },
    changeMenuComplete(item) {
      this.menuDate = null
      this.$emit('change-menu-complete', item)
    }
  }
}
</script>
<style scoped>
  .btn-menu-date {
    border-collapse: collapse;
    border-color: rgba(0, 0, 0, 0.38);
    border-style: solid;
    border-width: 1px;
    margin-right: 16px !important;
    background: transparent !important;
    box-shadow: unset;
    color: unset;
    text-transform: unset
  }
  .btn-menu-date:hover {
    border: thin solid currentColor;
    background: none !important;
  }
  .btn-menu-date:focus {
    border: 2px solid #0fafe4;
  }
  .label-complete {
    position: absolute;
    right: 0;
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 0 10px;
  }
</style>
