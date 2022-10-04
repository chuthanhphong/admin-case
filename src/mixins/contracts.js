export default {
  methods: {
    renderProcessContract(process) {
      if (process.totalStep <= 6) {
        let htmlProcess = "";
        for (let i = 1; i <= process.startProcess; i++) {
          htmlProcess +=
            i === +process.startProcess
              ? `<span class="process-item status-processing pulse icon-processing"><i class="icon-process"></i></span>`
              : `<span class="process-item status-done"><i class="mdi mdi-check"></i></span>`;
        }
        for (let i = process.startProcess + 1; i <= process.totalStep; i++) {
          htmlProcess += `<span class="process-item status-processing">${i}</span>`;
        }
        return htmlProcess;
      } else {
        let htmlProcess = "";
        // Cach buoc cuoi 3 buoc
        if (process.totalStep - process.myStep <= 3) {
          for (let i = 1; i <= process.startProcess; i++) {
            htmlProcess +=
              i === +process.startProcess
                ? `<span class="process-item status-processing pulse icon-processing"><i class="icon-process"></i></span>`
                : `<span class="process-item status-done"><i class="mdi mdi-check"></i></span>`;
          }
          for (let i = process.myStep + 1; i <= process.totalStep; i++) {
            htmlProcess += `<span class="process-item status-processing">${i}</span>`;
          }
        } else {
          for (let i = 1; i <= process.startProcess; i++) {
            htmlProcess +=
              i === +process.startProcess
                ? `<span class="process-item status-processing pulse  icon-processing"><i class="icon-process"></i></span>`
                : `<span class="process-item status-done"><i class="mdi mdi-check"></i></span>`;
          }
          for (let i = 1; i <= 4 - process.startProcess; i++) {
            htmlProcess += `<span class="process-item status-processing">${process.myStep + i}</span>`;
          }
          htmlProcess += `<span class="process-item status-processing">...</span>`;
          htmlProcess += `<span class="process-item status-processing">${process.totalStep}</span>`;
        }
        return htmlProcess;
      }
    },

    setProcess(contracts) {
      contracts.map((item) => {
        const maxDots = 6;
        // Tong so buoc
        const totalStep = +item.maxStep;
        // Buoc ky hien tai
        const currentStep = +item.myStep;
        // So buoc con lai
        const remainStep = totalStep - currentStep;
        var startProcess = currentStep;
        if (totalStep > maxDots && maxDots - currentStep <= 3) {
          startProcess = 3;
        }
        if (remainStep < 3 && totalStep > maxDots) {
          startProcess = maxDots - remainStep;
        }
        const step = {
          myStep: currentStep,
          totalStep,
          startProcess,
        };

        return (item.process = step);
      });
      return contracts;
    }
  }
}
