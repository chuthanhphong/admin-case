<template>
  <v-treeview
    id="org-tree"
    hoverable
    activatable
    transition
    :active="actives"
    :open="open"
    :items="items"
    expand-icon="mdi-chevron-down"
    class="col-sm-4 col-md-2"
    dense
    @update:active="clickOnNode"
  >
    <template slot="label" slot-scope="{ item, leaf }">
      <v-tooltip top content-class="tooltip-top">
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on">
            <span :class="`label-item-${leaf ? 'leaf' : 'parent'}`">{{
              item.name
            }}</span>
          </span>
        </template>
        <span>{{ item.name }}</span>
      </v-tooltip>
    </template>
    <template
      v-if="showAction && item.id !== ''"
      slot="append"
      slot-scope="{ item }"
      class="d-block"
    >
      <v-menu
        v-if="item.id !== rootGroupId"
        left
        offset-y
        transition="scroll-y-transition"
        content-class="menu-action arrow-up"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn text fab dense small v-bind="attrs" v-on="on">
            <v-icon> mdi-dots-vertical </v-icon>
          </v-btn>
        </template>

        <v-list :ripple="false">
          <div class="px-2 item-action">
            <v-btn
              text
              dark
              block
              :ripple="false"
              :to="{ name: 'GROUP_UPDATE', params: { groupId: item.id } }"
            >
              <v-icon size="20">mdi-pencil</v-icon>
              <span class="text-capitalize">
                {{ $t('contract.tooltip.edit') }}</span>
            </v-btn>
          </div>
          <div class="px-2 item-action">
            <v-btn
              block
              :ripple="false"
              text
              dark
              @click="accept(`${item.id}`)"
            >
              <v-icon size="20">mdi-trash-can</v-icon>
              <span class="text-capitalize">
                {{ $t('contract.tooltip.delete') }}
              </span>
            </v-btn>
          </div>
        </v-list>
      </v-menu>

      <!-- <v-menu
        v-if="item.id !== rootGroupId"
        offset-x
        bottom
        content-class="menu-group-action"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>
              mdi-dots-vertical
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  fab
                  dark
                  x-small
                  color="warning"
                  :to="{
                    name: 'GROUP_UPDATE',
                    params: { groupId: item.id }
                  }"
                  v-on="on"
                >
                  <v-icon>mdi-square-edit-outline</v-icon>
                </v-btn>
              </template>
              <span>Sửa</span>
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </template>
  </v-treeview>
</template>

<script>
import { GroupService } from '@/services/groupService'
import constants from '@/constants'
import { mapState } from 'vuex'

export default {
  name: 'TreeOrg',
  props: {
    showAction: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      actives: [],
      selectedNode: [],
      open: [],
      items: [],
      groups: [],
      rootGroupId: 1
    }
  },
  computed: { ...mapState('layout', ['userInfo']) },

  mounted() {
    this.getGroupTree()
  },

  methods: {
    async getGroupTree() {
      const response = await GroupService.groupTree()
      if (response.success) {
        this.groups = response.data
        // groupRoot
        const user = JSON.parse(localStorage.getItem(constants.USER_INFO))
        this.rootGroupId = user.rootGroupId
        const rootGroup = this.groups.find(g => g.groupId === this.rootGroupId)
        // Danh sach dv doi tac
        var listPartners = this.groups.filter(
          g => g.groupType === constants.GROUPS.EXTERNAL
        )
        listPartners = listPartners.map(p => ({
          id: p.groupId,
          name: p.groupName,
          code: p.groupCode
        }))
        // count external group, save to localstorage
        localStorage.setItem(
          constants.EXTERNAL_GROUP_COUNT,
          listPartners.length
        )
        var nodePartner = {
          id: '',
          name: this.$t('group.partnerLabel'),
          code: '',
          children: listPartners
        }
        this.items = [this.buildTree(rootGroup)]
        if (listPartners.length > 0) {
          this.items[0]['children'].push(nodePartner)
        }

        this.actives = [this.rootGroupId]
        this.open = [this.rootGroupId]
      }
    },
    // Build cay don vi
    buildTree(group) {
      const childs = this.groups.filter(
        g => g.parentGroupId === group.groupId && g.groupType === 'INTERNAL'
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
    editGroup(group) {
      console.log(group)
    },
    clickOnNode(node) {
      if (node.length === 0) {
        this.actives = this.selectedNode
        return
      }
      this.selectedNode = node
      this.$emit('selected-group', node[0])
    },
    accept(groupId) {
      if (groupId) {
        this.$emit('accept', groupId)
      }
    }
  }
}
</script>

<style lang="scss" src="./TreeOrg.scss"></style>
