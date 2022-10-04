<template>
  <div>
    <div class="row justify-space-between pt-3">
      <!-- Ten don vi -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">
            {{ $t('group.partnerGroupName') }}
            <span class="color-require">*</span>
          </label>
          <validation-provider
            v-slot="{ errors }"
            name="partnerGroupName"
            :rules="groupNameInput"
          >
            <v-text-field
              id="groupName"
              v-model="group.groupName"
              name="groupName"
              maxlength="255"
              :placeholder="$t('group.partnerGroupName')"
              outlined
              dense
              :error-messages="errors"
              required
              class="text--body-1"
              @change="group.groupName = trimSpace(group.groupName)"
            />
          </validation-provider>
        </div>
      </div>
      <!-- Ma don vi -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">
            {{ $t('group.partnerGroupCode') }}
            <span class="color-require">*</span>
          </label>
          <validation-provider
            v-slot="{ errors }"
            name="partnerGroupCode"
            :rules="groupCodeInput"
          >
            <v-text-field
              id="groupCode"
              v-model="group.groupCode"
              :placeholder="$t('group.partnerGroupCode')"
              maxlength="255"
              outlined
              dense
              :error-messages="errors"
              class="text--body-1"
              required
            />
          </validation-provider>
        </div>
      </div>
    </div>
    <div class="row justify-space-between">
      <!-- Ten don vi cha -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">{{
            $t('group.parentName')
          }}</label>
          <v-autocomplete
            v-model="group.parentGroupId"
            append-icon=""
            :items="parents"
            item-text="groupName"
            item-value="groupId"
            outlined
            attach
            dense
            :value="parents[0]"
            class="partner-parent-group text--body-1"
            readonly
            disabled
          >
            <template v-slot:selection="data">
              {{ data.item.groupName }}
            </template>
            <template v-slot:item="data">
              {{ data.item.groupName }}
            </template>
          </v-autocomplete>
        </div>
      </div>
      <!-- Thu tu sap xep -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">{{
            $t('group.orderNo')
          }}</label>
          <validation-provider
            v-slot="{ errors }"
            name="orderNo"
            :rules="numberPositive"
          >
            <v-text-field
              v-model="group.orderNo"
              :placeholder="$t('group.orderNo')"
              :error-messages="errors"
              outlined
              dense
              type="number"
              oninput="validity.valid||(value='');"
              class="text--body-1"
            />
          </validation-provider>
        </div>
      </div>
    </div>
    <div class="row justify-space-between">
      <!-- Dia chi -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">{{
            $t('group.address')
          }}</label>
          <v-text-field
            id="groupAddress"
            v-model="group.address"
            maxlength="500"
            :placeholder="$t('group.address')"
            outlined
            dense
            class="text--body-1"
            @change="group.address = trimSpace(group.address)"
          />
        </div>
      </div>
      <!-- So DT -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">{{
            $t('group.phoneNo')
          }}</label>
          <validation-provider
            v-slot="{ errors }"
            name="partnerGroupName"
            rules="max:15"
          >
            <v-text-field
              v-model="group.phone"
              maxlength="15"
              :placeholder="$t('group.phoneNo')"
              :error-messages="errors"
              outlined
              dense
              oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
              class="text--body-1"
              @change="group.phone = trimSpace(group.phone)"
            />
          </validation-provider>
        </div>
      </div>
    </div>
    <div class="row justify-space-between">
      <!-- Tk ngan hang -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">{{
            $t('group.bankNo')
          }}</label>
          <v-text-field
            id="groupBankNo"
            v-model="group.bankAccount"
            maxlength="500"
            :placeholder="$t('group.bankNo')"
            outlined
            dense
            class="text--body-1"
            @change="group.bankAccount = trimSpace(group.bankAccount)"
          />
        </div>
      </div>
      <!-- Ma so thue -->
      <div class="col-md-5">
        <div class="form-group">
          <label class="text-uppercase text--body-1">{{
            $t('group.taxCode')
          }}</label>
          <validation-provider
            v-slot="{ errors }"
            name="partnerGroupName"
            rules="max:13"
          >
            <v-text-field
              v-model="group.taxCode"
              maxlength="13"
              :placeholder="$t('group.taxCode')"
              :error-messages="errors"
              outlined
              dense
              class="text--body-1"
              @change="group.taxCode = trimSpace(group.taxCode)"
            />
          </validation-provider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rules from '@/mixins/rules'

export default {
  name: 'PartnerForm',
  mixins: [rules],
  props: {
    show: { type: Boolean, default: false },
    group: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      parents: [
        {
          groupName: this.$t('group.partnerLabel'),
          groupId: 1
        }
      ]
    }
  },
  methods: {
    trimSpace(val) {
      const value = val ? val.trim() : ''
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.col-md-5 {
  padding-bottom: 0 !important;
  padding-top: 0 !important;
}
</style>
