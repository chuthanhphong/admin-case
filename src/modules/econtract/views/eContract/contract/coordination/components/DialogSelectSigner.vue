<template>
  <v-dialog v-model="showDialog" persistent max-width="680">
    <v-card>
      <v-card-title class="d-flex justify-center">
        <h5 class="text-center">{{ $t('contract.selectSigner') }}</h5>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-list-item-group
        v-model="indexsSelected"
        multiple
        class="group-select-signer px-8"
        active-class=""
      >
        <v-list-item
          v-for="(person, id) in listPersonSign"
          :key="`${id}`"
          :disabled="checkDisablePerson(person)"
        >
          <template v-slot:default="{ active }">
            <v-list-item-action>
              <v-checkbox
                :input-value="active"
                :disabled="checkDisablePerson(person)"
              />
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title class="d-flex">
                <v-btn
                  color="primary"
                  elevation="0"
                  fab
                  small
                  class="subtitle-2 font-weight-bold mr-2"
                >{{ person.name[0] }}</v-btn>

                <div class="d-flex flex-column">
                  <span class="font-weight-medium">{{ person.name }} </span>
                  <span
                    class="caption text--secondary text-truncate mw-300 "
                  >{{ person.email }}
                  </span>
                </div>
              </v-list-item-title>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
      <div v-if="messageRequired" class="text-center text-danger text--body-2">
        {{ messageRequired }}
      </div>
      <v-card-actions class="d-flex justify-center">
        <div class="col-12 col-md-6">
          <v-btn
            rounded
            block
            color="primary"
            class="text--button"
            @click="acceptPersonalSign"
          >
            {{ $t('accept') }}
          </v-btn>
        </div>
      </v-card-actions>
      <v-card-actions />
    </v-card>
  </v-dialog>
</template>

<script>
import constants from '@/constants'
export default {
  props: {
    messageRequired: {
      type: String,
      default: undefined
    },
    listPersonSign: {
      type: Array,
      default: undefined
    },
    itemsSign: {
      type: Array,
      default: undefined
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    checkSignature: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      indexsSelected: []
    }
  },
  watch: {
    indexsSelected() {
      this.$emit('update-list-index-personal-sign', this.indexsSelected)
    },
    showDialog() {
      if (this.showDialog) {
        this.indexsSelected = []
      }
    }
  },
  methods: {
    acceptPersonalSign() {
      this.$emit('accept-personal-sign')
    },
    closeDialog() {
      this.$emit('close-dialog')
    },
    checkDisablePerson(person) {
      if (person.processStatus) {
        return true
      }
      if (!this.checkSignature || !this.itemsSign) {
        return false
      }
      const isExits = this.itemsSign.some(
        item =>
          item.signer.email === person.email &&
          item.signer.signType === constants.SIGN_TYPES.CA
      )
      return isExits
    }
  }
}
</script>

<style lang="scss" scoped></style>
