<template>
  <v-scale-transition>
    <div v-if="checkShowItemCard" v-bind="$attrs">
      <v-card
        class="pa-4 card-dashboard d-flex justify-space-between gradient-info"
        :href="createContract"
        @click="showDialogAddNew"
      >
        <div class="card-header d-flex justify-space-between">
          <div class="card-info">
            <div class="card-name white--text text--subtitle">
              {{ $t(item.name) }}
            </div>
            <h2 class="card-value white--text">
              {{ $t(item.value) }}
            </h2>
          </div>
        </div>
        <div class="card-icon rounded-circle align-self-center">
          <!-- <div class="border-item-create">
            <v-icon color="gray--text" size="30">
              {{ item.icon }}
            </v-icon>
          </div> -->
          <img
            src="@/assets/icons/ic_create_edoc.svg"
            alt="create"
            width="50"
            height="50"
          />
        </div>
      </v-card>
    </div>
  </v-scale-transition>
</template>

<script>
import routePaths from "@/router/routePaths";
import constants from "@/constants";
// import edocumentRoute from "@/modules/edocument/router/routePaths";
export default {
  name: "CardItem",
  props: {
    item: {
      type: Object,
      default: undefined,
    },
    isCreateCard: {
      type: Boolean,
      default: false,
    },
    isRoleVT: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      routePaths,
      //   createContract: `${edocumentRoute.CREATE_MANAGEMENT_DOC_PATH}`,
      createContract: "",
    };
  },
  computed: {},
  methods: {
    checkShowItemCard() {
      if (
        !this.isRoleVT &&
        this.item.key === constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_EXPIRE
      ) {
        return false;
      }
      return true;
    },
    showDialogAddNew() {
      this.$emit("show-dialog-add-new");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";
.gradient-info {
  background: linear-gradient(135deg, #868cff 0%, #4318ff 100%);
}
.card-dashboard {
  .card-icon {
    width: 64px !important;
    height: 64px !important;
  }
  .border-item {
    padding: 5px;
    border: 3px solid #4a50e2;
    border-radius: 50%;
  }
  .border-item-create {
    padding: 3px;
    border: 6px solid #4a50e2;
    border-radius: 50%;
  }
  border-radius: 20px;
  min-height: 130px;
  .card-header {
    padding: 6px;
    .card-info {
      .card-name {
        text-align: left;
        color: #fff;
        font-weight: 600;
        font-size: 18px;
      }
      .card-value {
        font-size: 34px;
        color: #fff;
        font-weight: 800;
      }
    }
  }
  .card-icon {
    background: #ffffff !important;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 15px;
    top: 30%;
    transform: translateY(-50%);
  }
  .card-body {
    position: absolute;
    bottom: 15px;
  }
  &.gradient-info {
    .card-icon {
      background: #ffffff !important;
    }
  }
}
@media (max-width: 640px) {
  .card-dashboard {
    width: 100%;
  }
}
</style>
