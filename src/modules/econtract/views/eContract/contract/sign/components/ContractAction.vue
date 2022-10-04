<template>
  <div v-if="additionalSigners !== null" class="mt-5">
    <v-container class="pa-0 px-1">
      <v-list class="contract-history">
        <template v-for="(item, index) in additionalSigners">
          <v-list-item :key="index">
            <v-tooltip left content-class="tooltip-left">
              <template v-slot:activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  class="icon-toolip"
                  v-on="on"
                  v-html="renderProcessContract(item)"
                />
              </template>
              <div>{{ $t(contentTooltip(item)) }}</div>
              <div>{{ genDate(item) }}</div>
            </v-tooltip>
            <v-list-item-content class="ml-1">
              <v-list-item-title
                class="d-flex text-wrap"
                :class="`sign-user-type-${item.signUserType.toLowerCase()}`"
              >
                {{ $t(genStatus(item)) }}
              </v-list-item-title>
              <v-list-item-title class="d-flex text-wrap">
                <v-tooltip left content-class="tooltip-left">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" class="icon-toolip btn" v-on="on">
                      {{ genUserName(item) }}
                    </div>
                  </template>
                  <div class="text--white">
                    <b>{{ genUserName(item) }}</b>
                  </div>
                  <div class="text--caption">
                    <div>{{ item.email }}</div>
                    <div v-if="item.phone">{{ item.phone }}</div>
                  </div>
                </v-tooltip>
              </v-list-item-title>
              <!-- <v-list-item-subtitle class="d-flex text-wrap">
                {{ item.email }}
              </v-list-item-subtitle> -->
            </v-list-item-content>
            <div v-if="showIconRemove(item)" class="btn icon-remove pa-0">
              <v-icon
                color="red"
                size="15"
                class="close-dialog"
                @click="removeAdditionalSigner(item)"
              >mdi-close</v-icon>
            </div>
          </v-list-item>
        </template>
      </v-list>
    </v-container>
  </div>
</template>

<script>
import constants from '@/constants'

export default {
  props: {
    additionalSigners: {
      type: Array,
      default: undefined
    }
  },
  methods: {
    genDate(item) {
      let dateText = item.processDate
      if (item.processStatus === constants.SIGN_PROCCESS_STATUS.UNPROCESSED) {
        dateText = item.submissionDate
      }
      return dateText
    },
    // Xoa nguoi xem xet, nguoi ky nhay
    removeAdditionalSigner(item) {
      if (item) {
        this.$emit('show-dialog', item)
      }
    },
    showIconRemove(item) {
      return item.isRemovable
    },
    contentTooltip(item) {
      if (
        item.documentState === constants.DOC_STATES.REJECT &&
        item.processStatus === constants.SIGN_PROCCESS_STATUS.UNPROCESSED
      ) {
        switch (item.signUserType) {
          case constants.SIGN_USER_TYPE.FLASHES: // ky nhay
            return 'contract.rejectStatus.flashes'
          case constants.SIGN_USER_TYPE.REVIEWER: // xem review
            return 'contract.rejectStatus.reviewer'
          default:
            return ''
        }
      } else {
        switch (item.signUserType) {
          case constants.SIGN_USER_TYPE.FLASHES: // ky nhay
            switch (item.processStatus) {
              case constants.SIGN_PROCCESS_STATUS.UNPROCESSED: // Cho ky nhay
                return 'contract.statusFlashes.unprocessed'
              case constants.SIGN_PROCCESS_STATUS.PROCESSED: // Da ky nhay
                return 'contract.statusFlashes.processed'
              case constants.SIGN_PROCCESS_STATUS.REJECTED: // Tu choi ky nhay
                return 'contract.statusFlashes.reject'
              default:
                return ''
            }
          case constants.SIGN_USER_TYPE.REVIEWER: // xem review
            switch (item.processStatus) {
              case constants.SIGN_PROCCESS_STATUS.UNPROCESSED: // Cho xem xet
                return 'contract.statusReviewer.unprocessed'
              case constants.SIGN_PROCCESS_STATUS.PROCESSED: // Da xem xet
                return 'contract.statusReviewer.processed'
              case constants.SIGN_PROCCESS_STATUS.REJECTED: // Tu choi xem xet
                return 'contract.statusReviewer.reject'
              default:
                return ''
            }
          default:
            return ''
        }
      }
    },
    genStatus(item) {
      switch (item.signUserType) {
        case constants.SIGN_USER_TYPE.FLASHES: // ky nhay
          return 'contract.signType.flashes'
        case constants.SIGN_USER_TYPE.REVIEWER: // xem review
          return 'contract.signType.reviewer'
        default:
          return ''
      }
    },
    genUserName(item) {
      let text = ''
      if (item) {
        text = item.signUserName
      }
      return text
    },
    renderProcessContract(status) {
      if (
        status.documentState === constants.DOC_STATES.REJECT &&
        status.processStatus === constants.SIGN_PROCCESS_STATUS.UNPROCESSED
      ) {
        switch (status.processStatus) {
          case constants.SIGN_PROCCESS_STATUS.UNPROCESSED: // Cho xem xet, ky nhay
            return `<button class="btn-history v-btn v-btn--fab v-btn--icon v-btn--outlined v-btn--round v-size--x-small btn-remove"><i class="icon-hourglass"></i></button>`
          case constants.SIGN_PROCCESS_STATUS.PROCESSED: // Da xe xet, da ky nhay
            return `<button class="btn-history v-btn v-btn--fab v-btn--icon v-btn--outlined v-btn--round v-size--x-small btn-remove"><i class="mdi mdi-check"></i></button>`
          case constants.SIGN_PROCCESS_STATUS.REJECTED: // Tu choi
            return `<button class="btn-history v-btn v-btn--fab v-btn--icon v-btn--outlined v-btn--round v-size--x-small btn-remove"><i class="mdi mdi-close"></i></button>`
          default:
            return ''
        }
      } else {
        switch (status.processStatus) {
          case constants.SIGN_PROCCESS_STATUS.UNPROCESSED: // Cho xem xet, ky nhay
            return `<button class="btn-history v-btn v-btn--fab v-btn--icon v-btn--outlined v-btn--round v-size--x-small btn-unprocess"><i class="icon-hourglass"></i></button>`
          case constants.SIGN_PROCCESS_STATUS.PROCESSED: // Da xe xet, da ky nhay
            return `<button class="btn-history v-btn v-btn--fab v-btn--icon v-btn--outlined v-btn--round v-size--x-small btn-process"><i class="mdi mdi-check"></i></button>`
          case constants.SIGN_PROCCESS_STATUS.REJECTED: // Tu choi
            return `<button class="btn-history v-btn v-btn--fab v-btn--icon v-btn--round v-size--x-small btn-reject"><i class="mdi mdi-close"></i></button>`
          default:
            return ''
        }
      }
    }
  }
}
</script>

<style lang="scss"></style>
