<template>
  <v-dialog v-model="showDialog" max-width="600" persistent>
    <v-card>
      <div class="dialogTitle">
        <v-card-title class="d-flex justify-center">
          <h5 class="white--text pt-0">{{ docName }}</h5>
          <v-icon
            class="close-dialog"
            color="black"
            @click="hideDialog"
          >mdi-close</v-icon>
        </v-card-title>
        <v-card-subtitle
          class="d-flex justify-center white--text dialogSubTitle"
        >
          {{ listSigner.length }} {{ $t('document.signer') }}
        </v-card-subtitle>
      </div>

      <!-- body -->
      <v-list
        v-if="listSigner && listSigner.length > 0"
        max-height="400"
        class="list-scroll-signer"
      >
        <template v-for="(item, i) in listSigner">
          <v-list-item :key="`${i}-${item.userId}`">
            <v-img v-if="item.avatar" :src="item.avatar" />
            <v-avatar
              v-else
              color="white--text"
              :style="`background-color:${item.color}`"
              size="42"
              class="mr-4"
            >
              {{ getFirstCharacter(item.fullName) }}
            </v-avatar>

            <v-list-item-content>
              <v-list-item-title class="list-title px-0 py-0 text-wrap">
                {{ item.fullName }} ({{ item.userName }})
              </v-list-item-title>
              <v-list-item-subtitle class="list-item-color text-wrap">
                {{ item.role }}
                <span v-show="item.positionName && item.role">-</span>
                {{ item.positionName }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="list-item-color text-wrap">
                {{ item.groupPathName }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogSigner',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    listSigner: {
      type: Array,
      default: undefined
    },
    docName: {
      type: String,
      default: ''
    }
  },
  methods: {
    hideDialog() {
      this.$emit('hide-dialog')
    },
    getFirstCharacter(name) {
      if (!name) return ''
      if (name.includes('+')) return name
      if (name.includes(' ')) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(' ').pop()
        return lastName[0].toUpperCase()
      }
      return name[0].toUpperCase()
    }
  }
}
</script>

<style
  lang="scss"
  src="@/modules/esignature/views/list/ListDocumentCreated.scss"
></style>
