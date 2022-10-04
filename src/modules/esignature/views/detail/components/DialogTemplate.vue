<template>
  <div class="doc-history-list">
    <v-simple-table dense fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center" style="width: 5%">STT</th>
            <th class="text-left" style="width: 94%">
              {{ $t('document.unit') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <div v-if="groupDocumentScopes.length == 0">
            <div class="no-data-table">
              {{ $t('noData') }}
            </div>
          </div>
          <tr v-for="(item, index) in groupDocumentScopes" v-else :key="index">
            <!-- STT -->
            <td class="text-center">
              <div class="my-2">{{ ++index }}</div>
            </td>

            <!-- Hinh thuc van ban -->
            <td class="text-left">{{ item.pathName }}</td>
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
    groupDocumentScopes: {
      type: Array,
      default: undefined
    }
  }
}
</script>

<style></style>
