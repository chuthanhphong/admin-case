<template>
  <div class="col-sm-2 col-md-2 pr-0">
    <v-treeview
      id="tree-prority"
      hoverable
      activatable
      transition
      :active="actives"
      :open="open"
      :items="items"
      expand-icon="mdi-chevron-down"
      class="pr-1"
      dense
      @update:active="clickOnNode"
    >
      <template slot="label" slot-scope="{ item, leaf }">
        <v-tooltip top content-class="tooltip-top">
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              <span :class="`label-item-${leaf ? 'leaf' : 'parent'}`">{{
                $t(item.name)
              }}</span>
            </span>
          </template>
          <span>{{ $t(item.name) }}</span>
        </v-tooltip>
      </template>
    </v-treeview>
  </div>
</template>

<script>
import { DocumentService } from '@/modules/edocument/services/documentService'

export default {
  name: 'FormulaTree',
  data() {
    return {
      actives: [],
      selectedNode: [],
      open: [],
      items: [],
      formulaTypes: []
    }
  },

  mounted() {
    this.getFormulaTree()
  },

  methods: {
    async getFormulaTree() {
      const response = await DocumentService.getFormulaTree()
      if (response.success) {
        this.formulaTypes = response.data
        this.$emit('get-formula-tree', this.formulaTypes)

        var rootFormulaTree = null
        rootFormulaTree = this.formulaTypes.find(g => !g.parentId)
        if (rootFormulaTree) {
          rootFormulaTree.name = 'libraries.listLibrary.all'
        }
        this.items = [this.buildTree(rootFormulaTree)]

        this.actives = [rootFormulaTree.id]
        this.open = [rootFormulaTree.id]
      }
    },
    // Build cay hinh thuc
    buildTree(formula) {
      const childs = this.formulaTypes.filter(g => g.parentId === formula.id)
      const dataChild = []
      childs.map(g => dataChild.push(this.buildTree(g)))
      if (dataChild.length === 0) {
        return { ...formula }
      }

      return { ...formula, children: dataChild }
    },
    clickOnNode(node) {
      if (node.length === 0) {
        this.actives = this.selectedNode
        return
      }
      this.selectedNode = node
      const nodeFormula = this.formulaTypes.find(item => item.id === node[0])
      var formulaId = null
      if (nodeFormula.parentId) {
        formulaId = nodeFormula.id
      }
      this.$emit('selected-group', formulaId)
    }
  }
}
</script>

<style lang="scss" src="./TreeFormula.scss"></style>
