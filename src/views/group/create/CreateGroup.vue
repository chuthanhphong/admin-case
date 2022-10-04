<template>
  <div class="wrap-home ml-2 mt-2">
    <v-container
      fluid
      class=" py-5 pt-2 rounded-xl bg-primary pb-15 wrap-content-group"
    >
      <breadcrumbs :items="breadcrumbs" />
      <v-card color="white" class="rounded-xl ma-2 mt-2 fill-height">
        <v-layout row wrap class="col-12 ma-0">
          <div class="col-12 ml-0 pb-0">
            <div class="d-flex justify-space-between align-center">
              <div class="option-create">
                <v-radio-group
                  v-model="createType"
                  class=""
                  row
                  hide-details=""
                >
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
            <div class="row mb-4 px-3 justify-space-between">
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
              <div class="col-12 col-md-4 justify-end d-flex">
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
      <v-dialog v-model="dialog" persistent max-width="680">
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
      <v-dialog v-model="dialogSave" persistent max-width="680">
        <v-card>
          <v-card-title class="d-flex justify-end">
            <v-icon @click="dialogSave = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="text-h6 d-flex justify-center">
            <h5>
              {{ $t('title.save') }}
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
import OrgForm from './OrgForm'
import PartnerForm from './PartnerForm'
import { GroupService } from '@/services/groupService'
import alertMixin from '@/mixins/alert'
import checkRoles from '@/mixins/checkRoles'
import { mapActions } from 'vuex'
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
  phone: null, // So dien thoai
  address: null, // Dia chi
  bankAccount: null // Tai khoan ngan hang
}
export default {
  name: 'CreateGroup',
  components: { Breadcrumbs, OrgForm, PartnerForm },
  mixins: [alertMixin, checkRoles],
  data() {
    return {
      loading: false,
      dialog: false,
      dialogSave: false,
      parents: [],
      parentOrg: '',
      types: types,
      createType: types.GROUP,
      groupPath: `${commonRoute.GROUP_PATH}`,
      group: {
        ...initGroup
      },
      breadcrumbs: [
        {
          text: this.$t('group.name'),
          disabled: false,
          groupPath: `${commonRoute.GROUP_PATH}`
        },
        {
          text: 'group.create',
          disabled: true,
          href: `${commonRoute.ECONTRACT_DASHBOARD_PATH}`
        }
      ]
    }
  },
  watch: {
    createType() {
      // Reset lai form
      this.group = { ...initGroup }
      if (this.createType === constants.GROUPS.EXTERNAL) {
        this.group.orderNo =
          parseInt(localStorage.getItem(constants.EXTERNAL_GROUP_COUNT)) + 1
        this.group.parentGroupId = 1
      }
    }
  },
  created() {
    this.hasPermission([constants.USER_ROLE.ROLE_ADMIN])
  },

  mounted() {
    // this.parentOrg = this.parents[0]['value']
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
        this.group['groupType'] = this.createType
        const response = await await GroupService.addGroup(this.group)
        if (response.status === 200) {
          this.setNotify({
            show: true,
            type: this.typeAlerts.SUCCESS,
            content: response.data.message
          })
          this.$router.push(`${commonRoute.GROUP_PATH}`).catch(() => {})
        }
      } catch (error) {
        this.isShowAlert = true
        this.message = error.message
        this.typeAlert = this.typeAlerts.ERROR
        this.loading = false
      }
    },
    // Lay danh sach don vi
    async getListGroup() {
      // khai bao store de count so thu tu don vi cha
      const store = {}

      const params = { groupType: this.createType, pageSize: 1000000 }
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

<style lang="scss" src="./CreateGroup.scss"></style>
