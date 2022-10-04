<template>
  <div v-if="additionalSigners && additionalSigners.length > 0" class="wrap--list-action mt-5">
    <!-- Text note -->
    <div
      v-if="additionalSigners && additionalSigners.length > 0 && listActions && listActions.length > 0"
      class="text-note"
    >
      {{ $t('document.noteWaitingCompleteSign') }}
    </div>

    <!-- List action -->
    <div class="list-action">
      <div
        v-for="(item, index) in additionalSigners"
        :key="index + '-' + item.signProcessId"
        class="item-list mb-4"
      >
        <!-- Avatar -->
        <v-tooltip left content-class="tooltip-left">
          <template v-slot:activator="{ on, attrs }">
            <v-img
              v-bind="attrs"
              width="28"
              height="28"
              :src="genIcon(item)"
              class="res-img"
              :class="checkOpacity(item) ? 'opcaity' : ''"
              v-on="on"
            />
          </template>
          <div class="d-flex flex-column">
            <span>{{ $t(`${contentTooltip(item)}`) }}</span>
            <span>{{ genDate(item) }}</span>
          </div>
        </v-tooltip>

        <!-- Content -->
        <div class="item-content ml-3">
          <span
            class="text--body-2"
            :class="getColorBySignUserType(item.signUserType)"
          >
            {{ $t(`${getSignUserType(item.signUserType)}`) }}
          </span>

          <v-tooltip left content-class="tooltip-left">
            <template v-slot:activator="{ on, attrs }">
              <p
                class="text--body-2 mb-0 text-link text-capitalize"
                v-bind="attrs"
                v-on="on"
              >
                {{ item.fullName }}
              </p>
            </template>
            <div class="d-flex flex-row">
              <div class="d-flex flex-column">
                <span class="text-capitalize"> {{ item.fullName }}</span>
                <span v-if="item.email"> {{ item.email }}</span>
                <span v-if="item.phone"> {{ item.phone }}</span>
                <span> {{ item.positionName }} - {{ item.signGroupName }}</span>
              </div>
            </div>
          </v-tooltip>
        </div>

        <!-- Icon remove -->
        <div
          v-if="item.isRemovable"
          style="cursor: pointer"
          class="ml-auto"
          @click="removeAdditionalSigner(item)"
        >
          <v-icon color="#FF4A55" size="20">mdi-close</v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import constants from '@/constants'

export default {
  props: {
    additionalSigners: {
      type: Array,
      default: null
    },
    listActions: {
      type: Array,
      default: null
    },
    docState: {
      type: String,
      default: null
    }
  },

  methods: {
    checkOpacity(item) {
      const signerReview = this.additionalSigners.find((signer) => {
        return (
          signer.signUserType === constants.SIGN_USER_TYPE.REVIEWER &&
          signer.processStatus === constants.SIGN_PROCCESS_STATUS.REJECTED
        )
      })
      let check = false
      if (
        (this.docState === constants.DOC_STATES.REJECT ||
          this.docState === constants.DOC_STATES.CANCEL ||
          signerReview) &&
        item.processStatus === constants.SIGN_PROCCESS_STATUS.UNPROCESSED
      ) {
        check = true
      }
      return check
    },
    getSignUserType(signUserType) {
      if (signUserType === constants.SIGN_USER_TYPE.FLASHES) {
        return 'document.flasher'
      }
      return 'reviewer'
    },

    getColorBySignUserType(signUserType) {
      if (signUserType === constants.SIGN_USER_TYPE.FLASHES) {
        return 'color--flasher'
      }
      return 'color--reviewer'
    },

    getFirstCharacter(item) {
      if (item.signUserName) {
        const lastName = item.signUserName.split(' ').pop()
        return lastName[0].toUpperCase()
      }
    },

    genDate(item) {
      if (item.processStatus === constants.SIGN_PROCCESS_STATUS.UNPROCESSED) {
        return item.submissionDate
      }
      return item.processDate
    },

    // Remove Flasher, Reviewer.
    removeAdditionalSigner(item) {
      if (item) this.$emit('show-dialog', item)
    },

    contentTooltip(item) {
      const signerReview = this.additionalSigners.find((signer) => {
        return (
          signer.signUserType === constants.SIGN_USER_TYPE.REVIEWER &&
          signer.processStatus === constants.SIGN_PROCCESS_STATUS.REJECTED
        )
      })
      if (
        (this.docState === constants.DOC_STATES.REJECT ||
          this.docState === constants.DOC_STATES.CANCEL ||
          signerReview) &&
        item.processStatus === constants.SIGN_PROCCESS_STATUS.UNPROCESSED
      ) {
        if (item.signUserType === constants.SIGN_USER_TYPE.FLASHES) {
          return 'document.rejectStatus.flashes'
        }
        if (item.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
          return 'document.rejectStatus.reviewer'
        }
      } else {
        let statusText = 'statusFlashes'
        if (item.signUserType === constants.SIGN_USER_TYPE.REVIEWER) {
          statusText = 'statusReviewer'
        }
        return this.renderTextStatus(item.processStatus, statusText)
      }
    },

    renderTextStatus(processStatus, status) {
      switch (processStatus) {
        case constants.SIGN_PROCCESS_STATUS.UNPROCESSED: // Cho
          return `document.${status}.unprocessed`
        case constants.SIGN_PROCCESS_STATUS.PROCESSED: // Da
          return `document.${status}.processed`
        case constants.SIGN_PROCCESS_STATUS.REJECTED: // Tu choi
          return `document.${status}.reject`
        default:
          return ''
      }
    },

    genIcon(item) {
      switch (item.processStatus) {
        case constants.SIGN_PROCCESS_STATUS.UNPROCESSED: // Cho xem xet, ky nhay
          return require('@/assets/imgs/waiting.svg')
        case constants.SIGN_PROCCESS_STATUS.PROCESSED: // Da xem xet, ky nhay
          return require('@/assets/imgs/checked.svg')
        case constants.SIGN_PROCCESS_STATUS.REJECTED: // Tu choi
          return require('@/assets/imgs/reject.svg')
        default:
          return require('@/assets/imgs/waiting.svg')
      }
    }
  }
}
</script>

<style lang="scss">
.wrap--list-action {
  text-align: left;
  .opcaity {
    opacity: 0.3 !important;
  }

  .text-note {
    font-size: 14px;
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
    color: #ff4a55;
    @media (max-width: 1336px) {
      font-size: 10px;
    }
  }

  .list-action {
    padding: 10px 20px 0px 20px;
    @media (max-width: 1336px) {
      padding: 5px 10px 0px 10px;
    }
  }

  .item-list {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .res-img {
    object-fit: cover;
    flex: 0 0 28px;
    .v-image__image--cover {
      background-size: none !important;
    }
  }

  .item-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .color--reviewer {
    color: #0fafe4;
  }

  .color--flasher {
    color: #4a50e2;
  }
}

.content-avatar {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  color: #fff;
  background-color: #0fafe4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}
</style>
