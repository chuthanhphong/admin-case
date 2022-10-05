<template>
  <div>
    <div
      v-for="(it, index) in vehicleInfoDtos"
      :key="index"
      class="list-item-book-car mt-2 pb-4"
    >
      <div v-if="it.seatRequest !== 0" class="title-choose">
        {{ it.seatRequest }} Chỗ:
      </div>
      <div v-else class="title-choose">xe khác</div>
      <div v-if="it.isShowChooseSeat" class="mb-2">
        <v-select
          v-model="it.seatRequest"
          item-text="name"
          item-value="value"
          outlined
          dense
          hide-details
          attach=""
          placeholder="Chọn loại xe"
          :items="itemTypeCar"
          :menu-props="{ contentClass: 'reportYear' }"
        >
        </v-select>
      </div>
      <div v-if="it.seatRequest !== 0">
        <div v-if="it.isShowChoose" style="width: 100%">
          <v-autocomplete
            :items="transportData"
            :no-filter="true"
            :no-data-text="$t('noData')"
            placeholder="Nhập tên tài xế / tên xe"
            class="text--body-5"
            dense
            outlined
            solo
            append-icon="mdi-magnify"
            @change="$emit('onSelected', $event, index)"
            @click="$emit('findTransport', it.seatRequest)"
            @update:search-input="
              $emit('findTransport', it.seatRequest, $event)
            "
          >
            <template v-slot:append-icon>
              <v-icon>fas fa-search</v-icon>
            </template>
            <template v-slot:item="data">
              <div v-if="transportData.length" class="item">
                <v-list-item color="transparent">
                  <div class="d-flex nowrap" style="width: 100%">
                    <div class="d-flex flex-column justify-center div-avatar">
                      <v-avatar class="mr-2" size="40px" color="primary">
                        <img v-if="false" />
                        <b v-else class="text-uppercase white--text">{{
                          data.item.driverName && data.item.driverName[0]
                        }}</b>
                      </v-avatar>
                    </div>
                    <div
                      class="
                        d-flex
                        flex-column
                        justify-left
                        align-left
                        div-content
                      "
                    >
                      <span class="title-name">
                        {{ data.item.driverName }} - Tài xế
                      </span>
                      <span class="sub-title-phone">
                        {{ data.item.driverPhone }}
                      </span>
                      <span class="sub-title-car">
                        {{ data.item.vehicleName }} -
                        {{ data.item.licensePlates }}
                      </span>
                    </div>
                  </div>
                </v-list-item>
              </div>
            </template>
          </v-autocomplete>
        </div>

        <div v-else class="mt-4">
          <div class="user">
            <v-list-item color="transparent">
              <div class="d-flex nowrap" style="width: 100%">
                <div class="d-flex flex-column justify-center div-avatar">
                  <v-avatar class="mr-4" size="80px" color="primary">
                    <img v-if="false" />
                    <b v-else class="text-uppercase white--text">{{
                      it.dataSelected?.driverName &&
                      it.dataSelected?.driverName[0]
                    }}</b>
                  </v-avatar>
                </div>
                <div
                  class="d-flex flex-column justify-left align-left div-content"
                >
                  <span class="title-name mb-2 mt-1">
                    {{ it.dataSelected?.driverName }} - Tài xế
                  </span>
                  <span class="sub-title-phone mb-2">
                    {{ it.dataSelected?.driverPhone }}
                  </span>
                  <span class="sub-title-car">
                    {{ it.dataSelected?.vehicleName }} -
                    {{ it.dataSelected?.licensePlates }}
                  </span>
                </div>
              </div>
            </v-list-item>
            <div class="ic-delete">
              <v-btn icon @click="$emit('onCloseSelected', index)">
                <v-icon color="#FF4A55"> mdi-close </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    vehicleInfoDtos: {
      type: Array,
      default: () => [],
    },
    transportData: {
      type: Array,
      default: () => [],
    },
    itemTypeCar: {
      type: Array,
      default: () => [],
    },
    isShowChooseSeat: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.title-choose {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #22242c;
}
.title-name {
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  text-transform: capitalize;
  color: #22242c;
}

.sub-title-phone {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-transform: capitalize;
  color: #4e5056;
}

.sub-title-car {
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  text-transform: capitalize;
  color: #a7a7ab;
}
</style>

