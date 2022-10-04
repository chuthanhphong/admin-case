<template>
  <v-row v-if="promulgateDetail" class="mx-1">
    <v-col cols="12" sm="12">
      <v-row justify="space-between">
        <!-- hinh thuc van ban -->
        <v-col cols="12" sm="3">
          <label class="docLabel text--label color--label">
            {{ $t('electronicSign.create.documentForm') }}
          </label>
          <div class="doc-content">
            <span class="text--body-1">{{ promulgateDetail.formulaName }}</span>
          </div>
        </v-col>
        <!-- so van ban -->
        <v-col cols="12" sm="3">
          <label class="docLabel text--label color--label">
            {{ $t('numDoc') }}
          </label>
          <div class="doc-content">
            <span class="text--body-1">{{
              promulgateDetail.documentNumber
            }}</span>
          </div>
        </v-col>
        <!--so ky hieu ban -->
        <v-col cols="12" sm="3">
          <label class="docLabel text--label color--label">
            {{ $t('numDoc2') }}
          </label>
          <div class="doc-content">
            <span class="text--body-1">{{ promulgateDetail.code }}</span>
          </div>
        </v-col>
      </v-row>

      <v-row justify="space-between">
        <!-- nganh -->
        <v-col cols="12" sm="3">
          <label class="docLabel text--label color--label">
            {{ $t('branch') }}
          </label>
          <div class="doc-content">
            <span class="text--body-1">{{
              promulgateDetail.occupationName
            }}</span>
          </div>
        </v-col>
        <!-- do mat -->
        <v-col cols="12" sm="3">
          <label class="docLabel text--label color--label">
            {{ $t('density') }}
          </label>
          <div class="doc-content">
            <span class="text--body-1">{{
              promulgateDetail.securityName
            }}</span>
          </div>
        </v-col>
        <!-- noi nhan van ban -->
        <v-col cols="12" sm="3">
          <label class="docLabel text--label color--label">
            {{ $t('receiveDoc') }}
          </label>
          <div class="doc-content">
            <span class="text--body-1">{{
              promulgateDetail.receivePlace
            }}</span>
          </div>
        </v-col>
      </v-row>

      <v-row justify="space-between">
        <!-- ngay ban hanh -->
        <v-col cols="12" sm="3">
          <label class="docLabel text--label color--label">
            {{ $t('dateProclaim') }}
          </label>
          <div class="doc-content">
            <span class="text--body-1">{{
              promulgateDetail.promulgatedDate
            }}</span>
          </div>
        </v-col>
        <!-- het hieu luc -->
        <v-col cols="12" sm="3">
          <label class="docLabel text--label color--label">
            {{ $t('document.timeExpired') }}
          </label>
          <div class="doc-content">
            <span class="text--body-1">{{ promulgateDetail.expiredDate }}</span>
          </div>
        </v-col>
        <v-col cols="12" sm="3" />
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FromulgateInfo',
  props: {
    promulgateDetail: {
      type: Object,
      default: null
    }
  }
}
</script>

<style></style>
