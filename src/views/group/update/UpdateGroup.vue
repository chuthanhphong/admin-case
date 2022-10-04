<template>
  <div class="wrap-home ml-2 mt-2">
    <v-container
      fluid
      class=" py-5 rounded-xl bg-primary pb-15 wrap-content-group"
    >
      <breadcrumbs :items="breadcrumbs" />
      <v-card color="white" class="rounded-xl ma-2 mt-2 fill-height">
        <v-layout row wrap class="col-12 ma-0">
          <div class="col-12 ml-0 ml-md-15">
            <div class="d-flex justify-space-between align-center">
              <div class="option-create">
                <v-radio-group v-model="createType" class="" row disabled>
                  <v-radio
                    class="flex-row-reverse"
                    :label="$t('group.groupLabel')"
                    :value="types.GROUP"
                    color="black"
                  />
                  <v-radio
                    class="flex-row-reverse"
                    :label="$t('group.partnerLabel')"
                    :value="types.PARTNER"
                    color="black"
                  />
                </v-radio-group>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="row mb-4 justify-center">
              <div class="col-12 col-md-7 pl-0">
                <validation-observer ref="observerOrg">
                  <org-form
                    v-if="createType == types.GROUP"
                    :group="group"
                    :parents="parents"
                  />
                </validation-observer>
                <validation-observer ref="observerPartner">
                  <partner-form
                    v-if="createType == types.PARTNER"
                    :group="group"
                  />
                </validation-observer>
              </div>
              <div class="col-12 col-sm-4 col-md-4 justify-center d-flex">
                <v-img src="@/assets/imgs/add-group.svg" max-width="280" />
              </div>
            </div>
          </div>
        </v-layout>
        <v-row class="justify-end px-8 groups-actions">
          <v-btn
            color="primary"
            class="w-150 py-5 text--button mr-10"
            outlined
            rounded
            @click.stop="dialog = true"
          >{{ $t('cancelLabel') }}
          </v-btn>

          <v-btn
            color="primary"
            class="w-150 py-5 text--button"
            rounded
            @click.stop="checkValidate()"
          >{{ $t('saveLabel') }}
          </v-btn>
        </v-row>
      </v-card>
      <!-- dialog cancel -->
      <v-dialog v-model="dialog" persistent max-width="600">
        <v-card>
          <v-card-title class="d-flex justify-end">
            <v-icon @click="dialog = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="d-flex justify-center">
            <h5>{{ $t('title.cancel') }}</h5>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-around">
            <v-btn
              rounded
              class="w-150 btn-cancel py-5 text--button"
              color="#0FAFE4"
              elevation="1"
              outlined
              @click="dialog = false"
            >
              {{ $t('close') }}
            </v-btn>
            <v-btn
              rounded
              class="w-150 py-5 text--button"
              color="primary"
              :to="groupPath"
            >
              {{ $t('accept') }}
            </v-btn>
          </v-card-actions>
          <v-card-actions />
        </v-card>
      </v-dialog>
      <!-- dialog save -->
      <v-dialog v-model="dialogSave" persistent max-width="600">
        <v-card>
          <v-card-title class="d-flex justify-end">
            <v-icon @click="dialogSave = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="text-h6 d-flex justify-center">
            <h5>
              {{ $t('title.edit') }}
            </h5>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-around">
            <v-btn
              rounded
              class="w-150 py-5 btn-cancel text--button"
              color="#0FAFE4"
              elevation="1"
              outlined
              @click="dialogSave = false"
            >
              {{ $t('cancelLabel') }}
            </v-btn>
            <v-btn
              class="w-150 py-5 text--button"
              rounded
              color="primary"
              @click.prevent="onSubmitCreateGroup"
              @click="dialogSave = false"
            >
              {{ $t('accept') }}
            </v-btn>
          </v-card-actions>
          <v-card-actions />
        </v-card>
      </v-dialog>
    </v-container>
    <base-loading :is-loading="loading" />
    <base-material-snackbar
      v-model="isShowAlert"
      :type="typeAlert"
      v-bind="{
        top: true,
        right: true
      }"
    >
      {{ messages }}
    </base-material-snackbar>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/core/Breadcrumbs.vue'
import OrgForm from '../create/OrgForm.vue'
import PartnerForm from '../create/PartnerForm.vue'
import { GroupService } from '@/services/groupService'
import alertMixin from '@/mixins/alert'
import { mapActions } from 'vuex'
import checkRoles from '@/mixins/checkRoles'
import constants from '@/constants'
import commonRoute from '@/router/routePaths'
const types = {
  GROUP: 'INTERNAL',
  PARTNER: 'EXTERNAL'
}
const initGroup = {
  parentGroupId: '', // Id Don vi cha
  groupName: '', // Ten don vi
  groupCode: '', // Ten viet tat
  taxCode: null, // Ma so thue
  groupType: '', // Don vi, doi tac
  orderNo: null, // Thu tu xap xep
  phoneOrFax: null, // So dien thoai
  address: null, // Dia chi
  bankAccount: null // Tai khoan ngan hang
}
export default {
  name: 'CreateGroup',
  components: { Breadcrumbs, OrgForm, PartnerForm },
  mixins: [alertMixin, checkRoles],
  data() {
    return {
      groupPath: `${commonRoute.GROUP_PATH}`,
      groupId: null,
      loading: false,
      dialog: false,
      dialogSave: false,
      parents: [],
      parentOrg: '',
      types: types,
      createType: types.GROUP,
      group: {
        ...initGroup
      },
      breadcrumbs: [
        {
          text: this.$t('group.name'),
          disabled: false,
          href: `${commonRoute.GROUP_PATH}`
        },
        {
          text: 'group.update',
          disabled: true,
          href: `${commonRoute.ECONTRACT_DASHBOARD_PATH}`
        }
      ]
    }
  },
  watch: {
    createType() {
      // Reset lai form
    }
  },

  created() {
    this.hasPermission([constants.USER_ROLE.ROLE_ADMIN])
    this.groupId = this.$route.params.groupId
    this.getInfo(this.groupId)
    this.getListGroup()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    // get info group
    async getInfo(id) {
      try {
        const response = await GroupService.getGroupInfo(id)
        this.group = response.data
        this.createType = this.group.groupType
      } catch (error) {
        console.log('error')
      }
    },
    async onSubmitCreateGroup() {
      // Validate form
      if (!(await this.validateOrgForm())) {
        return null
      }

      try {
        this.loading = true
        // Submit form
        const response = await GroupService.editGroup(this.groupId, this.group)
        if (response.status === 200) {
          this.setNotify({
            show: true,
            type: this.typeAlerts.SUCCESS,
            content: response.data.message
          })
          this.$router.push(`${commonRoute.GROUP_PATH}`).catch(() => {})
        }
      } catch (error) {
        this.loading = false
        const typeAlert = 'error'
        const message = error.message
        this.setNotify({
          show: true,
          type: typeAlert,
          content: this.$t(message)
        })
      }
    },
    // Lay danh sach don vi
    async getListGroup() {
      // khai bao store de count so thu tu don vi cha
      const store = {}

      const params = {
        groupType: this.createType,
        pageSize: 1000000,
        groupId: this.groupId,
        higherHierarchyOnly: true
      }
      const response = await GroupService.search(params)
      if (response.success) {
        const dataGroup = response.data
        this.parents = dataGroup.data
        if (this.parents.length > 0) {
          // dem don vi con trong don vi cha
          for (const group of this.parents) {
            let count = store[group.parentGroupId]
            count = count === undefined ? 0 : count
            store[group.parentGroupId] = count + 1
          }
          // loc qua data tra ve va gan count cho no
          for (const group of this.parents) {
            const count = store[group.groupId]
            group['numberOfChildrenGroup'] = count === undefined ? 0 : count
          }
        }
      }
    },
    // check validate form
    async checkValidate() {
      if (await this.validateOrgForm()) {
        this.dialogSave = true
      }
    },
    async validateOrgForm() {
      // Validate form
      return this.createType === types.GROUP
        ? await this.$refs.observerOrg.validate()
        : await this.$refs.observerPartner.validate()
    }
  }
}
</script>

<style lang="scss" src="../create/CreateGroup.scss"></style>
