<template>
  <div>
    <div v-if="items.length === 0">
      <EmptyBox
        :show-subtitle="true"
        :subtitle="$t('task-manager.empty.history-task')"
      />
    </div>
    <div v-if="items.length > 0" class="comment-task-history-task mt-3">
      <div v-for="(item,index) in items" :key="index">
        <v-expansion-panels>
          <v-expansion-panel ref="itemPanel">
            <v-expansion-panel-header :hide-actions="true" class="py-0">
              <v-list-item>
                <div class="d-flex flex-row ml-3">
                  <v-avatar
                    color="blue"
                    size="40"
                  >
                    <span
                      class="text-uppercase white--text"
                    >{{
                      renderAvatarText(item.userFullName)
                    }}</span>
                  </v-avatar>
                </div>
                <div>
                  <v-list-item-content class="ml-2">
                    <v-list-item-title v-html="item.userFullName + ' ' + item.content " />
                  </v-list-item-content>
                </div>
                <div class="d-flex flex-row ml-3 justify-end">
                  <v-list-item-content>
                    <span>{{ item.date }}</span>
                  </v-list-item-content>
                </div>
                <v-icon
                  class="icon align-self-center ml-1 icon-expand"
                >$expand</v-icon>
              </v-list-item>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div
                v-for="(history, idx) in item.children"
                :key="idx"
                class="history-task-item-detail d-flex flex-row align-center justify-start pl-4 mt-2 pa-0"
              >
                <v-avatar
                  color="blue"
                  size="40"
                >
                  <span
                    class="text-uppercase white--text"
                  >{{
                    renderAvatarText(item.userFullName)
                  }}</span>
                </v-avatar>
                <span class="pl-2">{{ item.userFullName }}</span>
                <div class="history-content pl-3">{{ history.content }}</div>
                <div v-if="history.note" class="pl-3">
                  <v-tooltip
                    content-class="tooltip-left"
                    left
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="#4B506D"
                        size="20"
                        v-bind="attrs"
                        v-on="on"
                      >mdi-alert-circle-outline</v-icon>
                    </template>
                    <div>
                      <div>{{ $t('contract.note') }}:</div>
                      <span> {{ history.note }}</span>
                    </div>
                  </v-tooltip>
                </div>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import EmptyBox from "@/views/components/EmptyBox";

export default {
  name: "HistoryActionTask",
  components: {
    EmptyBox
  },
  props: {
    historyTask: {
      type: Array,
      default: undefined
    },
    renderAvatarText: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      actives: [],
      nameTreeUnit: '',
      items: [

      ],
    }
  },
  method: {
    buildTree(group) {
      const childs = this.groups.filter(
        g => g.parentGroupId === group.groupId
      )
      const dataChild = []
      childs.map(g => dataChild.push(this.buildTree(g)))
      return {
        id: group.groupId,
        name: group.groupName,
        code: group.groupCode,
        children: dataChild
      }
    },
  }
}
</script>

<style scoped>
.v-list v-sheet>theme--light{
  background-color:transparent!important;

}

.v-expansion-panel::before{
box-shadow: unset!important;
}

.v-expansion-panel-header{
  background-color: transparent!important;
}
</style>
