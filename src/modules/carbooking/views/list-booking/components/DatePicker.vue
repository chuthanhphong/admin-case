<template>
  <div>
    <span class="label-input"> {{ label }} </span>
    <span style="color: red"> *</span>
    <v-form ref="form" v-model="formData.validate" lazy-validation>
      <div class="d-flex">
        <div class="mr-2">
          <div>
            <date-picker
              v-model="formData.timePicker"
              :time-picker-options="options"
              format="HH:mm"
              type="time"
              :lang="localDate"
              placeholder="HH:MM"
              class="calendar-text--body-1"
            ></date-picker>
          </div>
        </div>

        <div>
          <v-menu
            ref="menu"
            v-model="menuDate"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateValue"
                class="text--body-1"
                outlined
                v-bind="attrs"
                placeholder="DD-MM-YYYY"
                :error-messages="$t(errorDate)"
                required
                v-on="on"
                @click:append="menuDate = !menuDate"
              >
                <template v-slot:append>
                  <img
                    style="margin-top: -10px"
                    src="@/assets/icons/ic-calendar.svg"
                    alt=""
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="formData.datePicker"
              format="DD/MM/YYYY"
              :locale="localDate"
              :min="nowDate"
              no-title
              @input="menuDate = false"
            />
          </v-menu>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import moment from "moment";

export default {
  components: {
    DatePicker,
  },
  props: {
    isDeparture: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({
        start: "00:00",
        step: "00:15",
        end: "23:45",
      }),
    },
    label: {
      type: String,
      default: "",
    },
    isClear: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        validate: true,
        datePicker: moment().format("YYYY-MM-DD"),
        timePicker: "",
      },
      errorDate: null,
      nowDate: moment().format("YYYY-MM-DD"),
      dateValue: moment().format("DD/MM/YYYY"),
      menuDate: false,
    };
  },
  computed: {
    localDate() {
      return this.$i18n.locale === "vi" ? "vi-VN" : "en-US";
    },
  },
  watch: {
    formData: {
      deep: true,
      handler() {
        if (this.formData.datePicker) {
          this.dateValue = moment(this.formData.datePicker).format(
            "DD/MM/YYYY"
          );
        }
        if (this.formData.validate) {
          this.$emit("changeData", this.formData);
        }
      },
    },
    isClear() {
      if (this.isClear) {
        this.$refs.form.resetValidation();
        this.dateValue = moment().format("DD/MM/YYYY");
        this.formData.datePicker = moment().format("YYYY-MM-DD");
        this.formData.timePicker = "";
        this.formData.validate = true;
      }
    },
    dateValue() {
      console.log(this.dateValue);
      if (this.dateValue) {
        var isValid = moment(this.dateValue, "DD/MM/YYYY", true).isValid();
        if (!isValid) {
          this.errorDate = "booking.dialog-create.error.dateValid";
          this.formData.datePicker = null;
          this.$emit("errorDate");
          return;
        }

        if (isValid) {
          this.formData.datePicker = moment(
            this.dateValue,
            "DD/MM/YYYY"
          ).format("YYYY-MM-DD");
          const dateFrom = moment().format("DD/MM/YYYY");
          const diff = moment(dateFrom, "DD/MM/YYYY").diff(
            moment(this.dateValue, "DD/MM/YYYY"),
            "days"
          );

          this.errorDate = null;
          if (diff > 0) {
            this.errorDate = "booking.dialog-create.error.compareDate";
            this.formData.datePicker = null;
            this.$emit("errorDate");
            return;
          }
        }
      } else {
        this.$emit("errorDate");
        this.formData.datePicker = null;
        this.errorDate = this.isDeparture
          ? this.$t(`booking.dialog-create.error.departure-date-rules`)
          : this.$t(`booking.dialog-create.error.destination-date-rules`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.label-input {
  font-size: 14px;
  color: #22242c;
  font-weight: 600;
  font-size: 14px;
}
</style>
