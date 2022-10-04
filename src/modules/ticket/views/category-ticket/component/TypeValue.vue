<template>
  <div class="ticket-types col-12 col-md-3">
    <div class="text--subtitle font-weight-bold">
      <no-icon no="2" />
      {{ $t('data-type') }}
    </div>
    <div class="col-12 text-caption text-capitalize gray--text mt-1 pl-0">
      {{ $t('data-type-subtitle') }}
    </div>
    <v-scroll-x-transition>
      <div v-show="typesValue.length > 0" class="list-type">
        <ul v-if="typesValue">
          <li v-for="(type, indexValue) in typesValue" :key="indexValue">
            <v-btn
              small
              class="text-capitalize"
              :class="activeType === type.value ? 'active' : ''"
              @click="addTypeValue(type)"
            >
              <span class="font-weight-bold">{{ type.name }}</span>
              <v-tooltip top max-width="250" class="box-shadow">
                <template v-slot:activator="{ on, attrs }">
                  <i class="type-icon" :class="renderClassIcon(type.value)" v-bind="attrs" v-on="on" />
                </template>
                <span>
                  {{ renderTooltipByType(type.value) }}
                </span>
              </v-tooltip>
            </v-btn>
          </li>
        </ul>
      </div>
    </v-scroll-x-transition>
  </div>
</template>

<script>
// Components
import NoIcon from './NoIcon.vue'

import { mapValueTypeToCSSClass } from '@/modules/ticket/helpers/ticketUtils'
// Services
import { CategoryService } from '@/modules/ticket/services/categoryService'

export default {
  components: { NoIcon },
  data() {
    return {
      typesValue: [],
      activeType: -1
    }
  },
  computed: {},
  created() {
    this.getAllTypesValue()
  },
  methods: {
    async getAllTypesValue() {
      const dataTypesValue = await CategoryService.getAllValueType()
      if (dataTypesValue) {
        this.typesValue = dataTypesValue.data
      } else {
        this.typesValue = []
      }
    },
    renderClassIcon(value) {
      const type = mapValueTypeToCSSClass.find((vType) => vType.value === value)
      if (!type) {
        return ''
      }
      return type.icon
    },
    addTypeValue(type) {
      this.activeType = type.value
      type.valueType = type.value
      this.$emit('add-type', { ...type })
    },
    renderTooltipByType(type) {
      switch (type) {
        case 1:
          return this.$t('tickets.tooltips.type-param')
        case 2:
          return this.$t('tickets.tooltips.type-alpha')
        case 3:
          return this.$t('tickets.tooltips.type-number')
        case 4:
          return this.$t('tickets.tooltips.type-select')
        case 5:
          return this.$t('tickets.tooltips.type-check')
        case 6:
          return this.$t('tickets.tooltips.type-calendar')
        case 7:
          return this.$t('tickets.tooltips.type-clock')
        case 8:
          return this.$t('tickets.tooltips.type-upload')
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
