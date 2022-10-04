<template>
  <v-dialog v-model="showDialog" persistent max-width="440">
    <v-card>
      <v-card-title class="d-flex justify-center">
        <h5 class="text-center pa-0 text-dialog-header">
          {{ $t('electronicSign.selectSigner') }}
        </h5>
        <v-icon class="close-dialog" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-list-item-group
        v-model="indexsSelected"
        multiple
        class="group-select-signer"
      >
        <v-list-item v-for="(person, id) in listPersonSign" :key="`${id}`">
          <template v-slot:default="{ active }">
            <v-list-item-action>
              <v-checkbox :input-value="active" />
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title class="d-flex">
                <v-btn
                  color="primary"
                  elevation="0"
                  fab
                  small
                  class="subtitle-2 font-weight-bold mr-2"
                >{{ getFirstCharacter(person) }}</v-btn>

                <div v-if="person.signUserId" class="d-flex flex-column">
                  <div class="font-weight-medium">
                    <span>{{ person.fullName }} </span>
                    <span>({{ person.signUserName }}) </span>
                  </div>
                  <div class="caption text--secondary text-truncate mw-300">
                    <span>{{ person.positionName }} </span>
                    <span>- {{ person.signGroupName }} </span>
                    <span>({{ person.groupCode }})</span>
                  </div>
                </div>

                <div v-else class="d-flex flex-column">
                  <div class="font-weight-medium">
                    <span>{{ person.positionName }} </span>
                  </div>
                  <div class="caption text--secondary text-truncate mw-300">
                    <span>{{ person.signGroupName }} </span>
                    <span>({{ person.groupCode }})</span>
                  </div>
                </div>
              </v-list-item-title>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
      <div v-if="messageRequired" class="text-center text-danger">
        {{ messageRequired }}
      </div>
      <v-card-actions class="d-flex justify-space-around pt-4 pr-8 pl-8">
        <v-btn rounded block color="primary" @click="acceptPersonalSign">
          {{ $t('accept') }}
        </v-btn>
      </v-card-actions>
      <v-card-actions />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogSelectSigner',
  props: {
    messageRequired: {
      type: String,
      default: undefined
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    listPersonSign: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      indexsSelected: []
    }
  },
  watch: {
    indexsSelected() {
      this.$emit('update-list-index-personal-sign')
    },
    showDialog() {
      if (this.showDialog) {
        this.indexsSelected = []
      }
    }
  },
  methods: {
    getFirstCharacter(person) {
      let name = person.positionName
      if (person.signUserId) {
        name = person.fullName
      }
      if (!name) return ''
      if (name.includes('+')) return name
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    },
    acceptPersonalSign() {
      this.$emit('accept-personal-sign', this.indexsSelected)
    },
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style></style>
