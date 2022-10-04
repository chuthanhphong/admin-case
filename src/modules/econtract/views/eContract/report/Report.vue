<template>
  <div class="wrap-home ml-2 mt-2">
    <v-container fluid class="main-chart py-5 pt-2 rounded-xl bg-primary pb-15">
      <div class="px-5">
        <h4 class="white--text mb-3">{{ $t('report') }}</h4>
        <v-layout row wrap justify-center justify-sm-space-between>
          <div class="col-12">
            <v-card class="chart-item px-0 text-center piechart">
              <h5 class="text-left pl-5 title-chart">
                {{ $t('reportTitleDashboard') }}
              </h5>
              <div class="row piechart-content col-12 ma-0 pa-0">
                <div class="col-12 col-md-5">
                  <div class="row justify-end">
                    <div class="wrap-pie-chart">
                      <doughnut
                        v-if="totalAll > 0"
                        :chart-data="pieChartData"
                        :chart-options="pieChartOptions"
                        :plugins="pieChartPlugin"
                      />
                      <empty-box v-else />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-7">
                  <div class="form-search d-flex justify-space-between px-5">
                    <div class="d-flex">
                      <div class="mw-350">
                        <v-autocomplete
                          v-model="formData.groupId"
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
                          :placeholder="$t('group.groupLabel')"
                          :label="$t('group.groupLabel')"
                          :items="groups"
                          item-text="groupName"
                          item-value="groupId"
                          class="text--body-1"
                          @change="searchReport"
                        >
                          <vue-feather
                            slot="append"
                            class="grey--text"
                            type="search"
                          />
                        </v-autocomplete>
                      </div>
                      <div class="w-120 ml-md-8 ml-sm-5">
                        <v-select
                          v-model="formData.year"
                          :items="years"
                          outlined
                          dense
                          hide-details
                          class="text--lg"
                          attach=""
                          :menu-props="{ contentClass: 'reportYear' }"
                          @change="searchReport"
                        >
                          <template v-slot:append>
                            <v-icon>mdi-chevron-down</v-icon>
                          </template>
                        </v-select>
                      </div>
                    </div>
                    <!-- <v-btn class="px-8" outlined color="primary" dark>
                      <span class="text-capitalize pr-4 text--button">{{
                        $t('report')
                      }}</span>
                      <v-img src="@/assets/imgs/download.svg" />
                    </v-btn> -->
                  </div>
                  <div
                    v-if="totalAll > 0"
                    class="legend-chart-info text-center d-flex align-center ml-md-5"
                  >
                    <ul class="legend-chart flex-column">
                      <li v-show="seriesPie[0]" class="text--body-1">
                        <div>
                          <span class="card-icon rounded-circle bg-process" />
                          <span>{{ $t('dashboards.signing') }}</span>
                        </div>
                        <h5 class="count">{{ seriesPie[0] }}</h5>
                        <span class="percent">{{ percent(0) }}</span>
                      </li>
                      <li v-show="seriesPie[1]" class="text--body-1">
                        <div>
                          <span class="card-icon rounded-circle bg-completed" />
                          <span>{{ $t('dashboards.completed') }}</span>
                        </div>
                        <h5 class="count">{{ seriesPie[1] }}</h5>
                        <span class="percent">{{ percent(1) }}</span>
                      </li>
                      <li v-show="seriesPie[2]" class="text--body-1">
                        <div>
                          <span class="card-icon rounded-circle bg-reject" />
                          <span>{{ $t('dashboards.reject') }}</span>
                        </div>
                        <h5 class="count">{{ seriesPie[2] }}</h5>
                        <span class="percent">{{ percent(2) }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </v-card>
          </div>
          <div class="col-12 mt-sm-5 mt-md-0">
            <v-card class="chart-item px-0 barchart">
              <h5 class="pl-5 title-chart">
                {{ $t('dashboards.titleChartReport') }}
              </h5>
              <div v-if="showBarChart" class="container">
                <apexchart
                  ref="barChart"
                  type="bar"
                  :options="chartOptions"
                  :series="series"
                />
              </div>

              <div v-else class="col-12 col-sm-3 mx-auto">
                <empty-box />
              </div>
            </v-card>
          </div>
        </v-layout>
      </div>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment'
import { GroupService } from '@/services/groupService'
import { ContractService } from '@/modules/econtract/services/contractService'
import { mapActions, mapState } from 'vuex'
import checkRoles from '@/mixins/checkRoles'
import constants from '@/constants'
import EmptyBox from '@/views/components/EmptyBox'
import { Doughnut } from 'vue-chartjs/legacy'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
)
const barChartColors = ['#53CB9F', '#2DD4BF', '#20C2C4', '#15CBE6', '#0FAFE4']
export default {
  components: { EmptyBox, Doughnut },
  mixins: [checkRoles],
  data() {
    return {
      barChartHeight: 500,
      series: [
        {
          name: this.$t('contract.name'),
          data: []
        }
      ],
      dataPieChart: [],
      pieChartOptions: {
        responsive: true,
        hoverOffset: 4,
        plugins: {
          renderTotal: {
            title: this.$t('dashboards.totalContract')
          },
          legend: {
            display: false
          },
          tooltip: {
            enabled: false,
            position: 'nearest',
            external: this.externalTooltipHandler
          }
        }
      },
      pieChartPlugin: [
        {
          id: 'renderTotal',
          beforeDraw(chart, args, options) {
            const width = chart.width
            const height = chart.height
            // console.log({ width })
            const ctx = chart.ctx
            chart.ctx.restore()
            const data = chart.config.data.datasets[0].data
            const title = chart.config.options.plugins.renderTotal.title
            var total = data.reduce((sum, s) => sum + s, 0) + ''
            // let fontSize = (height / 180).toFixed(2)
            let fontSize = (height / 180).toFixed(2)
            let fontSizeTotal = (height / 100).toFixed(2)
            if (width < 300) {
              fontSize = 14
              fontSizeTotal = 36
            } else {
              fontSize = 16
              fontSizeTotal = 40
            }
            ctx.font = `600 ${fontSize}px Mulish`
            ctx.textBaseline = 'middle'
            const text = title
            const textX = Math.round((width - ctx.measureText(text).width) / 2)
            const textY = height / 2.2
            ctx.fillStyle = '#8E8EA1'
            ctx.fillText(text, textX, textY)

            ctx.font = `700 ${fontSizeTotal}px Mulish`
            const textTotalX = Math.round(
              (width - ctx.measureText(total).width) / 2
            )
            const textTotalY = height / 1.7
            ctx.fillStyle = '#000000'
            ctx.fillText(total, textTotalX, textTotalY)
            ctx.save()
          }
        }
      ],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 500
        },
        legend: {
          show: false
        },
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 4,
            horizontal: true,
            dataLabels: { position: 'top' },
            barHeight: '45'
          }
        },
        colors: [],
        dataLabels: {
          enabled: true,
          offsetX: -10,
          style: {
            fontWeight: '600',
            fontSize: '16px',
            fontFamily: 'Mulish',
            colors: ['#ffffff'],
            cssClass: 'text--body-1'
          }
        },

        yaxis: {
          labels: {
            maxWidth: 190,
            align: 'right',
            style: {
              colors: '#A7A7AB',
              fontSize: '16px',
              fontFamily: 'Mulish',
              fontWeight: 400
            }
          }
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: ['#A3AED0'],
              fontSize: '12px',
              fontFamily: 'Mulish',
              fontWeight: 400,
              cssClass: 'text--body-1'
            }
          }
        }
      },
      totalAll: 0,
      seriesPie: [0, 0, 0],
      years: ['2020'],
      formData: {
        year: '',
        groupId: ''
      },
      groups: [],
      showBarChart: false
    }
  },
  computed: {
    ...mapState('layout', ['refreshChart']),
    pieChartData() {
      return {
        labels: [
          this.$t('dashboards.signing'),
          this.$t('dashboards.completed'),
          this.$t('dashboards.reject')
        ],
        datasets: [
          {
            data: this.seriesPie,
            borderRadius: 5,
            spacing: 1,
            backgroundColor: ['#FFAF2E', '#00C3F9', '#FF1D1D'],
            cutout: '75%'
          }
        ]
      }
    }
  },
  watch: {
    refreshChart() {
      this.$refs.pieChart.refresh()
    }
  },
  created() {
    this.hasPermission([
      constants.USER_ROLE.ROLE_ADMIN,
      constants.USER_ROLE.LD,
      constants.USER_ROLE.HDDT
    ])
  },

  async mounted() {
    window.dispatchEvent(new Event('resize'))

    const currentYear = moment().format('YYYY')
    var startYear = 2020
    while (startYear < currentYear) {
      startYear++
      this.years.push(startYear.toString())
    }
    this.formData.year = currentYear
    // this.searchReport()
    await this.getGroups()
    if (this.groups && this.groups.length > 0) {
      this.formData.groupId = this.groups[0].groupId
    }
    this.searchReport()
  },
  methods: {
    ...mapActions('layout', ['setNotify']),
    // Lay danh sach don vi
    async getGroups() {
      try {
        const response = await GroupService.getGroupsReport()
        this.groups = response.data
      } catch (error) {
        console.log(error)
      }
    },
    percent(index) {
      var total = this.seriesPie.reduce((sum, s) => sum + s, 0)
      if (total === 0) {
        return 0
      }
      return ((this.seriesPie[index] / total) * 100).toFixed(2) + '%'
    },
    // Chon don vi
    onChangeGroup() {
      console.log(this.formData.groupId)
    },
    // Tim kiem bao cao
    async searchReport() {
      try {
        const response = await ContractService.searchReport(this.formData)
        const { data } = response
        if (!data) {
          return
        }
        this.updatePieChart(data)
        this.updateBarChart(data)
      } catch (error) {
        this.setNotify({
          show: true,
          type: 'error',
          content: 'errors.getReport'
        })
      }
    },
    // Cap nhat lai pie chart
    updatePieChart(data) {
      this.seriesPie = [data.totalProcess, data.totalComplete, data.totalReject]
      this.totalAll = data.totalAll
      if (this.totalAll > 0) {
        setTimeout(() => {
          // this.$refs.pieChart.updateSeries(this.seriesPie)
        }, 100)
      }
    },
    // Cap nhat lai bar chart
    updateBarChart(data) {
      var { totalFormulas } = data
      var seriesData = []
      var categoriesData = []
      if (totalFormulas.length > 0) {
        this.showBarChart = true
        totalFormulas.forEach(contract => {
          seriesData.push(contract.totalCount)
          categoriesData.push(contract.formulaName)
        })
        if (totalFormulas.length < 6) {
          this.barChartHeight = 80 * totalFormulas.length
        }
        if (totalFormulas.length <= 2) {
          this.barChartHeight = 120 + 30 * (totalFormulas.length - 1)
        }
        var options = { ...this.chartOptions }
        for (let i = 0; i < totalFormulas.length; i++) {
          options.colors[i] = barChartColors[i % 5]
          // options.dataLabels.style.colors[i] = barChartColors[i % 5]
        }
        options.xaxis.categories = categoriesData
        options.chart.height = this.barChartHeight
        setTimeout(() => {
          this.$refs.barChart.updateOptions(options)
          this.$refs.barChart.updateSeries([{ data: seriesData }])
        }, 100)
      } else {
        this.showBarChart = false
      }
    },
    externalTooltipHandler(context) {
      // Tooltip Element
      const { chart, tooltip } = context
      const tooltipEl = this.getOrCreateTooltip(chart)

      // Hide if no tooltip
      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0
        return
      }
      if (tooltip.dataPoints) {
        const tableBody = document.createElement('tbody')

        const dataTooltip = tooltip.dataPoints[0]
        const { label, formattedValue, dataset } = dataTooltip

        const tr = document.createElement('tr')
        tr.style.backgroundColor = 'inherit'
        tr.style.borderWidth = 0

        const td = document.createElement('td')
        td.style.borderWidth = 0
        const wrapCountEl = document.createElement('div')
        wrapCountEl.setAttribute('class', 'warp-count')

        const countEl = document.createElement('span')
        countEl.setAttribute('class', 'count-text')
        const nodeCount = document.createTextNode(formattedValue)
        countEl.appendChild(nodeCount)
        wrapCountEl.appendChild(countEl)

        const percentEl = document.createElement('span')
        percentEl.setAttribute('class', 'percent-text')
        var total = dataset.data.reduce((sum, s) => sum + s, 0)
        const percentValue =
          '(' + ((formattedValue / total) * 100).toFixed(2) + '%)'
        const nodePercent = document.createTextNode(percentValue)
        percentEl.appendChild(nodePercent)
        wrapCountEl.appendChild(percentEl)

        const labelEl = document.createElement('div')
        labelEl.setAttribute('class', 'label-tooltip')
        const nodeLabel = document.createTextNode(label)
        labelEl.appendChild(nodeLabel)

        td.appendChild(wrapCountEl)
        td.appendChild(labelEl)
        tr.appendChild(td)
        tableBody.appendChild(tr)
        const tableRoot = tooltipEl.querySelector('table')

        // Remove old children
        while (tableRoot.firstChild) {
          tableRoot.firstChild.remove()
        }

        // Add new children
        tableRoot.appendChild(tableBody)
      }
      const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1
      tooltipEl.style.left = positionX + tooltip.caretX + 'px'
      tooltipEl.style.top = positionY + tooltip.caretY + 'px'
      tooltipEl.style.font = tooltip.options.bodyFont.string
      tooltipEl.style.padding =
        tooltip.options.padding + 'px ' + tooltip.options.padding + 'px'
    },
    getOrCreateTooltip(chart) {
      let tooltipEl = chart.canvas.parentNode.querySelector('div')

      if (!tooltipEl) {
        tooltipEl = document.createElement('div')
        tooltipEl.style.background = '#fff'
        tooltipEl.style.borderRadius = '15px'
        tooltipEl.style.color = '#0A093D'
        tooltipEl.style.opacity = 1
        tooltipEl.style.pointerEvents = 'none'
        tooltipEl.style.position = 'absolute'
        tooltipEl.style.transform = 'translate(-50%, 0)'
        tooltipEl.style.transition = 'all .1s ease'

        const table = document.createElement('table')
        table.style.margin = '0px'

        tooltipEl.appendChild(table)
        chart.canvas.parentNode.appendChild(tooltipEl)
      }

      return tooltipEl
    }
  }
}
</script>
