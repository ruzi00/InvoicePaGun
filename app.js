const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const FIREBASE_CONFIG_STORAGE_KEY = "invoice-firebase-config";
const DEFAULT_TEACHER_STORAGE_KEY = "invoice-default-teacher";
const FIREBASE_SOURCE_COLLECTION = "invoice_sources";
const FIREBASE_STUDENT_COLLECTION = "student_details";
const FIREBASE_ATTENDANCE_COLLECTION = "attendance_records";
const FIREBASE_INVOICE_COLLECTION = "invoice_records";
const FIREBASE_SOURCE_KINDS = ["students", "pricing", "discount", "bank", "holiday", "attendance", "template_after"];
const APP_TIME_ZONE = "Asia/Jakarta";
const STUDENT_CSV_HEADERS = [
  "No.",
  "Nama Lengkap Siswa",
  "Nama Panggilan Siswa",
  "L/P",
  "Kelas",
  "H1",
  "Kelas Selanjutnya",
  "H2",
  "Sekolah",
  "Nomor WhatsApp\nSiswa",
  "Nama Orang Tua/Wali",
  "Nomor WhatsApp\nOrang Tua/Wali",
  "Riwayat Les",
];
const FIREBASE_SHARED_OWNER_UID = "bimbelpakgun-shared";
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyATOra_DTbyKzS-YY7KyRqBWLmeGPqReKY",
  authDomain: "bimbelpakgun.firebaseapp.com",
  projectId: "bimbelpakgun",
  storageBucket: "bimbelpakgun.firebasestorage.app",
  messagingSenderId: "1089600700256",
  appId: "1:1089600700256:web:1e99ba6cd2c2e88592a805",
};

const BUNDLED_SOURCE_FILES = {
  students: ["data/REKAP DATA SISWA.csv", "REKAP DATA SISWA.csv"],
  pricing: ["data/tarif.csv", "tarif.csv"],
  discount: ["data/diskon_durasi.csv", "diskon_durasi.csv"],
  bank: ["data/bank_guru.csv", "bank_guru.csv"],
  holiday: ["data/hari_libur.csv", "hari_libur.csv"],
  template_after: ["data/template_payment_after.csv", "template_payment_after.csv"],
};

const APP_ASSETS = {
  logo: "assets/images/Logo.png",
};

const TAB_GROUP_MAP = {
  front: "invoice",
  after: "invoice",
  calendar: "invoice",
  status: "invoice",
  students: "data",
  pricing: "data",
  discount: "data",
  bank: "data",
  holiday: "data",
  attendance_input: "operations",
  attendance: "operations",
  receivables: "operations",
  reminders: "operations",
};

const GROUP_TABS = {
  invoice: ["front", "after", "calendar", "status"],
  data: ["students", "pricing", "discount", "bank", "holiday"],
  operations: ["attendance_input", "attendance", "receivables", "reminders"],
};

const state = {
  mode: "front",
  activeGroup: "invoice",
  activeTab: "front",
  lastTabByGroup: {
    invoice: "front",
    data: "students",
    operations: "attendance_input",
  },
  currentInvoiceId: "",
  autoLoadTried: false,
  calendarWeekAutoFocus: true,
  calendarShareOnly: false,
  students: [],
  studentsByNickname: new Map(),
  studentsByFullName: new Map(),
  studentsById: new Map(),
  absensiRows: [],
  absensiHeaders: [],
  attendanceEntries: [],
  sessions: [],
  tarif: {
    weekdays: {},
    saturday: {},
    sunday: {},
  },
  diskonDurasi: [],
  bankGuru: [],
  holidaySet: new Set(),
  holidayInfoMap: new Map(),
  sourceTexts: {
    students: "",
    pricing: "",
    discount: "",
    bank: "",
    holiday: "",
    attendance: "",
    template_after: "",
  },
  lastInvoiceRecord: null,
  invoiceHistory: [],
  dashboardInvoices: [],
  rescheduleAnchorId: "",
  calendarWeekIndex: 0,
  calendarWeekCount: 0,
  invoiceHistoryQuery: {
    pageSize: 20,
    studentFilter: "",
    cursorStack: [],
    hasNext: false,
    lastVisibleDoc: null,
    currentPage: 1,
    activeOwnerUid: "",
  },
  studentManageQuery: {
    pageSize: 15,
    currentPage: 1,
    gradeFilter: "",
    searchName: "",
    searchSchool: "",
  },
  studentFormEditIndex: -1,
  editingInvoiceHistoryId: "",
  editingInvoiceMeta: null,
  pricingManageRows: [],
  discountManageRows: [],
  bankManageRows: [],
  holidayManageRows: [],
  operationsReminderRows: [],
  firebase: {
    app: null,
    auth: null,
    db: null,
    user: null,
    ready: false,
    config: null,
  },
};

const el = {
  workflowGroupButtons: document.querySelectorAll(".workflow-group"),
  workflowTabs: document.querySelectorAll(".workflow-tab"),
  settingsMenu: document.getElementById("settingsMenu"),
  settingsMenuContent: document.getElementById("settingsMenuContent"),
  runtimeNotice: document.getElementById("runtimeNotice"),
  cloudReadyNotice: document.getElementById("cloudReadyNotice"),
  autoLoadSection: document.getElementById("autoLoadSection"),
  firebaseSyncSection: document.getElementById("firebaseSyncSection"),
  localSourceControls: document.getElementById("localSourceControls"),
  firebaseCsvEditor: document.getElementById("firebaseCsvEditor"),
  packageFiles: document.getElementById("packageFiles"),
  btnAutoLoadFolder: document.getElementById("btnAutoLoadFolder"),
  studentSheetUrl: document.getElementById("studentSheetUrl"),
  btnMuatSiswaSheet: document.getElementById("btnMuatSiswaSheet"),
  studentFile: document.getElementById("studentFile"),
  btnSiswaContoh: document.getElementById("btnSiswaContoh"),

  pricingFile: document.getElementById("pricingFile"),
  btnTarifContoh: document.getElementById("btnTarifContoh"),
  discountFile: document.getElementById("discountFile"),
  btnDiskonContoh: document.getElementById("btnDiskonContoh"),
  bankFile: document.getElementById("bankFile"),
  btnBankContoh: document.getElementById("btnBankContoh"),
  holidayFile: document.getElementById("holidayFile"),
  btnHolidayContoh: document.getElementById("btnHolidayContoh"),
  holidayDates: document.getElementById("holidayDates"),

  invoiceDate: document.getElementById("invoiceDate"),
  invoiceTitle: document.getElementById("invoiceTitle"),
  studentSelect: document.getElementById("studentSelect"),
  studentOptions: document.getElementById("studentOptions"),
  totalTagihan: document.getElementById("totalTagihan"),
  studentDetail: document.getElementById("studentDetail"),

  frontSection: document.getElementById("frontSection"),
  frontStartDate: document.getElementById("frontStartDate"),
  frontWeeks: document.getElementById("frontWeeks"),
  btnGenerateMingguan: document.getElementById("btnGenerateMingguan"),
  frontWeekTable: document.getElementById("frontWeekTable"),
  defaultTeacherSelect: document.getElementById("defaultTeacherSelect"),
  btnSaveDefaultTeacher: document.getElementById("btnSaveDefaultTeacher"),

  afterSection: document.getElementById("afterSection"),
  csvFile: document.getElementById("csvFile"),
  btnContoh: document.getElementById("btnContoh"),
  btnDownloadAfterTemplate: document.getElementById("btnDownloadAfterTemplate"),
  sheetUrl: document.getElementById("sheetUrl"),
  btnMuatSheet: document.getElementById("btnMuatSheet"),
  afterInvoiceDateSelect: document.getElementById("afterInvoiceDateSelect"),
  btnApplyAfterInvoiceDate: document.getElementById("btnApplyAfterInvoiceDate"),
  calendarSection: document.getElementById("calendarSection"),
  paymentStatusSection: document.getElementById("paymentStatusSection"),
  studentManagementSection: document.getElementById("studentManagementSection"),
  pricingManagementSection: document.getElementById("pricingManagementSection"),
  discountManagementSection: document.getElementById("discountManagementSection"),
  bankManagementSection: document.getElementById("bankManagementSection"),
  holidayManagementSection: document.getElementById("holidayManagementSection"),
  attendanceOperationsSection: document.getElementById("attendanceOperationsSection"),
  attendanceOpsSummary: document.getElementById("attendanceOpsSummary"),
  attendanceOpsTableBody: document.getElementById("attendanceOpsTableBody"),
  attendanceInputOperationsSection: document.getElementById("attendanceInputOperationsSection"),
  attendanceInputTableBody: document.getElementById("attendanceInputTableBody"),
  btnAttendanceInputAddRow: document.getElementById("btnAttendanceInputAddRow"),
  btnAttendanceInputSaveAll: document.getElementById("btnAttendanceInputSaveAll"),
  btnAttendanceInputSeedDummy: document.getElementById("btnAttendanceInputSeedDummy"),
  receivablesOperationsSection: document.getElementById("receivablesOperationsSection"),
  receivablesOpsSummary: document.getElementById("receivablesOpsSummary"),
  receivablesOpsTableBody: document.getElementById("receivablesOpsTableBody"),
  remindersOperationsSection: document.getElementById("remindersOperationsSection"),
  remindersOpsSummary: document.getElementById("remindersOpsSummary"),
  remindersOpsTableBody: document.getElementById("remindersOpsTableBody"),
  btnCalendarRefresh: document.getElementById("btnCalendarRefresh"),
  btnDownloadCalendarCurrentMonth: document.getElementById("btnDownloadCalendarCurrentMonth"),
  btnDownloadCalendarNextMonth: document.getElementById("btnDownloadCalendarNextMonth"),
  btnCalendarPrevWeek: document.getElementById("btnCalendarPrevWeek"),
  btnCalendarNextWeek: document.getElementById("btnCalendarNextWeek"),
  btnCalendarCopyShareLink: document.getElementById("btnCalendarCopyShareLink"),
  calendarWeekLabel: document.getElementById("calendarWeekLabel"),
  calendarRangeLabel: document.getElementById("calendarRangeLabel"),
  invoiceCalendarGrid: document.getElementById("invoiceCalendarGrid"),
  btnPaymentStatusRefresh: document.getElementById("btnPaymentStatusRefresh"),
  btnPaymentStatusAutoCancel: document.getElementById("btnPaymentStatusAutoCancel"),
  paymentStatusSummary: document.getElementById("paymentStatusSummary"),
  paymentStatusTableBody: document.querySelector("#paymentStatusTable tbody"),
  studentManageGradeFilter: document.getElementById("studentManageGradeFilter"),
  studentManageSearchName: document.getElementById("studentManageSearchName"),
  studentManageSearchSchool: document.getElementById("studentManageSearchSchool"),
  studentManagePagers: document.querySelectorAll(".student-manage-pager"),
  studentManagePageInfos: document.querySelectorAll(".student-manage-page-info"),
  studentManageGotoInputs: document.querySelectorAll("input[data-student-goto]"),
  studentManageTableBody: document.getElementById("studentManageTableBody"),
  btnStudentManageAddRow: document.getElementById("btnStudentManageAddRow"),
  btnStudentManageHardDelete: document.getElementById("btnStudentManageHardDelete"),
  btnStudentManageDownloadCsv: document.getElementById("btnStudentManageDownloadCsv"),
  btnStudentManageUploadCsv: document.getElementById("btnStudentManageUploadCsv"),
  fileStudentManageUploadCsv: document.getElementById("fileStudentManageUploadCsv"),
  btnStudentManageSaveFirebase: document.getElementById("btnStudentManageSaveFirebase"),
  studentCreateModal: document.getElementById("studentCreateModal"),
  studentCreateForm: document.getElementById("studentCreateForm"),
  studentFormTitle: document.getElementById("studentFormTitle"),
  studentFormFullName: document.getElementById("studentFormFullName"),
  studentFormNickname: document.getElementById("studentFormNickname"),
  studentFormGender: document.getElementById("studentFormGender"),
  studentFormKelas: document.getElementById("studentFormKelas"),
  studentFormH1: document.getElementById("studentFormH1"),
  studentFormNextGrade: document.getElementById("studentFormNextGrade"),
  studentFormH2: document.getElementById("studentFormH2"),
  studentFormSekolah: document.getElementById("studentFormSekolah"),
  studentFormStudentWa: document.getElementById("studentFormStudentWa"),
  studentFormParentName: document.getElementById("studentFormParentName"),
  studentFormParentWa: document.getElementById("studentFormParentWa"),
  studentFormStudyHistory: document.getElementById("studentFormStudyHistory"),
  btnStudentFormCancel: document.getElementById("btnStudentFormCancel"),
  studentHardDeleteModal: document.getElementById("studentHardDeleteModal"),
  studentHardDeleteSelect: document.getElementById("studentHardDeleteSelect"),
  studentHardDeletePreview: document.getElementById("studentHardDeletePreview"),
  btnStudentHardDeleteArm: document.getElementById("btnStudentHardDeleteArm"),
  btnStudentHardDeleteCancel: document.getElementById("btnStudentHardDeleteCancel"),
  studentHardDeleteConfirmSection: document.getElementById("studentHardDeleteConfirmSection"),
  studentHardDeleteToken: document.getElementById("studentHardDeleteToken"),
  btnStudentHardDeleteConfirm: document.getElementById("btnStudentHardDeleteConfirm"),
  pricingManageTableBody: document.getElementById("pricingManageTableBody"),
  btnPricingManageAddRow: document.getElementById("btnPricingManageAddRow"),
  btnPricingManageApply: document.getElementById("btnPricingManageApply"),
  btnPricingManageDownloadCsv: document.getElementById("btnPricingManageDownloadCsv"),
  btnPricingManageUploadCsv: document.getElementById("btnPricingManageUploadCsv"),
  filePricingManageUploadCsv: document.getElementById("filePricingManageUploadCsv"),
  btnPricingManageSaveFirebase: document.getElementById("btnPricingManageSaveFirebase"),
  discountManageTableBody: document.getElementById("discountManageTableBody"),
  btnDiscountManageAddRow: document.getElementById("btnDiscountManageAddRow"),
  btnDiscountManageApply: document.getElementById("btnDiscountManageApply"),
  btnDiscountManageDownloadCsv: document.getElementById("btnDiscountManageDownloadCsv"),
  btnDiscountManageUploadCsv: document.getElementById("btnDiscountManageUploadCsv"),
  fileDiscountManageUploadCsv: document.getElementById("fileDiscountManageUploadCsv"),
  btnDiscountManageSaveFirebase: document.getElementById("btnDiscountManageSaveFirebase"),
  bankManageTableBody: document.getElementById("bankManageTableBody"),
  btnBankManageAddRow: document.getElementById("btnBankManageAddRow"),
  btnBankManageApply: document.getElementById("btnBankManageApply"),
  btnBankManageDownloadCsv: document.getElementById("btnBankManageDownloadCsv"),
  btnBankManageUploadCsv: document.getElementById("btnBankManageUploadCsv"),
  fileBankManageUploadCsv: document.getElementById("fileBankManageUploadCsv"),
  btnBankManageSaveFirebase: document.getElementById("btnBankManageSaveFirebase"),
  holidayManageTableBody: document.getElementById("holidayManageTableBody"),
  btnHolidayManageAddRow: document.getElementById("btnHolidayManageAddRow"),
  btnHolidayManageApply: document.getElementById("btnHolidayManageApply"),
  btnHolidayManageDownloadCsv: document.getElementById("btnHolidayManageDownloadCsv"),
  btnHolidayManageUploadCsv: document.getElementById("btnHolidayManageUploadCsv"),
  fileHolidayManageUploadCsv: document.getElementById("fileHolidayManageUploadCsv"),
  btnHolidayManageSaveFirebase: document.getElementById("btnHolidayManageSaveFirebase"),
  sessionsPanel: document.getElementById("sessionsPanel"),
  previewPanel: document.getElementById("previewPanel"),
  billingActionToolbar: document.getElementById("billingActionToolbar"),
  billingInvoiceInfoSection: document.getElementById("billingInvoiceInfoSection"),

  sessionsTitle: document.getElementById("sessionsTitle"),
  rescheduleDate: document.getElementById("rescheduleDate"),
  rescheduleUncheckAnchor: document.getElementById("rescheduleUncheckAnchor"),
  btnAddRescheduleSession: document.getElementById("btnAddRescheduleSession"),
  tableBody: document.querySelector("#sessionsTable tbody"),
  btnGenerate: document.getElementById("btnGenerate"),
  btnDownloadPng: document.getElementById("btnDownloadPng"),
  btnPreviewPng: document.getElementById("btnPreviewPng"),
  preview: document.getElementById("invoicePreview"),
  btnRefreshInvoiceHistory: document.getElementById("btnRefreshInvoiceHistory"),
  btnInvoiceHistoryPrev: document.getElementById("btnInvoiceHistoryPrev"),
  btnInvoiceHistoryNext: document.getElementById("btnInvoiceHistoryNext"),
  btnApplyInvoiceHistoryFilter: document.getElementById("btnApplyInvoiceHistoryFilter"),
  invoiceHistoryStudentFilter: document.getElementById("invoiceHistoryStudentFilter"),
  invoiceHistoryPageSize: document.getElementById("invoiceHistoryPageSize"),
  invoiceHistoryPageInfo: document.getElementById("invoiceHistoryPageInfo"),
  invoiceHistoryStatus: document.getElementById("invoiceHistoryStatus"),
  invoiceHistoryTableBody: document.querySelector("#invoiceHistoryTable tbody"),
  invoiceHistoryPreview: document.getElementById("invoiceHistoryPreview"),

  firebaseStatus: document.getElementById("firebaseStatus"),
  firebaseApiKey: document.getElementById("firebaseApiKey"),
  firebaseAuthDomain: document.getElementById("firebaseAuthDomain"),
  firebaseProjectId: document.getElementById("firebaseProjectId"),
  firebaseAppId: document.getElementById("firebaseAppId"),
  firebaseMeasurementId: document.getElementById("firebaseMeasurementId"),
  btnFirebaseSaveConfig: document.getElementById("btnFirebaseSaveConfig"),
  btnFirebaseConnect: document.getElementById("btnFirebaseConnect"),
  btnFirebaseLoadSources: document.getElementById("btnFirebaseLoadSources"),
  btnFirebaseSaveSources: document.getElementById("btnFirebaseSaveSources"),
  btnFirebaseSaveInvoice: document.getElementById("btnFirebaseSaveInvoice"),

  csvEditorStudents: document.getElementById("csvEditorStudents"),
  csvEditorPricing: document.getElementById("csvEditorPricing"),
  csvEditorDiscount: document.getElementById("csvEditorDiscount"),
  csvEditorBank: document.getElementById("csvEditorBank"),
  csvEditorHoliday: document.getElementById("csvEditorHoliday"),
  csvEditorAttendance: document.getElementById("csvEditorAttendance"),
  csvEditorTemplateAfter: document.getElementById("csvEditorTemplateAfter"),
  btnCsvApplyStudents: document.getElementById("btnCsvApplyStudents"),
  btnCsvSaveStudents: document.getElementById("btnCsvSaveStudents"),
  btnCsvDownloadStudents: document.getElementById("btnCsvDownloadStudents"),
  btnCsvUploadStudents: document.getElementById("btnCsvUploadStudents"),
  fileCsvUploadStudents: document.getElementById("fileCsvUploadStudents"),
  btnCsvApplyPricing: document.getElementById("btnCsvApplyPricing"),
  btnCsvSavePricing: document.getElementById("btnCsvSavePricing"),
  btnCsvDownloadPricing: document.getElementById("btnCsvDownloadPricing"),
  btnCsvUploadPricing: document.getElementById("btnCsvUploadPricing"),
  fileCsvUploadPricing: document.getElementById("fileCsvUploadPricing"),
  btnCsvApplyDiscount: document.getElementById("btnCsvApplyDiscount"),
  btnCsvSaveDiscount: document.getElementById("btnCsvSaveDiscount"),
  btnCsvDownloadDiscount: document.getElementById("btnCsvDownloadDiscount"),
  btnCsvUploadDiscount: document.getElementById("btnCsvUploadDiscount"),
  fileCsvUploadDiscount: document.getElementById("fileCsvUploadDiscount"),
  btnCsvApplyBank: document.getElementById("btnCsvApplyBank"),
  btnCsvSaveBank: document.getElementById("btnCsvSaveBank"),
  btnCsvDownloadBank: document.getElementById("btnCsvDownloadBank"),
  btnCsvUploadBank: document.getElementById("btnCsvUploadBank"),
  fileCsvUploadBank: document.getElementById("fileCsvUploadBank"),
  btnCsvApplyHoliday: document.getElementById("btnCsvApplyHoliday"),
  btnCsvSaveHoliday: document.getElementById("btnCsvSaveHoliday"),
  btnCsvDownloadHoliday: document.getElementById("btnCsvDownloadHoliday"),
  btnCsvUploadHoliday: document.getElementById("btnCsvUploadHoliday"),
  fileCsvUploadHoliday: document.getElementById("fileCsvUploadHoliday"),
  btnCsvApplyAttendance: document.getElementById("btnCsvApplyAttendance"),
  btnCsvSaveAttendance: document.getElementById("btnCsvSaveAttendance"),
  btnCsvDownloadAttendance: document.getElementById("btnCsvDownloadAttendance"),
  btnCsvUploadAttendance: document.getElementById("btnCsvUploadAttendance"),
  fileCsvUploadAttendance: document.getElementById("fileCsvUploadAttendance"),
  btnCsvApplyTemplateAfter: document.getElementById("btnCsvApplyTemplateAfter"),
  btnCsvSaveTemplateAfter: document.getElementById("btnCsvSaveTemplateAfter"),
  btnCsvDownloadTemplateAfter: document.getElementById("btnCsvDownloadTemplateAfter"),
  btnCsvUploadTemplateAfter: document.getElementById("btnCsvUploadTemplateAfter"),
  fileCsvUploadTemplateAfter: document.getElementById("fileCsvUploadTemplateAfter"),
};

initialize();

function initialize() {
  const today = new Date();
  el.invoiceDate.value = toLocalDateTimeInputValue(today);
  el.frontStartDate.value = toLocalDateInputValue(today);

  const locationState = getLocationState();
  if (locationState) {
    state.calendarShareOnly = Boolean(locationState.calendarShareOnly);
    state.activeGroup = locationState.group;
    state.activeTab = locationState.tab;
    state.lastTabByGroup[locationState.group] = locationState.tab;
  }
  bindEvents();
  applyRuntimeModeHints();
  moveSettingsIntoMenu();
  hydrateFirebaseConfigInputs();
  parseHolidaySetFromInput();
  setActiveTab(state.activeTab, { force: true, group: state.activeGroup });
  refreshWeeklyTeacherOptions();
  applyDefaultTeacherToWeekTable();
  refreshFirebaseButtons();
  syncCsvEditorsFromState();
  renderStudentManagementTable();
  renderPricingManagementTable();
  renderDiscountManagementTable();
  renderBankManagementTable();
  renderHolidayManagementTable();
  renderAttendanceInputSection();
  renderAttendanceOperationsSection();
  renderReceivablesOperationsSection();
  renderRemindersOperationsSection();
  renderInvoiceHistoryTable();
  void initializeDataSources();
}

async function initializeDataSources() {
  if (isFileProtocol()) {
    await autoLoadFromCurrentFolder(true);
  }

  const firebaseReady = await bootstrapFirebaseFromStorage({ silent: true, forceServer: true });
  if (!firebaseReady) {
    await preloadDefaults();
  }
}

function bindEvents() {
  el.workflowGroupButtons.forEach((groupBtn) => {
    groupBtn.addEventListener("click", async () => {
      const nextGroup = normalizeGroup(groupBtn.dataset.group);
      if (!nextGroup) return;
      const preferredTab = state.lastTabByGroup[nextGroup] || GROUP_TABS[nextGroup][0];
      await setActiveTab(preferredTab, { group: nextGroup });
      clearPreview();
    });
  });

  el.workflowTabs.forEach((tabBtn) => {
    tabBtn.addEventListener("click", async () => {
      const nextTab = String(tabBtn.dataset.tab || "front");
      const nextGroup = normalizeGroup(tabBtn.dataset.group);
      await setActiveTab(nextTab, { group: nextGroup });
      clearPreview();
    });
  });

  window.addEventListener("hashchange", async () => {
    const next = getLocationState();
    if (!next) return;
    state.calendarShareOnly = Boolean(next.calendarShareOnly);
    if (next.tab === state.activeTab && next.group === state.activeGroup) return;
    await setActiveTab(next.tab, { group: next.group });
  });

  el.packageFiles.addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    await importPackageFiles(files);
    event.target.value = "";
  });

  el.btnAutoLoadFolder.addEventListener("click", async () => {
    await autoLoadFromCurrentFolder(false);
  });

  el.btnMuatSiswaSheet?.addEventListener("click", async () => {
    try {
      const url = toGoogleSheetCsvUrlBySheetName((el.studentSheetUrl.value || "").trim(), "Aktif");
      const text = await fetchCsv(url, "Gagal mengambil data siswa dari Google Sheet.");
      loadMasterStudentsCsv(text);
    } catch (err) {
      alert(err.message);
    }
  });

  el.studentFile?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    loadMasterStudentsCsv(await file.text());
  });

  el.btnSiswaContoh?.addEventListener("click", async () => {
    try {
      loadMasterStudentsCsv(await fetchBundledSource("students", "Tidak bisa memuat REKAP DATA SISWA.csv"));
    } catch (err) {
      alert(err.message);
    }
  });

  el.pricingFile?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    applyPricingCsv(await file.text());
  });

  el.btnTarifContoh?.addEventListener("click", async () => {
    try {
      applyPricingCsv(await fetchBundledSource("pricing", "Tidak bisa memuat tarif.csv"));
    } catch (err) {
      alert(err.message);
    }
  });

  el.discountFile?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    applyDiscountCsv(await file.text());
  });

  el.btnDiskonContoh?.addEventListener("click", async () => {
    try {
      applyDiscountCsv(await fetchBundledSource("discount", "Tidak bisa memuat diskon_durasi.csv"));
    } catch (err) {
      alert(err.message);
    }
  });

  el.bankFile?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const rows = await readAnyTableFile(file);
    const rawText = file.name.toLowerCase().endsWith(".csv") ? await file.text() : "";
    applyBankRows(rows, true, rawText);
  });

  el.btnBankContoh?.addEventListener("click", async () => {
    try {
      const text = await fetchBundledSource("bank", "Tidak bisa memuat bank_guru.csv");
      applyBankRows(parseCsv(text), true, text);
    } catch (err) {
      alert(err.message);
    }
  });

  el.holidayFile?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    applyHolidayCsv(await file.text());
  });

  el.btnHolidayContoh?.addEventListener("click", async () => {
    try {
      const text = await fetchBundledSource("holiday", "Tidak bisa memuat hari_libur.csv");
      applyHolidayCsv(text);
    } catch (err) {
      alert(err.message);
    }
  });

  el.holidayDates?.addEventListener("input", () => {
    parseHolidaySetFromInput();
    recalcSessions();
  });

  el.csvFile.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    loadAbsensiCsv(text);
    const added = appendAttendanceEntriesFromCsvText(text);
    if (added > 0) {
      setFirebaseStatus(`Import attendance selesai: ${added} baris ditambahkan.`, "ok");
    }
  });

  el.btnContoh.addEventListener("click", async () => {
    alert("File contoh absensi sudah dihapus. Silakan unggah CSV absensi sendiri atau muat dari Google Sheet / Firebase.");
  });

  el.btnDownloadAfterTemplate.addEventListener("click", downloadAfterTemplateCsv);

  el.btnFirebaseSaveConfig?.addEventListener("click", () => {
    const config = getFirebaseConfigFromInputs();
    if (!config) return;
    persistFirebaseConfig(config);
    setFirebaseStatus("Konfigurasi Firebase disimpan di browser.", "ok");
  });

  el.btnFirebaseConnect?.addEventListener("click", async () => {
    try {
      await connectFirebase({ saveConfig: true, loadSources: true });
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal menghubungkan Firebase.", "error");
      alert(err.message);
    }
  });

  el.btnFirebaseLoadSources?.addEventListener("click", async () => {
    try {
      await loadSourcesFromFirebase();
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal memuat data Firebase.", "error");
      alert(err.message);
    }
  });

  el.btnFirebaseSaveSources?.addEventListener("click", async () => {
    try {
      await saveSourcesToFirebase();
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal menyimpan data ke Firebase.", "error");
      alert(err.message);
    }
  });

  el.btnFirebaseSaveInvoice?.addEventListener("click", async () => {
    try {
      await saveInvoiceRecordToFirebase();
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal menyimpan invoice ke Firebase.", "error");
      alert(err.message);
    }
  });

  bindCsvEditorActions();

  el.btnMuatSheet.addEventListener("click", async () => {
    try {
      const url = toGoogleSheetCsvUrl((el.sheetUrl.value || "").trim());
      const text = await fetchCsv(url, "Gagal mengambil absensi dari Google Sheet.");
      loadAbsensiCsv(text);
      const added = appendAttendanceEntriesFromCsvText(text);
      if (added > 0) {
        setFirebaseStatus(`Import attendance dari Google Sheet selesai: ${added} baris ditambahkan.`, "ok");
      }
    } catch (err) {
      alert(err.message);
    }
  });

  el.btnApplyAfterInvoiceDate?.addEventListener("click", () => {
    if (!el.afterInvoiceDateSelect?.value) return;
    applyInvoiceDateFromAttendanceDate(el.afterInvoiceDateSelect.value);
  });

  el.afterInvoiceDateSelect?.addEventListener("change", () => {
    if (!el.afterInvoiceDateSelect.value) return;
    applyInvoiceDateFromAttendanceDate(el.afterInvoiceDateSelect.value);
  });

  el.invoiceDate?.addEventListener("input", async () => {
    if (!state.lastInvoiceRecord || !state.firebase.ready) return;
    const parsed = parseDateInput(String(el.invoiceDate.value || "").trim());
    if (!parsed) return;
    state.lastInvoiceRecord.invoiceDate = toLocalDateTimeInputValue(parsed);
    if (state.editingInvoiceHistoryId) {
      state.lastInvoiceRecord.historyId = state.editingInvoiceHistoryId;
    }
    try {
      await saveInvoiceRecordToFirebase({ silent: true });
    } catch {
      // ignore background autosave failures; manual save button remains available
    }
  });

  el.studentSelect.addEventListener("change", () => {
    el.studentSelect.value = getSelectedStudentName();
    renderStudentDetail();
    if (state.mode === "after") hydrateAfterSessionsForSelectedStudent();
    if (state.mode === "front") {
      state.sessions = [];
      renderSessionsTable();
      updateTotal();
    }
  });

  el.studentSelect.addEventListener("input", () => {
    renderStudentDetail();
  });

  el.btnGenerateMingguan.addEventListener("click", generateFrontWeeklySessions);
  el.btnSaveDefaultTeacher?.addEventListener("click", () => {
    const teacher = String(el.defaultTeacherSelect?.value || "").trim();
    if (!teacher) {
      alert("Pilih nama pengajar default terlebih dahulu.");
      return;
    }
    persistDefaultTeacher(teacher);
    applyDefaultTeacherToWeekTable();
    alert(`Default pengajar disimpan: ${teacher}`);
  });
  el.btnGenerate.addEventListener("click", generateInvoice);
  el.btnAddRescheduleSession?.addEventListener("click", insertRescheduleSession);
  el.btnDownloadPng.addEventListener("click", downloadPng);
  if (el.btnPreviewPng) el.btnPreviewPng.addEventListener("click", downloadPng);
  el.btnCalendarRefresh?.addEventListener("click", async () => {
    try {
      await refreshDashboardInvoices({ forceServer: true });
      renderInvoiceCalendar();
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal memuat kalender invoice.", "error");
      alert(err.message);
    }
  });

  el.btnCalendarPrevWeek?.addEventListener("click", () => {
    if (state.calendarWeekIndex <= 0) return;
    state.calendarWeekAutoFocus = false;
    state.calendarWeekIndex -= 1;
    renderInvoiceCalendar();
  });

  el.btnCalendarNextWeek?.addEventListener("click", () => {
    if (state.calendarWeekIndex >= Math.max(0, state.calendarWeekCount - 1)) return;
    state.calendarWeekAutoFocus = false;
    state.calendarWeekIndex += 1;
    renderInvoiceCalendar();
  });

  el.btnCalendarCopyShareLink?.addEventListener("click", async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/share/calendar`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link kalender share berhasil disalin.");
        return;
      }
    } catch {
      // fallback below
    }
    window.prompt("Clipboard browser tidak tersedia. Salin link berikut:", shareUrl);
  });

  el.btnDownloadCalendarCurrentMonth?.addEventListener("click", async () => {
    await downloadCalendarMonthPng(0);
  });

  el.btnDownloadCalendarNextMonth?.addEventListener("click", async () => {
    await downloadCalendarMonthPng(1);
  });

  el.btnPaymentStatusRefresh?.addEventListener("click", async () => {
    try {
      await refreshDashboardInvoices({ forceServer: true });
      renderPaymentStatusTable();
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal memuat status pembayaran.", "error");
      alert(err.message);
    }
  });

  el.btnPaymentStatusAutoCancel?.addEventListener("click", async () => {
    if (!state.firebase.ready) {
      alert("Hubungkan Firebase terlebih dahulu.");
      return;
    }
    try {
      await refreshDashboardInvoices({ forceServer: true });
      const changed = await autoCancelOverdueInvoices({ silent: false });
      if (changed > 0) {
        await refreshDashboardInvoices({ forceServer: true });
      } else {
        renderPaymentStatusTable();
        renderInvoiceCalendar();
      }
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal menjalankan auto cancel overdue.", "error");
      alert(err.message || "Gagal menjalankan auto cancel overdue.");
    }
  });

  el.btnAttendanceInputAddRow?.addEventListener("click", () => {
    const student = getSelectedStudentRecord();
    const now = getCurrentTimeInZone();
    state.attendanceEntries.unshift(normalizeAttendanceEntry({
      tanggal: toLocalDateInputValue(now),
      studentId: String(student?.studentId || "").trim(),
      studentName: String(student?.nickname || student?.fullName || getSelectedStudentName() || "").trim(),
      status: "hadir",
      jamMulai: "19:30",
      jamSelesai: "21:00",
      pengajar: String(loadDefaultTeacher() || "-").trim() || "-",
      pesertaCount: 1,
      topik: "-",
      catatan: "",
    }));
    renderAttendanceInputSection();
    renderAttendanceOperationsSection();
    if (state.mode === "after") hydrateAfterSessionsForSelectedStudent();
  });

  el.btnAttendanceInputSaveAll?.addEventListener("click", async () => {
    if (!state.firebase.ready) {
      alert("Hubungkan Firebase terlebih dahulu.");
      return;
    }
    try {
      await saveAllAttendanceEntriesToFirebase();
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal menyimpan attendance ke Firebase.", "error");
      alert(err.message);
    }
  });

  el.btnAttendanceInputSeedDummy?.addEventListener("click", () => {
    const baseStudents = (state.students || []).slice(0, 6);
    if (baseStudents.length === 0) {
      alert("Belum ada data siswa. Tambahkan siswa terlebih dahulu untuk membuat dummy attendance.");
      return;
    }

    const now = getCurrentTimeInZone();
    const teachers = [String(loadDefaultTeacher() || "").trim() || "-", "Rensie", "Trias"];
    const topics = ["Matematika", "Fisika", "Kimia", "Bahasa Inggris"];
    const generated = [];

    for (let dayOffset = 0; dayOffset < 3; dayOffset += 1) {
      const date = addDays(now, -dayOffset);
      baseStudents.forEach((student, idx) => {
        const status = (dayOffset === 1 && idx % 4 === 0) ? "izin" : "hadir";
        generated.push(normalizeAttendanceEntry({
          tanggal: toLocalDateInputValue(date),
          studentId: String(student.studentId || "").trim(),
          studentName: String(student.nickname || student.fullName || "").trim(),
          status,
          jamMulai: idx % 2 === 0 ? "19:30" : "17:00",
          jamSelesai: idx % 2 === 0 ? "21:00" : "18:30",
          pengajar: teachers[idx % teachers.length],
          pesertaCount: (idx % 3) + 1,
          topik: `${topics[idx % topics.length]} - Dummy`,
          catatan: status === "hadir" ? "Dummy data otomatis" : "Izin - dummy data",
        }));
      });
    }

    const existing = sortAttendanceEntries(state.attendanceEntries || []);
    const seen = new Set(existing.map((item) => attendanceEntryFingerprint(item)));
    let added = 0;
    generated.forEach((item) => {
      const key = attendanceEntryFingerprint(item);
      if (seen.has(key)) return;
      seen.add(key);
      existing.push(item);
      added += 1;
    });

    state.attendanceEntries = sortAttendanceEntries(existing);
    renderAttendanceInputSection();
    renderAttendanceOperationsSection();
    if (state.mode === "after") hydrateAfterSessionsForSelectedStudent();
    alert(`Dummy attendance ditambahkan: ${added} baris.`);
  });

  el.attendanceInputTableBody?.addEventListener("click", async (event) => {
    const saveBtn = event.target.closest("button[data-save-attendance]");
    if (saveBtn) {
      const rowIndex = Number.parseInt(String(saveBtn.dataset.saveAttendance || "-1"), 10);
      if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.attendanceEntries.length) return;
      const row = state.attendanceEntries[rowIndex];

      const readField = (field) => String(el.attendanceInputTableBody.querySelector(`[data-row="${rowIndex}"][data-field="${field}"]`)?.value || "").trim();
      row.tanggal = readField("tanggal");
      row.studentName = readField("studentName");
      row.status = normalizeAttendanceStatus(readField("status"));
      row.jamMulai = readField("jamMulai");
      row.jamSelesai = readField("jamSelesai");
      row.pengajar = readField("pengajar") || "-";
      row.pesertaCount = Math.max(1, Number.parseInt(readField("pesertaCount") || "1", 10) || 1);
      row.topik = readField("topik") || "-";
      row.catatan = readField("catatan");

      const matchedStudent = (state.students || []).find((item) => normalizeName(item.nickname || item.fullName || "") === normalizeName(row.studentName || ""));
      row.studentId = String(matchedStudent?.studentId || row.studentId || "").trim();

      const normalized = normalizeAttendanceEntry(row, row.attendanceId);
      state.attendanceEntries[rowIndex] = normalized;
      renderAttendanceInputSection();
      renderAttendanceOperationsSection();
      if (state.mode === "after") hydrateAfterSessionsForSelectedStudent();

      if (state.firebase.ready) {
        await saveAttendanceEntryToFirebase(normalized);
      }
      return;
    }

    const removeBtn = event.target.closest("button[data-remove-attendance]");
    if (removeBtn) {
      const rowIndex = Number.parseInt(String(removeBtn.dataset.removeAttendance || "-1"), 10);
      if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.attendanceEntries.length) return;
      const target = state.attendanceEntries[rowIndex];
      const agreed = window.confirm(`Hapus attendance ${target?.attendanceId || "baris ini"}?`);
      if (!agreed) return;

      state.attendanceEntries.splice(rowIndex, 1);
      renderAttendanceInputSection();
      renderAttendanceOperationsSection();
      if (state.mode === "after") hydrateAfterSessionsForSelectedStudent();

      if (state.firebase.ready && target?.attendanceId) {
        await deleteAttendanceEntryFromFirebase(target.attendanceId);
      }
    }
  });

  el.btnStudentManageAddRow?.addEventListener("click", () => {
    openStudentFormForCreate();
  });

  el.btnStudentFormCancel?.addEventListener("click", () => {
    state.studentFormEditIndex = -1;
    el.studentCreateModal?.close();
  });

  el.studentFormKelas?.addEventListener("change", () => {
    syncStudentFormGradeDerivedFields();
  });

  el.studentCreateForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fullName = String(el.studentFormFullName?.value || "").trim();
    const nickname = String(el.studentFormNickname?.value || "").trim();
    if (!fullName && !nickname) {
      alert("Nama lengkap atau nama panggilan wajib diisi.");
      return;
    }

    const gradeProfile = getStudentGradeProfile(String(el.studentFormKelas?.value || "").trim());
    const payload = {
      fullName,
      nickname,
      gender: String(el.studentFormGender?.value || "").trim(),
      kelas: gradeProfile.kelas || String(el.studentFormKelas?.value || "").trim(),
      h1: gradeProfile.h1 || String(el.studentFormH1?.textContent || "").trim(),
      nextGrade: gradeProfile.nextGrade || String(el.studentFormNextGrade?.textContent || "").trim(),
      h2: gradeProfile.h2 || String(el.studentFormH2?.textContent || "").trim(),
      sekolah: String(el.studentFormSekolah?.value || "").trim(),
      studentWhatsapp: String(el.studentFormStudentWa?.value || "").trim(),
      parentName: String(el.studentFormParentName?.value || "").trim(),
      parentWhatsapp: String(el.studentFormParentWa?.value || "").trim(),
      studyHistory: String(el.studentFormStudyHistory?.value || "").trim(),
    };

    const editIndex = Number(state.studentFormEditIndex || -1);
    let savedStudent = null;
    const isNewStudent = !(Number.isInteger(editIndex) && editIndex >= 0 && editIndex < state.students.length);

    if (isNewStudent && !state.firebase.ready) {
      await bootstrapFirebaseFromStorage({ silent: true, forceServer: true });
    }

    if (isNewStudent && !state.firebase.ready) {
      alert("Tambah siswa baru wajib tersimpan ke Firebase. Hubungkan Firebase lalu coba lagi.");
      return;
    }

    if (Number.isInteger(editIndex) && editIndex >= 0 && editIndex < state.students.length) {
      const current = state.students[editIndex] || {};
      state.students[editIndex] = normalizeStudentRecord({ ...current, ...payload, studentId: current.studentId }, current.studentId || "");
      savedStudent = state.students[editIndex];
    } else {
      const created = normalizeStudentRecord(payload);
      state.students.push(created);
      savedStudent = created;
      state.studentManageQuery.currentPage = 1;
    }

    normalizeStudentsState({ sort: false, syncEditors: true });
    if (savedStudent) {
      const refreshed = getStudentRecordById(savedStudent.studentId) || savedStudent;
      if (state.firebase.ready) {
        try {
          await saveStudentRecordToFirebase(refreshed);
        } catch (err) {
          setFirebaseStatus(err.message || "Gagal menyimpan data siswa.", "error");
          alert(err.message || "Gagal menyimpan data siswa ke Firebase.");
          return;
        }
      }
    }

    renderStudentManagementTable();
    state.studentFormEditIndex = -1;
    if (el.studentFormTitle) el.studentFormTitle.textContent = "Tambah Siswa Baru";
    el.studentCreateModal?.close();
  });

  el.btnStudentManageHardDelete?.addEventListener("click", async () => {
    if (!state.firebase.ready) {
      alert("Hubungkan Firebase terlebih dahulu.");
      return;
    }
    renderStudentHardDeleteOptions();
    if (el.studentHardDeleteSelect) el.studentHardDeleteSelect.value = "";
    if (el.studentHardDeleteToken) el.studentHardDeleteToken.value = "";
    el.studentHardDeleteConfirmSection?.classList.add("hidden");
    renderStudentHardDeletePreview("");
    el.studentHardDeleteModal?.showModal();
  });

  el.studentHardDeleteSelect?.addEventListener("change", () => {
    renderStudentHardDeletePreview(String(el.studentHardDeleteSelect?.value || ""));
    el.studentHardDeleteConfirmSection?.classList.add("hidden");
    if (el.studentHardDeleteToken) el.studentHardDeleteToken.value = "";
  });

  el.btnStudentHardDeleteCancel?.addEventListener("click", () => {
    el.studentHardDeleteModal?.close();
  });

  el.btnStudentHardDeleteArm?.addEventListener("click", () => {
    const studentId = String(el.studentHardDeleteSelect?.value || "").trim();
    if (!studentId) {
      alert("Pilih siswa yang ingin dihapus permanen.");
      return;
    }
    el.studentHardDeleteConfirmSection?.classList.remove("hidden");
    el.studentHardDeleteToken?.focus();
  });

  el.btnStudentHardDeleteConfirm?.addEventListener("click", async () => {
    const studentId = String(el.studentHardDeleteSelect?.value || "").trim();
    if (!studentId) {
      alert("Pilih siswa terlebih dahulu.");
      return;
    }
    const token = String(el.studentHardDeleteToken?.value || "").trim().toUpperCase();
    if (token !== "HAPUS-PERMANEN") {
      alert("Token konfirmasi salah. Hard delete dibatalkan.");
      return;
    }

    await hardDeleteStudentRecord(studentId);
    state.students = (state.students || []).filter((s) => String(s.studentId || "") !== studentId);
    normalizeStudentsState({ sort: false, syncEditors: true });
    renderStudentManagementTable();
    el.studentHardDeleteModal?.close();
  });

  el.studentManageGradeFilter?.addEventListener("change", () => {
    state.studentManageQuery.gradeFilter = String(el.studentManageGradeFilter?.value || "").trim();
    state.studentManageQuery.currentPage = 1;
    renderStudentManagementTable();
  });

  el.studentManageSearchName?.addEventListener("input", () => {
    state.studentManageQuery.searchName = String(el.studentManageSearchName?.value || "").trim();
    state.studentManageQuery.currentPage = 1;
    renderStudentManagementTable();
  });

  el.studentManageSearchSchool?.addEventListener("input", () => {
    state.studentManageQuery.searchSchool = String(el.studentManageSearchSchool?.value || "").trim();
    state.studentManageQuery.currentPage = 1;
    renderStudentManagementTable();
  });

  el.studentManagementSection?.addEventListener("click", (event) => {
    const pagerBtn = event.target.closest("button[data-page-action]");
    if (!pagerBtn) return;
    const action = String(pagerBtn.dataset.pageAction || "").toLowerCase();
    if (!action) return;
    if (action === "goto") {
      const source = String(pagerBtn.dataset.pageGo || "top").toLowerCase();
      const input = el.studentManagementSection?.querySelector(`input[data-student-goto="${source}"]`);
      const page = Number.parseInt(String(input?.value || ""), 10);
      if (!Number.isFinite(page) || page <= 0) return;
      applyStudentPageAction("goto", page);
      return;
    }
    applyStudentPageAction(action);
  });

  el.btnStudentManageDownloadCsv?.addEventListener("click", () => {
    if (state.students.length === 0) {
      alert("Belum ada data siswa untuk diunduh.");
      return;
    }
    normalizeStudentsState({ sort: false, syncEditors: true });
    downloadSourceCsv("students");
  });

  el.btnStudentManageUploadCsv?.addEventListener("click", () => {
    el.fileStudentManageUploadCsv?.click();
  });

  el.fileStudentManageUploadCsv?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    loadMasterStudentsCsv(await file.text());
    renderStudentManagementTable();
    event.target.value = "";
  });

  el.btnStudentManageSaveFirebase?.addEventListener("click", async () => {
    if (!state.firebase.ready) {
      alert("Hubungkan Firebase terlebih dahulu.");
      return;
    }
    normalizeStudentsState({ sort: false, syncEditors: true });
    await saveStudentsToFirebase({ applyEditor: false });
  });

  el.studentManageTableBody?.addEventListener("click", (event) => {
    const editBtn = event.target.closest("button[data-edit-student]");
    if (editBtn) {
      const rowIndex = Number.parseInt(String(editBtn.dataset.editStudent || "-1"), 10);
      if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.students.length) return;
      openStudentFormForEdit(rowIndex);
      return;
    }

    const saveBtn = event.target.closest("button[data-save-student]");
    if (saveBtn) {
      const rowIndex = Number.parseInt(String(saveBtn.dataset.saveStudent || "-1"), 10);
      if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.students.length) return;
      const row = state.students[rowIndex];

      const readField = (field) => String(el.studentManageTableBody.querySelector(`[data-row="${rowIndex}"][data-field="${field}"]`)?.value || "").trim();
      row.nickname = readField("nickname") || deriveNicknameFromFullName(readField("fullName"));
      row.fullName = readField("fullName");
      row.kelas = readField("kelas");
      row.sekolah = readField("sekolah");

      const savedId = String(row.studentId || "").trim();
      normalizeStudentsState({ sort: false, syncEditors: true });
      renderStudentManagementTable();
      if (state.firebase.ready) {
        const updated = getStudentRecordById(savedId) || row;
        void saveStudentRecordToFirebase(updated).catch((err) => setFirebaseStatus(err.message || "Gagal menyimpan data siswa.", "error"));
      }
      return;
    }

    const removeBtn = event.target.closest("button[data-remove-student]");
    if (!removeBtn) return;
    const rowIndex = Number.parseInt(String(removeBtn.dataset.removeStudent || "-1"), 10);
    if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.students.length) return;
    const removed = state.students[rowIndex];
    state.students.splice(rowIndex, 1);
    normalizeStudentsState({ sort: false, syncEditors: true });
    renderStudentManagementTable();
    if (state.firebase.ready && removed) {
      void softDeleteStudentRecord(removed).catch((err) => setFirebaseStatus(err.message || "Gagal menghapus data siswa.", "error"));
    }
  });

  el.btnPricingManageAddRow?.addEventListener("click", () => {
    state.pricingManageRows.push({ jenis_hari: "weekdays", jumlah_peserta: "1", tarif_per_jam: "1" });
    renderPricingManagementTable();
  });
  el.btnPricingManageApply?.addEventListener("click", () => applyPricingFromManagement());
  el.btnPricingManageDownloadCsv?.addEventListener("click", () => {
    let csv;
    try {
      csv = serializePricingManageRows(state.pricingManageRows);
    } catch (err) {
      alert(err.message);
      return;
    }
    if (el.csvEditorPricing) el.csvEditorPricing.value = csv;
    state.sourceTexts.pricing = csv;
    downloadSourceCsv("pricing");
  });
  el.btnPricingManageUploadCsv?.addEventListener("click", () => el.filePricingManageUploadCsv?.click());
  el.filePricingManageUploadCsv?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    applyPricingCsv(await file.text(), false);
    renderPricingManagementTable();
    event.target.value = "";
  });
  el.btnPricingManageSaveFirebase?.addEventListener("click", async () => {
    if (!applyPricingFromManagement(false)) return;
    await saveSingleSourceToFirebase("pricing");
  });
  el.pricingManageTableBody?.addEventListener("input", (event) => {
    const input = event.target.closest("input[data-row][data-field]");
    if (!input) return;
    const rowIndex = Number.parseInt(String(input.dataset.row || "-1"), 10);
    const field = String(input.dataset.field || "");
    if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.pricingManageRows.length) return;
    state.pricingManageRows[rowIndex][field] = String(input.value || "");
  });
  el.pricingManageTableBody?.addEventListener("click", (event) => {
    const removeBtn = event.target.closest("button[data-remove-pricing]");
    if (!removeBtn) return;
    const rowIndex = Number.parseInt(String(removeBtn.dataset.removePricing || "-1"), 10);
    if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.pricingManageRows.length) return;
    state.pricingManageRows.splice(rowIndex, 1);
    renderPricingManagementTable();
  });

  el.btnDiscountManageAddRow?.addEventListener("click", () => {
    state.discountManageRows.push({ min_durasi: "0", max_durasi: "0", diskon_persen: "0" });
    renderDiscountManagementTable();
  });
  el.btnDiscountManageApply?.addEventListener("click", () => applyDiscountFromManagement());
  el.btnDiscountManageDownloadCsv?.addEventListener("click", () => {
    let csv;
    try {
      csv = serializeDiscountManageRows(state.discountManageRows);
    } catch (err) {
      alert(err.message);
      return;
    }
    if (el.csvEditorDiscount) el.csvEditorDiscount.value = csv;
    state.sourceTexts.discount = csv;
    downloadSourceCsv("discount");
  });
  el.btnDiscountManageUploadCsv?.addEventListener("click", () => el.fileDiscountManageUploadCsv?.click());
  el.fileDiscountManageUploadCsv?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    applyDiscountCsv(await file.text(), false);
    renderDiscountManagementTable();
    event.target.value = "";
  });
  el.btnDiscountManageSaveFirebase?.addEventListener("click", async () => {
    if (!applyDiscountFromManagement(false)) return;
    await saveSingleSourceToFirebase("discount");
  });
  el.discountManageTableBody?.addEventListener("input", (event) => {
    const input = event.target.closest("input[data-row][data-field]");
    if (!input) return;
    const rowIndex = Number.parseInt(String(input.dataset.row || "-1"), 10);
    const field = String(input.dataset.field || "");
    if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.discountManageRows.length) return;
    state.discountManageRows[rowIndex][field] = String(input.value || "");
  });
  el.discountManageTableBody?.addEventListener("click", (event) => {
    const removeBtn = event.target.closest("button[data-remove-discount]");
    if (!removeBtn) return;
    const rowIndex = Number.parseInt(String(removeBtn.dataset.removeDiscount || "-1"), 10);
    if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.discountManageRows.length) return;
    state.discountManageRows.splice(rowIndex, 1);
    renderDiscountManagementTable();
  });

  el.btnBankManageAddRow?.addEventListener("click", () => {
    state.bankManageRows.push({ nama_pengajar: "", label_rekening: "Utama", bank: "", nomor_rekening: "", atas_nama: "" });
    renderBankManagementTable();
  });
  el.btnBankManageApply?.addEventListener("click", () => applyBankFromManagement());
  el.btnBankManageDownloadCsv?.addEventListener("click", () => {
    let csv;
    try {
      csv = serializeBankManageRows(state.bankManageRows);
    } catch (err) {
      alert(err.message);
      return;
    }
    if (el.csvEditorBank) el.csvEditorBank.value = csv;
    state.sourceTexts.bank = csv;
    downloadSourceCsv("bank");
  });
  el.btnBankManageUploadCsv?.addEventListener("click", () => el.fileBankManageUploadCsv?.click());
  el.fileBankManageUploadCsv?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    applyBankRows(parseCsv(text), false, text);
    renderBankManagementTable();
    event.target.value = "";
  });
  el.btnBankManageSaveFirebase?.addEventListener("click", async () => {
    if (!applyBankFromManagement(false)) return;
    await saveSingleSourceToFirebase("bank");
  });
  el.bankManageTableBody?.addEventListener("input", (event) => {
    const input = event.target.closest("input[data-row][data-field]");
    if (!input) return;
    const rowIndex = Number.parseInt(String(input.dataset.row || "-1"), 10);
    const field = String(input.dataset.field || "");
    if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.bankManageRows.length) return;
    state.bankManageRows[rowIndex][field] = String(input.value || "");
  });
  el.bankManageTableBody?.addEventListener("click", (event) => {
    const removeBtn = event.target.closest("button[data-remove-bank]");
    if (!removeBtn) return;
    const rowIndex = Number.parseInt(String(removeBtn.dataset.removeBank || "-1"), 10);
    if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.bankManageRows.length) return;
    state.bankManageRows.splice(rowIndex, 1);
    renderBankManagementTable();
  });

  el.btnHolidayManageAddRow?.addEventListener("click", () => {
    state.holidayManageRows.push({ tanggal: "", nama: "", jenis: "libur nasional" });
    renderHolidayManagementTable();
  });
  el.btnHolidayManageApply?.addEventListener("click", () => applyHolidayFromManagement());
  el.btnHolidayManageDownloadCsv?.addEventListener("click", () => {
    let csv;
    try {
      csv = serializeHolidayManageRows(state.holidayManageRows);
    } catch (err) {
      alert(err.message);
      return;
    }
    if (el.csvEditorHoliday) el.csvEditorHoliday.value = csv;
    state.sourceTexts.holiday = csv;
    downloadSourceCsv("holiday");
  });
  el.btnHolidayManageUploadCsv?.addEventListener("click", () => el.fileHolidayManageUploadCsv?.click());
  el.fileHolidayManageUploadCsv?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    applyHolidayCsv(await file.text(), false);
    renderHolidayManagementTable();
    event.target.value = "";
  });
  el.btnHolidayManageSaveFirebase?.addEventListener("click", async () => {
    if (!applyHolidayFromManagement(false)) return;
    await saveSingleSourceToFirebase("holiday");
  });
  el.holidayManageTableBody?.addEventListener("input", (event) => {
    const input = event.target.closest("input[data-row][data-field], select[data-row][data-field]");
    if (!input) return;
    const rowIndex = Number.parseInt(String(input.dataset.row || "-1"), 10);
    const field = String(input.dataset.field || "");
    if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.holidayManageRows.length) return;
    state.holidayManageRows[rowIndex][field] = String(input.value || "");
  });
  el.holidayManageTableBody?.addEventListener("click", (event) => {
    const removeBtn = event.target.closest("button[data-remove-holiday]");
    if (!removeBtn) return;
    const rowIndex = Number.parseInt(String(removeBtn.dataset.removeHoliday || "-1"), 10);
    if (!Number.isFinite(rowIndex) || rowIndex < 0 || rowIndex >= state.holidayManageRows.length) return;
    state.holidayManageRows.splice(rowIndex, 1);
    renderHolidayManagementTable();
  });
  el.btnRefreshInvoiceHistory?.addEventListener("click", async () => {
    try {
      await loadInvoiceHistory({ direction: "reset" });
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal memuat riwayat invoice.", "error");
      alert(err.message);
    }
  });

  el.btnInvoiceHistoryPrev?.addEventListener("click", async () => {
    try {
      await loadInvoiceHistory({ direction: "prev" });
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal memuat halaman sebelumnya.", "error");
      alert(err.message);
    }
  });

  el.btnInvoiceHistoryNext?.addEventListener("click", async () => {
    try {
      await loadInvoiceHistory({ direction: "next" });
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal memuat halaman berikutnya.", "error");
      alert(err.message);
    }
  });

  el.btnApplyInvoiceHistoryFilter?.addEventListener("click", async () => {
    try {
      await applyInvoiceHistoryFilterAndReload();
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal menerapkan filter riwayat.", "error");
      alert(err.message);
    }
  });

  el.invoiceHistoryStudentFilter?.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    try {
      await applyInvoiceHistoryFilterAndReload();
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal menerapkan filter riwayat.", "error");
      alert(err.message);
    }
  });

  el.invoiceHistoryPageSize?.addEventListener("change", async () => {
    try {
      await applyInvoiceHistoryFilterAndReload();
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal mengubah ukuran halaman.", "error");
      alert(err.message);
    }
  });

  el.invoiceHistoryTableBody?.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-history-id]");
    if (!btn) return;
    const historyId = btn.dataset.historyId;
    const action = String(btn.dataset.historyAction || "view").toLowerCase();
    const item = state.invoiceHistory.find((row) => row.historyId === historyId);
    if (!item) return;
    if (action === "edit") {
      void loadInvoiceForEditing(item);
      return;
    }
    if (action === "delete") {
      void confirmAndDeleteInvoice(item);
      return;
    }
    if (action === "download") {
      redownloadInvoiceFromHistory(item);
      return;
    }
    showInvoiceHistoryPreview(item);
  });

  el.paymentStatusTableBody?.addEventListener("click", async (event) => {
    const deleteBtn = event.target.closest("button[data-payment-delete]");
    if (deleteBtn) {
      const historyId = String(deleteBtn.dataset.paymentDelete || "").trim();
      if (!historyId) return;
      const item = state.dashboardInvoices.find((row) => String(row.historyId || "") === historyId);
      if (!item) return;
      try {
        await confirmAndDeleteInvoice(item);
      } catch (err) {
        setFirebaseStatus(err.message || "Gagal menghapus invoice.", "error");
        alert(err.message || "Gagal menghapus invoice.");
      }
      return;
    }

    const btn = event.target.closest("button[data-payment-save]");
    if (!btn) return;
    const historyId = String(btn.dataset.paymentSave || "");
    if (!historyId) return;
    const row = btn.closest("tr");
    const statusSelect = row?.querySelector("select[data-payment-status]");
    const noteInput = row?.querySelector("input[data-payment-note]");
    const status = String(statusSelect?.value || "issued");
    const note = String(noteInput?.value || "").trim();
    try {
      await updateInvoicePaymentStatus(historyId, status, note);
      await refreshDashboardInvoices({ forceServer: true });
      renderPaymentStatusTable();
      renderInvoiceCalendar();
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal menyimpan status pembayaran.", "error");
      alert(err.message);
    }
  });

  el.paymentStatusTableBody?.addEventListener("change", (event) => {
    const statusSelect = event.target.closest("select[data-payment-status]");
    if (!statusSelect) return;
    const normalized = normalizeInvoiceStatus(statusSelect.value);
    statusSelect.value = normalized;
    statusSelect.className = `payment-status-select ${normalized}`;
  });

  el.remindersOpsTableBody?.addEventListener("click", async (event) => {
    const copyBtn = event.target.closest("button[data-copy-reminder]");
    if (!copyBtn) return;
    const historyId = String(copyBtn.dataset.copyReminder || "").trim();
    if (!historyId) return;
    const reminder = state.operationsReminderRows.find((item) => String(item.historyId || "") === historyId);
    if (!reminder?.message) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(reminder.message);
        alert(`Pesan reminder ${reminder.invoiceNo || historyId} berhasil disalin.`);
        return;
      }
    } catch {
      // Fallback below.
    }

    window.prompt("Clipboard browser tidak tersedia. Salin pesan berikut:", reminder.message);
  });
}

function moveSettingsIntoMenu() {
  if (!el.settingsMenuContent) return;
  const settingBlocks = [
    el.defaultTeacherSelect?.closest(".grid-2"),
    el.runtimeNotice,
    el.cloudReadyNotice,
    el.autoLoadSection,
    el.firebaseSyncSection,
  ].filter(Boolean);

  settingBlocks.forEach((node) => {
    if (node.parentElement !== el.settingsMenuContent) {
      el.settingsMenuContent.appendChild(node);
    }
  });
}

async function fetchBundledSource(kind, errorMessage = "") {
  const candidates = BUNDLED_SOURCE_FILES[kind] || [];
  let lastError = null;

  for (const path of candidates) {
    try {
      return await fetchCsv(path, "");
    } catch (err) {
      lastError = err;
    }
  }

  if (errorMessage) throw new Error(errorMessage);
  throw lastError || new Error(`Gagal memuat sumber data: ${kind}`);
}

function normalizeGroup(group) {
  const key = String(group || "").trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(GROUP_TABS, key) ? key : "";
}

function getLocationState() {
  const raw = String(window.location.hash || "").replace(/^#/, "").toLowerCase();
  const normalized = raw.replace(/^\//, "");
  if (normalized === "share/calendar" || normalized === "calendar-share") {
    return { group: "invoice", tab: "calendar", calendarShareOnly: true };
  }
  const groupMatch = normalized.match(/^group\/([^/]+)\/tab\/([^/]+)/);
  if (groupMatch) {
    const group = normalizeGroup(groupMatch[1]);
    const tab = String(groupMatch[2] || "").trim().toLowerCase();
    if (group && TAB_GROUP_MAP[tab] && GROUP_TABS[group].includes(tab)) {
      return { group, tab, calendarShareOnly: false };
    }
  }

  const token = normalized.replace(/^tab\//, "");
  if (TAB_GROUP_MAP[token]) {
    return { group: TAB_GROUP_MAP[token], tab: token, calendarShareOnly: false };
  }

  return null;
}

function updateLocationForView(group, tab) {
  if (state.calendarShareOnly) {
    const shareTarget = "#/share/calendar";
    if (window.location.hash !== shareTarget) {
      window.history.replaceState(null, "", shareTarget);
    }
    return;
  }
  const target = `#/group/${group}/tab/${tab}`;
  if (window.location.hash === target) return;
  window.history.replaceState(null, "", target);
}

function bindCsvEditorActions() {
  const pairs = [
    [el.btnCsvApplyStudents, () => applyCsvFromEditor("students")],
    [el.btnCsvApplyPricing, () => applyCsvFromEditor("pricing")],
    [el.btnCsvApplyDiscount, () => applyCsvFromEditor("discount")],
    [el.btnCsvApplyBank, () => applyCsvFromEditor("bank")],
    [el.btnCsvApplyHoliday, () => applyCsvFromEditor("holiday")],
    [el.btnCsvApplyAttendance, () => applyCsvFromEditor("attendance")],
    [el.btnCsvApplyTemplateAfter, () => applyCsvFromEditor("template_after")],
    [el.btnCsvSaveStudents, () => saveStudentsToFirebase({ applyEditor: true })],
    [el.btnCsvSavePricing, () => saveSingleSourceToFirebase("pricing")],
    [el.btnCsvSaveDiscount, () => saveSingleSourceToFirebase("discount")],
    [el.btnCsvSaveBank, () => saveSingleSourceToFirebase("bank")],
    [el.btnCsvSaveHoliday, () => saveSingleSourceToFirebase("holiday")],
    [el.btnCsvSaveAttendance, () => saveSingleSourceToFirebase("attendance")],
    [el.btnCsvSaveTemplateAfter, () => saveSingleSourceToFirebase("template_after")],
    [el.btnCsvDownloadStudents, () => downloadSourceCsv("students")],
    [el.btnCsvDownloadPricing, () => downloadSourceCsv("pricing")],
    [el.btnCsvDownloadDiscount, () => downloadSourceCsv("discount")],
    [el.btnCsvDownloadBank, () => downloadSourceCsv("bank")],
    [el.btnCsvDownloadHoliday, () => downloadSourceCsv("holiday")],
    [el.btnCsvDownloadAttendance, () => downloadSourceCsv("attendance")],
    [el.btnCsvDownloadTemplateAfter, () => downloadSourceCsv("template_after")],
    [el.btnCsvUploadStudents, () => triggerCsvUpload("students")],
    [el.btnCsvUploadPricing, () => triggerCsvUpload("pricing")],
    [el.btnCsvUploadDiscount, () => triggerCsvUpload("discount")],
    [el.btnCsvUploadBank, () => triggerCsvUpload("bank")],
    [el.btnCsvUploadHoliday, () => triggerCsvUpload("holiday")],
    [el.btnCsvUploadAttendance, () => triggerCsvUpload("attendance")],
    [el.btnCsvUploadTemplateAfter, () => triggerCsvUpload("template_after")],
  ];

  pairs.forEach(([btn, handler]) => {
    if (!btn) return;
    btn.addEventListener("click", async () => {
      try {
        await handler();
      } catch (err) {
        setFirebaseStatus(err.message || "Gagal memproses CSV editor.", "error");
        alert(err.message);
      }
    });
  });

  const uploads = [
    [el.fileCsvUploadStudents, "students"],
    [el.fileCsvUploadPricing, "pricing"],
    [el.fileCsvUploadDiscount, "discount"],
    [el.fileCsvUploadBank, "bank"],
    [el.fileCsvUploadHoliday, "holiday"],
    [el.fileCsvUploadAttendance, "attendance"],
    [el.fileCsvUploadTemplateAfter, "template_after"],
  ];

  uploads.forEach(([input, kind]) => {
    if (!input) return;
    input.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      const editor = getCsvEditorElement(kind);
      if (editor) editor.value = text;
      applyCsvFromEditor(kind);
      syncCsvEditorsFromState();
      input.value = "";
      setFirebaseStatus(`CSV ${kind} berhasil di-upload ke editor.`, "ok");
    });
  });
}

async function preloadDefaults() {
  if (isFileProtocol()) return;

  try {
    const url = toGoogleSheetCsvUrlBySheetName(el.studentSheetUrl.value, "Aktif");
    loadMasterStudentsCsv(await fetchCsv(url, ""));
  } catch {
    // ignore
  }

  if (state.students.length === 0) {
    try {
      loadMasterStudentsCsv(await fetchBundledSource("students", ""));
    } catch {
      // ignore
    }
  }

  try {
    applyPricingCsv(await fetchBundledSource("pricing", ""), false);
  } catch {
    // ignore
  }

  try {
    applyDiscountCsv(await fetchBundledSource("discount", ""), false);
  } catch {
    // ignore
  }

  try {
    const bankText = await fetchBundledSource("bank", "");
    applyBankRows(parseCsv(bankText), false, bankText);
  } catch {
    // ignore
  }

  try {
    applyHolidayCsv(await fetchBundledSource("holiday", ""), false);
  } catch {
    // ignore
  }

  try {
    state.sourceTexts.template_after = await fetchBundledSource("template_after", "");
  } catch {
    // ignore
  }

  syncCsvEditorsFromState();
}

async function loadBundledFallbackSources() {
  const loaded = [];

  if (state.students.length === 0) {
    try {
      loadMasterStudentsCsv(await fetchBundledSource("students", ""));
      loaded.push("siswa");
    } catch {
      // ignore
    }
  }

  if (!hasTarif(state.tarif)) {
    try {
      applyPricingCsv(await fetchBundledSource("pricing", ""), false);
      loaded.push("tarif");
    } catch {
      // ignore
    }
  }

  if ((state.diskonDurasi || []).length === 0) {
    try {
      applyDiscountCsv(await fetchBundledSource("discount", ""), false);
      loaded.push("diskon");
    } catch {
      // ignore
    }
  }

  if ((state.bankGuru || []).length === 0) {
    try {
      const bankText = await fetchBundledSource("bank", "");
      applyBankRows(parseCsv(bankText), false, bankText);
      loaded.push("rekening");
    } catch {
      // ignore
    }
  }

  if ((state.holidaySet || new Set()).size === 0) {
    try {
      applyHolidayCsv(await fetchBundledSource("holiday", ""), false);
      loaded.push("libur");
    } catch {
      // ignore
    }
  }

  if (!String(state.sourceTexts.template_after || "").trim()) {
    try {
      state.sourceTexts.template_after = await fetchBundledSource("template_after", "");
      loaded.push("template payment after");
    } catch {
      // ignore
    }
  }

  syncCsvEditorsFromState();
  return loaded;
}

async function autoLoadFromCurrentFolder(silent) {
  if (state.autoLoadTried && silent) return;
  state.autoLoadTried = true;

  const loaders = [
    { sourceKind: "students", kind: "siswa", run: async (text) => loadMasterStudentsCsv(text) },
    { sourceKind: "pricing", kind: "tarif", run: async (text) => applyPricingCsv(text, false) },
    { sourceKind: "discount", kind: "diskon", run: async (text) => applyDiscountCsv(text, false) },
    { sourceKind: "bank", kind: "rekening", run: async (text) => applyBankRows(parseCsv(text), false, text) },
    { sourceKind: "holiday", kind: "libur", run: async (text) => applyHolidayCsv(text, false) },
    { sourceKind: "template_after", kind: "template_after", run: async (text) => { state.sourceTexts.template_after = text; } },
  ];

  const loaded = [];
  for (const item of loaders) {
    try {
      const text = await fetchBundledSource(item.sourceKind, "");
      await item.run(text);
      loaded.push(item.kind);
    } catch {
      // ignore missing files or blocked local fetch
    }
  }

  if (loaded.length > 0 && !silent) {
    syncCsvEditorsFromState();
    alert(`Auto Load selesai. Terbaca: ${loaded.join(", ")}`);
    return;
  }

  if (loaded.length === 0 && !silent) {
    alert("Auto Load gagal membaca file dari folder saat ini. Jika browser memblokir file lokal, gunakan upload banyak file di bawah tombol Auto Load.");
  }
}

function applyRuntimeModeHints() {
  if (!el.runtimeNotice) return;

  const fileMode = isFileProtocol();
  el.runtimeNotice.classList.toggle("hidden", !fileMode);
  if (el.autoLoadSection) el.autoLoadSection.classList.toggle("hidden", !fileMode);

  if (!fileMode) {
    return;
  }

  el.runtimeNotice.innerHTML = `
    <strong>Mode Offline Terdeteksi</strong><br/>
    App dibuka langsung dari file sehingga fitur data contoh dan Google Sheet dinonaktifkan.<br/>
    App akan mencoba Auto Load dari folder saat dibuka. Jika ada yang belum terbaca, klik Auto Load atau upload manual.
  `;

  const blockedButtons = [
    el.btnMuatSiswaSheet,
    el.btnSiswaContoh,
    el.btnTarifContoh,
    el.btnDiskonContoh,
    el.btnBankContoh,
    el.btnHolidayContoh,
    el.btnContoh,
    el.btnMuatSheet,
  ];

  blockedButtons.forEach((btn) => {
    if (!btn) return;
    btn.disabled = true;
    btn.title = "Nonaktif pada mode file langsung. Gunakan upload file.";
  });

  el.btnAutoLoadFolder.disabled = false;
}

async function importPackageFiles(files) {
  const loaded = [];
  const skipped = [];

  for (const file of files) {
    const kind = detectFileKind(file.name);
    if (!kind) {
      skipped.push(file.name);
      continue;
    }

    try {
      if (kind === "students") {
        loadMasterStudentsCsv(await file.text());
        loaded.push(`${file.name} -> siswa`);
        continue;
      }

      if (kind === "pricing") {
        applyPricingCsv(await file.text(), false);
        loaded.push(`${file.name} -> tarif`);
        continue;
      }

      if (kind === "discount") {
        applyDiscountCsv(await file.text(), false);
        loaded.push(`${file.name} -> diskon`);
        continue;
      }

      if (kind === "bank") {
        const rawText = file.name.toLowerCase().endsWith(".csv") ? await file.text() : "";
        const rows = rawText ? parseCsv(rawText) : await readAnyTableFile(file);
        applyBankRows(rows, false, rawText);
        loaded.push(`${file.name} -> rekening`);
        continue;
      }

      if (kind === "holiday") {
        applyHolidayCsv(await file.text(), false);
        loaded.push(`${file.name} -> hari libur`);
        continue;
      }

      if (kind === "attendance") {
        loadAbsensiCsv(await file.text());
        loaded.push(`${file.name} -> absensi`);
        continue;
      }

      if (kind === "template_after") {
        state.sourceTexts.template_after = await file.text();
        loaded.push(`${file.name} -> template payment after`);
      }
    } catch {
      skipped.push(file.name);
    }
  }

  if (loaded.length === 0) {
    alert("Tidak ada file yang berhasil diproses. Pastikan nama file mengandung kata kunci seperti siswa, tarif, diskon, bank, libur, atau absensi.");
    return;
  }

  const skippedText = skipped.length > 0 ? `\n\nDilewati: ${skipped.join(", ")}` : "";
  syncCsvEditorsFromState();
  alert(`Setup cepat selesai.\n${loaded.join("\n")}${skippedText}`);
}

function detectFileKind(fileName) {
  const n = String(fileName || "").toLowerCase();
  if (n.includes("rekap") || n.includes("siswa")) return "students";
  if (n.includes("tarif") || n.includes("pricing")) return "pricing";
  if (n.includes("diskon") || n.includes("discount")) return "discount";
  if (n.includes("bank") || n.includes("rekening")) return "bank";
  if (n.includes("libur") || n.includes("holiday")) return "holiday";
  if (n.includes("template_payment_after")) return "template_after";
  if (n.includes("payment_after") || n.includes("after_invoice")) return "attendance";
  if (n.includes("absensi") || n.includes("attendance") || n.includes("jadwal")) return "attendance";
  return null;
}

function applyCalendarShareOnlyMode() {
  const enabled = Boolean(state.calendarShareOnly);
  document.body.classList.toggle("calendar-share-only", enabled);
  if (el.btnCalendarRefresh) el.btnCalendarRefresh.classList.toggle("hidden", enabled);
  if (el.btnDownloadCalendarCurrentMonth) el.btnDownloadCalendarCurrentMonth.classList.toggle("hidden", enabled);
  if (el.btnDownloadCalendarNextMonth) el.btnDownloadCalendarNextMonth.classList.toggle("hidden", enabled);
}

async function setActiveTab(nextTab, { force = false, group = "" } = {}) {
  let tab = TAB_GROUP_MAP[nextTab] ? String(nextTab) : "front";
  let activeGroup = normalizeGroup(group) || TAB_GROUP_MAP[tab] || "invoice";

  if (state.calendarShareOnly) {
    tab = "calendar";
    activeGroup = "invoice";
  }

  if (!GROUP_TABS[activeGroup].includes(tab)) {
    const preferred = state.lastTabByGroup[activeGroup];
    tab = GROUP_TABS[activeGroup].includes(preferred) ? preferred : GROUP_TABS[activeGroup][0];
  }

  if (!force && state.activeTab === tab && state.activeGroup === activeGroup) return;

  state.activeTab = tab;
  state.activeGroup = activeGroup;
  state.lastTabByGroup[activeGroup] = tab;
  updateLocationForView(activeGroup, tab);
  applyCalendarShareOnlyMode();

  el.workflowGroupButtons.forEach((btn) => {
    const isActive = normalizeGroup(btn.dataset.group) === activeGroup;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  el.workflowTabs.forEach((btn) => {
    const btnGroup = normalizeGroup(btn.dataset.group) || TAB_GROUP_MAP[String(btn.dataset.tab || "")];
    const showByGroup = btnGroup === activeGroup;
    btn.classList.toggle("hidden", !showByGroup);
    const isActive = String(btn.dataset.tab || "") === tab;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  const billingTab = tab === "front" || tab === "after";
  el.frontSection.classList.toggle("hidden", tab !== "front");
  el.afterSection.classList.toggle("hidden", tab !== "after");
  el.calendarSection?.classList.toggle("hidden", tab !== "calendar");
  el.paymentStatusSection?.classList.toggle("hidden", tab !== "status");
  el.studentManagementSection?.classList.toggle("hidden", tab !== "students");
  el.pricingManagementSection?.classList.toggle("hidden", tab !== "pricing");
  el.discountManagementSection?.classList.toggle("hidden", tab !== "discount");
  el.bankManagementSection?.classList.toggle("hidden", tab !== "bank");
  el.holidayManagementSection?.classList.toggle("hidden", tab !== "holiday");
  el.attendanceInputOperationsSection?.classList.toggle("hidden", tab !== "attendance_input");
  el.attendanceOperationsSection?.classList.toggle("hidden", tab !== "attendance");
  el.receivablesOperationsSection?.classList.toggle("hidden", tab !== "receivables");
  el.remindersOperationsSection?.classList.toggle("hidden", tab !== "reminders");

  if (el.sessionsPanel) el.sessionsPanel.classList.toggle("hidden", !billingTab);
  if (el.previewPanel) el.previewPanel.classList.toggle("hidden", !billingTab);
  if (el.billingActionToolbar) el.billingActionToolbar.classList.toggle("hidden", !billingTab);
  if (el.billingInvoiceInfoSection) el.billingInvoiceInfoSection.classList.toggle("hidden", !billingTab);

  if (tab === "front" || tab === "after") {
    state.mode = tab;
    applyModeUI();
    return;
  }

  if (tab === "students") {
    renderStudentManagementTable();
    refreshFirebaseButtons();
    return;
  }

  if (tab === "pricing") {
    renderPricingManagementTable();
    refreshFirebaseButtons();
    return;
  }

  if (tab === "discount") {
    renderDiscountManagementTable();
    refreshFirebaseButtons();
    return;
  }

  if (tab === "bank") {
    renderBankManagementTable();
    refreshFirebaseButtons();
    return;
  }

  if (tab === "holiday") {
    renderHolidayManagementTable();
    refreshFirebaseButtons();
    return;
  }

  if (tab === "attendance_input") {
    renderAttendanceInputSection();
    refreshFirebaseButtons();
    return;
  }

  if (tab === "attendance") {
    renderAttendanceOperationsSection();
    refreshFirebaseButtons();
    return;
  }

  if (!state.firebase.ready) {
    if (tab === "calendar") renderInvoiceCalendar();
    if (tab === "status") renderPaymentStatusTable();
    if (tab === "receivables") renderReceivablesOperationsSection();
    if (tab === "reminders") renderRemindersOperationsSection();
    return;
  }

  await refreshDashboardInvoices({ forceServer: true });
  if (tab === "calendar") renderInvoiceCalendar();
  if (tab === "status") renderPaymentStatusTable();
  if (tab === "receivables") renderReceivablesOperationsSection();
  if (tab === "reminders") renderRemindersOperationsSection();
}

function applyModeUI() {
  const isFront = state.mode === "front";
  el.sessionsTitle.textContent = isFront ? "Daftar Sesi Mingguan (Payment in Front)" : "Daftar Sesi Unpaid (Payment After)";

  if (!isFront) {
    hydrateAfterSessionsForSelectedStudent();
    return;
  }

  state.sessions = [];
  renderSessionsTable();
  updateTotal();
}

function loadMasterStudentsCsv(text) {
  const rows = parseCsv(text);
  const existingByFingerprint = new Map((state.students || []).map((student) => [studentFingerprint(student), student.studentId]));
  const parsed = sortStudentsByNickname(
    parseMasterStudents(rows).map((student) => normalizeStudentRecord(student, existingByFingerprint.get(studentFingerprint(student)) || ""))
  );
  if (parsed.length === 0) {
    alert("Data siswa tidak valid. Pastikan ada kolom nama siswa.");
    return;
  }

  state.students = parsed;
  rebuildStudentIndexes(parsed);
  state.sourceTexts.students = text;
  fillStudentSelect(parsed.map((s) => s.nickname));
  renderStudentDetail();
  renderStudentManagementTable();

  if (state.mode === "after") hydrateAfterSessionsForSelectedStudent();
}

function loadAbsensiCsv(text) {
  const parsed = parseCsv(text);
  if (parsed.length < 2) {
    alert("CSV absensi kosong atau tidak valid.");
    return;
  }

  state.absensiHeaders = parsed[0].map(normalizeHeader);
  state.absensiRows = parsed.slice(1);
  state.sourceTexts.attendance = text;
  renderAttendanceOperationsSection();

  if (state.mode === "after") hydrateAfterSessionsForSelectedStudent();
}

function attendanceEntryFingerprint(entry = {}) {
  return [
    String(entry.tanggal || "").trim(),
    normalizeName(entry.studentName || ""),
    normalizeAttendanceStatus(entry.status || "hadir"),
    String(entry.jamMulai || "").trim(),
    String(entry.jamSelesai || "").trim(),
    normalizeName(entry.pengajar || ""),
    String(entry.topik || "").trim().toLowerCase(),
  ].join("|");
}

function buildAttendanceEntriesFromCsvText(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  const idxNama = findHeaderIndex(headers, ["nama siswa", "siswa", "nama panggilan"]);
  const idxTanggal = findHeaderIndex(headers, ["tanggal"]);
  const idxMulai = findHeaderIndex(headers, ["jam_mulai", "jam mulai", "mulai"]);
  const idxSelesai = findHeaderIndex(headers, ["jam_selesai", "jam selesai", "selesai"]);
  const idxDurasi = findHeaderIndex(headers, ["durasi"]);
  const idxPengajar = findHeaderIndex(headers, ["pengajar", "guru"]);
  const idxPeserta = findHeaderIndex(headers, ["jumlah peserta", "total peserta", "peserta"]);
  const idxTopik = findHeaderIndex(headers, ["topik", "mata pelajaran", "subject", "mapel"]);
  const idxCatatan = findHeaderIndex(headers, ["catatan", "keterangan", "notes"]);
  const idxStatus = findHeaderIndex(headers, ["status", "kehadiran"]);
  const idxStudentId = findHeaderIndex(headers, ["student_id", "student id", "siswa_id", "siswa id"]);

  const entries = [];

  const buildTimeRange = (row) => {
    const start = String(idxMulai >= 0 ? row[idxMulai] || "" : "").trim();
    const end = String(idxSelesai >= 0 ? row[idxSelesai] || "" : "").trim();
    if (start && end) return { start, end };
    const durasi = Number.parseFloat(String(idxDurasi >= 0 ? row[idxDurasi] || "0" : "0").replace(",", "."));
    if (Number.isFinite(durasi) && durasi > 0) {
      const base = "19:30";
      const baseMin = parseTimeToMinutes(base);
      const endText = minutesToTimeText(baseMin + Math.max(15, Math.round(durasi * 60)));
      return { start: base, end: endText };
    }
    return { start: "19:30", end: "21:00" };
  };

  if (idxNama >= 0 && idxTanggal >= 0) {
    for (let i = 1; i < rows.length; i += 1) {
      const row = rows[i] || [];
      const studentName = String(row[idxNama] || "").trim();
      const parsedDate = parseDateFlex(String(row[idxTanggal] || "").trim()) || parseDateInput(String(row[idxTanggal] || "").trim());
      if (!studentName || !parsedDate) continue;
      const times = buildTimeRange(row);
      entries.push(normalizeAttendanceEntry({
        tanggal: toLocalDateInputValue(parsedDate),
        studentId: String(idxStudentId >= 0 ? row[idxStudentId] || "" : "").trim(),
        studentName,
        status: normalizeAttendanceStatus(idxStatus >= 0 ? row[idxStatus] || "hadir" : "hadir"),
        jamMulai: times.start,
        jamSelesai: times.end,
        pengajar: String(idxPengajar >= 0 ? row[idxPengajar] || "" : "").trim() || "-",
        pesertaCount: Math.max(1, parseIntFromText(idxPeserta >= 0 ? row[idxPeserta] || "1" : "1") || 1),
        topik: String(idxTopik >= 0 ? row[idxTopik] || "" : "").trim() || "-",
        catatan: String(idxCatatan >= 0 ? row[idxCatatan] || "" : "").trim(),
      }));
    }
    return entries;
  }

  const idxAbsensiLabel = headers.findIndex((h) => h.toLowerCase().includes("absensi - jangan diapus"));
  const idxTotalPeserta = headers.findIndex((h) => h.toLowerCase().includes("total peserta"));
  if (idxAbsensiLabel >= 0 && idxTotalPeserta > idxAbsensiLabel && idxTanggal >= 0) {
    const attendanceNames = headers.slice(idxAbsensiLabel + 1, idxTotalPeserta);
    for (let i = 1; i < rows.length; i += 1) {
      const row = rows[i] || [];
      const parsedDate = parseDateFlex(String(row[idxTanggal] || "").trim()) || parseDateInput(String(row[idxTanggal] || "").trim());
      if (!parsedDate) continue;
      const times = buildTimeRange(row);
      attendanceNames.forEach((name, offset) => {
        const value = String(row[idxAbsensiLabel + 1 + offset] || "").trim().toUpperCase();
        if (value !== "TRUE") return;
        entries.push(normalizeAttendanceEntry({
          tanggal: toLocalDateInputValue(parsedDate),
          studentName: String(name || "").trim(),
          status: "hadir",
          jamMulai: times.start,
          jamSelesai: times.end,
          pengajar: String(idxPengajar >= 0 ? row[idxPengajar] || "" : "").trim() || "-",
          pesertaCount: Math.max(1, parseIntFromText(idxPeserta >= 0 ? row[idxPeserta] || "1" : "1") || 1),
          topik: String(idxTopik >= 0 ? row[idxTopik] || "" : "").trim() || "-",
          catatan: String(idxCatatan >= 0 ? row[idxCatatan] || "" : "").trim(),
        }));
      });
    }
  }

  return entries;
}

function appendAttendanceEntriesFromCsvText(text) {
  const imported = buildAttendanceEntriesFromCsvText(text);
  if (imported.length === 0) return 0;

  const existing = sortAttendanceEntries(state.attendanceEntries || []);
  const seen = new Set(existing.map((item) => attendanceEntryFingerprint(item)));
  let added = 0;
  imported.forEach((item) => {
    const key = attendanceEntryFingerprint(item);
    if (seen.has(key)) return;
    seen.add(key);
    existing.push(item);
    added += 1;
  });

  state.attendanceEntries = sortAttendanceEntries(existing);
  renderAttendanceInputSection();
  renderAttendanceOperationsSection();
  if (state.mode === "after") hydrateAfterSessionsForSelectedStudent();
  return added;
}

function applyPricingCsv(text, notify = true) {
  const map = parseTarifCsv(parseCsv(text));
  if (!hasTarif(map)) {
    alert("Format tarif tidak valid. Gunakan: jenis_hari,jumlah_peserta,tarif_per_jam");
    return;
  }

  state.tarif = map;
  state.pricingManageRows = tarifMapToManageRows(map);
  state.sourceTexts.pricing = text;
  recalcSessions();
  renderPricingManagementTable();
  if (notify) alert("Tarif berhasil dimuat.");
}

function applyDiscountCsv(text, notify = true) {
  const list = parseDiscountCsv(parseCsv(text));
  if (list.length === 0) {
    alert("Format diskon tidak valid. Gunakan: min_durasi,max_durasi,diskon_persen");
    return;
  }

  state.diskonDurasi = list;
  state.discountManageRows = discountListToManageRows(list);
  state.sourceTexts.discount = text;
  recalcSessions();
  renderDiscountManagementTable();
  if (notify) alert("Diskon durasi berhasil dimuat.");
}

function applyBankRows(rows, notify = true, rawText = "") {
  const parsed = parseBankRows(rows);
  if (parsed.length === 0) {
    alert("File rekening guru tidak valid.");
    return;
  }

  state.bankGuru = parsed;
  state.bankManageRows = bankListToManageRows(parsed);
  state.sourceTexts.bank = rawText || serializeRowsToCsv(rows);
  refreshWeeklyTeacherOptions();
  applyDefaultTeacherToWeekTable();
  renderBankManagementTable();
  if (notify) alert("Data rekening guru berhasil dimuat.");
}

function applyHolidayCsv(text, notify = true) {
  const rows = parseCsv(text);
  const entries = parseHolidayEntries(rows);
  const dates = parseHolidayCsv(rows);
  if (dates.length === 0) {
    alert("Format hari libur tidak valid. Gunakan kolom tanggal atau isi tanggal di kolom pertama.");
    return;
  }

  el.holidayDates.value = dates.join("\n");
  state.holidayManageRows = holidayEntriesToManageRows(entries);
  state.holidayInfoMap = buildHolidayInfoMap(entries);
  state.sourceTexts.holiday = text;
  parseHolidaySetFromInput();
  recalcSessions();
  renderHolidayManagementTable();
  if (notify) alert("Hari libur berhasil dimuat.");
}

function parseHolidaySetFromInput() {
  const raw = String(el.holidayDates.value || "");
  const parts = raw
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean);

  const dates = parts.filter(isValidIsoDate);
  state.holidaySet = new Set(dates);
  if ((state.holidayInfoMap || new Map()).size === 0) {
    state.holidayInfoMap = new Map(dates.map((d) => [d, { labels: ["libur nasional"] }]));
  }
}

function generateFrontWeeklySessions() {
  const student = getSelectedStudentName();
  if (!student) {
    alert("Pilih siswa terlebih dahulu.");
    return;
  }

  const startDate = parseDateInput(el.frontStartDate.value);
  if (!startDate) {
    alert("Tanggal awal belum valid.");
    return;
  }

  const totalWeeks = Math.max(1, Number.parseInt(el.frontWeeks.value || "1", 10));
  const activeDays = Array.from(el.frontWeekTable.querySelectorAll('input[type="checkbox"][data-day]:checked')).map((c) => c.dataset.day);

  if (activeDays.length === 0) {
    alert("Pilih minimal satu hari aktif.");
    return;
  }

  const sessions = [];
  for (let week = 0; week < totalWeeks; week += 1) {
    for (let i = 0; i < 7; i += 1) {
      const date = addDays(startDate, week * 7 + i);
      const hari = HARI[date.getDay()];
      if (!activeDays.includes(hari)) continue;

      const startInput = el.frontWeekTable.querySelector(`input[data-start="${hari}"]`);
      const endInput = el.frontWeekTable.querySelector(`input[data-end="${hari}"]`);
      const jamMulai = snapTimeToStep(startInput?.value || "19:30", 15);
      const jamSelesai = snapTimeToStep(endInput?.value || "21:00", 15);
      if (startInput && startInput.value !== jamMulai) startInput.value = jamMulai;
      if (endInput && endInput.value !== jamSelesai) endInput.value = jamSelesai;
      const pengajar = el.frontWeekTable.querySelector(`select[data-teacher="${hari}"]`)?.value || "-";
      const pesertaCount = Math.max(
        1,
        Number.parseInt(el.frontWeekTable.querySelector(`input[data-peserta="${hari}"]`)?.value || "1", 10)
      );

      const durasi = calculateDuration(jamMulai, jamSelesai);
      if (durasi <= 0) continue;

      sessions.push(
        buildSession({
          date,
          hari,
          jamMulai,
          jamSelesai,
          pengajar,
          pesertaCount,
          catatan: "",
          source: "front",
        })
      );
    }
  }

  if (sessions.length === 0) {
    alert("Tidak ada sesi valid yang bisa digenerate. Cek jam mulai/selesai.");
    return;
  }

  state.sessions = sessions;
  renderSessionsTable();
  updateTotal();
}

function buildAfterSessionsFromAttendanceEntries(studentName) {
  const target = normalizeName(studentName);
  const items = (state.attendanceEntries || []).filter((entry) => {
    const status = normalizeAttendanceStatus(entry?.status || "hadir");
    if (status !== "hadir") return false;
    if (entry?.studentId) {
      const record = getStudentRecordById(entry.studentId);
      if (record) {
        const aliases = [record.nickname, record.fullName].map((name) => normalizeName(name || "")).filter(Boolean);
        if (aliases.includes(target)) return true;
      }
    }
    return normalizeName(entry?.studentName || "") === target;
  });

  return items
    .map((entry) => {
      const tanggal = parseDateInput(String(entry.tanggal || "").trim()) || parseDateFlex(String(entry.tanggal || "").trim());
      if (!tanggal) return null;
      const jamMulai = String(entry.jamMulai || "-").trim() || "-";
      const jamSelesai = String(entry.jamSelesai || "-").trim() || "-";
      const durasiOverride = calculateDuration(jamMulai, jamSelesai);
      if (durasiOverride <= 0) return null;
      return buildSession({
        date: tanggal,
        hari: HARI[tanggal.getDay()] || "-",
        jamMulai,
        jamSelesai,
        pengajar: String(entry.pengajar || "-").trim() || "-",
        pesertaCount: Math.max(1, Number.parseInt(String(entry.pesertaCount || "1"), 10) || 1),
        durasiOverride,
        topik: String(entry.topik || "-").trim() || "-",
        catatan: String(entry.catatan || "").trim(),
        source: "after",
      });
    })
    .filter(Boolean);
}

function hydrateAfterSessionsForSelectedStudent() {
  const studentName = getSelectedStudentName();
  if (!studentName) {
    state.sessions = [];
    renderSessionsTable();
    return;
  }

  const structured = buildAfterSessionsFromAttendanceEntries(studentName);
  if (structured.length > 0) {
    state.sessions = structured.sort((a, b) => a.tanggal - b.tanggal);
    updateAfterInvoiceDateOptions(state.sessions);
    renderSessionsTable();
    updateTotal();
    return;
  }

  if (state.absensiRows.length === 0 || state.absensiHeaders.length === 0) {
    state.sessions = [];
    renderSessionsTable("Belum ada data attendance. Tambahkan dari Operations > Attendance Input.");
    return;
  }

  const headers = state.absensiHeaders;
  const rows = state.absensiRows;

  const simple = buildAfterSessionsFromSimpleCsv(headers, rows, studentName);
  if (simple.length > 0) {
    state.sessions = simple.sort((a, b) => a.tanggal - b.tanggal);
    updateAfterInvoiceDateOptions(state.sessions);
    renderSessionsTable();
    updateTotal();
    return;
  }

  const idxPengajar = findHeaderIndex(headers, ["pengajar"]);
  const idxHari = findHeaderIndex(headers, ["hari"]);
  const idxTanggal = findHeaderIndex(headers, ["tanggal"]);
  const idxDurasi = findHeaderIndex(headers, ["durasi"]);
  const idxTotal = findHeaderIndex(headers, ["total peserta"]);
  const idxTopik = findHeaderIndex(headers, ["topik", "mata pelajaran", "subject", "mapel"]);
  const idxCatatan = findHeaderIndex(headers, ["catatan", "keterangan", "notes"]);

  const idxAbsensiLabel = headers.findIndex((h) => h.toLowerCase().includes("absensi - jangan diapus"));
  const idxTotalPeserta = headers.findIndex((h) => h.toLowerCase().includes("total peserta"));

  if (idxAbsensiLabel === -1 || idxTotalPeserta === -1) {
    renderSessionsTable("Format absensi tidak menemukan kolom absensi siswa.");
    return;
  }

  const attendanceNames = headers.slice(idxAbsensiLabel + 1, idxTotalPeserta);
  const target = normalizeName(studentName);

  const sessions = [];
  for (const row of rows) {
    const rawTanggal = String(row[idxTanggal] || "").trim();
    const rawHari = String(row[idxHari] || "").trim();
    if (!rawTanggal || !rawHari) continue;

    const tanggal = parseDateFlex(rawTanggal);
    if (!tanggal) continue;

    let hadirStudent = false;
    let pesertaCount = 0;

    attendanceNames.forEach((name, i) => {
      const value = String(row[idxAbsensiLabel + 1 + i] || "").trim().toUpperCase();
      const hadir = value === "TRUE";
      if (hadir) pesertaCount += 1;
      if (hadir && normalizeName(name) === target) hadirStudent = true;
    });

    if (!hadirStudent) continue;

    const pesertaDariKolom = parseIntFromText(row[idxTotal] || "");
    if (pesertaDariKolom > 0) pesertaCount = pesertaDariKolom;

    sessions.push(
      buildSession({
        date: tanggal,
        hari: rawHari,
        jamMulai: "-",
        jamSelesai: "-",
        pengajar: String(row[idxPengajar] || "").trim() || "-",
        pesertaCount: pesertaCount || 1,
        durasiOverride: Number.parseFloat(String(row[idxDurasi] || "0").replace(",", ".")) || 0,
        topik: idxTopik >= 0 ? String(row[idxTopik] || "").trim() || "-" : "-",
        catatan: idxCatatan >= 0 ? String(row[idxCatatan] || "").trim() : "",
        source: "after",
      })
    );
  }

  state.sessions = sessions.sort((a, b) => a.tanggal - b.tanggal);
  updateAfterInvoiceDateOptions(state.sessions);
  renderSessionsTable(sessions.length === 0 ? "Tidak ada sesi absensi untuk siswa ini." : undefined);
  updateTotal();
}

function updateAfterInvoiceDateOptions(sourceSessions = null) {
  if (!el.afterInvoiceDateSelect) return;
  const sessions = Array.isArray(sourceSessions) ? sourceSessions : state.sessions;
  const isoDates = [...new Set((sessions || [])
    .map((s) => (s?.tanggal instanceof Date ? toLocalDateInputValue(s.tanggal) : ""))
    .filter(Boolean))].sort();

  if (isoDates.length === 0) {
    el.afterInvoiceDateSelect.innerHTML = '<option value="">Belum ada tanggal dari CSV</option>';
    return;
  }

  el.afterInvoiceDateSelect.innerHTML = isoDates
    .map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(formatTanggal(new Date(d)))}</option>`)
    .join("");

  const preferred = isoDates[isoDates.length - 1];
  el.afterInvoiceDateSelect.value = preferred;
  applyInvoiceDateFromAttendanceDate(preferred);
}

function buildSession({ date, hari, jamMulai, jamSelesai, pengajar, pesertaCount, durasiOverride, topik, catatan, source }) {
  const durasi = Number.isFinite(durasiOverride) ? durasiOverride : calculateDuration(jamMulai, jamSelesai);
  const tarifPerJam = pickTarif(hari, pesertaCount, date);
  const subtotal = tarifPerJam * durasi;

  return {
    id: `${date.getTime()}-${hari}-${Math.random().toString(36).slice(2, 7)}`,
    source,
    dipilih: true,
    tanggal: date,
    hari,
    jamMulai,
    jamSelesai,
    pengajar,
    topik: topik || "-",
    pesertaCount,
    durasi,
    tarifPerJam,
    subtotal,
    catatan: catatan ?? "",
  };
}

function recalcSessions() {
  state.sessions = state.sessions.map((s) => ({
    ...buildSession({
      date: s.tanggal,
      hari: s.hari,
      jamMulai: s.jamMulai,
      jamSelesai: s.jamSelesai,
      pengajar: s.pengajar,
      topik: s.topik,
      pesertaCount: s.pesertaCount,
      durasiOverride: s.durasi,
      catatan: s.catatan,
      source: s.source,
    }),
    id: s.id,
    dipilih: s.dipilih,
  }));

  sortSessionsAscending();
  renderSessionsTable();
  updateTotal();
}

function sortSessionsAscending() {
  state.sessions.sort((a, b) => {
    const dateDiff = (a?.tanggal?.getTime?.() || 0) - (b?.tanggal?.getTime?.() || 0);
    if (dateDiff !== 0) return dateDiff;
    const aStart = parseTimeToMinutes(a?.jamMulai || "");
    const bStart = parseTimeToMinutes(b?.jamMulai || "");
    if (aStart >= 0 && bStart >= 0 && aStart !== bStart) return aStart - bStart;
    return String(a?.pengajar || "").localeCompare(String(b?.pengajar || ""), "id");
  });
}

function hasDuplicateSession(candidate, ignoreId = "") {
  const candidateDate = toLocalDateInputValue(candidate.tanggal);
  return state.sessions.some((s) => {
    if (ignoreId && s.id === ignoreId) return false;
    return (
      toLocalDateInputValue(s.tanggal) === candidateDate
      && String(s.jamMulai || "") === String(candidate.jamMulai || "")
      && String(s.jamSelesai || "") === String(candidate.jamSelesai || "")
      && String(s.pengajar || "") === String(candidate.pengajar || "")
      && String(s.topik || "") === String(candidate.topik || "")
    );
  });
}

function insertRescheduleSession() {
  if (!Array.isArray(state.sessions) || state.sessions.length === 0) {
    alert("Belum ada sesi yang bisa dijadwalkan ulang.");
    return;
  }
  const anchor = state.sessions.find((s) => s.id === state.rescheduleAnchorId) || state.sessions[0];
  if (!anchor) {
    alert("Pilih satu sesi dulu sebagai acuan reschedule (klik baris sesi).");
    return;
  }

  const rawDate = String(el.rescheduleDate?.value || "").trim();
  const nextDate = parseDateInput(rawDate);
  if (!nextDate) {
    alert("Isi tanggal sesi pengganti terlebih dahulu.");
    return;
  }

  const nextHari = HARI[nextDate.getDay()];
  const cloned = buildSession({
    date: nextDate,
    hari: nextHari,
    jamMulai: anchor.jamMulai,
    jamSelesai: anchor.jamSelesai,
    pengajar: anchor.pengajar,
    pesertaCount: anchor.pesertaCount,
    topik: anchor.topik,
    catatan: anchor.catatan,
    source: anchor.source || state.mode,
  });

  if (hasDuplicateSession(cloned)) {
    alert("Sesi pengganti duplikat: kombinasi tanggal/jam/pengajar/topik sudah ada.");
    return;
  }

  state.sessions.push(cloned);
  if (el.rescheduleUncheckAnchor?.checked) {
    anchor.dipilih = false;
  }
  state.rescheduleAnchorId = cloned.id;
  sortSessionsAscending();
  renderSessionsTable();
  updateTotal();
}

function renderSessionsTable(emptyMsg = "Belum ada sesi. Muat data terlebih dahulu.") {
  if (state.sessions.length === 0) {
    state.rescheduleAnchorId = "";
    el.tableBody.innerHTML = `<tr><td colspan="11" class="empty">${escapeHtml(emptyMsg)}</td></tr>`;
    return;
  }

  if (!state.sessions.some((s) => s.id === state.rescheduleAnchorId)) {
    state.rescheduleAnchorId = state.sessions[0]?.id || "";
  }

  el.tableBody.innerHTML = state.sessions
    .map(
      (s) => `
      <tr data-id="${s.id}" class="${isHolidayLikeDate(s.tanggal) ? "holiday-row" : ""} ${s.id === state.rescheduleAnchorId ? "reschedule-anchor" : ""}">
        <td><input type="checkbox" class="pick" ${s.dipilih ? "checked" : ""} /></td>
        <td>${escapeHtml(s.hari)}</td>
        <td>${formatTanggal(s.tanggal)}${buildHolidayBadgeHtml(s.tanggal)}</td>
        <td>${escapeHtml(formatJamRange(s.jamMulai, s.jamSelesai))}</td>
        <td><select class="teacher-input">${getTeacherOptionsHtml(s.pengajar)}</select></td>
        <td><input type="text" class="topic-input" value="${escapeHtml(s.topik || "-")}" /></td>
        <td>${s.durasi.toFixed(2)} jam</td>
        <td>${formatRupiah(s.tarifPerJam)}</td>
        <td><input type="number" min="1" class="participant-input" value="${s.pesertaCount}" /></td>
        <td>${formatRupiah(s.subtotal)}</td>
        <td><textarea class="catatan" placeholder="Catatan khusus...">${escapeHtml(s.catatan || "")}</textarea></td>
      </tr>
    `
    )
    .join("");

  el.tableBody.querySelectorAll("tr").forEach((row) => {
    const id = row.dataset.id;
    const session = state.sessions.find((x) => x.id === id);
    if (!session) return;
    const checkbox = row.querySelector(".pick");
    const teacherInput = row.querySelector(".teacher-input");
    const topicInput = row.querySelector(".topic-input");
    const participantInput = row.querySelector(".participant-input");
    const catatan = row.querySelector(".catatan");
    row.addEventListener("click", (event) => {
      if (event.target.closest("input,select,textarea,button,label")) return;
      state.rescheduleAnchorId = session.id;
      renderSessionsTable();
    });
    checkbox.addEventListener("change", () => {
      session.dipilih = checkbox.checked;
      updateTotal();
    });
    teacherInput.addEventListener("change", () => {
      session.pengajar = teacherInput.value || "-";
    });
    topicInput.addEventListener("input", () => {
      session.topik = topicInput.value.trim() || "-";
    });
    participantInput.addEventListener("input", () => {
      const next = Math.max(1, Number.parseInt(participantInput.value || "1", 10) || 1);
      session.pesertaCount = next;
      session.tarifPerJam = pickTarif(session.hari, next, session.tanggal);
      session.subtotal = session.tarifPerJam * session.durasi;
      renderSessionsTable();
      updateTotal();
    });
    catatan.addEventListener("input", () => {
      session.catatan = catatan.value;
    });
  });
}

function updateTotal() {
  const totals = calculateInvoiceTotals(state.sessions.filter((s) => s.dipilih));
  el.totalTagihan.value = formatRupiah(totals.grandTotal);
}

function generateInvoice() {
  const student = getSelectedStudentName();
  if (!student) {
    alert("Pilih siswa terlebih dahulu.");
    return;
  }

  if (state.mode === "after" && state.sessions.length === 0) {
    hydrateAfterSessionsForSelectedStudent();
  }

  let selected = state.sessions.filter((s) => s.dipilih);
  if (state.mode === "after" && selected.length === 0 && state.sessions.length > 0) {
    state.sessions.forEach((s) => {
      s.dipilih = true;
    });
    selected = state.sessions.slice();
    renderSessionsTable();
    updateTotal();
  }

  if (selected.length === 0) {
    alert("Tidak ada sesi terpilih untuk ditagihkan.");
    return;
  }

  const teachers = getCollaboratedTeachers(selected);
  const bankList = getBankListForInvoice(teachers);
  if (bankList.length === 0) {
    alert("Data rekening belum tersedia. Isi bank_guru.csv.");
    return;
  }

  const totals = calculateInvoiceTotals(selected);
  const teacherPortions = calculateTeacherPortions(selected, totals);
  const detail = getSelectedStudentRecord();
  const invoiceDate = parseDateInput(el.invoiceDate.value) || getCurrentTimeInZone();
  const paymentDeadline = toLocalDateTimeInputValue(addHours(getCurrentTimeInZone(), 24));
  const editMeta = state.editingInvoiceMeta;
  const invoiceNo = String(editMeta?.invoiceNo || "").trim() || buildInvoiceNumber(invoiceDate, detail, student);
  state.currentInvoiceId = invoiceNo;
  const studentId = String(detail?.studentId || "").trim();
  const rowsHtml = selected
    .map(
      (s, i) => `
      <tr class="${isHolidayLikeDate(s.tanggal) ? "invoice-holiday-row" : ""}">
        <td>${i + 1}</td>
        <td>${escapeHtml(s.hari)}</td>
        <td>${formatTanggal(s.tanggal)}</td>
        <td>${escapeHtml(formatJamRange(s.jamMulai, s.jamSelesai))}</td>
        <td>${escapeHtml(s.pengajar || "-")}</td>
        <td>${escapeHtml(s.topik || "-")}</td>
        <td>${s.durasi.toFixed(2)}</td>
        <td>${formatRupiah(s.tarifPerJam)}</td>
        <td>${s.pesertaCount}</td>
        <td>${formatRupiah(s.subtotal)}</td>
        <td>${escapeHtml(s.catatan || "-")}</td>
      </tr>
    `
    )
    .join("");

  el.preview.innerHTML = `
    <article class="invoice-sheet landscape">
      <div class="print-page-header">
        <div><strong>${escapeHtml(invoiceNo)}</strong></div>
        <div class="print-header-logo"><img src="${escapeHtml(APP_ASSETS.logo)}" alt="Logo" /></div>
      </div>

      <div class="invoice-top">
        <div class="invoice-left">
          <div class="invoice-title-box"><div class="invoice-title">${escapeHtml(el.invoiceTitle.value || "INVOICE")}</div></div>
          <div class="badge">
            <div><strong>No:</strong> ${escapeHtml(invoiceNo)}</div>
            <div><strong>Tanggal:</strong> ${formatTanggalWaktu(invoiceDate)}</div>
          </div>
        </div>
        <div class="invoice-right">
          <div class="invoice-logo" aria-label="Logo Rumah Belajar Pak Gun">
            <img src="${escapeHtml(APP_ASSETS.logo)}" alt="Logo Rumah Belajar Pak Gun" onload="this.nextElementSibling.style.display='none';" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
            <span class="logo-fallback">LOGO</span>
          </div>
        </div>
      </div>

      <section class="student-info-box">
        <div><strong>Nama Siswa:</strong> ${escapeHtml(student)}</div>
        <div><strong>Nama Lengkap:</strong> ${escapeHtml(detail?.fullName || "-")}</div>
        <div><strong>Nama Orang Tua:</strong> ${escapeHtml(detail?.parentName || "-")}</div>
        <div><strong>Sekolah / Kelas:</strong> ${escapeHtml(detail ? `${detail.sekolah || "-"} / ${detail.kelas || "-"}` : "-")}</div>
        <div class="student-full"><strong>Pengajar Terlibat:</strong> ${escapeHtml(teachers.join(", ") || "-")}</div>
      </section>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Hari</th>
            <th>Tanggal</th>
            <th>Jam</th>
            <th>Pengajar</th>
            <th>Topik/Mapel</th>
            <th>Durasi</th>
            <th>Tarif/Jam</th>
            <th>Peserta</th>
            <th>Subtotal</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>

      <div class="portion-box">
        <h4>Porsi Pembayaran per Pengajar</h4>
        <table class="portion-table">
          <thead>
            <tr>
              <th>Pengajar</th>
              <th>Durasi</th>
              <th>Sesi</th>
              <th>Biaya Akhir</th>
            </tr>
          </thead>
          <tbody>${renderTeacherPortionRows(teacherPortions)}</tbody>
        </table>
      </div>

      <div class="invoice-footer-grid">
        <div class="bank-box">
          <h4>Informasi Pembayaran</h4>
          ${renderAllBankRows(bankList)}
          <label class="deadline-field">
            <span>Deadline Pembayaran</span>
            <input id="invoiceDeadline" type="datetime-local" step="1" value="${paymentDeadline}" />
          </label>
        </div>

        <div class="total-box">
          <div><span>Total Durasi</span><span>${totals.totalDurasi.toFixed(2)} jam</span></div>
          <div><span>Subtotal</span><span>${formatRupiah(totals.baseTotal)}</span></div>
          <div><span>Diskon Invoice</span><span>${totals.diskonPersen}% (${formatRupiah(totals.diskonNominal)})</span></div>
          <div><span>Total Tagihan</span><span>${formatRupiah(totals.grandTotal)}</span></div>
        </div>
      </div>

      <div class="print-page-footer">
        <span>${escapeHtml(invoiceNo)}</span>
        <span>${escapeHtml(formatTanggalWaktu(invoiceDate))} | <span class="page-count"></span></span>
      </div>
    </article>
  `;

  el.btnDownloadPng.disabled = false;
  if (el.btnPreviewPng) el.btnPreviewPng.disabled = false;

  const deadlineInput = el.preview.querySelector("#invoiceDeadline");
  if (deadlineInput) {
    deadlineInput.addEventListener("input", () => {
      deadlineInput.dataset.userEdited = "true";
      if (state.lastInvoiceRecord) {
        state.lastInvoiceRecord.paymentDeadline = String(deadlineInput.value || "").trim() || toLocalDateTimeInputValue(addHours(new Date(), 24));
        if (state.firebase.ready) {
          void saveInvoiceRecordToFirebase({ silent: true }).catch(() => {
            // ignore background autosave failures; manual save button remains available
          });
        }
      }
    });
  }

  state.lastInvoiceRecord = {
    historyId: String(editMeta?.historyId || "").trim(),
    invoiceNo,
    createdAt: String(editMeta?.createdAt || new Date().toISOString()),
    paymentStatus: normalizeInvoiceStatus(editMeta?.paymentStatus || "issued"),
    paymentNote: String(editMeta?.paymentNote || "").trim(),
    paidAt: String(editMeta?.paidAt || ""),
    mode: state.mode,
    title: String(el.invoiceTitle.value || "INVOICE LES").trim(),
    student,
    invoiceDate: toLocalDateTimeInputValue(invoiceDate),
    paymentDeadline,
    teachers,
    teacherPortions,
    totals,
    studentId,
    studentDetail: {
      studentId,
      fullName: detail?.fullName || "",
      parentName: detail?.parentName || "",
      kelas: detail?.kelas || "",
      sekolah: detail?.sekolah || "",
    },
    items: selected.map((s) => ({
      tanggal: toLocalDateInputValue(s.tanggal),
      hari: s.hari,
      jamMulai: s.jamMulai,
      jamSelesai: s.jamSelesai,
      pengajar: s.pengajar,
      topik: s.topik,
      durasi: s.durasi,
      tarifPerJam: s.tarifPerJam,
      pesertaCount: s.pesertaCount,
      subtotal: s.subtotal,
      catatan: s.catatan,
    })),
  };
  refreshFirebaseButtons();

  if (state.firebase.ready) {
    void saveInvoiceRecordToFirebase({ silent: true }).catch(() => {
      // ignore background autosave failures; manual save button remains available
    });
  }

  state.editingInvoiceHistoryId = "";
  state.editingInvoiceMeta = null;
}

async function downloadPng() {
  if (el.btnDownloadPng.disabled) return;
  const sheet = el.preview.querySelector(".invoice-sheet");
  if (!sheet) {
    alert("Generate invoice terlebih dahulu.");
    return;
  }

  if (typeof window.html2canvas !== "function") {
    alert("Fitur Download PNG belum siap. Coba refresh halaman saat internet aktif.");
    return;
  }

  const fileName = `${sanitizeFileName(state.currentInvoiceId || "INV")}.png`;

  try {
    const canvas = await captureInvoiceCanvas(sheet, false);
    downloadCanvas(canvas, fileName);
    return;
  } catch {
    // continue to fallback mode
  }

  try {
    const canvasFallback = await captureInvoiceCanvas(sheet, true);
    downloadCanvas(canvasFallback, fileName);
    alert("PNG dibuat dengan mode kompatibel offline.");
  } catch {
    alert("Gagal membuat PNG. Coba tutup-buka file index.html lalu generate ulang invoice.");
  }
}

async function captureInvoiceCanvas(sheet, captureSafeMode) {
  if (captureSafeMode) {
    sheet.classList.add("capture-safe");
    await nextPaint();
  }

  try {
    return await window.html2canvas(sheet, {
      scale: 2,
      useCORS: false,
      allowTaint: false,
      imageTimeout: 0,
      backgroundColor: "#ffffff",
      logging: false,
    });
  } finally {
    if (captureSafeMode) sheet.classList.remove("capture-safe");
  }
}

function downloadCanvas(canvas, fileName) {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = fileName;
  link.click();
}

function nextPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function sanitizeFileName(name) {
  return String(name || "INV").replace(/[\\/:*?"<>|]/g, "_").trim() || "INV";
}

function downloadAfterTemplateCsv() {
  const csv = [
    "nama_siswa,tanggal,hari,jam_mulai,jam_selesai,pengajar,jumlah_peserta,topik,catatan",
    "Budi,2026-05-20,Rabu,19:30,21:00,Rensie,1,Matematika - Integral,Pembahasan latihan UTBK",
    "Budi,2026-05-22,Jumat,19:30,21:00,Trias,1,Fisika - Kinematika,Bahas soal rutin",
  ].join("\n");

  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  state.sourceTexts.template_after = csv;
  syncCsvEditorsFromState();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "template_payment_after.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function buildAfterSessionsFromSimpleCsv(headers, rows, studentName) {
  const idxNama = findHeaderIndex(headers, ["nama siswa", "siswa", "nama panggilan"]);
  const idxTanggal = findHeaderIndex(headers, ["tanggal"]);
  const idxHari = findHeaderIndex(headers, ["hari"]);
  const idxMulai = findHeaderIndex(headers, ["jam_mulai", "jam mulai"]);
  const idxSelesai = findHeaderIndex(headers, ["jam_selesai", "jam selesai"]);
  const idxPengajar = findHeaderIndex(headers, ["pengajar", "guru"]);
  const idxPeserta = findHeaderIndex(headers, ["jumlah peserta", "total peserta", "peserta"]);
  const idxTopik = findHeaderIndex(headers, ["topik", "mata pelajaran", "subject", "mapel"]);
  const idxCatatan = findHeaderIndex(headers, ["catatan", "keterangan", "notes"]);

  if (idxNama === -1 || idxTanggal === -1) return [];

  const target = normalizeName(studentName);
  const out = [];

  for (const row of rows) {
    const nama = normalizeName(String(row[idxNama] || "").trim());
    if (!nama || nama !== target) continue;

    const tanggal = parseDateFlex(String(row[idxTanggal] || "").trim());
    if (!tanggal) continue;

    const hariCsv = String(idxHari >= 0 ? row[idxHari] || "" : "").trim();
    const hari = hariCsv || HARI[tanggal.getDay()];
    const jamMulai = String(idxMulai >= 0 ? row[idxMulai] || "" : "").trim() || "-";
    const jamSelesai = String(idxSelesai >= 0 ? row[idxSelesai] || "" : "").trim() || "-";
    const durasiOverride = calculateDuration(jamMulai, jamSelesai);
    if (durasiOverride <= 0) continue;
    const peserta = Math.max(1, parseIntFromText(idxPeserta >= 0 ? row[idxPeserta] || "1" : "1") || 1);

    out.push(
      buildSession({
        date: tanggal,
        hari,
        jamMulai,
        jamSelesai,
        pengajar: String(idxPengajar >= 0 ? row[idxPengajar] || "" : "").trim() || "-",
        pesertaCount: peserta,
        durasiOverride,
        topik: String(idxTopik >= 0 ? row[idxTopik] || "" : "").trim() || "-",
        catatan: String(idxCatatan >= 0 ? row[idxCatatan] || "" : "").trim(),
        source: "after",
      })
    );
  }

  return out;
}

function refreshWeeklyTeacherOptions() {
  const names = [
    ...new Set(state.bankGuru.filter((b) => !isCollaboratedAccountRow(b)).map((b) => b.namaPengajar).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "id"));
  const defaultTeacher = loadDefaultTeacher();
  const html = names.length === 0
    ? '<option value="-" selected>-</option>'
    : names.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");

  el.frontWeekTable.querySelectorAll("select.teacher-week").forEach((sel) => {
    const prev = sel.value;
    sel.innerHTML = html;
    if (prev && names.includes(prev)) sel.value = prev;
    if ((!prev || prev === "-" || !names.includes(prev)) && defaultTeacher && names.includes(defaultTeacher)) {
      sel.value = defaultTeacher;
    }
  });

  refreshDefaultTeacherOptions(names);
}

function refreshDefaultTeacherOptions(names) {
  if (!el.defaultTeacherSelect) return;
  const current = loadDefaultTeacher();
  el.defaultTeacherSelect.innerHTML =
    '<option value="">- Pilih Pengajar Default -</option>' +
    names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
  if (current && names.includes(current)) {
    el.defaultTeacherSelect.value = current;
  }
}

function loadDefaultTeacher() {
  try {
    return String(localStorage.getItem(DEFAULT_TEACHER_STORAGE_KEY) || "").trim();
  } catch {
    return "";
  }
}

function persistDefaultTeacher(name) {
  try {
    localStorage.setItem(DEFAULT_TEACHER_STORAGE_KEY, String(name || "").trim());
  } catch {
    // ignore storage failures
  }
}

function applyDefaultTeacherToWeekTable() {
  const defaultTeacher = loadDefaultTeacher();
  if (!defaultTeacher) return;
  el.frontWeekTable.querySelectorAll("select.teacher-week").forEach((sel) => {
    const options = Array.from(sel.options || []).map((o) => o.value);
    if (options.includes(defaultTeacher) && (!sel.value || sel.value === "-")) {
      sel.value = defaultTeacher;
    }
  });
}

function getTeacherOptionsHtml(selectedTeacher = "-") {
  const names = [
    ...new Set(state.bankGuru.filter((b) => !isCollaboratedAccountRow(b)).map((b) => b.namaPengajar).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "id"));

  const options = ['<option value="-">-</option>'];
  names.forEach((name) => {
    options.push(`<option value="${escapeHtml(name)}" ${name === selectedTeacher ? "selected" : ""}>${escapeHtml(name)}</option>`);
  });
  return options.join("");
}

function renderStudentDetail() {
  const s = getSelectedStudentRecord();
  if (!s) {
    el.studentDetail.textContent = "Detail siswa akan muncul di sini.";
    return;
  }

  el.studentDetail.innerHTML = `
    <strong>Profil Siswa:</strong>
    Nama Lengkap: ${escapeHtml(s.fullName || "-")} |
    Panggilan: ${escapeHtml(s.nickname || "-")} |
    Orang Tua/Wali: ${escapeHtml(s.parentName || "-")} |
    Kelas: ${escapeHtml(s.kelas || "-")} |
    Sekolah: ${escapeHtml(s.sekolah || "-")}
  `;
}

function getCollaboratedTeachers(selectedSessions) {
  return [...new Set(selectedSessions.map((s) => (s.pengajar || "").trim()).filter((x) => x && x !== "-"))];
}

function getBankListForInvoice(collaboratedTeachers) {
  if (collaboratedTeachers.length > 1) {
    const kolab = state.bankGuru.filter((b) => isCollaboratedAccountRow(b));
    if (kolab.length > 0) return kolab;
    return [
      {
        namaPengajar: "Kolaborasi",
        label: "Utama",
        bank: "ISI DI bank_guru.csv",
        nomor: "-",
        atasNama: "Bimbel Pa Gun",
      },
    ];
  }

  if (collaboratedTeachers.length === 1) {
    return state.bankGuru.filter((b) => b.namaPengajar === collaboratedTeachers[0]);
  }

  return state.bankGuru;
}

function isCollaboratedAccountRow(row) {
  const nama = normalizeName(row.namaPengajar);
  const label = normalizeName(row.label);
  return nama.includes("kolaborasi") || label.includes("kolaborasi");
}

function renderAllBankRows(bankList) {
  return bankList
    .map(
      (bank) =>
        `<div class="bank-row"><strong>${escapeHtml(bank.namaPengajar)}</strong> - ${escapeHtml(bank.label)}: ${escapeHtml(
          bank.bank
        )} | ${escapeHtml(bank.nomor)} | a.n. ${escapeHtml(bank.atasNama)}</div>`
    )
    .join("");
}

function calculateTeacherPortions(rows, totals = {}) {
  const grouped = new Map();
  (rows || []).forEach((row) => {
    const teacher = String(row?.pengajar || "").trim() || "Tanpa Pengajar";
    const current = grouped.get(teacher) || { teacher, sessions: 0, duration: 0, gross: 0, discountableGross: 0 };
    current.sessions += 1;
    current.duration += Number(row?.durasi || 0);
    current.gross += Number(row?.subtotal || 0);
    if (Number(row?.pesertaCount || 1) > 1) {
      current.discountableGross += Number(row?.subtotal || 0);
    }
    grouped.set(teacher, current);
  });

  const entries = Array.from(grouped.values()).sort((a, b) => a.teacher.localeCompare(b.teacher, "id"));
  if (entries.length === 0) return [];

  const fallbackBase = entries.reduce((sum, row) => sum + row.gross, 0);
  const fallbackDiscountableBase = entries.reduce((sum, row) => sum + row.discountableGross, 0);
  const baseTotal = Number(totals?.baseTotal || fallbackBase);
  const discountableBaseTotal = Number(totals?.discountableBaseTotal || fallbackDiscountableBase);
  const totalDiscount = Number(totals?.diskonNominal || 0);
  let allocatedDiscount = 0;

  return entries.map((entry, index) => {
    let discount = 0;
    const hasDiscountablePart = discountableBaseTotal > 0 && entry.discountableGross > 0;
    if (totalDiscount > 0 && baseTotal > 0 && hasDiscountablePart) {
      const discountableEntriesLeft = entries.slice(index + 1).some((row) => row.discountableGross > 0);
      if (!discountableEntriesLeft) {
        discount = Math.max(0, totalDiscount - allocatedDiscount);
      } else {
        discount = Math.max(0, Math.round((entry.discountableGross / discountableBaseTotal) * totalDiscount));
        allocatedDiscount += discount;
      }
    }

    return {
      teacher: entry.teacher,
      sessions: entry.sessions,
      duration: entry.duration,
      gross: entry.gross,
      discount,
      net: Math.max(0, entry.gross - discount),
    };
  });
}

function renderTeacherPortionRows(portions) {
  if (!Array.isArray(portions) || portions.length === 0) {
    return '<tr><td colspan="4">Belum ada pembagian porsi pengajar.</td></tr>';
  }

  return portions
    .map(
      (row) => `
      <tr>
        <td>${escapeHtml(row.teacher || "-")}</td>
        <td>${Number(row.duration || 0).toFixed(2)} jam</td>
        <td>${Number(row.sessions || 0)}</td>
        <td>${formatRupiah(Number(row.net || 0))}</td>
      </tr>
    `
    )
    .join("");
}

function calculateInvoiceTotals(selectedSessions) {
  const baseTotal = selectedSessions.reduce((sum, s) => sum + s.subtotal, 0);
  const totalDurasi = selectedSessions.reduce((sum, s) => sum + s.durasi, 0);
  const nonPrivateSessions = selectedSessions.filter((s) => Number(s?.pesertaCount || 1) > 1);
  const nonPrivateDurasi = nonPrivateSessions.reduce((sum, s) => sum + Number(s?.durasi || 0), 0);
  const discountableBaseTotal = nonPrivateSessions.reduce((sum, s) => sum + Number(s?.subtotal || 0), 0);
  const diskonPersen = nonPrivateDurasi > 0 ? pickDiskonByDurasi(nonPrivateDurasi) : 0;
  const diskonNominal = (discountableBaseTotal * diskonPersen) / 100;
  const grandTotal = Math.max(0, baseTotal - diskonNominal);
  return { baseTotal, totalDurasi, discountableBaseTotal, nonPrivateDurasi, diskonPersen, diskonNominal, grandTotal };
}

function parseMasterStudents(rows) {
  if (!rows || rows.length < 2) return [];

  const headers = (rows[0] || []).map((x) => String(x || "").trim().toLowerCase());
  const idxFullName = findHeaderIndex(headers, ["nama lengkap siswa"]);
  const idxNick = findHeaderIndex(headers, ["nama panggilan siswa"]);
  const idxGender = findHeaderIndex(headers, ["l/p", "gender", "jenis kelamin"]);
  const idxKelas = findHeaderIndex(headers, ["kelas"]);
  const idxH1 = findHeaderIndex(headers, ["h1"]);
  const idxNextGrade = findHeaderIndex(headers, ["kelas selanjutnya"]);
  const idxH2 = findHeaderIndex(headers, ["h2"]);
  const idxSekolah = findHeaderIndex(headers, ["sekolah"]);
  const idxStudentWa = findHeaderIndex(headers, ["nomor whatsapp siswa", "nomor whatsapp", "whatsapp siswa"]);
  const idxParent = findHeaderIndex(headers, ["nama orang tua", "wali"]);
  const idxParentWa = findHeaderIndex(headers, ["nomor whatsapp orang tua", "whatsapp orang tua"]);
  const idxHistory = findHeaderIndex(headers, ["riwayat les"]);
  if (idxFullName === -1 && idxNick === -1) return [];

  const out = [];
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const fullName = String(row[idxFullName] || "").trim();
    const nickname = String(row[idxNick] || "").trim() || deriveNicknameFromFullName(fullName);
    if (!nickname) continue;

    out.push({
      fullName,
      nickname,
      gender: String(idxGender >= 0 ? row[idxGender] : "").trim(),
      kelas: String(idxKelas >= 0 ? row[idxKelas] : "").trim(),
      h1: String(idxH1 >= 0 ? row[idxH1] : "").trim(),
      nextGrade: String(idxNextGrade >= 0 ? row[idxNextGrade] : "").trim(),
      h2: String(idxH2 >= 0 ? row[idxH2] : "").trim(),
      sekolah: String(idxSekolah >= 0 ? row[idxSekolah] : "").trim(),
      studentWhatsapp: String(idxStudentWa >= 0 ? row[idxStudentWa] : "").trim(),
      parentName: String(idxParent >= 0 ? row[idxParent] : "").trim(),
      parentWhatsapp: String(idxParentWa >= 0 ? row[idxParentWa] : "").trim(),
      studyHistory: String(idxHistory >= 0 ? row[idxHistory] : "").trim(),
    });
  }

  return dedupeByNickname(makeNicknamesUnique(out));
}

function deriveNicknameFromFullName(fullName) {
  const words = String(fullName || "")
    .trim()
    .split(/\s+/)
    .map((x) => x.replace(/[^A-Za-z0-9'.-]/g, "").trim())
    .filter(Boolean);
  if (words.length === 0) return "";
  const candidate = words.find((w) => w.length > 2) || words[0];
  return candidate || "";
}

function makeNicknamesUnique(students) {
  const used = new Set();
  return students.map((student) => {
    const base = String(student.nickname || deriveNicknameFromFullName(student.fullName) || student.fullName || "").trim();
    let next = base || "Siswa";
    let bump = 2;
    while (used.has(normalizeName(next))) {
      const words = String(student.fullName || "").trim().split(/\s+/).filter(Boolean);
      if (bump === 2 && words.length > 1) {
        next = `${words[0]} ${words[1]}`;
      } else {
        next = `${base} ${bump - 1}`;
      }
      bump += 1;
    }
    used.add(normalizeName(next));
    return { ...student, nickname: next };
  });
}

function generateStudentId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `stu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function generateAttendanceId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `att_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeAttendanceStatus(value) {
  const normalized = String(value || "hadir").trim().toLowerCase();
  if (["izin", "sakit"].includes(normalized)) return normalized;
  return "hadir";
}

function normalizeAttendanceEntry(entry = {}, fallbackId = "") {
  const attendanceId = String(entry.attendanceId || fallbackId || generateAttendanceId()).trim();
  return {
    attendanceId,
    tanggal: String(entry.tanggal || "").trim(),
    studentId: String(entry.studentId || "").trim(),
    studentName: String(entry.studentName || "").trim(),
    status: normalizeAttendanceStatus(entry.status || "hadir"),
    jamMulai: String(entry.jamMulai || "").trim(),
    jamSelesai: String(entry.jamSelesai || "").trim(),
    pengajar: String(entry.pengajar || "-").trim() || "-",
    pesertaCount: Math.max(1, Number.parseInt(String(entry.pesertaCount || "1"), 10) || 1),
    topik: String(entry.topik || "-").trim() || "-",
    catatan: String(entry.catatan || "").trim(),
  };
}

function sortAttendanceEntries(entries = []) {
  return [...entries].sort((a, b) => {
    const timeA = parseDateInput(String(a.tanggal || ""))?.getTime?.() || 0;
    const timeB = parseDateInput(String(b.tanggal || ""))?.getTime?.() || 0;
    if (timeA !== timeB) return timeB - timeA;
    const startA = parseTimeToMinutes(String(a.jamMulai || ""));
    const startB = parseTimeToMinutes(String(b.jamMulai || ""));
    if (startA >= 0 && startB >= 0 && startA !== startB) return startA - startB;
    return String(a.studentName || "").localeCompare(String(b.studentName || ""), "id");
  });
}

function normalizeGradeNumber(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return null;
  if (raw === "alumni") return 13;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 13) return null;
  return parsed;
}

function getSchoolLevelFromGradeNumber(gradeNumber) {
  if (!Number.isInteger(gradeNumber)) return "";
  if (gradeNumber >= 1 && gradeNumber <= 6) return "SD";
  if (gradeNumber >= 7 && gradeNumber <= 9) return "SMP";
  if (gradeNumber >= 10 && gradeNumber <= 12) return "SMA";
  if (gradeNumber === 13) return "Alumni";
  return "";
}

function getStudentGradeProfile(kelasValue) {
  const gradeNumber = normalizeGradeNumber(kelasValue);
  if (!Number.isInteger(gradeNumber)) {
    return {
      gradeNumber: null,
      kelas: String(kelasValue || "").trim(),
      h1: "",
      nextGrade: "",
      h2: "",
    };
  }
  const nextGradeNumber = Math.min(13, gradeNumber + 1);
  return {
    gradeNumber,
    kelas: String(gradeNumber),
    h1: getSchoolLevelFromGradeNumber(gradeNumber),
    nextGrade: String(nextGradeNumber),
    h2: getSchoolLevelFromGradeNumber(nextGradeNumber),
  };
}

function syncStudentFormGradeDerivedFields() {
  const profile = getStudentGradeProfile(el.studentFormKelas?.value || "");
  if (el.studentFormKelas && profile.kelas) {
    el.studentFormKelas.value = profile.kelas;
  }
  if (el.studentFormH1) el.studentFormH1.textContent = profile.h1 || "-";
  if (el.studentFormNextGrade) el.studentFormNextGrade.textContent = profile.nextGrade || "-";
  if (el.studentFormH2) el.studentFormH2.textContent = profile.h2 || "-";
}

function applyInvoiceDateFromAttendanceDate(isoDate) {
  const text = String(isoDate || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || !el.invoiceDate) return;
  const existing = parseDateInput(String(el.invoiceDate.value || ""));
  const now = getCurrentTimeInZone();
  const hour = existing ? existing.getHours() : now.getHours();
  const minute = existing ? existing.getMinutes() : now.getMinutes();
  const second = existing ? existing.getSeconds() : now.getSeconds();
  const next = new Date(`${text}T00:00:00`);
  next.setHours(hour, minute, second, 0);
  el.invoiceDate.value = toLocalDateTimeInputValue(next);
}

function buildInvoiceNumber(invoiceDate, studentRecord, studentName) {
  const datePart = `${invoiceDate.getFullYear()}${String(invoiceDate.getMonth() + 1).padStart(2, "0")}${String(invoiceDate.getDate()).padStart(2, "0")}`;
  const nicknameSource = String(studentName || studentRecord?.nickname || studentRecord?.fullName || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const nicknameKey = nicknameSource.slice(0, 12) || "SISWA";
  const gradeProfile = getStudentGradeProfile(studentRecord?.kelas || "");
  const gradeKey = gradeProfile.kelas || "00";
  const idDigits = String(studentRecord?.studentId || "").replace(/\D/g, "");
  const studentIdKey = (idDigits.slice(0, 5) || "00000").padEnd(5, "0");
  return `INV-${datePart}-${nicknameKey}-${gradeKey}-${studentIdKey}`;
}

function studentFingerprint(student) {
  return [student?.fullName || "", student?.nickname || ""]
    .map((x) => normalizeName(x))
    .join("|");
}

function createStudentRecord(student = {}, fallbackId = "") {
  const gradeProfile = getStudentGradeProfile(student.kelas || "");
  return {
    studentId: String(student.studentId || fallbackId || generateStudentId()).trim(),
    fullName: String(student.fullName || "").trim(),
    nickname: String(student.nickname || "").trim() || deriveNicknameFromFullName(String(student.fullName || "")),
    gender: String(student.gender || "").trim(),
    kelas: gradeProfile.kelas || String(student.kelas || "").trim(),
    h1: gradeProfile.h1 || String(student.h1 || "").trim(),
    nextGrade: gradeProfile.nextGrade || String(student.nextGrade || "").trim(),
    h2: gradeProfile.h2 || String(student.h2 || "").trim(),
    sekolah: String(student.sekolah || "").trim(),
    studentWhatsapp: String(student.studentWhatsapp || "").trim(),
    parentName: String(student.parentName || "").trim(),
    parentWhatsapp: String(student.parentWhatsapp || "").trim(),
    studyHistory: String(student.studyHistory || "").trim(),
  };
}

function normalizeStudentRecord(student = {}, fallbackId = "") {
  const normalized = createStudentRecord(student, fallbackId);
  return {
    ...normalized,
    studentId: normalized.studentId || generateStudentId(),
  };
}

function rebuildStudentIndexes(list) {
  state.studentsByNickname = new Map(list.map((s) => [normalizeName(s.nickname), s]));
  state.studentsByFullName = new Map(list.filter((s) => s.fullName).map((s) => [normalizeName(s.fullName), s]));
  state.studentsById = new Map(list.filter((s) => s.studentId).map((s) => [String(s.studentId), s]));
}

function syncStudentCsvSnapshot(list, { syncEditors = false } = {}) {
  state.sourceTexts.students = serializeStudentsToCsv(list);
  fillStudentSelect(list.map((s) => s.nickname));
  renderStudentDetail();
  if (syncEditors) syncCsvEditorsFromState();
}

function setStudentList(list, { sort = false, syncEditors = false } = {}) {
  let next = (list || [])
    .map((student) => normalizeStudentRecord(student))
    .filter((student) => student.nickname || student.fullName || student.kelas || student.sekolah || student.parentName);

  next = makeNicknamesUnique(next);
  if (sort) next = sortStudentsByNickname(next);

  state.students = next;
  rebuildStudentIndexes(next);
  syncStudentCsvSnapshot(next, { syncEditors });
}

function getStudentRecordById(studentId) {
  return state.studentsById.get(String(studentId || "")) || null;
}

function getSelectedStudentRecord() {
  const raw = String(el.studentSelect?.value || "").trim();
  if (!raw) return null;
  return state.studentsByNickname.get(normalizeName(raw))
    || state.studentsByFullName.get(normalizeName(raw))
    || state.studentsById.get(raw)
    || null;
}

function getStudentRecordFromInvoice(item) {
  return getStudentRecordById(item?.studentId)
    || getStudentRecordById(item?.studentDetail?.studentId)
    || state.studentsByNickname.get(normalizeName(item?.student || ""))
    || state.studentsByFullName.get(normalizeName(item?.studentDetail?.fullName || ""))
    || null;
}

function renderStudentHardDeleteOptions() {
  if (!el.studentHardDeleteSelect) return;
  const options = (state.students || [])
    .slice()
    .sort((a, b) => String(a.nickname || "").localeCompare(String(b.nickname || ""), "id"))
    .map((student) => `<option value="${escapeHtml(student.studentId || "")}">${escapeHtml(student.nickname || student.fullName || "-")} (${escapeHtml(student.kelas || "-")})</option>`);

  el.studentHardDeleteSelect.innerHTML = ['<option value="">- Pilih siswa -</option>', ...options].join("");
}

function renderStudentHardDeletePreview(studentId) {
  if (!el.studentHardDeletePreview) return;
  const student = getStudentRecordById(studentId);
  if (!student) {
    el.studentHardDeletePreview.innerHTML = "Preview siswa akan muncul di sini.";
    return;
  }

  el.studentHardDeletePreview.innerHTML = [
    `<strong>${escapeHtml(student.nickname || student.fullName || "-")}</strong>`,
    `ID: ${escapeHtml(student.studentId || "-")}`,
    `Nama Lengkap: ${escapeHtml(student.fullName || "-")}`,
    `Kelas: ${escapeHtml(student.kelas || "-")}`,
    `Sekolah: ${escapeHtml(student.sekolah || "-")}`,
    `Orang Tua/Wali: ${escapeHtml(student.parentName || "-")}`,
  ].join("<br/>");
}

function openStudentFormForCreate() {
  state.studentFormEditIndex = -1;
  el.studentCreateForm?.reset();
  if (el.studentFormKelas) el.studentFormKelas.value = "10";
  syncStudentFormGradeDerivedFields();
  if (el.studentFormTitle) el.studentFormTitle.textContent = "Tambah Siswa Baru";
  el.studentCreateModal?.showModal();
}

function openStudentFormForEdit(sourceIndex) {
  const row = state.students?.[sourceIndex];
  if (!row) return;
  state.studentFormEditIndex = sourceIndex;
  if (el.studentFormTitle) el.studentFormTitle.textContent = "Edit Detail Siswa";
  if (el.studentFormFullName) el.studentFormFullName.value = String(row.fullName || "");
  if (el.studentFormNickname) el.studentFormNickname.value = String(row.nickname || "");
  if (el.studentFormGender) el.studentFormGender.value = String(row.gender || "");
  if (el.studentFormKelas) el.studentFormKelas.value = String(row.kelas || "");
  syncStudentFormGradeDerivedFields();
  if (el.studentFormSekolah) el.studentFormSekolah.value = String(row.sekolah || "");
  if (el.studentFormStudentWa) el.studentFormStudentWa.value = String(row.studentWhatsapp || "");
  if (el.studentFormParentName) el.studentFormParentName.value = String(row.parentName || "");
  if (el.studentFormParentWa) el.studentFormParentWa.value = String(row.parentWhatsapp || "");
  if (el.studentFormStudyHistory) el.studentFormStudyHistory.value = String(row.studyHistory || "");
  el.studentCreateModal?.showModal();
}

function getStudentDisplayName(studentName, detail = null) {
  const raw = String(studentName || "").trim();
  if (!raw) return "-";

  const byNick = state.studentsByNickname.get(normalizeName(raw));
  if (byNick?.nickname) return byNick.nickname;

  const detailFullName = String(detail?.fullName || "").trim();
  const byFullName = state.studentsByFullName.get(normalizeName(raw))
    || state.studentsByFullName.get(normalizeName(detailFullName));
  if (byFullName?.nickname) return byFullName.nickname;

  return deriveNicknameFromFullName(raw) || raw;
}

function parseTarifCsv(rows) {
  const map = { weekdays: {}, saturday: {}, sunday: {} };
  if (!rows || rows.length === 0) return map;

  let start = 0;
  const first = (rows[0] || []).map((x) => String(x || "").trim().toLowerCase());
  if (first.includes("jenis_hari")) start = 1;

  for (let i = start; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const day = String(row[0] || "").trim().toLowerCase();
    const peserta = Number.parseInt(String(row[1] || "").replace(/\D/g, ""), 10);
    const tarif = parseCurrency(row[2] || "");

    if (!day || !Number.isFinite(peserta) || peserta <= 0 || !Number.isFinite(tarif) || tarif <= 0) continue;

    let key = "weekdays";
    if (day.includes("sabtu")) key = "saturday";
    if (day.includes("minggu")) key = "sunday";
    map[key][peserta] = tarif;
  }

  return map;
}

function parseDiscountCsv(rows) {
  if (!rows || rows.length === 0) return [];
  let start = 0;
  const first = (rows[0] || []).map((x) => String(x || "").trim().toLowerCase());
  if (first.includes("min_durasi")) start = 1;

  const out = [];
  for (let i = start; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const min = Number.parseFloat(String(row[0] || "").replace(",", "."));
    const max = Number.parseFloat(String(row[1] || "").replace(",", "."));
    const persen = Number.parseFloat(String(row[2] || "").replace(",", "."));
    if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(persen)) continue;
    out.push({ min, max, persen });
  }

  return out.sort((a, b) => a.min - b.min);
}

function parseBankRows(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = (rows[0] || []).map((x) => String(x || "").trim().toLowerCase());
  const idxGuru = headers.findIndex((h) => h.includes("pengajar") || h.includes("guru"));
  const idxLabel = headers.findIndex((h) => h.includes("label"));
  const idxBank = headers.findIndex((h) => h === "bank" || h.includes("nama bank"));
  const idxNomor = headers.findIndex((h) => h.includes("nomor") && h.includes("rekening"));
  const idxAtasNama = headers.findIndex((h) => h.includes("atas"));

  if (idxGuru === -1 || idxBank === -1 || idxNomor === -1) return [];

  const out = [];
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const namaPengajar = String(row[idxGuru] || "").trim();
    const bank = String(row[idxBank] || "").trim();
    const nomor = String(row[idxNomor] || "").trim();
    if (!namaPengajar || !bank || !nomor) continue;

    out.push({
      namaPengajar,
      label: String(row[idxLabel] || "Utama").trim() || "Utama",
      bank,
      nomor,
      atasNama: String(row[idxAtasNama] || namaPengajar).trim() || namaPengajar,
    });
  }

  return out;
}

function parseHolidayCsv(rows) {
  const entries = parseHolidayEntries(rows);
  const set = new Set(entries.filter((x) => x.label === "libur nasional").map((x) => x.date));
  return [...set].sort();
}

function parseHolidayEntries(rows) {
  if (!rows || rows.length === 0) return [];

  const header = (rows[0] || []).map((x) => String(x || "").trim().toLowerCase());
  const idxTanggal = header.findIndex((h) => h.includes("tanggal") || h.includes("date"));
  const idxNama = header.findIndex((h) => h === "nama" || h.includes("name") || h.includes("libur"));
  const idxJenis = header.findIndex((h) => h.includes("jenis") || h.includes("type"));
  const hasHeader = idxTanggal >= 0 || idxNama >= 0 || idxJenis >= 0;
  const start = hasHeader ? 1 : 0;

  const out = [];
  for (let i = start; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const rawDate = String(idxTanggal >= 0 ? row[idxTanggal] : row[0] || "").trim();
    if (!isValidIsoDate(rawDate)) continue;
    const rawName = String(idxNama >= 0 ? row[idxNama] : row[1] || "").trim();
    const rawJenis = String(idxJenis >= 0 ? row[idxJenis] : "").trim();
    const label = normalizeHolidayLabel(rawJenis || rawName);
    out.push({ date: rawDate, name: rawName, label });
  }

  return out;
}

function normalizeHolidayLabel(text) {
  const key = String(text || "").trim().toLowerCase();
  if (key.includes("cuti") || key.includes("collective")) return "cuti bersama";
  return "libur nasional";
}

function buildHolidayInfoMap(entries) {
  const map = new Map();
  for (const item of entries || []) {
    if (!item?.date) continue;
    const prev = map.get(item.date) || { labels: [] };
    if (!prev.labels.includes(item.label)) prev.labels.push(item.label);
    map.set(item.date, prev);
  }
  return map;
}

function getHolidayLabels(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return [];
  const key = toLocalDateInputValue(date);
  const info = state.holidayInfoMap?.get(key);
  const labels = info?.labels?.length ? [...info.labels] : (state.holidaySet?.has(key) ? ["libur nasional"] : []);
  if (isWeekendDate(date) && !labels.includes("akhir pekan")) {
    labels.push("akhir pekan");
  }
  return labels;
}

function buildHolidayBadgeHtml(date) {
  const labels = getHolidayLabels(date);
  if (labels.length === 0) return "";
  return `
    <div class="holiday-badges">${labels
      .map((label) => {
        const klass = label === "cuti bersama" ? "cuti" : (label === "akhir pekan" ? "weekend" : "nasional");
        return `<span class="holiday-chip ${klass}">${escapeHtml(label)}</span>`;
      })
      .join("")}</div>
  `;
}

function isWeekendDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return false;
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHolidayLikeDate(date) {
  return isPublicHoliday(date) || isWeekendDate(date);
}

function pickTarif(hari, pesertaCount, date) {
  let key = "weekdays";

  if (isPublicHoliday(date)) {
    key = "sunday";
  } else {
    const h = normalizeName(hari);
    if (h.includes("sabtu")) key = "saturday";
    if (h.includes("minggu")) key = "sunday";
  }

  const map = state.tarif[key] || {};
  const direct = map[pesertaCount];
  if (direct) return direct;

  const keys = Object.keys(map).map(Number).sort((a, b) => a - b);
  if (keys.length === 0) return 0;

  const nearest = keys.find((k) => pesertaCount <= k);
  return map[nearest || keys[keys.length - 1]];
}

function isPublicHoliday(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return false;
  const key = toLocalDateInputValue(date);
  return state.holidaySet.has(key);
}

function pickDiskonByDurasi(durasi) {
  for (const d of state.diskonDurasi) {
    if (durasi >= d.min && durasi <= d.max) return d.persen;
  }
  return 0;
}

function hasTarif(map) {
  return ["weekdays", "saturday", "sunday"].some((k) => Object.keys(map[k] || {}).length > 0);
}

function fillStudentSelect(list) {
  const sorted = [...list].sort((a, b) => String(a || "").localeCompare(String(b || ""), "id"));
  const opts = [];
  sorted.forEach((name) => opts.push(`<option value="${escapeHtml(name)}"></option>`));
  if (el.studentOptions) el.studentOptions.innerHTML = opts.join("");
}

function getSelectedStudentName() {
  const raw = String(el.studentSelect.value || "").trim();
  if (!raw) return "";
  const exact = state.studentsByNickname.get(normalizeName(raw));
  if (exact) return exact.nickname;
  const lower = normalizeName(raw);
  const prefix = state.students.find((s) => normalizeName(s.nickname).startsWith(lower));
  return prefix ? prefix.nickname : raw;
}

function parseCsv(content) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];

    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (ch === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += ch;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows;
}

function parseDateFlex(text) {
  const fixed = String(text || "").replace(/\s+/g, " ").trim();
  const direct = new Date(fixed);
  if (!Number.isNaN(direct.getTime())) return direct;

  const match = fixed.match(/^(\d{1,2})\s([A-Za-z]+)\s(\d{2,4})$/);
  if (!match) return null;

  const day = Number.parseInt(match[1], 10);
  const month = parseMonth(match[2]);
  let year = Number.parseInt(match[3], 10);
  if (year < 100) year += 2000;
  if (month < 0) return null;

  const d = new Date(year, month, day);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseMonth(name) {
  const m = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
    may: 4, mei: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7,
    sep: 8, sept: 8, september: 8, oct: 9, october: 9, okt: 9,
    nov: 10, november: 10, dec: 11, december: 11, des: 11,
  };
  return m[String(name || "").toLowerCase()] ?? -1;
}

function findHeaderIndex(headers, candidates) {
  const wants = candidates.map((c) => c.toLowerCase());
  return headers.findIndex((h) => wants.some((w) => String(h || "").toLowerCase().includes(w)));
}

function normalizeHeader(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function normalizeName(text) {
  return String(text || "").trim().toLowerCase();
}

function parseCurrency(text) {
  const cleaned = String(text || "").replace(/[^0-9,.-]/g, "").replace(/,/g, "");
  const val = Number.parseFloat(cleaned);
  return Number.isFinite(val) ? val : 0;
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
  const d = new Date(`${value}T00:00:00`);
  return !Number.isNaN(d.getTime()) && toLocalDateInputValue(d) === value;
}

function parseIntFromText(text) {
  const n = Number.parseInt(String(text || "").replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function formatTanggal(date) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatTanggalPanjang(date) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function formatTanggalWaktu(date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatRupiah(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(num) ? num : 0);
}

function formatJamRange(start, end) {
  if (!start || start === "-" || !end || end === "-") return "-";
  return `${start} - ${end}`;
}

function calculateDuration(start, end) {
  const startM = parseTimeToMinutes(start);
  const endM = parseTimeToMinutes(end);
  if (startM < 0 || endM < 0 || endM <= startM) return 0;
  return (endM - startM) / 60;
}

function parseTimeToMinutes(text) {
  const parts = String(text || "").split(":");
  if (parts.length !== 2) return -1;
  const h = Number.parseInt(parts[0], 10);
  const m = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return -1;
  return h * 60 + m;
}

function minutesToTimeText(totalMinutes) {
  const dayMinutes = 24 * 60;
  const normalized = ((totalMinutes % dayMinutes) + dayMinutes) % dayMinutes;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function snapTimeToStep(text, stepMinutes = 15) {
  const min = parseTimeToMinutes(text);
  if (min < 0) return String(text || "");
  const snapped = Math.round(min / stepMinutes) * stepMinutes;
  return minutesToTimeText(snapped);
}

function parseDateInput(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function dedupeByNickname(list) {
  const seen = new Set();
  const out = [];
  for (const row of list) {
    const key = normalizeName(row.nickname);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

function sortStudentsByNickname(students) {
  return [...students].sort((a, b) => String(a.nickname || "").localeCompare(String(b.nickname || ""), "id"));
}

async function fetchCsv(url, errorMessage) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(errorMessage || "Gagal mengambil file CSV.");
  return res.text();
}

function toGoogleSheetCsvUrl(inputUrl) {
  let url;
  try {
    url = new URL(inputUrl);
  } catch {
    throw new Error("URL Google Sheet tidak valid.");
  }

  if (!url.hostname.includes("docs.google.com") || !url.pathname.includes("/spreadsheets/")) {
    throw new Error("URL bukan Google Sheet.");
  }

  const idMatch = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/);
  if (!idMatch) throw new Error("Spreadsheet ID tidak ditemukan.");

  const gid = url.searchParams.get("gid") || (url.hash.match(/gid=(\d+)/)?.[1] ?? "0");
  return `https://docs.google.com/spreadsheets/d/${idMatch[1]}/export?format=csv&gid=${gid}`;
}

function toGoogleSheetCsvUrlBySheetName(inputUrl, sheetName) {
  let url;
  try {
    url = new URL(inputUrl);
  } catch {
    throw new Error("URL Google Sheet tidak valid.");
  }

  if (!url.hostname.includes("docs.google.com") || !url.pathname.includes("/spreadsheets/")) {
    throw new Error("URL bukan Google Sheet.");
  }

  const idMatch = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/);
  if (!idMatch) throw new Error("Spreadsheet ID tidak ditemukan.");

  return `https://docs.google.com/spreadsheets/d/${idMatch[1]}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

async function readAnyTableFile(file) {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".xlsx")) {
    if (typeof XLSX === "undefined") throw new Error("Library XLSX tidak tersedia.");
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
  }
  return parseCsv(await file.text());
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toLocalDateInputValue(date) {
  const tzOffsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

function toLocalDateTimeInputValue(date) {
  const tzOffsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 19);
}

function toDateTimeLocalInputOrEmpty(value) {
  const parsed = parseDateInput(value);
  return parsed ? toLocalDateTimeInputValue(parsed) : "";
}

function isFileProtocol() {
  return window.location.protocol === "file:";
}

function clearPreview() {
  el.preview.innerHTML = '<div class="placeholder">Pratinjau invoice akan muncul di sini.</div>';
  el.btnDownloadPng.disabled = true;
  if (el.btnPreviewPng) el.btnPreviewPng.disabled = true;
}

function hydrateFirebaseConfigInputs() {
  const config = getPreferredFirebaseConfig();
  if (!config) return;

  el.firebaseApiKey.value = config.apiKey || "";
  el.firebaseAuthDomain.value = config.authDomain || "";
  el.firebaseProjectId.value = config.projectId || "";
  el.firebaseAppId.value = config.appId || "";
  el.firebaseMeasurementId.value = config.measurementId || "";
  state.firebase.config = config;
}

function loadFirebaseConfigFromStorage() {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function getPreferredFirebaseConfig() {
  const stored = loadFirebaseConfigFromStorage();
  if (!stored) return { ...DEFAULT_FIREBASE_CONFIG };
  return {
    ...DEFAULT_FIREBASE_CONFIG,
    ...stored,
  };
}

function getFirebaseConfigFromInputs(silent = false) {
  const preferred = getPreferredFirebaseConfig();
  const config = {
    apiKey: String(el.firebaseApiKey.value || preferred.apiKey || "").trim(),
    authDomain: String(el.firebaseAuthDomain.value || preferred.authDomain || "").trim(),
    projectId: String(el.firebaseProjectId.value || preferred.projectId || "").trim(),
    appId: String(el.firebaseAppId.value || preferred.appId || "").trim(),
  };

  if (preferred.storageBucket) config.storageBucket = preferred.storageBucket;
  if (preferred.messagingSenderId) config.messagingSenderId = preferred.messagingSenderId;

  const measurementId = String(el.firebaseMeasurementId.value || preferred.measurementId || "").trim();
  if (measurementId) config.measurementId = measurementId;

  const missing = ["apiKey", "authDomain", "projectId", "appId"].filter((key) => !config[key]);
  if (missing.length > 0) {
    if (!silent) {
      setFirebaseStatus("Isi API Key, Auth Domain, Project ID, dan App ID terlebih dahulu.", "warn");
      alert("Isi API Key, Auth Domain, Project ID, dan App ID Firebase terlebih dahulu.");
    }
    return null;
  }

  return config;
}

function persistFirebaseConfig(config) {
  state.firebase.config = config;
  try {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore storage failures
  }
}

function setFirebaseStatus(message, variant = "neutral") {
  if (!el.firebaseStatus) return;
  el.firebaseStatus.className = `firebase-status ${variant}`;
  el.firebaseStatus.textContent = message;
}

function setCloudReadyMode(ready) {
  document.body.classList.toggle("cloud-ready", Boolean(ready));
  if (ready) {
    if (el.localSourceControls) el.localSourceControls.open = false;
    if (el.firebaseSyncSection) el.firebaseSyncSection.open = false;
    if (el.firebaseCsvEditor) el.firebaseCsvEditor.open = false;
  }
  if (!el.cloudReadyNotice) return;
  if (ready) {
    el.cloudReadyNotice.classList.remove("hidden");
    el.cloudReadyNotice.innerHTML = "<strong>Cloud Mode Aktif</strong><br/>Data utama sekarang dari Firebase. CSV lokal tetap tersedia sebagai fallback file bawaan.";
    return;
  }
  el.cloudReadyNotice.classList.add("hidden");
  el.cloudReadyNotice.innerHTML = "";
}

function triggerCsvUpload(kind) {
  const input = getCsvUploadInputElement(kind);
  if (!input) throw new Error("Input upload CSV tidak ditemukan.");
  input.click();
}

function getCsvUploadInputElement(kind) {
  const map = {
    students: el.fileCsvUploadStudents,
    pricing: el.fileCsvUploadPricing,
    discount: el.fileCsvUploadDiscount,
    bank: el.fileCsvUploadBank,
    holiday: el.fileCsvUploadHoliday,
    attendance: el.fileCsvUploadAttendance,
    template_after: el.fileCsvUploadTemplateAfter,
  };
  return map[kind] || null;
}

function downloadSourceCsv(kind) {
  const editor = getCsvEditorElement(kind);
  const text = String(editor?.value || state.sourceTexts[kind] || "").trim();
  if (!text) throw new Error("CSV kosong. Tidak ada data untuk didownload.");

  const fileNameMap = {
    students: "REKAP DATA SISWA.csv",
    pricing: "tarif.csv",
    discount: "diskon_durasi.csv",
    bank: "bank_guru.csv",
    holiday: "hari_libur.csv",
    attendance: "attendance.csv",
    template_after: "template_payment_after.csv",
  };

  const blob = new Blob(["\uFEFF", text], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileNameMap[kind] || `${kind}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function getCsvEditorElement(kind) {
  const map = {
    students: el.csvEditorStudents,
    pricing: el.csvEditorPricing,
    discount: el.csvEditorDiscount,
    bank: el.csvEditorBank,
    holiday: el.csvEditorHoliday,
    attendance: el.csvEditorAttendance,
    template_after: el.csvEditorTemplateAfter,
  };
  return map[kind] || null;
}

function syncCsvEditorsFromState() {
  FIREBASE_SOURCE_KINDS.forEach((kind) => {
    const editor = getCsvEditorElement(kind);
    if (editor) editor.value = state.sourceTexts[kind] || "";
  });
}

function applyCsvFromEditor(kind) {
  const editor = getCsvEditorElement(kind);
  if (!editor) return;
  const csvText = String(editor.value || "").trim();
  if (!csvText) throw new Error("CSV kosong. Isi data terlebih dahulu.");

  if (kind === "students") {
    loadMasterStudentsCsv(csvText);
    return;
  }
  if (kind === "pricing") {
    applyPricingCsv(csvText, false);
    return;
  }
  if (kind === "discount") {
    applyDiscountCsv(csvText, false);
    return;
  }
  if (kind === "bank") {
    applyBankRows(parseCsv(csvText), false, csvText);
    return;
  }
  if (kind === "holiday") {
    applyHolidayCsv(csvText, false);
    return;
  }
  if (kind === "attendance") {
    loadAbsensiCsv(csvText);
    return;
  }
  if (kind === "template_after") {
    state.sourceTexts.template_after = csvText;
    return;
  }
}

function refreshFirebaseButtons() {
  const ready = Boolean(state.firebase.ready && state.firebase.db);
  if (el.btnFirebaseLoadSources) el.btnFirebaseLoadSources.disabled = !ready;
  if (el.btnFirebaseSaveSources) el.btnFirebaseSaveSources.disabled = !ready;
  if (el.btnFirebaseSaveInvoice) el.btnFirebaseSaveInvoice.disabled = !ready || !state.lastInvoiceRecord;
  if (el.btnRefreshInvoiceHistory) el.btnRefreshInvoiceHistory.disabled = !ready;
  if (el.btnApplyInvoiceHistoryFilter) el.btnApplyInvoiceHistoryFilter.disabled = !ready;
  if (el.invoiceHistoryStudentFilter) el.invoiceHistoryStudentFilter.disabled = !ready;
  if (el.invoiceHistoryPageSize) el.invoiceHistoryPageSize.disabled = !ready;
  if (el.btnInvoiceHistoryPrev) el.btnInvoiceHistoryPrev.disabled = !ready || state.invoiceHistoryQuery.cursorStack.length === 0;
  if (el.btnInvoiceHistoryNext) el.btnInvoiceHistoryNext.disabled = !ready || !state.invoiceHistoryQuery.hasNext;
  if (el.btnCalendarRefresh) el.btnCalendarRefresh.disabled = !ready;
  if (el.btnDownloadCalendarCurrentMonth) el.btnDownloadCalendarCurrentMonth.disabled = !ready;
  if (el.btnDownloadCalendarNextMonth) el.btnDownloadCalendarNextMonth.disabled = !ready;
  if (el.btnPaymentStatusRefresh) el.btnPaymentStatusRefresh.disabled = !ready;
  if (el.btnPaymentStatusAutoCancel) el.btnPaymentStatusAutoCancel.disabled = !ready;
  if (el.btnStudentManageHardDelete) el.btnStudentManageHardDelete.disabled = !ready;
  if (el.btnAttendanceInputSaveAll) el.btnAttendanceInputSaveAll.disabled = !ready;
  const saveButtons = [
    el.btnCsvSaveStudents,
    el.btnCsvSavePricing,
    el.btnCsvSaveDiscount,
    el.btnCsvSaveBank,
    el.btnCsvSaveHoliday,
    el.btnCsvSaveAttendance,
    el.btnCsvSaveTemplateAfter,
    el.btnStudentManageSaveFirebase,
    el.btnPricingManageSaveFirebase,
    el.btnDiscountManageSaveFirebase,
    el.btnBankManageSaveFirebase,
    el.btnHolidayManageSaveFirebase,
  ];
  saveButtons.forEach((btn) => {
    if (btn) btn.disabled = !ready;
  });
  renderInvoiceHistoryPaginationInfo();
}

function applyInvoiceHistoryFilterFromInputs() {
  const nextFilter = String(el.invoiceHistoryStudentFilter?.value || "").trim();
  const nextPageSizeRaw = Number.parseInt(String(el.invoiceHistoryPageSize?.value || "20"), 10);
  const nextPageSize = Number.isFinite(nextPageSizeRaw) ? Math.min(50, Math.max(1, nextPageSizeRaw)) : 20;

  state.invoiceHistoryQuery.studentFilter = nextFilter;
  state.invoiceHistoryQuery.pageSize = nextPageSize;
  state.invoiceHistoryQuery.cursorStack = [];
  state.invoiceHistoryQuery.currentPage = 1;
  state.invoiceHistoryQuery.lastVisibleDoc = null;
  state.invoiceHistoryQuery.hasNext = false;
}

async function applyInvoiceHistoryFilterAndReload() {
  applyInvoiceHistoryFilterFromInputs();
  await loadInvoiceHistory({ direction: "reset" });
}

function renderInvoiceHistoryPaginationInfo() {
  if (!el.invoiceHistoryPageInfo) return;
  const { currentPage, hasNext } = state.invoiceHistoryQuery;
  const nextHint = hasNext ? " | ada halaman berikutnya" : " | halaman terakhir";
  el.invoiceHistoryPageInfo.textContent = `Halaman ${currentPage}${nextHint}`;
}

async function bootstrapFirebaseFromStorage({ silent = true, forceServer = false } = {}) {
  const config = getPreferredFirebaseConfig();
  const missing = ["apiKey", "authDomain", "projectId", "appId"].filter((key) => !String(config?.[key] || "").trim());
  if (missing.length > 0) {
    setFirebaseStatus("Firebase belum dihubungkan.", "neutral");
    setCloudReadyMode(false);
    refreshFirebaseButtons();
    return false;
  }

  hydrateFirebaseConfigInputs();
  try {
    await connectFirebase({ saveConfig: true, loadSources: true, silent, forceServer });
    return true;
  } catch (err) {
    setFirebaseStatus(`Konfigurasi Firebase tersimpan, tetapi koneksi gagal: ${err.message}`, "warn");
    setCloudReadyMode(false);
    refreshFirebaseButtons();
    return false;
  }
}

async function connectFirebase({ saveConfig = false, loadSources = false, silent = false, forceServer = false } = {}) {
  const config = getFirebaseConfigFromInputs(silent);
  if (!config) throw new Error("Konfigurasi Firebase belum lengkap.");

  if (typeof firebase === "undefined") {
    throw new Error("SDK Firebase belum termuat. Pastikan koneksi internet aktif di GitHub Pages.");
  }

  if (saveConfig) persistFirebaseConfig(config);

  if (!firebase.apps.length) {
    state.firebase.app = firebase.initializeApp(config);
  } else {
    const currentOptions = firebase.app().options || {};
    const currentSignature = JSON.stringify({
      apiKey: currentOptions.apiKey || "",
      authDomain: currentOptions.authDomain || "",
      projectId: currentOptions.projectId || "",
      appId: currentOptions.appId || "",
      measurementId: currentOptions.measurementId || "",
    });
    const nextSignature = JSON.stringify(config);

    if (currentSignature !== nextSignature) {
      await firebase.app().delete();
      state.firebase.app = firebase.initializeApp(config);
    } else {
      state.firebase.app = firebase.app();
    }
  }

  state.firebase.auth = firebase.auth();
  state.firebase.db = firebase.firestore();
  await state.firebase.auth.signInAnonymously();
  state.firebase.user = state.firebase.auth.currentUser;
  state.firebase.config = config;
  state.firebase.ready = true;

  const userLabel = state.firebase.user?.isAnonymous ? "anonymous" : "signed-in";
  setFirebaseStatus(`Firebase terhubung (${userLabel}) ke project ${config.projectId}.`, "ok");
  setCloudReadyMode(true);
  refreshFirebaseButtons();

  if (loadSources) {
    await loadSourcesFromFirebase({ silent: true, forceServer });
  }

  await loadAttendanceEntriesFromFirebase({ forceServer });

  await loadInvoiceHistory({ silent: true, forceServer });
  await refreshDashboardInvoices({ forceServer });
}

function collectFirebaseSourcePayloads() {
  return FIREBASE_SOURCE_KINDS.filter((kind) => kind !== "students").map((kind) => {
    if (kind === "bank") {
      return { kind, csvText: state.sourceTexts.bank || serializeRowsToCsv(bankGuruToRows(state.bankGuru)) };
    }
    if (kind === "holiday") {
      return { kind, csvText: state.sourceTexts.holiday || String(el.holidayDates.value || "") };
    }
    return { kind, csvText: state.sourceTexts[kind] || "" };
  }).filter((item) => String(item.csvText || "").trim().length > 0);
}

async function loadStudentsFromFirebase({ silent = false, forceServer = false, legacyCsvText = "" } = {}) {
  const ownerUid = getFirebaseReadOwnerUidCandidates()[0];
  const snapshot = await firestoreGet(
    state.firebase.db.collection(FIREBASE_STUDENT_COLLECTION).where("ownerUid", "==", ownerUid),
    { forceServer }
  );

  if (snapshot.empty) {
    if (legacyCsvText.trim()) {
      loadMasterStudentsCsv(legacyCsvText);
      await saveStudentsToFirebase({ applyEditor: false, silent: true });
      if (!silent) alert("Data siswa dimigrasikan dari CSV lama ke koleksi student_details.");
      return true;
    }
    return false;
  }

  const rows = [];
  snapshot.forEach((doc) => {
    const data = doc.data() || {};
    const deletedAt = String(data.deletedAt || "").trim();
    if (deletedAt) return;
    rows.push(normalizeStudentRecord({
      studentId: String(data.studentId || doc.id.split("__").slice(1).join("__") || "").trim(),
      fullName: String(data.fullName || "").trim(),
      nickname: String(data.nickname || "").trim(),
      gender: String(data.gender || "").trim(),
      kelas: String(data.kelas || "").trim(),
      h1: String(data.h1 || "").trim(),
      nextGrade: String(data.nextGrade || "").trim(),
      h2: String(data.h2 || "").trim(),
      sekolah: String(data.sekolah || "").trim(),
      studentWhatsapp: String(data.studentWhatsapp || "").trim(),
      parentName: String(data.parentName || "").trim(),
      parentWhatsapp: String(data.parentWhatsapp || "").trim(),
      studyHistory: String(data.studyHistory || "").trim(),
    }, String(data.studentId || doc.id.split("__").slice(1).join("__") || "").trim()));
  });

  if (rows.length === 0 && legacyCsvText.trim()) {
    loadMasterStudentsCsv(legacyCsvText);
    await saveStudentsToFirebase({ applyEditor: false, silent: true });
    return true;
  }

  setStudentList(sortStudentsByNickname(rows), { sort: false, syncEditors: false });
  syncCsvEditorsFromState();
  return true;
}

async function saveStudentRecordToFirebase(student, { deleted = false } = {}) {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }

  const ownerUid = getFirebaseWriteOwnerUid();
  const next = normalizeStudentRecord(student, student?.studentId || "");
  const ref = state.firebase.db.collection(FIREBASE_STUDENT_COLLECTION).doc(`${ownerUid}__${next.studentId}`);
  const existing = await ref.get();
  const existingData = existing.exists ? (existing.data() || {}) : {};
  await ref.set(
    {
      studentId: next.studentId,
      fullName: next.fullName,
      nickname: next.nickname,
      gender: next.gender,
      kelas: next.kelas,
      h1: next.h1,
      nextGrade: next.nextGrade,
      h2: next.h2,
      sekolah: next.sekolah,
      studentWhatsapp: next.studentWhatsapp,
      parentName: next.parentName,
      parentWhatsapp: next.parentWhatsapp,
      studyHistory: next.studyHistory,
      deletedAt: deleted ? new Date().toISOString() : "",
      deletedBy: deleted ? ownerUid : "",
      ownerUid,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: existingData.createdAt || firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

async function softDeleteStudentRecord(student) {
  const current = normalizeStudentRecord(student, student?.studentId || "");
  if (!current.studentId) return;
  await saveStudentRecordToFirebase(current, { deleted: true });
}

async function hardDeleteStudentRecord(studentId) {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }
  const ownerUid = getFirebaseWriteOwnerUid();
  const safeId = String(studentId || "").trim();
  if (!safeId) throw new Error("studentId tidak valid.");
  await state.firebase.db.collection(FIREBASE_STUDENT_COLLECTION).doc(`${ownerUid}__${safeId}`).delete();
  setFirebaseStatus(`Student ${safeId} dihapus permanen.`, "ok");
}

async function saveStudentsToFirebase({ applyEditor = true, silent = false } = {}) {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }

  if (applyEditor) {
    applyCsvFromEditor("students");
  } else {
    normalizeStudentsState({ sort: false, syncEditors: true });
  }

  const ownerUid = getFirebaseWriteOwnerUid();
  const activeStudents = (state.students || []).map((student) => normalizeStudentRecord(student, student?.studentId || ""));
  const existingSnapshot = await firestoreGet(
    state.firebase.db.collection(FIREBASE_STUDENT_COLLECTION).where("ownerUid", "==", ownerUid),
    { forceServer: false }
  );

  const existingDocs = new Map();
  existingSnapshot.forEach((doc) => {
    const data = doc.data() || {};
    const id = String(data.studentId || doc.id.split("__").slice(1).join("__") || "").trim();
    if (!id) return;
    existingDocs.set(id, { id, data });
  });

  const batch = state.firebase.db.batch();
  const currentIds = new Set();

  activeStudents.forEach((student) => {
    const normalized = normalizeStudentRecord(student, student.studentId);
    currentIds.add(normalized.studentId);
    const ref = state.firebase.db.collection(FIREBASE_STUDENT_COLLECTION).doc(`${ownerUid}__${normalized.studentId}`);
    const existing = existingDocs.get(normalized.studentId)?.data || {};
    batch.set(
      ref,
      {
        studentId: normalized.studentId,
        fullName: normalized.fullName,
        nickname: normalized.nickname,
        gender: normalized.gender,
        kelas: normalized.kelas,
        h1: normalized.h1,
        nextGrade: normalized.nextGrade,
        h2: normalized.h2,
        sekolah: normalized.sekolah,
        studentWhatsapp: normalized.studentWhatsapp,
        parentName: normalized.parentName,
        parentWhatsapp: normalized.parentWhatsapp,
        studyHistory: normalized.studyHistory,
        deletedAt: "",
        deletedBy: "",
        ownerUid,
        createdAt: existing.createdAt || firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  existingDocs.forEach(({ data }, id) => {
    if (currentIds.has(id)) return;
    if (String(data.deletedAt || "").trim()) return;
    const ref = state.firebase.db.collection(FIREBASE_STUDENT_COLLECTION).doc(`${ownerUid}__${id}`);
    batch.set(
      ref,
      {
        studentId: id,
        deletedAt: new Date().toISOString(),
        deletedBy: ownerUid,
        ownerUid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  await batch.commit();
  setFirebaseStatus(`Data siswa tersimpan ke Firebase: ${activeStudents.length} baris aktif.`, "ok");
  refreshFirebaseButtons();
  if (!silent) return true;
  return true;
}

async function loadAttendanceEntriesFromFirebase({ forceServer = false } = {}) {
  if (!state.firebase.ready || !state.firebase.db) {
    state.attendanceEntries = [];
    renderAttendanceInputSection();
    renderAttendanceOperationsSection();
    return false;
  }

  const ownerUid = getFirebaseReadOwnerUidCandidates()[0];
  const snapshot = await firestoreGet(
    state.firebase.db.collection(FIREBASE_ATTENDANCE_COLLECTION).where("ownerUid", "==", ownerUid),
    { forceServer }
  );

  const rows = [];
  snapshot.forEach((doc) => {
    const data = doc.data() || {};
    if (String(data.deletedAt || "").trim()) return;
    rows.push(normalizeAttendanceEntry({
      attendanceId: String(data.attendanceId || doc.id.split("__").slice(1).join("__") || "").trim(),
      tanggal: String(data.tanggal || "").trim(),
      studentId: String(data.studentId || "").trim(),
      studentName: String(data.studentName || "").trim(),
      status: normalizeAttendanceStatus(data.status || "hadir"),
      jamMulai: String(data.jamMulai || "").trim(),
      jamSelesai: String(data.jamSelesai || "").trim(),
      pengajar: String(data.pengajar || "-").trim() || "-",
      pesertaCount: Math.max(1, Number.parseInt(String(data.pesertaCount || "1"), 10) || 1),
      topik: String(data.topik || "-").trim() || "-",
      catatan: String(data.catatan || "").trim(),
    }));
  });

  state.attendanceEntries = sortAttendanceEntries(rows);
  renderAttendanceInputSection();
  renderAttendanceOperationsSection();
  if (state.mode === "after") hydrateAfterSessionsForSelectedStudent();
  return true;
}

async function saveAttendanceEntryToFirebase(entry) {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }

  const ownerUid = getFirebaseWriteOwnerUid();
  const next = normalizeAttendanceEntry(entry, entry?.attendanceId || "");
  const ref = state.firebase.db.collection(FIREBASE_ATTENDANCE_COLLECTION).doc(`${ownerUid}__${next.attendanceId}`);
  const existing = await ref.get();
  const existingData = existing.exists ? (existing.data() || {}) : {};

  await ref.set(
    {
      attendanceId: next.attendanceId,
      tanggal: next.tanggal,
      studentId: next.studentId,
      studentName: next.studentName,
      status: next.status,
      jamMulai: next.jamMulai,
      jamSelesai: next.jamSelesai,
      pengajar: next.pengajar,
      pesertaCount: next.pesertaCount,
      topik: next.topik,
      catatan: next.catatan,
      deletedAt: "",
      ownerUid,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: existingData.createdAt || firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  setFirebaseStatus(`Attendance ${next.attendanceId} tersimpan.`, "ok");
}

async function deleteAttendanceEntryFromFirebase(attendanceId) {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }
  const ownerUid = getFirebaseWriteOwnerUid();
  const safeId = String(attendanceId || "").trim();
  if (!safeId) throw new Error("attendanceId tidak valid.");
  await state.firebase.db.collection(FIREBASE_ATTENDANCE_COLLECTION).doc(`${ownerUid}__${safeId}`).delete();
  setFirebaseStatus(`Attendance ${safeId} dihapus.`, "ok");
}

async function saveAllAttendanceEntriesToFirebase() {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }
  const ownerUid = getFirebaseWriteOwnerUid();
  const list = sortAttendanceEntries((state.attendanceEntries || []).map((item) => normalizeAttendanceEntry(item, item?.attendanceId || "")));
  state.attendanceEntries = list;
  renderAttendanceInputSection();

  const existingSnapshot = await firestoreGet(
    state.firebase.db.collection(FIREBASE_ATTENDANCE_COLLECTION).where("ownerUid", "==", ownerUid),
    { forceServer: false }
  );

  const existingIds = new Set();
  existingSnapshot.forEach((doc) => {
    const data = doc.data() || {};
    const id = String(data.attendanceId || doc.id.split("__").slice(1).join("__") || "").trim();
    if (!id) return;
    existingIds.add(id);
  });

  const currentIds = new Set(list.map((item) => String(item.attendanceId || "").trim()).filter(Boolean));
  const batch = state.firebase.db.batch();

  list.forEach((item) => {
    const ref = state.firebase.db.collection(FIREBASE_ATTENDANCE_COLLECTION).doc(`${ownerUid}__${item.attendanceId}`);
    batch.set(
      ref,
      {
        attendanceId: item.attendanceId,
        tanggal: item.tanggal,
        studentId: item.studentId,
        studentName: item.studentName,
        status: item.status,
        jamMulai: item.jamMulai,
        jamSelesai: item.jamSelesai,
        pengajar: item.pengajar,
        pesertaCount: item.pesertaCount,
        topik: item.topik,
        catatan: item.catatan,
        deletedAt: "",
        ownerUid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  existingIds.forEach((id) => {
    if (currentIds.has(id)) return;
    const ref = state.firebase.db.collection(FIREBASE_ATTENDANCE_COLLECTION).doc(`${ownerUid}__${id}`);
    batch.delete(ref);
  });

  await batch.commit();
  setFirebaseStatus(`Attendance tersimpan: ${list.length} baris.`, "ok");
  renderAttendanceOperationsSection();
  if (state.mode === "after") hydrateAfterSessionsForSelectedStudent();
}

async function firestoreGet(queryRef, { forceServer = false } = {}) {
  if (!forceServer) return queryRef.get();
  try {
    return await queryRef.get({ source: "server" });
  } catch {
    return queryRef.get();
  }
}

function getFirebaseWriteOwnerUid() {
  return FIREBASE_SHARED_OWNER_UID;
}

function getFirebaseReadOwnerUidCandidates() {
  return [FIREBASE_SHARED_OWNER_UID];
}

async function loadSourcesFromFirebase({ silent = false, forceServer = false } = {}) {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }

  const ownerCandidates = getFirebaseReadOwnerUidCandidates();
  let snapshot = null;
  let resolvedOwnerUid = "";
  for (const ownerUid of ownerCandidates) {
    const next = await firestoreGet(
      state.firebase.db.collection(FIREBASE_SOURCE_COLLECTION).where("ownerUid", "==", ownerUid),
      { forceServer }
    );
    if (!next.empty) {
      snapshot = next;
      resolvedOwnerUid = ownerUid;
      break;
    }
    if (!snapshot) snapshot = next;
  }

  if (!snapshot) {
    throw new Error("Gagal memuat source dari Firebase.");
  }

  if (snapshot.empty) {
    const fallbackLoaded = await loadBundledFallbackSources();
    if (fallbackLoaded.length > 0) {
      setFirebaseStatus(`Firebase kosong. Fallback lokal dimuat: ${fallbackLoaded.join(", ")}.`, "ok");
      if (!silent) alert(`Firebase belum punya source. Fallback lokal dimuat: ${fallbackLoaded.join(", ")}`);
      refreshFirebaseButtons();
      return;
    }

    setFirebaseStatus("Belum ada data di shared cloud dan fallback lokal juga tidak terbaca. Simpan data dari sesi utama sekali untuk bootstrap.", "warn");
    if (!silent) alert("Belum ada data di shared cloud dan fallback lokal tidak terbaca. Buka sesi utama lalu klik Simpan Data ke Firebase sekali.");
    refreshFirebaseButtons();
    return;
  }

  const docsByKind = {};
  snapshot.forEach((doc) => {
    const data = doc.data() || {};
    const fallbackKind = String(doc.id || "").split("__").pop();
    const kind = String(data.kind || fallbackKind || "").trim().toLowerCase();
    if (!kind) return;
    docsByKind[kind] = data;
  });

  const loaded = [];
  if (await loadStudentsFromFirebase({ silent: true, forceServer, legacyCsvText: docsByKind.students?.csvText || "" })) {
    loaded.push("siswa");
  }
  if (docsByKind.pricing?.csvText) {
    applyPricingCsv(docsByKind.pricing.csvText, false);
    loaded.push("tarif");
  }
  if (docsByKind.discount?.csvText) {
    applyDiscountCsv(docsByKind.discount.csvText, false);
    loaded.push("diskon");
  }
  if (docsByKind.bank?.csvText) {
    applyBankRows(parseCsv(docsByKind.bank.csvText), false, docsByKind.bank.csvText);
    loaded.push("rekening");
  }
  if (docsByKind.holiday?.csvText) {
    applyHolidayCsv(docsByKind.holiday.csvText, false);
    loaded.push("libur");
  }
  if (docsByKind.attendance?.csvText) {
    loadAbsensiCsv(docsByKind.attendance.csvText);
    loaded.push("absensi");
  }
  if (docsByKind.template_after?.csvText) {
    state.sourceTexts.template_after = docsByKind.template_after.csvText;
    loaded.push("template payment after");
  }

  syncCsvEditorsFromState();

  if (loaded.length === 0) {
    setFirebaseStatus("Data Firebase terbaca, tetapi tidak ada source CSV yang valid.", "warn");
    if (!silent) alert("Data Firebase tidak berisi source CSV yang valid.");
    return;
  }

  setFirebaseStatus(`Data Firebase dimuat: ${loaded.join(", ")}.`, "ok");
  if (!silent) alert(`Data Firebase dimuat: ${loaded.join(", ")}`);
}

async function saveSourcesToFirebase() {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }

  const payloads = collectFirebaseSourcePayloads();
  if (payloads.length === 0 && (!state.students || state.students.length === 0)) {
    throw new Error("Belum ada source data yang bisa disimpan ke Firebase.");
  }

  if (state.students && state.students.length > 0) {
    await saveStudentsToFirebase({ applyEditor: false, silent: true });
  }

  const ownerUid = getFirebaseWriteOwnerUid();

  const batch = state.firebase.db.batch();
  payloads.forEach((item) => {
    const ref = state.firebase.db.collection(FIREBASE_SOURCE_COLLECTION).doc(`${ownerUid}__${item.kind}`);
    batch.set(
      ref,
      {
        kind: item.kind,
        csvText: item.csvText,
        ownerUid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  await batch.commit();
  setFirebaseStatus(`Source data tersimpan ke Firebase: ${payloads.map((x) => x.kind).join(", ")}.`, "ok");
  refreshFirebaseButtons();
}

async function saveSingleSourceToFirebase(kind) {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }
  if (kind === "students") {
    await saveStudentsToFirebase({ applyEditor: true });
    return;
  }
  if (!FIREBASE_SOURCE_KINDS.includes(kind)) {
    throw new Error("Jenis CSV tidak valid.");
  }

  applyCsvFromEditor(kind);
  const ownerUid = getFirebaseWriteOwnerUid();

  const csvText = String(state.sourceTexts[kind] || "").trim();
  if (!csvText) throw new Error("CSV kosong. Isi data terlebih dahulu.");

  const ref = state.firebase.db.collection(FIREBASE_SOURCE_COLLECTION).doc(`${ownerUid}__${kind}`);
  await ref.set(
    {
      kind,
      csvText,
      ownerUid,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  setFirebaseStatus(`CSV ${kind} berhasil diupdate ke Firebase.`, "ok");
}

async function saveInvoiceRecordToFirebase({ silent = false } = {}) {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }

  if (!state.lastInvoiceRecord) {
    throw new Error("Generate invoice terlebih dahulu sebelum menyimpan ke Firebase.");
  }

  const ownerUid = getFirebaseWriteOwnerUid();

  const record = {
    ...state.lastInvoiceRecord,
    paymentStatus: normalizeInvoiceStatus(state.lastInvoiceRecord.paymentStatus || "issued"),
    paidAt: String(state.lastInvoiceRecord.paidAt || ""),
    ownerUid,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  const docId = String(state.lastInvoiceRecord.historyId || "").trim() || `${ownerUid}__${sanitizeFileName(state.lastInvoiceRecord.invoiceNo || "INV")}`;
  await state.firebase.db.collection(FIREBASE_INVOICE_COLLECTION).doc(docId).set(record, { merge: true });
  await refreshDashboardInvoices({ forceServer: true });
  if (!silent) setFirebaseStatus(`Invoice ${state.lastInvoiceRecord.invoiceNo} tersimpan ke Firebase.`, "ok");
}

async function loadInvoiceHistory({ silent = false, forceServer = false, direction = "reset" } = {}) {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }

  const queryState = state.invoiceHistoryQuery;
  if (direction === "reset") {
    queryState.cursorStack = [];
    queryState.currentPage = 1;
    queryState.lastVisibleDoc = null;
    queryState.hasNext = false;
    queryState.activeOwnerUid = "";
  } else if (direction === "next") {
    if (!queryState.hasNext || !queryState.lastVisibleDoc) return;
    queryState.cursorStack.push(queryState.lastVisibleDoc);
    queryState.currentPage = queryState.cursorStack.length + 1;
  } else if (direction === "prev") {
    if (queryState.cursorStack.length > 0) {
      queryState.cursorStack.pop();
    }
    queryState.currentPage = queryState.cursorStack.length + 1;
  }

  const startAfterDoc = queryState.cursorStack.length > 0 ? queryState.cursorStack[queryState.cursorStack.length - 1] : null;
  const studentFilter = String(queryState.studentFilter || "").trim();
  const pageSize = Number(queryState.pageSize || 20);

  const ownerCandidates = queryState.activeOwnerUid ? [queryState.activeOwnerUid] : getFirebaseReadOwnerUidCandidates();

  const runHistoryQueryForOwner = async (ownerUid) => {
    const buildBaseQuery = (orderField) => {
      let q = state.firebase.db.collection(FIREBASE_INVOICE_COLLECTION).where("ownerUid", "==", ownerUid);
      if (studentFilter) {
        q = q.where("student", "==", studentFilter);
      }
      q = q.orderBy(orderField, "desc").limit(pageSize + 1);
      if (startAfterDoc) {
        q = q.startAfter(startAfterDoc);
      }
      return q;
    };

    try {
      return await firestoreGet(buildBaseQuery("updatedAt"), { forceServer });
    } catch {
      return firestoreGet(buildBaseQuery("createdAt"), { forceServer });
    }
  };

  let snapshot = null;
  let resolvedOwnerUid = queryState.activeOwnerUid || "";
  for (const ownerUid of ownerCandidates) {
    const next = await runHistoryQueryForOwner(ownerUid);
    if (!next.empty) {
      snapshot = next;
      resolvedOwnerUid = ownerUid;
      break;
    }
    if (!snapshot) snapshot = next;
  }

  if (!snapshot) {
    throw new Error("Gagal memuat riwayat invoice.");
  }
  queryState.activeOwnerUid = resolvedOwnerUid;

  const docs = snapshot.docs || [];
  const hasNext = docs.length > pageSize;
  const pageDocs = hasNext ? docs.slice(0, pageSize) : docs;
  queryState.hasNext = hasNext;
  queryState.lastVisibleDoc = pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] : null;

  state.invoiceHistory = pageDocs.map((doc) => ({
    historyId: doc.id,
    invoiceNo: doc.data()?.invoiceNo || doc.id,
    ...doc.data(),
  }));

  await backfillInvoiceStudentIds(state.invoiceHistory);

  renderInvoiceHistoryTable();
  renderInvoiceHistoryPaginationInfo();
  refreshFirebaseButtons();
  if (el.invoiceHistoryStatus) {
    el.invoiceHistoryStatus.textContent = state.invoiceHistory.length
      ? `Menampilkan ${state.invoiceHistory.length} invoice (halaman ${queryState.currentPage}).`
      : "Belum ada riwayat invoice di shared cloud Firebase.";
  }

  if (!silent && state.invoiceHistory.length > 0) {
    setFirebaseStatus(`Riwayat invoice dimuat (${state.invoiceHistory.length} data).`, "ok");
  }
}

async function backfillInvoiceStudentIds(items = []) {
  if (!state.firebase.ready || !state.firebase.db || !Array.isArray(items) || items.length === 0) return;
  const ownerUid = getFirebaseWriteOwnerUid();
  const batch = state.firebase.db.batch();
  let changed = 0;

  items.forEach((item) => {
    if (!item?.historyId) return;
    const existing = String(item.studentId || item?.studentDetail?.studentId || "").trim();
    if (existing) return;

    const resolved = getStudentRecordFromInvoice(item);
    const studentId = String(resolved?.studentId || "").trim();
    if (!studentId) return;

    const ref = state.firebase.db.collection(FIREBASE_INVOICE_COLLECTION).doc(String(item.historyId));
    batch.set(
      ref,
      {
        studentId,
        studentDetail: {
          ...(item.studentDetail || {}),
          studentId,
        },
        ownerUid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    changed += 1;
  });

  if (changed > 0) {
    await batch.commit();
    setFirebaseStatus(`Backfill studentId selesai untuk ${changed} invoice.`, "ok");
  }
}

async function refreshDashboardInvoices({ forceServer = false } = {}) {
  if (!state.firebase.ready || !state.firebase.db) {
    state.dashboardInvoices = [];
    state.calendarWeekAutoFocus = true;
    renderPaymentStatusTable();
    renderInvoiceCalendar();
    renderReceivablesOperationsSection();
    renderRemindersOperationsSection();
    return;
  }

  const ownerUid = getFirebaseWriteOwnerUid();
  const buildQuery = (orderField) => state.firebase.db
    .collection(FIREBASE_INVOICE_COLLECTION)
    .where("ownerUid", "==", ownerUid)
    .orderBy(orderField, "desc")
    .limit(300);

  let snapshot;
  try {
    snapshot = await firestoreGet(buildQuery("updatedAt"), { forceServer });
  } catch {
    snapshot = await firestoreGet(buildQuery("createdAt"), { forceServer });
  }

  state.dashboardInvoices = (snapshot.docs || []).map((doc) => ({
    historyId: doc.id,
    invoiceNo: doc.data()?.invoiceNo || doc.id,
    ...doc.data(),
    paymentStatus: normalizeInvoiceStatus(doc.data()?.paymentStatus || "issued"),
  }));
  state.calendarWeekAutoFocus = true;

  renderPaymentStatusTable();
  renderInvoiceCalendar();
  renderReceivablesOperationsSection();
  renderRemindersOperationsSection();
}

async function autoCancelOverdueInvoices({ silent = true } = {}) {
  if (!state.firebase.ready || !state.firebase.db) return 0;
  if (!Array.isArray(state.dashboardInvoices) || state.dashboardInvoices.length === 0) return 0;

  const now = getCurrentTimeInZone();
  const overdue = state.dashboardInvoices.filter((item) => {
    const status = normalizeInvoiceStatus(item?.paymentStatus || "issued");
    if (status !== "issued") return false;
    const deadlineDate = parseDateInput(String(item?.paymentDeadline || ""));
    if (!deadlineDate) return false;
    return deadlineDate.getTime() < now.getTime();
  });

  if (overdue.length === 0) return 0;

  const batch = state.firebase.db.batch();
  overdue.forEach((item) => {
    const ref = state.firebase.db.collection(FIREBASE_INVOICE_COLLECTION).doc(String(item.historyId || ""));
    const existingNote = String(item.paymentNote || "").trim();
    const autoNote = "Auto cancelled: melewati deadline pembayaran.";
    batch.set(ref, {
      paymentStatus: "cancelled",
      paymentNote: existingNote || autoNote,
      paidAt: "",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  });

  await batch.commit();

  const cancelledIds = new Set(overdue.map((item) => String(item.historyId || "")));
  state.dashboardInvoices = state.dashboardInvoices.map((item) => {
    if (!cancelledIds.has(String(item.historyId || ""))) return item;
    return {
      ...item,
      paymentStatus: "cancelled",
      paymentNote: String(item.paymentNote || "").trim() || "Auto cancelled: melewati deadline pembayaran.",
      paidAt: "",
    };
  });

  if (!silent) {
    setFirebaseStatus(`Auto cancel berjalan: ${overdue.length} invoice overdue diubah jadi CANCELLED.`, "ok");
  }
  return overdue.length;
}

function getCalendarRangeBase() {
  const now = getCurrentTimeInZone();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  return { start, end };
}

function getDatePartsInZone(date = new Date(), timeZone = APP_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const lookup = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return {
    year: Number(lookup.year || 0),
    month: Number(lookup.month || 1),
    day: Number(lookup.day || 1),
    hour: Number(lookup.hour || 0),
    minute: Number(lookup.minute || 0),
    second: Number(lookup.second || 0),
  };
}

function getCurrentTimeInZone(timeZone = APP_TIME_ZONE) {
  const parts = getDatePartsInZone(new Date(), timeZone);
  return new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
}

function getCurrentIsoDateInZone(timeZone = APP_TIME_ZONE) {
  const parts = getDatePartsInZone(new Date(), timeZone);
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function getDefaultCalendarWeekIndex(viewStart, totalWeeks) {
  const currentWeekStart = getStartOfWeekMonday(getCurrentTimeInZone());
  const diffDays = Math.floor((currentWeekStart.getTime() - viewStart.getTime()) / 86400000);
  const rawIndex = Math.floor(diffDays / 7);
  return Math.max(0, Math.min(rawIndex, Math.max(0, totalWeeks - 1)));
}

function getStartOfWeekMonday(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}

function roundDownToStep(value, step) {
  return Math.floor(value / step) * step;
}

function roundUpToStep(value, step) {
  return Math.ceil(value / step) * step;
}

function formatMinuteLabel(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatMonthShort(date) {
  return new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date);
}

function normalizeInvoiceStatus(status) {
  const normalized = String(status || "issued").trim().toLowerCase();
  if (normalized === "paid") return "paid";
  if (normalized === "cancelled" || normalized === "canceled") return "cancelled";
  if (normalized === "aborted") return "cancelled";
  return "issued";
}

function isCalendarVisibleStatus(status) {
  const normalized = normalizeInvoiceStatus(status);
  return normalized === "issued" || normalized === "paid";
}

function formatCalendarStudentLabel(studentName, gradeLabel) {
  const name = getStudentDisplayName(studentName);
  const grade = String(gradeLabel || "").trim();
  return grade ? `${name} (${grade})` : name;
}

function normalizeTeacherIdentity(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function getTeacherCalendarAccent(teacherName) {
  const key = normalizeTeacherIdentity(teacherName);
  if (key.includes("pakgun") || key.includes("pakgung")) return "#1f3a5f";
  if (key.includes("trias")) return "#d16a5a";
  if (key.includes("rensie")) return "#2f9e8f";
  return "#7a6f60";
}

function assignCalendarEntryLanes(entries) {
  const sorted = [...entries].sort((a, b) => {
    if (a.startMin !== b.startMin) return a.startMin - b.startMin;
    if (a.endMin !== b.endMin) return a.endMin - b.endMin;
    return String(a.student || "").localeCompare(String(b.student || ""), "id");
  });

  const laneEnds = [];
  const laidOut = sorted.map((entry) => {
    let lane = laneEnds.findIndex((endMin) => endMin <= entry.startMin);
    if (lane < 0) {
      lane = laneEnds.length;
      laneEnds.push(entry.endMin);
    } else {
      laneEnds[lane] = entry.endMin;
    }
    return { ...entry, lane };
  });

  return {
    entries: laidOut,
    laneCount: Math.max(1, laneEnds.length),
  };
}

function buildCalendarViewModel(days, viewStart, viewEnd, rangeStart, rangeEnd) {
  const rowMap = new Map();
  const timedEntries = [];
  const teachersByDay = new Map();

  const ensureRow = (dayKey, teacher, dayDate) => {
    const rowKey = `${dayKey}__${teacher}`;
    if (!rowMap.has(rowKey)) {
      rowMap.set(rowKey, {
        dayKey,
        teacher,
        dayDate,
        timed: [],
        noTime: [],
      });
    }
    return rowMap.get(rowKey);
  };

  state.dashboardInvoices.forEach((item) => {
    const status = normalizeInvoiceStatus(item.paymentStatus || "issued");
    if (!isCalendarVisibleStatus(status)) return;
    const sessions = Array.isArray(item.items) ? item.items : [];

    sessions.forEach((session) => {
      const d = parseDateInput(String(session?.tanggal || ""));
      if (!d) return;
      if (d < rangeStart || d > rangeEnd) return;
      if (d < viewStart || d > viewEnd) return;

      const dayKey = toLocalDateInputValue(d);
      const teacher = String(session?.pengajar || "Tanpa Pengajar").trim() || "Tanpa Pengajar";
      if (!teachersByDay.has(dayKey)) teachersByDay.set(dayKey, new Set());
      teachersByDay.get(dayKey).add(teacher);

      const startMin = parseTimeToMinutes(String(session?.jamMulai || ""));
      const endMinRaw = parseTimeToMinutes(String(session?.jamSelesai || ""));
      const durMinFallback = Math.max(15, Math.round(Number(session?.durasi || 0) * 60));
      const endMin = endMinRaw > startMin ? endMinRaw : (startMin >= 0 ? startMin + durMinFallback : -1);

      const row = ensureRow(dayKey, teacher, d);
      const gradeLabel = String(item?.studentDetail?.kelas || "").trim();
      const entry = {
        invoiceNo: item.invoiceNo,
        student: item.student,
        studentLabel: formatCalendarStudentLabel(item.student, gradeLabel),
        status,
        teacher,
        startMin,
        endMin,
      };

      if (startMin >= 0 && endMin > startMin) {
        row.timed.push(entry);
        timedEntries.push(entry);
      } else {
        row.noTime.push(entry);
      }
    });
  });

  let timelineStart = 8 * 60;
  let timelineEnd = 21 * 60;
  if (timedEntries.length > 0) {
    timelineStart = roundDownToStep(Math.min(...timedEntries.map((e) => e.startMin)), 30);
    timelineEnd = roundUpToStep(Math.max(...timedEntries.map((e) => e.endMin)), 30);
    if (timelineEnd <= timelineStart) timelineEnd = timelineStart + 120;
  }

  const totalMinutes = timelineEnd - timelineStart;
  const totalUnits = Math.max(2, Math.round(totalMinutes / 15));

  const getTeachersForDay = (dayKey) => {
    const teacherSet = teachersByDay.get(dayKey);
    if (!teacherSet || teacherSet.size === 0) return ["Tanpa Pengajar"];
    return [...teacherSet].sort((a, b) => a.localeCompare(b, "id"));
  };

  return {
    days,
    rangeStart,
    rangeEnd,
    todayKey: getCurrentIsoDateInZone(),
    ensureRow,
    getTeachersForDay,
    timelineStart,
    timelineEnd,
    totalMinutes,
    totalUnits,
  };
}

function buildCalendarBoardHtml(model) {
  const tickLabels = [];
  const tickCount = Math.floor((model.timelineEnd - model.timelineStart) / 30) + 1;
  const denseRuler = tickCount > 20;
  let tickIndex = 0;
  for (let m = model.timelineStart; m <= model.timelineEnd; m += 30, tickIndex += 1) {
    const left = ((m - model.timelineStart) / model.totalMinutes) * 100;
    const tickClass = denseRuler && tickIndex % 2 === 1 ? "tick-stagger" : "";
    tickLabels.push(`<span class="${tickClass}" style="left:${left}%">${escapeHtml(formatMinuteLabel(m))}</span>`);
  }

  const rowsHtml = model.days
    .map((d) => {
      const dayKey = toLocalDateInputValue(d);
      const outRange = d < model.rangeStart || d > model.rangeEnd;
      const isToday = dayKey === model.todayKey;
      const teachersForDay = model.getTeachersForDay(dayKey);
      return teachersForDay
        .map((teacher, teacherIndex) => {
          const row = model.ensureRow(dayKey, teacher, d);
          const teacherAccent = getTeacherCalendarAccent(teacher);
          const dayLabel = teacherIndex === 0
            ? `<div class="cal-day-label ${outRange ? "out-range" : ""} ${isToday ? "today" : ""}"><em>${escapeHtml(formatMonthShort(d))}</em><span>${escapeHtml(HARI[d.getDay()])}</span><strong>${d.getDate()}</strong></div>`
            : "<div class=\"cal-day-label-spacer\"></div>";

          const laneLayout = assignCalendarEntryLanes(row.timed);
          const blocks = laneLayout.entries
            .map((entry) => {
              const startOffset = Math.max(0, entry.startMin - model.timelineStart);
              const widthMin = Math.max(15, entry.endMin - entry.startMin);
              const left = (startOffset / model.totalMinutes) * 100;
              const width = (widthMin / model.totalMinutes) * 100;
              const entryAccent = getTeacherCalendarAccent(entry.teacher);
              const tooltip = `Invoice: ${entry.invoiceNo || "INV"}\nStatus: ${String(entry.status || "issued").toUpperCase()}\nSiswa: ${entry.studentLabel || entry.student || "-"}\nPengajar: ${entry.teacher || "-"}`;
              return `<div class="cal-slot-item teacher-coded ${entry.status}" title="${escapeHtml(tooltip)}" style="left:${left}%;width:${width}%;--lane:${entry.lane};--teacher-accent:${entryAccent};"><small>${escapeHtml(entry.studentLabel || entry.student || "-")}</small></div>`;
            })
            .join("");

          const noTimeBadges = row.noTime
            .map((entry) => {
              const tooltip = `Invoice: ${entry.invoiceNo || "INV"}\nStatus: ${String(entry.status || "issued").toUpperCase()}\nSiswa: ${entry.studentLabel || entry.student || "-"}\nPengajar: ${entry.teacher || "-"}`;
              const entryAccent = getTeacherCalendarAccent(entry.teacher);
              return `<span class="cal-notime-badge teacher-coded ${entry.status}" title="${escapeHtml(tooltip)}" style="--teacher-accent:${entryAccent};">${escapeHtml(entry.studentLabel || entry.student || "-")}</span>`;
            })
            .join("");

          return `
            <div class="cal-week-row ${teacherIndex === 0 ? "day-separator-top" : ""} ${outRange ? "out-range" : ""}">
              ${dayLabel}
              <div class="cal-teacher-axis ${outRange ? "out-range" : ""}" style="--teacher-accent:${teacherAccent};"><span class="cal-teacher-dot"></span>${escapeHtml(teacher)}</div>
              <div class="cal-track-wrap ${outRange ? "out-range" : ""}" style="--total-units:${model.totalUnits};--lane-count:${laneLayout.laneCount};">
                <div class="cal-track-grid"></div>
                ${blocks}
                ${noTimeBadges ? `<div class="cal-notime-wrap">${noTimeBadges}</div>` : ""}
              </div>
            </div>
          `;
        })
        .join("");
    })
    .join("");

  return `
    <div class="calendar-weekly-board">
      <div class="cal-header-row">
        <div class="cal-header-day">Bulan / Hari</div>
        <div class="cal-header-teacher">Pengajar</div>
        <div class="cal-time-ruler ${denseRuler ? "dense" : ""}" style="--total-units:${model.totalUnits};">
          <div class="cal-track-grid"></div>
          ${tickLabels.join("")}
        </div>
      </div>
      ${rowsHtml}
    </div>
  `;
}

function renderInvoiceCalendar() {
  if (!el.invoiceCalendarGrid || !el.calendarRangeLabel) return;

  const { start, end } = getCalendarRangeBase();
  el.calendarRangeLabel.textContent = `${formatTanggal(start)} - ${formatTanggal(end)}`;

  const viewStart = getStartOfWeekMonday(start);
  const viewEnd = addDays(getStartOfWeekMonday(end), 6);
  const totalWeeks = Math.max(1, Math.round((viewEnd - viewStart) / (7 * 24 * 60 * 60 * 1000)) + 1);
  state.calendarWeekCount = totalWeeks;
  if (state.calendarWeekAutoFocus) {
    state.calendarWeekIndex = getDefaultCalendarWeekIndex(viewStart, totalWeeks);
    state.calendarWeekAutoFocus = false;
  }
  state.calendarWeekIndex = Math.max(0, Math.min(state.calendarWeekIndex, totalWeeks - 1));
  if (el.btnCalendarPrevWeek) el.btnCalendarPrevWeek.disabled = state.calendarWeekIndex <= 0;
  if (el.btnCalendarNextWeek) el.btnCalendarNextWeek.disabled = state.calendarWeekIndex >= totalWeeks - 1;

  const weekStart = addDays(viewStart, state.calendarWeekIndex * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = weekDays[6];
  if (el.calendarWeekLabel) {
    el.calendarWeekLabel.textContent = `Minggu ${state.calendarWeekIndex + 1}/${totalWeeks} | ${formatTanggal(weekStart)} - ${formatTanggal(weekEnd)}`;
  }

  const model = buildCalendarViewModel(weekDays, weekStart, weekEnd, start, end);
  el.invoiceCalendarGrid.innerHTML = buildCalendarBoardHtml(model);
}

async function downloadCalendarMonthPng(monthOffset) {
  if (typeof window.html2canvas !== "function") {
    alert("Fitur Download PNG belum siap. Coba refresh halaman saat internet aktif.");
    return;
  }

  const now = getCurrentTimeInZone();
  const monthStart = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0);
  const days = [];
  for (let d = new Date(monthStart); d <= monthEnd; d = addDays(d, 1)) {
    days.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  }

  const model = buildCalendarViewModel(days, monthStart, monthEnd, monthStart, monthEnd);
  const title = `Kalender ${new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(monthStart)}`;

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-99999px";
  host.style.top = "0";
  host.style.zIndex = "-1";
  host.style.width = "1800px";

  const sheet = document.createElement("div");
  sheet.style.background = "#ffffff";
  sheet.style.padding = "16px";
  sheet.innerHTML = `<h3 style="margin:0 0 10px; color:#4c3d2a;">${escapeHtml(title)}</h3>${buildCalendarBoardHtml(model)}`;
  host.appendChild(sheet);
  document.body.appendChild(host);

  try {
    const canvas = await window.html2canvas(sheet, {
      scale: 2,
      useCORS: false,
      allowTaint: false,
      imageTimeout: 0,
      backgroundColor: "#ffffff",
      logging: false,
    });
    const y = monthStart.getFullYear();
    const m = String(monthStart.getMonth() + 1).padStart(2, "0");
    downloadCanvas(canvas, `calendar-${y}-${m}.png`);
  } catch {
    alert("Gagal membuat PNG kalender bulanan.");
  } finally {
    host.remove();
  }
}

function renderPaymentStatusTable() {
  if (!el.paymentStatusTableBody || !el.paymentStatusSummary) return;

  if (!state.firebase.ready) {
    el.paymentStatusSummary.textContent = "Hubungkan Firebase untuk memuat data.";
    el.paymentStatusTableBody.innerHTML = '<tr><td colspan="7" class="empty">Firebase belum terhubung.</td></tr>';
    return;
  }

  if (state.dashboardInvoices.length === 0) {
    el.paymentStatusSummary.textContent = "Belum ada invoice di cloud.";
    el.paymentStatusTableBody.innerHTML = '<tr><td colspan="7" class="empty">Belum ada data invoice.</td></tr>';
    return;
  }

  const paidCount = state.dashboardInvoices.filter((x) => String(x.paymentStatus || "").toLowerCase() === "paid").length;
  const issuedCount = state.dashboardInvoices.filter((x) => normalizeInvoiceStatus(x.paymentStatus) === "issued").length;
  const cancelledCount = state.dashboardInvoices.filter((x) => normalizeInvoiceStatus(x.paymentStatus) === "cancelled").length;
  el.paymentStatusSummary.textContent = `Total ${state.dashboardInvoices.length} invoice | ISSUED: ${issuedCount} | PAID: ${paidCount} | CANCELLED: ${cancelledCount}`;

  el.paymentStatusTableBody.innerHTML = state.dashboardInvoices
    .map((item) => {
      const invoiceDate = parseDateInput(String(item.invoiceDate || ""));
      const deadlineDate = parseDateInput(String(item.paymentDeadline || ""));
      const status = normalizeInvoiceStatus(item.paymentStatus || "issued");
      const note = String(item.paymentNote || "").trim();
      return `
      <tr>
        <td>${escapeHtml(item.invoiceNo || "-")}</td>
        <td>${escapeHtml(getStudentDisplayName(item.student, item.studentDetail || {}))}</td>
        <td>${invoiceDate ? escapeHtml(formatTanggalWaktu(invoiceDate)) : "-"}</td>
        <td>${deadlineDate ? escapeHtml(formatTanggalWaktu(deadlineDate)) : "-"}</td>
        <td>
          <select data-payment-status class="payment-status-select ${status}">
            <option value="issued" ${status === "issued" ? "selected" : ""}>ISSUED</option>
            <option value="paid" ${status === "paid" ? "selected" : ""}>PAID</option>
            <option value="cancelled" ${status === "cancelled" ? "selected" : ""}>CANCELLED</option>
          </select>
        </td>
        <td><input type="text" data-payment-note value="${escapeHtml(note)}" placeholder="Transfer ke BCA xxx / alasan cancel" /></td>
        <td>
          <button type="button" class="btn" data-payment-save="${escapeHtml(item.historyId || "")}">Simpan</button>
          <button type="button" class="btn" data-payment-delete="${escapeHtml(item.historyId || "")}">Hapus</button>
        </td>
      </tr>`;
    })
    .join("");
}

function renderOperationsSummaryCards(host, cards) {
  if (!host) return;
  host.innerHTML = (cards || [])
    .map((card) => `<div class="operations-card"><span>${escapeHtml(card.label || "-")}</span><strong>${escapeHtml(card.value || "-")}</strong></div>`)
    .join("");
}

function formatOperationsDateRange(minDate, maxDate) {
  if (!minDate || !maxDate) return "-";
  const start = formatTanggal(minDate);
  const end = formatTanggal(maxDate);
  return start === end ? start : `${start} - ${end}`;
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function diffInDays(fromDate, toDate) {
  return Math.round((startOfDay(toDate).getTime() - startOfDay(fromDate).getTime()) / 86400000);
}

function renderAttendanceInputSection() {
  if (!el.attendanceInputTableBody) return;

  const rows = sortAttendanceEntries(state.attendanceEntries || []);
  state.attendanceEntries = rows;

  if (rows.length === 0) {
    el.attendanceInputTableBody.innerHTML = '<tr><td colspan="12" class="empty">Belum ada data attendance input.</td></tr>';
    return;
  }

  el.attendanceInputTableBody.innerHTML = rows
    .map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><input type="date" data-row="${index}" data-field="tanggal" value="${escapeHtml(String(row.tanggal || ""))}" /></td>
        <td><input type="text" data-row="${index}" data-field="studentName" value="${escapeHtml(String(row.studentName || ""))}" placeholder="Nama siswa" list="studentOptions" /></td>
        <td>
          <select data-row="${index}" data-field="status">
            <option value="hadir" ${normalizeAttendanceStatus(row.status) === "hadir" ? "selected" : ""}>Hadir</option>
            <option value="izin" ${normalizeAttendanceStatus(row.status) === "izin" ? "selected" : ""}>Izin</option>
            <option value="sakit" ${normalizeAttendanceStatus(row.status) === "sakit" ? "selected" : ""}>Sakit</option>
          </select>
        </td>
        <td><input type="time" data-row="${index}" data-field="jamMulai" value="${escapeHtml(String(row.jamMulai || ""))}" /></td>
        <td><input type="time" data-row="${index}" data-field="jamSelesai" value="${escapeHtml(String(row.jamSelesai || ""))}" /></td>
        <td><input type="text" data-row="${index}" data-field="pengajar" value="${escapeHtml(String(row.pengajar || ""))}" /></td>
        <td><input type="number" min="1" data-row="${index}" data-field="pesertaCount" value="${escapeHtml(String(row.pesertaCount || 1))}" /></td>
        <td><input type="text" data-row="${index}" data-field="topik" value="${escapeHtml(String(row.topik || ""))}" /></td>
        <td><input type="text" data-row="${index}" data-field="catatan" value="${escapeHtml(String(row.catatan || ""))}" /></td>
        <td><code>${escapeHtml(String(row.attendanceId || "-"))}</code></td>
        <td>
          <div class="attendance-actions">
            <button type="button" class="icon-btn save" title="Simpan" data-save-attendance="${index}">&#128190;</button>
            <button type="button" class="icon-btn delete" title="Hapus" data-remove-attendance="${index}">&#128465;</button>
          </div>
        </td>
      </tr>`)
    .join("");
}

function buildAttendanceOperationsViewModel() {
  const structuredRows = sortAttendanceEntries((state.attendanceEntries || []).map((entry) => normalizeAttendanceEntry(entry, entry?.attendanceId || "")));
  if (structuredRows.length > 0) {
    const summary = new Map();
    let minDate = null;
    let maxDate = null;
    let totalSessions = 0;

    structuredRows.forEach((entry) => {
      const date = parseDateInput(String(entry.tanggal || ""));
      if (!date) return;
      if (!minDate || date < minDate) minDate = date;
      if (!maxDate || date > maxDate) maxDate = date;
      if (normalizeAttendanceStatus(entry.status) !== "hadir") return;

      totalSessions += 1;
      const key = String(entry.studentId || normalizeName(entry.studentName || "")).trim();
      const current = summary.get(key) || { name: entry.studentName || "-", count: 0, lastDate: null, sourceFormat: "structured" };
      current.count += 1;
      if (!current.lastDate || date > current.lastDate) current.lastDate = date;
      summary.set(key, current);
    });

    const items = [...summary.values()]
      .sort((a, b) => b.count - a.count || String(a.name || "").localeCompare(String(b.name || ""), "id"))
      .slice(0, 40);

    return {
      totalSessions,
      uniqueStudents: summary.size,
      rangeText: formatOperationsDateRange(minDate, maxDate),
      items,
    };
  }

  const headers = Array.isArray(state.absensiHeaders) ? state.absensiHeaders : [];
  const rows = Array.isArray(state.absensiRows) ? state.absensiRows : [];
  if (headers.length === 0 || rows.length === 0) {
    return {
      totalSessions: 0,
      uniqueStudents: 0,
      rangeText: "-",
      items: [],
    };
  }

  const idxNama = findHeaderIndex(headers, ["nama siswa", "siswa", "nama panggilan"]);
  const idxTanggal = findHeaderIndex(headers, ["tanggal"]);
  const summary = new Map();
  let minDate = null;
  let maxDate = null;
  let totalSessions = 0;

  const registerHit = (label, date, sourceFormat) => {
    const name = String(label || "").trim();
    if (!name || !date) return;
    const key = normalizeName(name);
    const current = summary.get(key) || { name, count: 0, lastDate: null, sourceFormat };
    current.count += 1;
    current.sourceFormat = sourceFormat;
    if (!current.lastDate || date > current.lastDate) current.lastDate = date;
    summary.set(key, current);
  };

  if (idxNama >= 0 && idxTanggal >= 0) {
    rows.forEach((row) => {
      const name = String(row[idxNama] || "").trim();
      const date = parseDateFlex(String(row[idxTanggal] || "").trim());
      if (!name || !date) return;
      registerHit(name, date, "simple");
      totalSessions += 1;
      if (!minDate || date < minDate) minDate = date;
      if (!maxDate || date > maxDate) maxDate = date;
    });
  } else {
    const idxAbsensiLabel = headers.findIndex((h) => h.toLowerCase().includes("absensi - jangan diapus"));
    const idxTotalPeserta = headers.findIndex((h) => h.toLowerCase().includes("total peserta"));
    if (idxAbsensiLabel >= 0 && idxTotalPeserta > idxAbsensiLabel && idxTanggal >= 0) {
      const attendanceNames = headers.slice(idxAbsensiLabel + 1, idxTotalPeserta);
      rows.forEach((row) => {
        const date = parseDateFlex(String(row[idxTanggal] || "").trim());
        if (!date) return;
        totalSessions += 1;
        if (!minDate || date < minDate) minDate = date;
        if (!maxDate || date > maxDate) maxDate = date;
        attendanceNames.forEach((name, index) => {
          const value = String(row[idxAbsensiLabel + 1 + index] || "").trim().toUpperCase();
          if (value === "TRUE") registerHit(name, date, "matrix");
        });
      });
    }
  }

  const items = [...summary.values()]
    .sort((a, b) => b.count - a.count || String(a.name || "").localeCompare(String(b.name || ""), "id"))
    .slice(0, 40);

  return {
    totalSessions,
    uniqueStudents: summary.size,
    rangeText: formatOperationsDateRange(minDate, maxDate),
    items,
  };
}

function renderAttendanceOperationsSection() {
  const view = buildAttendanceOperationsViewModel();
  renderOperationsSummaryCards(el.attendanceOpsSummary, [
    { label: "Total Sesi", value: String(view.totalSessions) },
    { label: "Siswa Terdeteksi", value: String(view.uniqueStudents) },
    { label: "Rentang Data", value: view.rangeText },
  ]);

  if (!el.attendanceOpsTableBody) return;
  if (view.items.length === 0) {
    el.attendanceOpsTableBody.innerHTML = '<tr><td colspan="4" class="empty">Belum ada data absensi yang bisa diringkas.</td></tr>';
    return;
  }

  el.attendanceOpsTableBody.innerHTML = view.items
    .map((item) => `
      <tr>
        <td>${escapeHtml(item.name || "-")}</td>
        <td>${escapeHtml(String(item.count || 0))}</td>
        <td>${item.lastDate ? escapeHtml(formatTanggal(item.lastDate)) : "-"}</td>
        <td>${escapeHtml(item.sourceFormat || "-")}</td>
      </tr>`)
    .join("");
}

function getReceivablesOperationsItems() {
  const today = new Date();
  return (state.dashboardInvoices || [])
    .map((item) => {
      const status = normalizeInvoiceStatus(item.paymentStatus || "issued");
      const deadlineDate = parseDateInput(String(item.paymentDeadline || item.invoiceDate || ""));
      const total = Number(item?.totals?.grandTotal || 0);
      const dayDelta = deadlineDate ? diffInDays(deadlineDate, today) : null;
      return {
        ...item,
        status,
        deadlineDate,
        total,
        isOpen: status === "issued",
        isOverdue: status === "issued" && Number.isFinite(dayDelta) && dayDelta > 0,
        dayDelta,
      };
    })
    .filter((item) => item.isOpen)
    .sort((a, b) => {
      if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
      const aTime = a.deadlineDate?.getTime?.() || Number.MAX_SAFE_INTEGER;
      const bTime = b.deadlineDate?.getTime?.() || Number.MAX_SAFE_INTEGER;
      if (aTime !== bTime) return aTime - bTime;
      return String(a.invoiceNo || "").localeCompare(String(b.invoiceNo || ""), "id");
    });
}

function formatReceivableAgeLabel(item) {
  if (!item?.deadlineDate || !Number.isFinite(item.dayDelta)) return "Tanpa deadline";
  if (item.dayDelta > 0) return `Overdue ${item.dayDelta} hari`;
  if (item.dayDelta === 0) return "Jatuh tempo hari ini";
  return `${Math.abs(item.dayDelta)} hari lagi`;
}

function renderReceivablesOperationsSection() {
  const items = getReceivablesOperationsItems();
  const overdueCount = items.filter((item) => item.isOverdue).length;
  const outstanding = items.reduce((sum, item) => sum + Number(item.total || 0), 0);

  renderOperationsSummaryCards(el.receivablesOpsSummary, [
    { label: "Open Invoice", value: String(items.length) },
    { label: "Overdue", value: String(overdueCount) },
    { label: "Outstanding", value: formatRupiah(outstanding) },
  ]);

  if (!el.receivablesOpsTableBody) return;
  if (!state.firebase.ready) {
    el.receivablesOpsTableBody.innerHTML = '<tr><td colspan="6" class="empty">Hubungkan Firebase untuk memuat piutang.</td></tr>';
    return;
  }
  if (items.length === 0) {
    el.receivablesOpsTableBody.innerHTML = '<tr><td colspan="6" class="empty">Tidak ada invoice issued yang masih terbuka.</td></tr>';
    return;
  }

  el.receivablesOpsTableBody.innerHTML = items
    .map((item) => {
      const ageLabel = formatReceivableAgeLabel(item);
      return `
      <tr>
        <td>${escapeHtml(item.invoiceNo || "-")}</td>
        <td>${escapeHtml(getStudentDisplayName(item.student, item.studentDetail || {}))}</td>
        <td>${item.deadlineDate ? escapeHtml(formatTanggalWaktu(item.deadlineDate)) : "-"}</td>
        <td><span class="ops-pill ${escapeHtml(item.status || "issued")}">${escapeHtml(String(item.status || "issued").toUpperCase())}</span></td>
        <td>${formatRupiah(item.total)}</td>
        <td class="${item.isOverdue ? "ops-overdue" : ""}">${escapeHtml(ageLabel)}</td>
      </tr>`;
    })
    .join("");
}

function buildReminderMessage(item, studentRecord) {
  const studentName = getStudentDisplayName(item.student, item.studentDetail || {});
  const parentName = String(studentRecord?.parentName || "Bapak/Ibu").trim() || "Bapak/Ibu";
  const deadlineText = item.deadlineDate ? formatTanggalWaktu(item.deadlineDate) : "segera";
  return [
    `Halo ${parentName},`,
    "",
    `Mengingatkan untuk invoice les ${studentName} dengan nomor ${item.invoiceNo || "-"}.`,
    `Total tagihan: ${formatRupiah(Number(item.total || 0))}.`,
    `Deadline pembayaran: ${deadlineText}.`,
    "",
    "Mohon konfirmasi jika pembayaran sudah dilakukan. Terima kasih.",
  ].join("\n");
}

function renderRemindersOperationsSection() {
  const items = getReceivablesOperationsItems().slice(0, 50).map((item) => {
    const studentRecord = getStudentRecordFromInvoice(item);
    const phone = String(studentRecord?.parentWhatsapp || studentRecord?.studentWhatsapp || "").trim();
    return {
      historyId: String(item.historyId || ""),
      invoiceNo: String(item.invoiceNo || ""),
      studentLabel: getStudentDisplayName(item.student, item.studentDetail || {}),
      deadlineText: item.deadlineDate ? formatTanggalWaktu(item.deadlineDate) : "-",
      phone,
      message: buildReminderMessage(item, studentRecord),
    };
  });

  state.operationsReminderRows = items;
  const withPhone = items.filter((item) => item.phone).length;

  renderOperationsSummaryCards(el.remindersOpsSummary, [
    { label: "Perlu Follow-up", value: String(items.length) },
    { label: "Punya Kontak WA", value: String(withPhone) },
    { label: "Tanpa Kontak", value: String(items.length - withPhone) },
  ]);

  if (!el.remindersOpsTableBody) return;
  if (!state.firebase.ready) {
    el.remindersOpsTableBody.innerHTML = '<tr><td colspan="5" class="empty">Hubungkan Firebase untuk memuat reminder.</td></tr>';
    return;
  }
  if (items.length === 0) {
    el.remindersOpsTableBody.innerHTML = '<tr><td colspan="5" class="empty">Tidak ada invoice issued yang perlu di-follow-up.</td></tr>';
    return;
  }

  el.remindersOpsTableBody.innerHTML = items
    .map((item) => `
      <tr>
        <td>${escapeHtml(item.invoiceNo || "-")}</td>
        <td>${escapeHtml(item.studentLabel || "-")}</td>
        <td>${escapeHtml(item.phone || "-")}</td>
        <td>${escapeHtml(item.deadlineText || "-")}</td>
        <td>
          <button type="button" class="btn" data-copy-reminder="${escapeHtml(item.historyId || "")}" ${item.phone ? "" : "disabled"}>Salin Pesan</button>
          <pre class="ops-message">${escapeHtml(item.message || "")}</pre>
        </td>
      </tr>`)
    .join("");
}

function renderStudentManagementTable() {
  if (!el.studentManageTableBody) return;

  const gradeOptionMap = new Map();
  (state.students || []).forEach((student) => {
    const grade = normalizeStudentGradeValue(student?.kelas || "");
    if (!grade.value || gradeOptionMap.has(grade.value)) return;
    gradeOptionMap.set(grade.value, grade);
  });
  const gradeOptions = [...gradeOptionMap.values()].sort(compareStudentGradeValues);
  if (!gradeOptions.some((item) => item.value === "13")) {
    gradeOptions.push({ value: "13", label: "13 (Alumni)" });
    gradeOptions.sort(compareStudentGradeValues);
  }
  if (el.studentManageGradeFilter) {
    const selected = String(state.studentManageQuery.gradeFilter || "");
    el.studentManageGradeFilter.innerHTML = ['<option value="">Semua Kelas</option>']
      .concat(gradeOptions.map((grade) => `<option value="${escapeHtml(grade.value)}">${escapeHtml(grade.label)}</option>`))
      .join("");
    el.studentManageGradeFilter.value = selected;
  }

  const view = getStudentManagementViewModel();
  const { pageItems, totalItems, currentPage, totalPages } = view;

  el.studentManagePagers?.forEach((pager) => {
    const btnFirst = pager.querySelector('button[data-page-action="first"]');
    const btnPrev = pager.querySelector('button[data-page-action="prev"]');
    const btnNext = pager.querySelector('button[data-page-action="next"]');
    const btnLast = pager.querySelector('button[data-page-action="last"]');
    if (btnFirst) btnFirst.disabled = currentPage <= 1;
    if (btnPrev) btnPrev.disabled = currentPage <= 1;
    if (btnNext) btnNext.disabled = currentPage >= totalPages;
    if (btnLast) btnLast.disabled = currentPage >= totalPages;
  });

  const pageInfoText = `Halaman ${currentPage}/${totalPages} | ${totalItems} siswa | 15 per halaman`;
  el.studentManagePageInfos?.forEach((info) => {
    info.textContent = pageInfoText;
  });
  el.studentManageGotoInputs?.forEach((input) => {
    input.value = String(currentPage);
  });

  if (!Array.isArray(state.students) || state.students.length === 0 || pageItems.length === 0) {
    const hasGradeFilter = String(state.studentManageQuery.gradeFilter || "").trim().length > 0;
    const hasNameFilter = String(state.studentManageQuery.searchName || "").trim().length > 0;
    const hasSchoolFilter = String(state.studentManageQuery.searchSchool || "").trim().length > 0;
    const message = state.students.length === 0
      ? "Belum ada data siswa."
      : (hasGradeFilter || hasNameFilter || hasSchoolFilter ? "Tidak ada siswa yang cocok dengan filter pencarian." : "Tidak ada siswa untuk ditampilkan.");
    el.studentManageTableBody.innerHTML = `<tr><td colspan="7" class="empty">${message}</td></tr>`;
    return;
  }

  el.studentManageTableBody.innerHTML = pageItems
    .map((row, pageIndex) => {
      const { student: s, sourceIndex } = row;
      const rowNumber = ((currentPage - 1) * state.studentManageQuery.pageSize) + pageIndex + 1;
      return `
      <tr>
        <td>${rowNumber}</td>
        <td><input type="text" data-row="${sourceIndex}" data-field="nickname" value="${escapeHtml(s.nickname || "")}" /></td>
        <td><input type="text" data-row="${sourceIndex}" data-field="fullName" value="${escapeHtml(s.fullName || "")}" /></td>
        <td><input type="number" min="1" max="13" step="1" data-row="${sourceIndex}" data-field="kelas" value="${escapeHtml(s.kelas || "")}" /></td>
        <td><input type="text" data-row="${sourceIndex}" data-field="sekolah" value="${escapeHtml(s.sekolah || "")}" /></td>
        <td><code>${escapeHtml(s.studentId || "-")}</code></td>
        <td>
          <div class="student-row-actions">
            <button type="button" class="btn" title="Edit Detail" data-edit-student="${sourceIndex}">Detail</button>
            <button type="button" class="icon-btn save" title="Simpan" data-save-student="${sourceIndex}">&#128190;</button>
            <button type="button" class="icon-btn delete" title="Soft Delete" data-remove-student="${sourceIndex}">&#128465;</button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}

function tarifMapToManageRows(map) {
  const out = [];
  const appendRows = (key, dayLabel) => {
    const entries = Object.entries(map?.[key] || {}).map(([count, tariff]) => ({ count: Number(count), tariff: Number(tariff) }));
    entries.sort((a, b) => a.count - b.count).forEach((entry) => {
      out.push({
        jenis_hari: dayLabel,
        jumlah_peserta: String(entry.count),
        tarif_per_jam: String(entry.tariff),
      });
    });
  };
  appendRows("weekdays", "weekdays");
  appendRows("saturday", "sabtu");
  appendRows("sunday", "minggu");
  return out;
}

function normalizeTarifDayLabel(text) {
  const value = String(text || "").trim().toLowerCase();
  if (["weekdays", "weekday", "weekdays", "senin-jumat", "senin sampai jumat", "hari kerja"].includes(value)) return "weekdays";
  if (["sabtu", "saturday"].includes(value)) return "sabtu";
  if (["minggu", "sunday"].includes(value)) return "minggu";
  return "";
}

function validatePricingManageRows(rows) {
  const normalized = [];
  const seen = new Set();

  for (let index = 0; index < (rows || []).length; index += 1) {
    const row = rows[index] || {};
    const day = normalizeTarifDayLabel(row.jenis_hari);
    const peserta = Number.parseInt(String(row.jumlah_peserta || "").trim(), 10);
    const tarif = Number.parseInt(String(row.tarif_per_jam || "").trim(), 10);

    if (!day) {
      return { ok: false, message: `Baris ${index + 1}: jenis hari harus weekdays, sabtu, atau minggu.` };
    }
    if (!Number.isInteger(peserta) || peserta <= 0) {
      return { ok: false, message: `Baris ${index + 1}: jumlah peserta harus bilangan bulat positif.` };
    }
    if (!Number.isInteger(tarif) || tarif <= 0) {
      return { ok: false, message: `Baris ${index + 1}: tarif per jam harus bilangan bulat positif.` };
    }

    const key = `${day}:${peserta}`;
    if (seen.has(key)) {
      return { ok: false, message: `Baris ${index + 1}: kombinasi hari dan jumlah peserta duplikat.` };
    }
    seen.add(key);
    normalized.push({ jenis_hari: day, jumlah_peserta: String(peserta), tarif_per_jam: String(tarif) });
  }

  return { ok: true, rows: normalized };
}

function serializePricingManageRows(rows) {
  const validation = validatePricingManageRows(rows);
  if (!validation.ok) throw new Error(validation.message);
  const normalized = validation.rows;

  return serializeRowsToCsv([
    ["jenis_hari", "jumlah_peserta", "tarif_per_jam"],
    ...normalized.map((r) => [r.jenis_hari, r.jumlah_peserta, r.tarif_per_jam]),
  ]);
}

function applyPricingFromManagement(notify = true) {
  let csv;
  try {
    csv = serializePricingManageRows(state.pricingManageRows);
  } catch (err) {
    alert(err.message);
    return false;
  }
  if (el.csvEditorPricing) el.csvEditorPricing.value = csv;
  applyPricingCsv(csv, notify);
  syncCsvEditorsFromState();
  return true;
}

function renderPricingManagementTable() {
  if (!el.pricingManageTableBody) return;
  if (!state.pricingManageRows.length) {
    el.pricingManageTableBody.innerHTML = '<tr><td colspan="5" class="empty">Belum ada data tarif.</td></tr>';
    return;
  }

  el.pricingManageTableBody.innerHTML = state.pricingManageRows
    .map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>
          <select data-row="${index}" data-field="jenis_hari">
            <option value="weekdays" ${normalizeTarifDayLabel(row.jenis_hari || "") === "weekdays" ? "selected" : ""}>weekdays</option>
            <option value="sabtu" ${normalizeTarifDayLabel(row.jenis_hari || "") === "sabtu" ? "selected" : ""}>sabtu</option>
            <option value="minggu" ${normalizeTarifDayLabel(row.jenis_hari || "") === "minggu" ? "selected" : ""}>minggu</option>
          </select>
        </td>
        <td><input type="number" min="1" data-row="${index}" data-field="jumlah_peserta" value="${escapeHtml(row.jumlah_peserta || "")}" /></td>
        <td><input type="number" min="0" data-row="${index}" data-field="tarif_per_jam" value="${escapeHtml(row.tarif_per_jam || "")}" /></td>
        <td><button type="button" class="btn" data-remove-pricing="${index}">Hapus</button></td>
      </tr>
    `)
    .join("");
}

function discountListToManageRows(list) {
  return (list || []).map((d) => ({
    min_durasi: String(d.min),
    max_durasi: String(d.max),
    diskon_persen: String(d.persen),
  }));
}

function validateDiscountManageRows(rows) {
  const normalized = [];
  let previousMax = -Infinity;
  const ordered = (rows || [])
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const minA = Number.parseFloat(String(a.row?.min_durasi || "").trim().replace(",", "."));
      const minB = Number.parseFloat(String(b.row?.min_durasi || "").trim().replace(",", "."));
      return minA - minB;
    });

  for (const item of ordered) {
    const row = item.row || {};
    const index = item.index;
    const min = Number.parseFloat(String(row.min_durasi || "").trim().replace(",", "."));
    const max = Number.parseFloat(String(row.max_durasi || "").trim().replace(",", "."));
    const persen = Number.parseFloat(String(row.diskon_persen || "").trim().replace(",", "."));

    if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(persen)) {
      return { ok: false, message: `Baris ${index + 1}: min, max, dan persen harus angka yang valid.` };
    }
    if (min < 0 || max < 0) {
      return { ok: false, message: `Baris ${index + 1}: durasi tidak boleh negatif.` };
    }
    if (min > max) {
      return { ok: false, message: `Baris ${index + 1}: min durasi tidak boleh lebih besar dari max durasi.` };
    }
    if (persen < 0 || persen > 100) {
      return { ok: false, message: `Baris ${index + 1}: diskon persen harus di antara 0 dan 100.` };
    }
    if (min <= previousMax) {
      return { ok: false, message: `Baris ${index + 1}: rentang diskon tumpang tindih dengan baris sebelumnya.` };
    }

    previousMax = max;
    normalized.push({ min, max, persen });
  }

  return { ok: true, rows: normalized };
}

function serializeDiscountManageRows(rows) {
  const validation = validateDiscountManageRows(rows);
  if (!validation.ok) throw new Error(validation.message);
  const normalized = validation.rows;

  return serializeRowsToCsv([
    ["min_durasi", "max_durasi", "diskon_persen"],
    ...normalized.map((r) => [String(r.min_durasi), String(r.max_durasi), String(r.persen)]),
  ]);
}

function applyDiscountFromManagement(notify = true) {
  let csv;
  try {
    csv = serializeDiscountManageRows(state.discountManageRows);
  } catch (err) {
    alert(err.message);
    return false;
  }
  if (el.csvEditorDiscount) el.csvEditorDiscount.value = csv;
  applyDiscountCsv(csv, notify);
  syncCsvEditorsFromState();
  return true;
}

function renderDiscountManagementTable() {
  if (!el.discountManageTableBody) return;
  if (!state.discountManageRows.length) {
    el.discountManageTableBody.innerHTML = '<tr><td colspan="5" class="empty">Belum ada data diskon.</td></tr>';
    return;
  }

  el.discountManageTableBody.innerHTML = state.discountManageRows
    .map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><input type="number" min="0" step="0.01" data-row="${index}" data-field="min_durasi" value="${escapeHtml(row.min_durasi || "")}" /></td>
        <td><input type="number" min="0" step="0.01" data-row="${index}" data-field="max_durasi" value="${escapeHtml(row.max_durasi || "")}" /></td>
        <td><input type="number" min="0" step="0.01" data-row="${index}" data-field="diskon_persen" value="${escapeHtml(row.diskon_persen || "")}" /></td>
        <td><button type="button" class="btn" data-remove-discount="${index}">Hapus</button></td>
      </tr>
    `)
    .join("");
}

function bankListToManageRows(list) {
  return (list || []).map((b) => ({
    nama_pengajar: String(b.namaPengajar || ""),
    label_rekening: String(b.label || "Utama"),
    bank: String(b.bank || ""),
    nomor_rekening: String(b.nomor || ""),
    atas_nama: String(b.atasNama || ""),
  }));
}

function validateBankManageRows(rows) {
  const normalized = [];

  for (let index = 0; index < (rows || []).length; index += 1) {
    const row = rows[index] || {};
    const namaPengajar = String(row.nama_pengajar || "").trim();
    const label = String(row.label_rekening || "Utama").trim() || "Utama";
    const bank = String(row.bank || "").trim();
    const nomor = String(row.nomor_rekening || "").replace(/[^0-9]/g, "");
    const atasNama = String(row.atas_nama || "").trim() || namaPengajar;

    if (!namaPengajar) {
      return { ok: false, message: `Baris ${index + 1}: nama pengajar wajib diisi.` };
    }
    if (!bank) {
      return { ok: false, message: `Baris ${index + 1}: nama bank wajib diisi.` };
    }
    if (nomor.length < 5) {
      return { ok: false, message: `Baris ${index + 1}: nomor rekening harus berisi minimal 5 digit angka.` };
    }

    normalized.push({ nama_pengajar: namaPengajar, label_rekening: label, bank, nomor_rekening: nomor, atas_nama: atasNama });
  }

  return { ok: true, rows: normalized };
}

function serializeBankManageRows(rows) {
  const validation = validateBankManageRows(rows);
  if (!validation.ok) throw new Error(validation.message);
  const normalized = validation.rows;

  return serializeRowsToCsv([
    ["nama_pengajar", "label_rekening", "bank", "nomor_rekening", "atas_nama"],
    ...normalized.map((r) => [r.nama_pengajar, r.label_rekening, r.bank, r.nomor_rekening, r.atas_nama]),
  ]);
}

function applyBankFromManagement(notify = true) {
  let csv;
  try {
    csv = serializeBankManageRows(state.bankManageRows);
  } catch (err) {
    alert(err.message);
    return false;
  }
  if (el.csvEditorBank) el.csvEditorBank.value = csv;
  applyBankRows(parseCsv(csv), notify, csv);
  syncCsvEditorsFromState();
  return true;
}

function renderBankManagementTable() {
  if (!el.bankManageTableBody) return;
  if (!state.bankManageRows.length) {
    el.bankManageTableBody.innerHTML = '<tr><td colspan="7" class="empty">Belum ada data bank guru.</td></tr>';
    return;
  }

  el.bankManageTableBody.innerHTML = state.bankManageRows
    .map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><input type="text" data-row="${index}" data-field="nama_pengajar" value="${escapeHtml(row.nama_pengajar || "")}" /></td>
        <td><input type="text" data-row="${index}" data-field="label_rekening" value="${escapeHtml(row.label_rekening || "")}" /></td>
        <td><input type="text" data-row="${index}" data-field="bank" value="${escapeHtml(row.bank || "")}" /></td>
        <td><input type="text" data-row="${index}" data-field="nomor_rekening" value="${escapeHtml(row.nomor_rekening || "")}" /></td>
        <td><input type="text" data-row="${index}" data-field="atas_nama" value="${escapeHtml(row.atas_nama || "")}" /></td>
        <td><button type="button" class="btn" data-remove-bank="${index}">Hapus</button></td>
      </tr>
    `)
    .join("");
}

function holidayEntriesToManageRows(entries) {
  return (entries || []).map((item) => ({
    tanggal: String(item.date || ""),
    nama: String(item.name || ""),
    jenis: String(item.label || "libur nasional"),
  }));
}

function validateHolidayManageRows(rows) {
  const normalized = [];
  const seenDates = new Set();

  for (let index = 0; index < (rows || []).length; index += 1) {
    const row = rows[index] || {};
    const tanggal = String(row.tanggal || "").trim();
    const nama = String(row.nama || "").trim();
    const jenisRaw = String(row.jenis || "libur nasional").trim().toLowerCase();
    const jenis = jenisRaw === "cuti bersama" ? "cuti bersama" : (jenisRaw === "libur nasional" ? "libur nasional" : "");

    if (!isValidIsoDate(tanggal)) {
      return { ok: false, message: `Baris ${index + 1}: tanggal harus format YYYY-MM-DD yang valid.` };
    }
    if (!nama) {
      return { ok: false, message: `Baris ${index + 1}: nama hari libur wajib diisi.` };
    }
    if (!jenis) {
      return { ok: false, message: `Baris ${index + 1}: jenis harus libur nasional atau cuti bersama.` };
    }
    if (seenDates.has(tanggal)) {
      return { ok: false, message: `Baris ${index + 1}: tanggal hari libur duplikat.` };
    }

    seenDates.add(tanggal);
    normalized.push({ tanggal, nama, jenis });
  }

  return { ok: true, rows: normalized };
}

function serializeHolidayManageRows(rows) {
  const validation = validateHolidayManageRows(rows);
  if (!validation.ok) throw new Error(validation.message);
  const normalized = validation.rows;

  return serializeRowsToCsv([
    ["tanggal", "nama", "jenis"],
    ...normalized.map((r) => [r.tanggal, r.nama, r.jenis]),
  ]);
}

function applyHolidayFromManagement(notify = true) {
  let csv;
  try {
    csv = serializeHolidayManageRows(state.holidayManageRows);
  } catch (err) {
    alert(err.message);
    return false;
  }
  if (el.csvEditorHoliday) el.csvEditorHoliday.value = csv;
  applyHolidayCsv(csv, notify);
  syncCsvEditorsFromState();
  return true;
}

function renderHolidayManagementTable() {
  if (!el.holidayManageTableBody) return;
  if (!state.holidayManageRows.length) {
    el.holidayManageTableBody.innerHTML = '<tr><td colspan="5" class="empty">Belum ada data hari libur.</td></tr>';
    return;
  }

  el.holidayManageTableBody.innerHTML = state.holidayManageRows
    .map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><input type="date" data-row="${index}" data-field="tanggal" value="${escapeHtml(row.tanggal || "")}" /></td>
        <td><input type="text" data-row="${index}" data-field="nama" value="${escapeHtml(row.nama || "")}" /></td>
        <td>
          <select data-row="${index}" data-field="jenis">
            <option value="libur nasional" ${String(row.jenis || "") === "libur nasional" ? "selected" : ""}>libur nasional</option>
            <option value="cuti bersama" ${String(row.jenis || "") === "cuti bersama" ? "selected" : ""}>cuti bersama</option>
          </select>
        </td>
        <td><button type="button" class="btn" data-remove-holiday="${index}">Hapus</button></td>
      </tr>
    `)
    .join("");
}

function applyStudentPageAction(action, targetPage = null) {
  const { totalPages } = getStudentManagementViewModel();
  const current = state.studentManageQuery.currentPage;
  let next = current;

  if (action === "first") next = 1;
  if (action === "prev") next = Math.max(1, current - 1);
  if (action === "next") next = Math.min(totalPages, current + 1);
  if (action === "last") next = totalPages;
  if (action === "goto") next = Math.min(totalPages, Math.max(1, Number(targetPage || 1)));

  if (next === current) return;
  state.studentManageQuery.currentPage = next;
  renderStudentManagementTable();
}

function getStudentManagementViewModel() {
  const filter = String(state.studentManageQuery.gradeFilter || "").trim().toLowerCase();
  const searchName = normalizeName(state.studentManageQuery.searchName || "");
  const searchSchool = normalizeName(state.studentManageQuery.searchSchool || "");
  const filtered = (state.students || [])
    .map((student, index) => ({ student, sourceIndex: index }))
    .filter(({ student }) => {
      const gradeMatch = !filter || normalizeStudentGradeValue(student?.kelas || "").value === filter;
      if (!gradeMatch) return false;

      const nameHaystack = [student?.nickname || "", student?.fullName || ""]
        .map((item) => normalizeName(item))
        .join(" ");
      const schoolHaystack = normalizeName(student?.sekolah || "");

      const nameMatch = !searchName || nameHaystack.includes(searchName);
      const schoolMatch = !searchSchool || schoolHaystack.includes(searchSchool);
      return nameMatch && schoolMatch;
    });

  const pageSize = Math.max(1, Number.parseInt(String(state.studentManageQuery.pageSize || "15"), 10) || 15);
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, state.studentManageQuery.currentPage || 1), totalPages);
  state.studentManageQuery.currentPage = currentPage;

  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIndex, startIndex + pageSize);

  return { pageItems, totalItems, currentPage, totalPages };
}

function normalizeStudentGradeValue(value) {
  if (value && typeof value === "object" && "value" in value && "label" in value) {
    return {
      value: String(value.value || "").trim().toLowerCase(),
      label: String(value.label || "").trim() || String(value.value || "").trim(),
    };
  }
  const gradeNumber = normalizeGradeNumber(value);
  if (gradeNumber === 13) {
    return { value: "13", label: "13 (Alumni)" };
  }
  if (Number.isInteger(gradeNumber) && gradeNumber >= 1 && gradeNumber <= 12) {
    return { value: String(gradeNumber), label: String(gradeNumber) };
  }
  const raw = String(value || "").trim();
  if (!raw || raw === "-") {
    return { value: "13", label: "13 (Alumni)" };
  }
  return { value: raw.toLowerCase(), label: raw };
}

function compareStudentGradeValues(a, b) {
  const left = normalizeStudentGradeValue(a);
  const right = normalizeStudentGradeValue(b);

  if (left.value === right.value) return 0;
  if (left.value === "13") return 1;
  if (right.value === "13") return -1;

  const leftNumeric = Number.parseFloat(left.label);
  const rightNumeric = Number.parseFloat(right.label);
  const leftIsNumeric = Number.isFinite(leftNumeric) && String(left.label).trim() !== "" && /^\d+(?:[.,]\d+)?$/.test(String(left.label).trim());
  const rightIsNumeric = Number.isFinite(rightNumeric) && String(right.label).trim() !== "" && /^\d+(?:[.,]\d+)?$/.test(String(right.label).trim());

  if (leftIsNumeric && rightIsNumeric) {
    return leftNumeric - rightNumeric;
  }
  if (leftIsNumeric) return -1;
  if (rightIsNumeric) return 1;

  const leftMatch = left.label.match(/^(.*?)(\d+)$/);
  const rightMatch = right.label.match(/^(.*?)(\d+)$/);

  if (leftMatch && rightMatch && leftMatch[1].trim().toLowerCase() === rightMatch[1].trim().toLowerCase()) {
    return Number.parseInt(leftMatch[2], 10) - Number.parseInt(rightMatch[2], 10);
  }

  return left.label.localeCompare(right.label, "id", { numeric: true, sensitivity: "base" });
}

function normalizeStudentsState({ sort = false, syncEditors = false } = {}) {
  let list = (state.students || [])
    .map((s) => normalizeStudentRecord(s, s?.studentId || ""))
    .filter((s) => s.nickname || s.fullName || s.kelas || s.sekolah || s.parentName);

  list = makeNicknamesUnique(list);
  if (sort) list = sortStudentsByNickname(list);

  state.students = list;
  rebuildStudentIndexes(list);
  syncStudentCsvSnapshot(list, { syncEditors });
}

function serializeStudentsToCsv(students) {
  const rows = [
    STUDENT_CSV_HEADERS,
    ...(students || []).map((s, index) => [
      String(index + 1),
      String(s?.fullName || ""),
      String(s?.nickname || ""),
      String(s?.gender || ""),
      String(s?.kelas || ""),
      String(s?.h1 || ""),
      String(s?.nextGrade || ""),
      String(s?.h2 || ""),
      String(s?.sekolah || ""),
      String(s?.studentWhatsapp || ""),
      String(s?.parentName || ""),
      String(s?.parentWhatsapp || ""),
      String(s?.studyHistory || ""),
    ]),
  ];
  return serializeRowsToCsv(rows);
}

async function updateInvoicePaymentStatus(historyId, status, note = "") {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }
  const normalized = normalizeInvoiceStatus(status || "issued");
  const paymentNote = String(note || "").trim();
  const ref = state.firebase.db.collection(FIREBASE_INVOICE_COLLECTION).doc(historyId);
  await ref.set(
    {
      paymentStatus: normalized,
      paymentNote,
      paidAt: normalized === "paid" ? new Date().toISOString() : "",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  setFirebaseStatus(`Status invoice diubah ke ${normalized.toUpperCase()}.`, "ok");
}

function renderInvoiceHistoryTable() {
  if (!el.invoiceHistoryTableBody) return;
  if (state.invoiceHistory.length === 0) {
    el.invoiceHistoryTableBody.innerHTML = '<tr><td colspan="7" class="empty">Belum ada riwayat invoice.</td></tr>';
    return;
  }

  el.invoiceHistoryTableBody.innerHTML = state.invoiceHistory
    .map((item) => {
      const grandTotal = Number(item?.totals?.grandTotal || 0);
      const invoiceDate = parseDateInput(item.invoiceDate || "");
      const paymentDeadline = parseDateInput(item.paymentDeadline || "");
      return `
      <tr>
        <td>${escapeHtml(item.invoiceNo || "-")}</td>
        <td>${invoiceDate ? escapeHtml(formatTanggalWaktu(invoiceDate)) : "-"}</td>
        <td>${paymentDeadline ? escapeHtml(formatTanggalWaktu(paymentDeadline)) : "-"}</td>
        <td>${escapeHtml(getStudentDisplayName(item.student, item.studentDetail || {}))}</td>
        <td>${escapeHtml(item.mode || "-")}</td>
        <td>${formatRupiah(grandTotal)}</td>
        <td>
          <button type="button" class="btn" data-history-id="${escapeHtml(item.historyId || "")}" data-history-action="edit">Edit</button>
          <button type="button" class="btn" data-history-id="${escapeHtml(item.historyId || "")}" data-history-action="view">Lihat</button>
          <button type="button" class="btn" data-history-id="${escapeHtml(item.historyId || "")}" data-history-action="download">Download PNG</button>
          <button type="button" class="btn" data-history-id="${escapeHtml(item.historyId || "")}" data-history-action="delete">Hapus</button>
        </td>
      </tr>`;
    })
    .join("");
}

function showInvoiceHistoryPreview(item) {
  if (!el.invoiceHistoryPreview) return;

  const items = Array.isArray(item.items) ? item.items : [];
  const teacherList = Array.isArray(item.teachers) ? item.teachers.join(", ") : "-";
  const htmlItems = items
    .slice(0, 30)
    .map(
      (row) =>
        `<li>${escapeHtml(row.tanggal || "-")} | ${escapeHtml(row.hari || "-")} | ${escapeHtml(row.pengajar || "-")} | ${escapeHtml(
          row.topik || "-"
        )} | ${formatRupiah(Number(row.subtotal || 0))}</li>`
    )
    .join("");
  const teacherPortions = Array.isArray(item.teacherPortions)
    ? item.teacherPortions
    : calculateTeacherPortions(items, item.totals || {});
  const teacherPortionLines = teacherPortions
    .map((row) => `${row.teacher}: ${formatRupiah(Number(row.net || 0))}`)
    .join(" | ");
  const paymentDeadlineDate = parseDateInput(item.paymentDeadline || item.invoiceDate || "");
  const paymentDeadlineText = paymentDeadlineDate ? formatTanggalWaktu(paymentDeadlineDate) : (item.paymentDeadline || item.invoiceDate || "-");

  el.invoiceHistoryPreview.classList.remove("hidden");
  el.invoiceHistoryPreview.innerHTML = `
    <h4>${escapeHtml(item.invoiceNo || "Invoice")}</h4>
    <div><strong>Siswa:</strong> ${escapeHtml(getStudentDisplayName(item.student, item.studentDetail || {}))}</div>
    <div><strong>Tanggal:</strong> ${escapeHtml(item.invoiceDate || "-")}</div>
    <div><strong>Deadline Pembayaran:</strong> ${escapeHtml(paymentDeadlineText)}</div>
    <div><strong>Mode:</strong> ${escapeHtml(item.mode || "-")}</div>
    <div><strong>Pengajar:</strong> ${escapeHtml(teacherList || "-")}</div>
    <div><strong>Porsi Pengajar:</strong> ${escapeHtml(teacherPortionLines || "-")}</div>
    <div><strong>Total:</strong> ${formatRupiah(Number(item?.totals?.grandTotal || 0))}</div>
    <div><strong>Rincian Sesi:</strong></div>
    <ol class="history-items">${htmlItems || "<li>Tidak ada rincian sesi.</li>"}</ol>
  `;
}

async function loadInvoiceForEditing(item) {
  const items = Array.isArray(item.items) ? item.items : [];
  if (items.length === 0) {
    alert("Invoice ini tidak punya sesi untuk diedit.");
    return;
  }

  await setActiveTab("front");

  if (el.invoiceTitle) {
    el.invoiceTitle.value = String(item.title || "INVOICE LES").trim() || "INVOICE LES";
  }
  if (el.invoiceDate && item.invoiceDate) {
    el.invoiceDate.value = toDateTimeLocalInputOrEmpty(String(item.invoiceDate || "").trim()) || toLocalDateTimeInputValue(new Date());
  }
  if (el.studentSelect) {
    const studentRecord = getStudentRecordFromInvoice(item);
    el.studentSelect.value = studentRecord?.nickname || getStudentDisplayName(item.student, item.studentDetail || {});
    renderStudentDetail();
  }

  const editableSessions = items
    .map((s) => {
      const rawDate = parseDateFlex(String(s.tanggal || "")) || parseDateInput(String(s.tanggal || ""));
      if (!rawDate) return null;
      return buildSession({
        date: rawDate,
        hari: String(s.hari || HARI[rawDate.getDay()] || "-"),
        jamMulai: String(s.jamMulai || "-"),
        jamSelesai: String(s.jamSelesai || "-"),
        pengajar: String(s.pengajar || "-").trim() || "-",
        pesertaCount: Math.max(1, Number.parseInt(String(s.pesertaCount || "1"), 10) || 1),
        durasiOverride: Number(s.durasi || 0),
        topik: String(s.topik || "-").trim() || "-",
        catatan: String(s.catatan || ""),
        source: "front",
      });
    })
    .filter(Boolean);

  if (editableSessions.length === 0) {
    alert("Tidak ada data sesi valid untuk diedit.");
    return;
  }

  state.mode = "front";
  state.sessions = editableSessions;
  state.editingInvoiceHistoryId = String(item.historyId || "").trim();
  state.editingInvoiceMeta = {
    historyId: String(item.historyId || "").trim(),
    invoiceNo: String(item.invoiceNo || "").trim(),
    createdAt: String(item.createdAt || "").trim(),
    paymentStatus: String(item.paymentStatus || "issued").trim(),
    paymentNote: String(item.paymentNote || "").trim(),
    paidAt: String(item.paidAt || "").trim(),
  };
  renderSessionsTable();
  updateTotal();
  alert("Invoice dimuat ke editor. Ubah sesi yang diperlukan lalu klik Generate Invoice untuk memperbarui.");
}

async function confirmAndDeleteInvoice(item) {
  if (!state.firebase.ready || !state.firebase.db) {
    alert("Firebase belum terhubung.");
    return;
  }
  const invoiceNo = String(item?.invoiceNo || "invoice");
  const agree = window.confirm(`Hapus invoice ${invoiceNo}? Data ini tidak bisa dikembalikan.`);
  if (!agree) return;
  const token = window.prompt(`Ketik HAPUS untuk konfirmasi hapus ${invoiceNo}:`, "");
  if (String(token || "").trim().toUpperCase() !== "HAPUS") {
    alert("Penghapusan dibatalkan.");
    return;
  }

  await state.firebase.db.collection(FIREBASE_INVOICE_COLLECTION).doc(String(item.historyId || "")).delete();
  setFirebaseStatus(`Invoice ${invoiceNo} berhasil dihapus.`, "ok");
  await refreshDashboardInvoices({ forceServer: true });
  await loadInvoiceHistory({ direction: "reset", silent: true, forceServer: true });
  if (el.invoiceHistoryPreview) {
    el.invoiceHistoryPreview.classList.add("hidden");
    el.invoiceHistoryPreview.innerHTML = "";
  }
}

function redownloadInvoiceFromHistory(item) {
  const items = Array.isArray(item.items) ? item.items : [];
  const detail = item.studentDetail || {};
  const teachers = Array.isArray(item.teachers) ? item.teachers : [];
  const totals = item.totals || { baseTotal: 0, totalDurasi: 0, diskonPersen: 0, diskonNominal: 0, grandTotal: 0 };
  const teacherPortions = Array.isArray(item.teacherPortions)
    ? item.teacherPortions
    : calculateTeacherPortions(items, totals);
  const paymentDeadline = toDateTimeLocalInputOrEmpty(String(item.paymentDeadline || item.invoiceDate || "").trim());
  const bankList = getBankListForInvoice(teachers);

  const rowsHtml = items
    .map((s, i) => {
      const tanggalRaw = String(s.tanggal || "").trim();
      const tanggalDate = parseDateFlex(tanggalRaw) || parseDateInput(tanggalRaw);
      const tanggalText = tanggalDate ? formatTanggal(tanggalDate) : escapeHtml(tanggalRaw || "-");
      const hari = String(s.hari || "-");
      const jamMulai = String(s.jamMulai || "-");
      const jamSelesai = String(s.jamSelesai || "-");
      const pengajar = String(s.pengajar || "-");
      const topik = String(s.topik || "-");
      const durasi = Number(s.durasi || 0);
      const tarifPerJam = Number(s.tarifPerJam || 0);
      const pesertaCount = Number(s.pesertaCount || 1);
      const subtotal = Number(s.subtotal || 0);
      const catatan = String(s.catatan || "-");

      return `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(hari)}</td>
        <td>${tanggalText}</td>
        <td>${escapeHtml(formatJamRange(jamMulai, jamSelesai))}</td>
        <td>${escapeHtml(pengajar)}</td>
        <td>${escapeHtml(topik)}</td>
        <td>${durasi.toFixed(2)}</td>
        <td>${formatRupiah(tarifPerJam)}</td>
        <td>${pesertaCount}</td>
        <td>${formatRupiah(subtotal)}</td>
        <td>${escapeHtml(catatan)}</td>
      </tr>
    `;
    })
    .join("");

  const invoiceDate = parseDateInput(String(item.invoiceDate || "")) || new Date();
  const invoiceNo = String(item.invoiceNo || "INV").trim() || "INV";
  const schoolAndClass = `${detail.sekolah || "-"} / ${detail.kelas || "-"}`;

  el.preview.innerHTML = `
    <article class="invoice-sheet landscape">
      <div class="print-page-header">
        <div><strong>${escapeHtml(invoiceNo)}</strong></div>
        <div class="print-header-logo"><img src="${escapeHtml(APP_ASSETS.logo)}" alt="Logo" /></div>
      </div>

      <div class="invoice-top">
        <div class="invoice-left">
          <div class="invoice-title-box"><div class="invoice-title">${escapeHtml(item.title || "INVOICE")}</div></div>
          <div class="badge">
            <div><strong>No:</strong> ${escapeHtml(invoiceNo)}</div>
            <div><strong>Tanggal:</strong> ${formatTanggalWaktu(invoiceDate)}</div>
          </div>
        </div>
        <div class="invoice-right">
          <div class="invoice-logo" aria-label="Logo Rumah Belajar Pak Gun">
            <img src="${escapeHtml(APP_ASSETS.logo)}" alt="Logo Rumah Belajar Pak Gun" onload="this.nextElementSibling.style.display='none';" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
            <span class="logo-fallback">LOGO</span>
          </div>
        </div>
      </div>

      <section class="student-info-box">
        <div><strong>Nama Siswa:</strong> ${escapeHtml(item.student || "-")}</div>
        <div><strong>Nama Lengkap:</strong> ${escapeHtml(detail.fullName || "-")}</div>
        <div><strong>Nama Orang Tua:</strong> ${escapeHtml(detail.parentName || "-")}</div>
        <div><strong>Sekolah / Kelas:</strong> ${escapeHtml(schoolAndClass)}</div>
        <div class="student-full"><strong>Pengajar Terlibat:</strong> ${escapeHtml(teachers.join(", ") || "-")}</div>
      </section>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Hari</th>
            <th>Tanggal</th>
            <th>Jam</th>
            <th>Pengajar</th>
            <th>Topik/Mapel</th>
            <th>Durasi</th>
            <th>Tarif/Jam</th>
            <th>Peserta</th>
            <th>Subtotal</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>

      <div class="portion-box">
        <h4>Porsi Pembayaran per Pengajar</h4>
        <table class="portion-table">
          <thead>
            <tr>
              <th>Pengajar</th>
              <th>Durasi</th>
              <th>Sesi</th>
              <th>Biaya Akhir</th>
            </tr>
          </thead>
          <tbody>${renderTeacherPortionRows(teacherPortions)}</tbody>
        </table>
      </div>

      <div class="invoice-footer-grid">
        <div class="bank-box">
          <h4>Informasi Pembayaran</h4>
          ${renderAllBankRows(bankList)}
          <label class="deadline-field">
            <span>Deadline Pembayaran</span>
            <input id="invoiceDeadline" type="datetime-local" step="1" value="${escapeHtml(paymentDeadline)}" disabled />
          </label>
        </div>

        <div class="total-box">
          <div><span>Total Durasi</span><span>${Number(totals.totalDurasi || 0).toFixed(2)} jam</span></div>
          <div><span>Subtotal</span><span>${formatRupiah(Number(totals.baseTotal || 0))}</span></div>
          <div><span>Diskon Invoice</span><span>${Number(totals.diskonPersen || 0)}% (${formatRupiah(Number(totals.diskonNominal || 0))})</span></div>
          <div><span>Total Tagihan</span><span>${formatRupiah(Number(totals.grandTotal || 0))}</span></div>
        </div>
      </div>

      <div class="print-page-footer">
        <span>${escapeHtml(invoiceNo)}</span>
        <span>${escapeHtml(formatTanggalWaktu(invoiceDate))} | <span class="page-count"></span></span>
      </div>
    </article>
  `;

  state.currentInvoiceId = invoiceNo;
  el.btnDownloadPng.disabled = false;
  if (el.btnPreviewPng) el.btnPreviewPng.disabled = false;
  void downloadPng();
}

function bankGuruToRows(bankList) {
  return [
    ["nama_pengajar", "label_rekening", "bank", "nomor_rekening", "atas_nama"],
    ...bankList.map((b) => [b.namaPengajar, b.label, b.bank, b.nomor, b.atasNama]),
  ];
}

function serializeRowsToCsv(rows) {
  return (rows || [])
    .map((row) =>
      (row || [])
        .map((value) => {
          const text = String(value ?? "");
          return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
        })
        .join(",")
    )
    .join("\n");
}
