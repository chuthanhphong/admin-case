<template>
  <div class="wrap-advance-search flow-search-advance px-2 py-4 pb-0 mt-3">
    <v-row justify="space-between" align="start" class="">
      <div
        class="d-flex align-start flex-column  flex-sm-row align-sm-center justify-end col-md-6 col-12"
      >
        <div class="d-flex align-start form-group flex-column col-12">
          <label class="text-left text--body-5">{{
            $t('contract.label.contractType')
          }}</label>
          <v-select
            v-model="selectContractType"
            :items="lstContractType"
            :item-text="item => $t(item.name)"
            item-value="id"
            return-object
            outlined
            hide-details
            class="col-12 text--body-5"
            dense
            :placeholder="$t('contract.label.contractType')"
            @change="onChangeSelectTypeContract"
          >
            <template v-slot:append>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
          </v-select>
        </div>
      </div>
      <div class="d-flex align-start flex-column justify-end col-md-6 col-12">
        <div class="d-flex flex-column  align-start form-group col-12">
          <label class="pr-2 text--body-5">{{ $t('contract.label.scopeUse') }}</label>
          <v-autocomplete
            v-model="selectedGroup"
            :search-input.sync="search"
            class="flow-scope col-12 text--body-5"
            outlined
            :no-data-text="$t('users.itemGroupName')"
            hide-selected
            hide-details
            maxlength="255"
            floating
            solo
            dense
            elevation="0"
            :menu-props="{
              bottom: true,
              offsetY: true
            }"
            :placeholder="$t('contract.label.selectScopeUse')"
            :label="$t('contract.label.selectScopeUse')"
            :items="groups"
            item-text="groupName"
            item-value="groupId"
            chips
            deletable-chips
            multiple
            @change="onChangeSelectedGroup"
          >
            <vue-feather slot="append" class="grey--text" type="search" />
            <template v-slot:item="data">
              <div class="select-item flex-column d-flex">
                <div class="title-item">{{ data.item.groupName }}</div>
                <div class="desc-item">{{ data.item.groupPathName }}</div>
              </div>
            </template>
          </v-autocomplete>
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
import { ContractService } from '@/modules/econtract/services/contractService'
import { GroupService } from '@/services/groupService'

export default {
  props: {
    formdata: {
      type: Object,
      default: undefined
    },
    searchFlow: {
      type: Function,
      default: undefined
    },
    showAdvance: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      selectedGroup: [],
      groups: [],
      search: '',
      lstContractType: [],
      selectContractType: { id: '' }
    }
  },
  computed: {
    localDate() {
      return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-US'
    }
  },
  watch: {
    showAdvance() {
      if (!this.showAdvance) {
        this.selectedGroup = []
        this.selectContractType = { id: '' }
        this.searchFlow()
      }
    }
  },
  mounted() {
    this.getContractTypes()
    this.getGroups()
  },
  methods: {
    onChangeSelectedGroup() {
      this.formdata.groupDocScopeIds = this.selectedGroup
      this.searchFlow()
      this.search = ''
    },
    onChangeSelectTypeContract() {
      if (this.selectContractType.id !== '') {
        this.formdata.documentFormulaId = this.selectContractType.id
      } else {
        this.formdata.documentFormulaId = ''
      }
      this.searchFlow()
    },
    // Lay danh sach loai hop dong
    async getContractTypes() {
      try {
        const response = await ContractService.getList()
        this.lstContractType = response.data
        this.lstContractType.unshift({
          id: '',
          name: 'contract.label.docStates.all'
        })
      } catch (error) {
        console.log(error)
      }
    },
    // Lay danh sach don vi
    async getGroups() {
      try {
        const response = await GroupService.getFlowGroup()
        this.groups = response.data
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
.v-select__selections {
  .v-chip--select {
    margin: 4px !important;
  }
}
.flow-search-advance {
  .v-input__control .v-input__slot {
    width: 100% !important;
  }
}
</style>
