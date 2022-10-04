<template>
  <div class="doc-history-list">
    <v-simple-table dense fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center" style="width: 5%">STT</th>
            <th class="text-left" style="width: 25%">
              {{ $t('document.label.dateProcess') }}
            </th>
            <th class="text-left" style="width: 30%">
              {{ $t('document.label.fullName') }}
            </th>
            <th class="text-left" style="width: 40%">
              {{ $t('electronicSign.actions') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <div v-if="signDocumentHistories.length == 0">
            <div class="no-data-table">
              {{ $t('noData') }}
            </div>
          </div>
          <tr v-for="(item, index) in signDocumentHistories" v-else :key="index">
            <!-- STT -->
            <td class="text-center">
              <div class="my-2">{{ ++index }}</div>
            </td>

            <!-- Hinh thuc van ban -->
            <td class="text-left">{{ item.createdDate }}</td>

            <!-- Do khan -->
            <td class="text-left">{{ item.fullName }} ({{ item.userName }})</td>
            <td class="text-left">{{ item.description }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: 'DocumentHistory',
  props: {
    signDocumentHistories: {
      type: Array,
      default: undefined
    }
  }
}
</script>

<style></style>
