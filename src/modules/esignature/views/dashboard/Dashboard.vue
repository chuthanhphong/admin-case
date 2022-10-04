<template>
  <div class="wrap-dashboard">
    <p class="title-dashboard">{{ $t('dashboards.overview') }}</p>

    <!-- Intro -->
    <v-scale-transition>
      <div v-show="showTransition && showIntro" class="intro-dashboard">
        <div class="wrap-text-title">
          <p class="text-intro-title">
            {{ $t('hello') }} {{ userInfo.fullName }}
          </p>

          <p class="text-intro-subtitle">{{ $t('dashboardIntro1') }}</p>

          <p class="text-intro-subtitle">{{ $t('dashboardIntro2') }}</p>

          <p class="text-intro-subtitle">{{ $t('dashboardIntro3') }}</p>
        </div>

        <v-spacer />

        <img class="img-intro" src="@/assets/intro.png" alt="intro">
      </div>
    </v-scale-transition>

    <!-- count 4 item -->
    <!-- <v-row class="ma-0 wrap-col-item">
      <card-item
        v-for="(item, index) in cardItems"
        :key="item.name"
        :item="item"
        :index="index"
      />
    </v-row> -->

    <!-- count 5 item -->
    <v-row class="ma-0 wrap-col-item flex-row justify-space-between">
      <card-item-five
        v-for="(item, index) in cardItems"
        v-show="showTransition"
        :key="item.name"
        :item="item"
        :index="index"
      />

      <CardItemCreate v-show="showTransition" />
    </v-row>

    <!-- List document -->
    <v-scroll-y-transition>
      <EsignatureWaitSign
        v-show="showTransition"
        @update-show-intro="updateShowIntro"
        @update-count="countDocByState()"
      />
    </v-scroll-y-transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import CardItem from './component/CardItem.vue'
import CardItemFive from './component/CardItemFive.vue'
import CardItemCreate from './component/CardItemCreate.vue'
import EsignatureWaitSign from './component/EsignatureWaitSign.vue'
import constants from '@/constants'
import { UsersService } from '@/services/usersService'
import { DocumentService } from '@/modules/esignature/services/documentService'
import routeEsignature from '@/modules/esignature/router/routePaths'

export default {
  name: 'Home',
  components: {
    // CardItem,
    CardItemFive,
    CardItemCreate,
    EsignatureWaitSign
    // DialogChangePassword
  },

  data() {
    return {
      showChangePassword: false,
      showTransition: false,
      showIntro: false,
      cardItems: [
        {
          docState: constants.DOC_STATES.IN_PROGRESS,
          title: 'dashboards.signing',
          count: 0,
          icon: require('@/assets/icons/ic_inprocess.png'),
          subTitle: 'dashboards.processOfSigning',
          link: `${routeEsignature.DOCUMENT_LIST_PROCESS_PATH}?docState=${constants.DOC_STATES.IN_PROGRESS}`,
          bgColor: '#ffaf2e'
        },
        {
          docState: constants.DOC_STATES.REJECT,
          title: 'dashboards.reject',
          count: 0,
          icon: require('@/assets/icons/ic_reject.png'),
          subTitle: 'dashboards.esignatureReject',
          link: `${routeEsignature.DOCUMENT_LIST_PROCESS_PATH}?docState=${constants.DOC_STATES.REJECT}`,
          bgColor: '#FF4A55'
        },
        {
          docState: constants.DOC_STATES.COMPLETE,
          title: 'dashboards.completed',
          count: 0,
          icon: require('@/assets/icons/ic_complete.png'),
          subTitle: 'dashboards.esignatureCompleted',
          link: `${routeEsignature.DOCUMENT_LIST_PROCESS_PATH}?docState=${constants.DOC_STATES.COMPLETE}`,
          bgColor: '#0FAFE4'
        },
        {
          docState: constants.DOC_STATES.PROMULGATE,
          title: 'electronicSign.docState.promulgate',
          count: 0,
          icon: require('@/assets/icons/ic_proclaim.png'),
          subTitle: 'subTitleProclaim',
          link: `${routeEsignature.DOCUMENT_LIST_PROCESS_PATH}?docState=${constants.DOC_STATES.PROMULGATE}`,
          bgColor: '#1C49E9'
        }
      ]
    }
  },

  computed: {
    ...mapState('layout', ['userInfo'])
  },

  created() {
    const user = JSON.parse(localStorage.getItem(constants.USER_INFO))
    this.countDocByState()
    if (user) {
      this.setUserInfo(user)
      if (user.isFirstLogin) {
        this.showChangePassword = true
      }
    }

    setTimeout(() => {
      this.showTransition = true
    }, 10)
  },

  methods: {
    ...mapActions('layout', ['setNotify', 'setUserInfo']),

    async acceptChangePassword(value) {
      try {
        const response = await UsersService.changePassword(value)
        if (response.status === 200) {
          this.showChangePassword = false
          var message = 'users.messageSuccess.changePassword'
          const typeAlert = 'success'
          await this.setNotify({
            show: true,
            type: typeAlert,
            content: this.$t(message)
          })
          setTimeout(() => {
            localStorage.clear()
            this.$router.push(`${constants.ROOT_PATH}login`).catch(() => {})
          }, 3000)
        }
      } catch (error) {
        const typeAlert = 'error'
        const message = error.message
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message)
        })
      }
    },

    showMenu() {
      const roles = constants.USER_ROLE.HDDT
      return (
        this.userInfo &&
        this.userInfo.roles &&
        this.userInfo.roles.includes(roles)
      )
    },

    async countDocByState() {
      try {
        const { data } = await DocumentService.getCountDocByState()

        if (data && data.length > 0) {
          const objData = data.reduce((obj, countItem) => {
            obj[countItem.key] = countItem.value
            return obj
          }, {})

          this.cardItems.map((cardItem) => {
            cardItem.count = 0
            if (objData[cardItem.docState]) {
              cardItem.count = objData[cardItem.docState]
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    },

    updateShowIntro(show) {
      this.showIntro = show
    }
  }
}
</script>
<style lang="scss" src="./Dashboard.scss" scope></style>
