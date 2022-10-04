<template>
  <div class="wrap-home ml-2 mt-2">
    <v-container fluid class=" py-2 rounded-xl bg-seconds pb-5">
      <v-container grid-list-xs class="py-1">
        <p class="title-dashboard">{{ $t('dashboards.overview') }}</p>
        <v-card v-show="showIntro" color="#00C3F9" class="white--text my-3">
          <div
            class="d-flex align-center justify-space-between px-8 py-6 flex-column flex-md-row"
          >
            <div
              v-html="$t('dashboardIntro', { fullName: userInfo.fullName })"
            />
            <div>
              <v-img src="@/assets/intro.png" />
            </div>
          </div>
        </v-card>
        <div class="row justify-space-between mt-2">
          <card-item
            v-for="item in cardItems"
            v-show="showCard"
            :key="item.name"
            class="col-12 col-md-3 col-sm-6"
            :item="item"
          />
          <card-item
            v-show="showCard"
            v-if="showMenu()"
            class="col-12 col-md-3 col-sm-6 card-create"
            :item="cardCreate"
            :is-creat-card="true"
          />
        </div>
        <v-scroll-y-transition>
          <contract-wait-sign
            v-show="showCard"
            :show-action-create="showMenu()"
            @update-show-intro="updateShowIntro"
          />
        </v-scroll-y-transition>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CardItem from './component/CardItem'
import ContractWaitSign from '@/modules/econtract/views/eContract/dashboard/component/ContractWaitSign'
import { ContractService } from '@/modules/econtract/services/contractService'
import constants from '@/constants'
import econtractRoute from '@/modules/econtract/router/routePaths'

export default {
  name: 'Home',
  components: {
    CardItem,
    ContractWaitSign
  },
  data() {
    return {
      showCard: true,
      counts: [],
      cardItems: [
        {
          docState: constants.DOC_STATES.IN_PROGRESS,
          name: 'dashboards.signing',
          value: null,
          icon: 'icon-process',
          iconColor: 'process',
          remainText: 'dashboards.processOfSigning',
          link: `${econtractRoute.LIST_CONTRACT_PROCESS_PATH}?docState=${constants.DOC_STATES.IN_PROGRESS}`,
          bgColor: '#ffaf2e'
        },
        {
          docState: constants.DOC_STATES.REJECTED,
          name: 'dashboards.reject',
          value: null,
          icon: 'mdi-alert-circle-outline',
          iconColor: 'reject',
          remainText: 'dashboards.contractReject',
          link: `${econtractRoute.LIST_CONTRACT_PROCESS_PATH}?docState=${constants.DOC_STATES.REJECT}`,
          bgColor: '#FF4A55'
        },
        {
          docState: constants.DOC_STATES.COMPLETE,
          name: 'dashboards.completed',
          value: null,
          icon: 'mdi-check-circle-outline',
          iconColor: 'completed',
          remainText: 'dashboards.contractCompleted',
          link: `${econtractRoute.LIST_CONTRACT_PROCESS_PATH}?docState=${constants.DOC_STATES.COMPLETE}`,
          bgColor: '#0FAFE4'
        }
      ],
      cardCreate: {
        name: 'dashboards.electronic',
        value: 'dashboards.create',
        icon: 'mdi-plus-circle-outline',
        iconColor: 'white'
      },
      showIntro: false
    }
  },
  computed: {
    ...mapState('layout', ['userInfo'])
  },
  created() {
    localStorage.setItem(constants.LIST_CONTRACT_ROOT, 'created')
    this.countContract()
    const user = JSON.parse(localStorage.getItem(constants.USER_INFO))

    if (user) {
      this.setUserInfo(user)
    }
    // setTimeout(() => {
    //   this.showCard = true
    // }, 10)
  },
  methods: {
    ...mapActions('layout', ['setNotify', 'setUserInfo']),
    showMenu() {
      const roles = constants.USER_ROLE.HDDT
      return (
        this.userInfo &&
        this.userInfo.roles &&
        this.userInfo.roles.includes(roles)
      )
    },
    async countContract() {
      try {
        const response = await ContractService.getCount()
        this.counts = response.data
        if (this.counts.length > 0) {
          this.cardItems.map(item => {
            this.counts.map(count => {
              if (item.docState === count.docState) {
                item.value = count.count
              }
            })
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
