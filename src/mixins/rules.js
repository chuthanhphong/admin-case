export default {
  data() {
    return {
      groupNameInput: {
        required: true,
        regex:
          '^([ 0-9a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴýÝỶỸửữựỳỵỷỹs|_|&]||[^\u0000-\u007F])+$'
      },
      groupNameInputSearch: {
        regex:
          '^([ 0-9a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴýÝỶỸửữựỳỵỷỹs|_|&]||[^\u0000-\u007F])+$'
      },
      textInput: {
        max: 255,
        regex:
          '^([ 0-9a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴýÝỶỸửữựỳỵỷỹs|_]||[^\u0000-\u007F])+$'
      },
      textInputRequired: {
        ...this.textInput,
        required: true
      },
      groupCodeInput: {
        required: true,
        regex: '^[0-9a-zA-Z|_|\\-]+$'
      },
      numberPositive: {
        regex: '^[1-9]{1}[0-9]{0,2}$'
      },
      ruleDate: {
        dateBefore: true,
        regex:
          '^(((0[1-9]|[12]\\d|3[01])\\/(0[13578]|1[02])\\/((19|[2-9]\\d)\\d{2}))|((0[1-9]|[12]\\d|30)\\/(0[13456789]|1[012])\\/((19|[2-9]\\d)\\d{2}))|((0[1-9]|1\\d|2[0-8])\\/02\\/((19|[2-9]\\d)\\d{2}))|(29\\/02\\/((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$'
      },
      fullNameRuler: {
        required: true,
        max: 255,
        regex:
          '^([ 0-9a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴýÝỶỸửữựỳỵỷỹ@.s|_]|[^\u0000-\u007F])+$'
      },
      userNameInput: {
        required: true,
        max: 255,
        regex: '^[0-9a-zA-Z@.]+$'
      },
      password: {
        required: true,
        max: 50,
        min: 8,
        validatePassword: true
      },
      confirmPassword: {
        required: true,
        max: 50,
        min: 8,
        validatePassword: true,
        confirmed: 'newPassword'
      },
      ruleEmail: {
        required: true,
        max: 255,
        regex:
          '^[A-Za-z0-9-\\+]+(\\.[A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
      },
      ruleEmailNotRequired: {
        max: 255,
        regex:
          '^[A-Za-z0-9-\\+]+(\\.[A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
      },
      ruleFileContract: {
        required: true,
        ext: ['pdf'],
        mimes: ['application/pdf'],
        size: 1024 * 50
      },
      ruleFileDocument: {
        ext: ['pdf'],
        mimes: ['application/pdf'],
        size: 1024 * 50
      },
      ruleFileAttachs: {
        ext: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
        mimes: [
          'application/pdf',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        size: 1024 * 50
      },
      ruleFileAttachsDoc: {
        ext: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'txt', 'msg'],
        mimes: [
          'application/pdf',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ''
        ],
        size: 1024 * 50
      },
      ruleFileAttachsCalender: {
        ext: ['pdf', 'xls', 'xlsx', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'txt', 'msg'],
        mimes: [
          'application/pdf',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'image/jpeg',
          ''
        ],
        size: 1024 * 50
      },
      ruleFileListContract: {
        required: true,
        ext: ['xls', 'xlsx'],
        mimes: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ],
        size: 1024 * 50
      },
      ruleFileZipContract: {
        required: true,
        ext: ['zip'],
        mimes: [
          'application/zip',
          'application/octet-stream',
          'application/x-zip-compressed',
          'multipart/x-zip'
        ],
        size: 1024 * 50
      },
      formatDateRule: {
        checkFormatDate: true
      },
      effectiveDateRule: {
        required: true,
        checkFormatDate: true
      },
      ruleFileAttachsTicket: {
        ext: ['pdf', 'xls', 'xlsx', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
        mimes: [
          'application/pdf',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png'
        ],
        size: 1024 * 10
      },
      ruleFileAttachsTicketRequired: {
        ...this.ruleFileAttachsTicket,
        required: true
      },
      ruleFileCompleteTicket: {
        ext: ['pdf', 'xls', 'xlsx', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
        mimes: [
          'application/pdf',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'image/jpeg',
          'application/vnd.opemxmlformats-officedociment.wordprocessingml.document',
        ],
        size: 1024 * 100
      },
      ruleFileTask: {
        ext: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'txt', 'msg', 'zip', 'rar'],
        mimes: [
          'application/pdf',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          '',
          'application/zip',
          'application/octet-stream',
          'application/x-zip-compressed',
          'multipart/x-zip'
        ],
        size: 1024 * 50
      },
    }
  }
}
