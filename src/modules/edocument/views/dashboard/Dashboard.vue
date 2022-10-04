<template>
  <div class="wrap-dashboard edocument-font">
    <v-container fluid class="rounded-xl bg-seconds pa-0">
      <v-container grid-list-xs class="pa-0">
        <p class="title-dashboard">
          {{ $t("managementDoc.dashboards.overview") }}
        </p>
        <v-card v-show="showIntro" color="#00C3F9" class="white--text my-3">
          <div
            class="d-flex align-center justify-space-between px-8 py-6 flex-column flex-md-row"
          >
            <div
              v-html="
                $t('managementDoc.dashboardIntro', {
                  fullName: userInfo.fullName,
                })
              "
            />
            <div>
              <v-img src="@/assets/intro.png" />
            </div>
          </div>
        </v-card>
        <div class="row justify-space-between">
          <card-item
            v-for="item in cardItems"
            v-show="showCard"
            :key="item.name"
            class="col-12 col-sm-6"
            :class="(isRoleVT && 'col-md-3') || 'col-md-4'"
            :item="item"
            :is-role-v-t="isRoleVT"
          />
          <card-item
            v-show="showCard"
            class="col-12 col-sm-6"
            :class="(isRoleVT && 'col-md-3') || 'col-md-4'"
            :item="cardCreate"
            :is-create-card="true"
          />
        </div>
        <v-scroll-y-transition>
          <contract-wait-sign
            v-show="showCard"
            @update-show-intro="updateShowIntro"
          />
        </v-scroll-y-transition>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardItem from "./component/CardItem";
import ContractWaitSign from "@/modules/edocument/views/dashboard/component/ContractWaitSign";
import { DocumentService } from "@/modules/edocument/services/documentService";
import constants from "@/constants";
import edocumentRoute from "@/modules/edocument/router/routePaths";

export default {
  name: "Home",
  components: {
    CardItem,
    ContractWaitSign,
  },
  data() {
    return {
      showChangePassword: false,
      showCard: false,
      counts: [],
      cardItems: [
        {
          key: constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_CREATE,
          name: "managementDoc.dashboards.icreate",
          value: null,
          icon: "icon-icreate",
          iconColor: "process",
          remainText: "managementDoc.dashboards.icreateDocument",
          link: `${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}?searchCriteria=${constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_CREATE}`,
          bgColor: "#ffaf2e",
        },
        {
          key: constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_RECEIVE,
          name: "managementDoc.dashboards.receive",
          value: null,
          icon: "icon-receive",
          iconColor: "completed",
          remainText: "managementDoc.dashboards.receiveDocument",
          link: `${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}?searchCriteria=${constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_RECEIVE}`,
          bgColor: "#0FAFE4",
        },
        {
          key: constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_EXPIRE,
          name: "managementDoc.dashboards.expire",
          value: null,
          icon: "icon-expire",
          iconColor: "reject",
          remainText: "managementDoc.dashboards.expireDocument",
          link: `${edocumentRoute.DOCUMENT_MANAGEMENT_PATH}?searchCriteria=${constants.SEARCH_TYPE_DOCUMENT.EDOCUMENT_EXPIRE}`,
          bgColor: "#FF4A55",
        },
      ],
      cardCreate: {
        name: "managementDoc.dashboards.document",
        value: "managementDoc.dashboards.create",
        icon: "mdi-plus-circle-outline",
        iconColor: "white",
      },
      showIntro: false,
      isRoleVT: false,
    };
  },
  computed: {
    ...mapState("layout", ["userInfo"]),
  },
  created() {
    localStorage.setItem(constants.LIST_CONTRACT_ROOT, "created");
    this.countDocument();
    const user = JSON.parse(localStorage.getItem(constants.USER_INFO));

    if (user) {
      this.setUserInfo(user);

      if (user.roles.includes("VT")) {
        this.isRoleVT = true;
      }
    }
    setTimeout(() => {
      this.showCard = true;
    }, 10);
  },
  methods: {
    ...mapActions("layout", ["setNotify", "setUserInfo"]),
    showMenu() {
      const roles = constants.USER_ROLE.HDDT;
      return (
        this.userInfo &&
        this.userInfo.roles &&
        this.userInfo.roles.includes(roles)
      );
    },
    async countDocument() {
      try {
        const response = await DocumentService.getCountDashBoard();
        this.counts = response.data;
        if (this.counts.length > 0) {
          this.cardItems.map((item) => {
            this.counts.map((count) => {
              if (item.key === count.key) {
                item.value = count.value;
              }
            });
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    updateShowIntro(show) {
      this.showIntro = show;
    },
  },
};
</script>
<style lang="scss" src="./Dashboard.scss" scope></style>
