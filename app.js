const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const FIREBASE_CONFIG_STORAGE_KEY = "invoice-firebase-config";
const DEFAULT_TEACHER_STORAGE_KEY = "invoice-default-teacher";
const FIREBASE_SOURCE_COLLECTION = "invoice_sources";
const FIREBASE_INVOICE_COLLECTION = "invoice_records";
const FIREBASE_SOURCE_KINDS = ["students", "pricing", "discount", "bank", "holiday", "attendance", "template_after"];
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const state = {
  mode: "front",
  currentInvoiceId: "",
  autoLoadTried: false,
  students: [],
  studentsByNickname: new Map(),
  absensiRows: [],
  absensiHeaders: [],
  sessions: [],
  tarif: {
    weekdays: {},
    saturday: {},
    sunday: {},
  },
  diskonDurasi: [],
  bankGuru: [],
  holidaySet: new Set(),
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
  modeRadios: document.querySelectorAll('input[name="modePembayaran"]'),
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

  sessionsTitle: document.getElementById("sessionsTitle"),
  tableBody: document.querySelector("#sessionsTable tbody"),
  btnGenerate: document.getElementById("btnGenerate"),
  btnDownloadPng: document.getElementById("btnDownloadPng"),
  btnPreviewPng: document.getElementById("btnPreviewPng"),
  preview: document.getElementById("invoicePreview"),
  btnRefreshInvoiceHistory: document.getElementById("btnRefreshInvoiceHistory"),
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
  el.invoiceDate.value = toLocalDateInputValue(today);
  el.frontStartDate.value = toLocalDateInputValue(today);

  bindEvents();
  applyRuntimeModeHints();
  hydrateFirebaseConfigInputs();
  parseHolidaySetFromInput();
  applyModeUI();
  refreshWeeklyTeacherOptions();
  applyDefaultTeacherToWeekTable();
  refreshFirebaseButtons();
  syncCsvEditorsFromState();
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
  el.modeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      state.mode = radio.value;
      applyModeUI();
      clearPreview();
    });
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
      loadMasterStudentsCsv(await fetchCsv("REKAP DATA SISWA.csv", "Tidak bisa memuat REKAP DATA SISWA.csv"));
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
      applyPricingCsv(await fetchCsv("tarif.csv", "Tidak bisa memuat tarif.csv"));
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
      applyDiscountCsv(await fetchCsv("diskon_durasi.csv", "Tidak bisa memuat diskon_durasi.csv"));
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
      const text = await fetchCsv("bank_guru.csv", "Tidak bisa memuat bank_guru.csv");
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
      const text = await fetchCsv("hari_libur.csv", "Tidak bisa memuat hari_libur.csv");
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
    loadAbsensiCsv(await file.text());
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
      loadAbsensiCsv(await fetchCsv(url, "Gagal mengambil absensi dari Google Sheet."));
    } catch (err) {
      alert(err.message);
    }
  });

  el.btnApplyAfterInvoiceDate?.addEventListener("click", () => {
    if (!el.afterInvoiceDateSelect?.value) return;
    el.invoiceDate.value = el.afterInvoiceDateSelect.value;
  });

  el.afterInvoiceDateSelect?.addEventListener("change", () => {
    if (!el.afterInvoiceDateSelect.value) return;
    el.invoiceDate.value = el.afterInvoiceDateSelect.value;
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
  el.btnDownloadPng.addEventListener("click", downloadPng);
  if (el.btnPreviewPng) el.btnPreviewPng.addEventListener("click", downloadPng);
  el.btnRefreshInvoiceHistory?.addEventListener("click", async () => {
    try {
      await loadInvoiceHistory();
    } catch (err) {
      setFirebaseStatus(err.message || "Gagal memuat riwayat invoice.", "error");
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
    if (action === "download") {
      redownloadInvoiceFromHistory(item);
      return;
    }
    showInvoiceHistoryPreview(item);
  });
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
    [el.btnCsvSaveStudents, () => saveSingleSourceToFirebase("students")],
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
      loadMasterStudentsCsv(await fetchCsv("REKAP DATA SISWA.csv", ""));
    } catch {
      // ignore
    }
  }

  try {
    applyPricingCsv(await fetchCsv("tarif.csv", ""), false);
  } catch {
    // ignore
  }

  try {
    applyDiscountCsv(await fetchCsv("diskon_durasi.csv", ""), false);
  } catch {
    // ignore
  }

  try {
    const bankText = await fetchCsv("bank_guru.csv", "");
    applyBankRows(parseCsv(bankText), false, bankText);
  } catch {
    // ignore
  }

  try {
    applyHolidayCsv(await fetchCsv("hari_libur.csv", ""), false);
  } catch {
    // ignore
  }

  try {
    state.sourceTexts.template_after = await fetchCsv("template_payment_after.csv", "");
  } catch {
    // ignore
  }

  syncCsvEditorsFromState();
}

async function loadBundledFallbackSources() {
  const loaded = [];

  if (state.students.length === 0) {
    try {
      loadMasterStudentsCsv(await fetchCsv("REKAP DATA SISWA.csv", ""));
      loaded.push("siswa");
    } catch {
      // ignore
    }
  }

  if (!hasTarif(state.tarif)) {
    try {
      applyPricingCsv(await fetchCsv("tarif.csv", ""), false);
      loaded.push("tarif");
    } catch {
      // ignore
    }
  }

  if ((state.diskonDurasi || []).length === 0) {
    try {
      applyDiscountCsv(await fetchCsv("diskon_durasi.csv", ""), false);
      loaded.push("diskon");
    } catch {
      // ignore
    }
  }

  if ((state.bankGuru || []).length === 0) {
    try {
      const bankText = await fetchCsv("bank_guru.csv", "");
      applyBankRows(parseCsv(bankText), false, bankText);
      loaded.push("rekening");
    } catch {
      // ignore
    }
  }

  if ((state.holidaySet || new Set()).size === 0) {
    try {
      applyHolidayCsv(await fetchCsv("hari_libur.csv", ""), false);
      loaded.push("libur");
    } catch {
      // ignore
    }
  }

  if (!String(state.sourceTexts.template_after || "").trim()) {
    try {
      state.sourceTexts.template_after = await fetchCsv("template_payment_after.csv", "");
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
    { file: "REKAP DATA SISWA.csv", kind: "siswa", run: async (text) => loadMasterStudentsCsv(text) },
    { file: "tarif.csv", kind: "tarif", run: async (text) => applyPricingCsv(text, false) },
    { file: "diskon_durasi.csv", kind: "diskon", run: async (text) => applyDiscountCsv(text, false) },
    { file: "bank_guru.csv", kind: "rekening", run: async (text) => applyBankRows(parseCsv(text), false, text) },
    { file: "hari_libur.csv", kind: "libur", run: async (text) => applyHolidayCsv(text, false) },
    { file: "template_payment_after.csv", kind: "template_after", run: async (text) => { state.sourceTexts.template_after = text; } },
  ];

  const loaded = [];
  for (const item of loaders) {
    try {
      const text = await fetchCsv(item.file, "");
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

function applyModeUI() {
  const isFront = state.mode === "front";
  el.frontSection.classList.toggle("hidden", !isFront);
  el.afterSection.classList.toggle("hidden", isFront);
  el.sessionsTitle.textContent = isFront ? "Daftar Sesi Mingguan (Payment in Front)" : "Daftar Sesi Unpaid (Payment After)";

  if (!isFront) {
    updateAfterInvoiceDateOptions();
  }

  if (isFront) {
    state.sessions = [];
    renderSessionsTable();
    updateTotal();
  }
}

function loadMasterStudentsCsv(text) {
  const rows = parseCsv(text);
  const parsed = sortStudentsByNickname(parseMasterStudents(rows));
  if (parsed.length === 0) {
    alert("Data siswa tidak valid. Pastikan ada kolom nama siswa.");
    return;
  }

  state.students = parsed;
  state.studentsByNickname = new Map(parsed.map((s) => [normalizeName(s.nickname), s]));
  state.sourceTexts.students = text;
  fillStudentSelect(parsed.map((s) => s.nickname));
  renderStudentDetail();

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

  if (state.mode === "after") hydrateAfterSessionsForSelectedStudent();
}

function applyPricingCsv(text, notify = true) {
  const map = parseTarifCsv(parseCsv(text));
  if (!hasTarif(map)) {
    alert("Format tarif tidak valid. Gunakan: jenis_hari,jumlah_peserta,tarif_per_jam");
    return;
  }

  state.tarif = map;
  state.sourceTexts.pricing = text;
  recalcSessions();
  if (notify) alert("Tarif berhasil dimuat.");
}

function applyDiscountCsv(text, notify = true) {
  const list = parseDiscountCsv(parseCsv(text));
  if (list.length === 0) {
    alert("Format diskon tidak valid. Gunakan: min_durasi,max_durasi,diskon_persen");
    return;
  }

  state.diskonDurasi = list;
  state.sourceTexts.discount = text;
  recalcSessions();
  if (notify) alert("Diskon durasi berhasil dimuat.");
}

function applyBankRows(rows, notify = true, rawText = "") {
  const parsed = parseBankRows(rows);
  if (parsed.length === 0) {
    alert("File rekening guru tidak valid.");
    return;
  }

  state.bankGuru = parsed;
  state.sourceTexts.bank = rawText || serializeRowsToCsv(rows);
  refreshWeeklyTeacherOptions();
  applyDefaultTeacherToWeekTable();
  if (notify) alert("Data rekening guru berhasil dimuat.");
}

function applyHolidayCsv(text, notify = true) {
  const dates = parseHolidayCsv(parseCsv(text));
  if (dates.length === 0) {
    alert("Format hari libur tidak valid. Gunakan kolom tanggal atau isi tanggal di kolom pertama.");
    return;
  }

  el.holidayDates.value = dates.join("\n");
  state.sourceTexts.holiday = text;
  parseHolidaySetFromInput();
  recalcSessions();
  if (notify) alert("Hari libur berhasil dimuat.");
}

function parseHolidaySetFromInput() {
  const raw = String(el.holidayDates.value || "");
  const parts = raw
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean);

  state.holidaySet = new Set(parts.filter(isValidIsoDate));
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

      const jamMulai = el.frontWeekTable.querySelector(`input[data-start="${hari}"]`)?.value || "19:30";
      const jamSelesai = el.frontWeekTable.querySelector(`input[data-end="${hari}"]`)?.value || "21:00";
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

function hydrateAfterSessionsForSelectedStudent() {
  const studentName = getSelectedStudentName();
  if (!studentName) {
    state.sessions = [];
    renderSessionsTable();
    return;
  }

  if (state.absensiRows.length === 0 || state.absensiHeaders.length === 0) {
    state.sessions = [];
    renderSessionsTable("Belum ada data absensi. Unggah CSV atau Google Sheet absensi.");
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
  el.invoiceDate.value = preferred;
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

  renderSessionsTable();
  updateTotal();
}

function renderSessionsTable(emptyMsg = "Belum ada sesi. Muat data terlebih dahulu.") {
  if (state.sessions.length === 0) {
    el.tableBody.innerHTML = `<tr><td colspan="11" class="empty">${escapeHtml(emptyMsg)}</td></tr>`;
    return;
  }

  el.tableBody.innerHTML = state.sessions
    .map(
      (s) => `
      <tr data-id="${s.id}" class="${isPublicHoliday(s.tanggal) ? "holiday-row" : ""}">
        <td><input type="checkbox" class="pick" ${s.dipilih ? "checked" : ""} /></td>
        <td>${escapeHtml(s.hari)}</td>
        <td>${formatTanggal(s.tanggal)}</td>
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

  const selected = state.sessions.filter((s) => s.dipilih);
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
  const invoiceDate = parseDateInput(el.invoiceDate.value) || new Date();
  const paymentDeadline = toLocalDateInputValue(invoiceDate);
  const invoiceNo = `INV-${invoiceDate.getFullYear()}${String(invoiceDate.getMonth() + 1).padStart(2, "0")}${String(
    invoiceDate.getDate()
  ).padStart(2, "0")}-${student.replace(/\s+/g, "").slice(0, 6).toUpperCase()}`;
  state.currentInvoiceId = invoiceNo;

  const detail = state.studentsByNickname.get(normalizeName(student));
  const rowsHtml = selected
    .map(
      (s, i) => `
      <tr class="${isPublicHoliday(s.tanggal) ? "invoice-holiday-row" : ""}">
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
        <div class="print-header-logo"><img src="Logo.png" alt="Logo" /></div>
      </div>

      <div class="invoice-top">
        <div class="invoice-left">
          <div class="invoice-title-box"><div class="invoice-title">${escapeHtml(el.invoiceTitle.value || "INVOICE")}</div></div>
          <div class="badge">
            <div><strong>No:</strong> ${escapeHtml(invoiceNo)}</div>
            <div><strong>Tanggal:</strong> ${formatTanggalPanjang(invoiceDate)}</div>
          </div>
        </div>
        <div class="invoice-right">
          <div class="invoice-logo" aria-label="Logo Rumah Belajar Pak Gun">
            <img src="Logo.png" alt="Logo Rumah Belajar Pak Gun" onload="this.nextElementSibling.style.display='none';" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
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
            <input id="invoiceDeadline" type="date" value="${paymentDeadline}" />
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
        <span class="page-count"></span>
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
        state.lastInvoiceRecord.paymentDeadline = String(deadlineInput.value || "").trim() || state.lastInvoiceRecord.invoiceDate;
        if (state.firebase.ready) {
          void saveInvoiceRecordToFirebase({ silent: true }).catch(() => {
            // ignore background autosave failures; manual save button remains available
          });
        }
      }
    });
  }

  state.lastInvoiceRecord = {
    invoiceNo,
    createdAt: new Date().toISOString(),
    mode: state.mode,
    title: String(el.invoiceTitle.value || "INVOICE LES").trim(),
    student,
    invoiceDate: toLocalDateInputValue(invoiceDate),
    paymentDeadline,
    teachers,
    teacherPortions,
    totals,
    studentDetail: {
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
  const s = state.studentsByNickname.get(normalizeName(getSelectedStudentName()));
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
    const current = grouped.get(teacher) || { teacher, sessions: 0, duration: 0, gross: 0 };
    current.sessions += 1;
    current.duration += Number(row?.durasi || 0);
    current.gross += Number(row?.subtotal || 0);
    grouped.set(teacher, current);
  });

  const entries = Array.from(grouped.values()).sort((a, b) => a.teacher.localeCompare(b.teacher, "id"));
  if (entries.length === 0) return [];

  const fallbackBase = entries.reduce((sum, row) => sum + row.gross, 0);
  const baseTotal = Number(totals?.baseTotal || fallbackBase);
  const totalDiscount = Number(totals?.diskonNominal || 0);
  let allocatedDiscount = 0;

  return entries.map((entry, index) => {
    let discount = 0;
    if (totalDiscount > 0 && baseTotal > 0) {
      if (index === entries.length - 1) {
        discount = Math.max(0, totalDiscount - allocatedDiscount);
      } else {
        discount = Math.max(0, Math.round((entry.gross / baseTotal) * totalDiscount));
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
  const diskonPersen = pickDiskonByDurasi(totalDurasi);
  const diskonNominal = (baseTotal * diskonPersen) / 100;
  const grandTotal = Math.max(0, baseTotal - diskonNominal);
  return { baseTotal, totalDurasi, diskonPersen, diskonNominal, grandTotal };
}

function parseMasterStudents(rows) {
  if (!rows || rows.length < 2) return [];

  const headers = (rows[0] || []).map((x) => String(x || "").trim().toLowerCase());
  const idxFullName = headers.findIndex((h) => h.includes("nama lengkap siswa"));
  const idxNick = headers.findIndex((h) => h.includes("nama panggilan siswa"));
  const idxKelas = headers.findIndex((h) => h === "kelas");
  const idxSekolah = headers.findIndex((h) => h.includes("sekolah"));
  const idxParent = headers.findIndex((h) => h.includes("nama orang tua") || h.includes("wali"));
  if (idxFullName === -1 && idxNick === -1) return [];

  const out = [];
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const fullName = String(row[idxFullName] || "").trim();
    const nickname = String(row[idxNick] || "").trim() || fullName;
    if (!nickname) continue;

    out.push({
      fullName,
      nickname,
      kelas: String(row[idxKelas] || "").trim(),
      sekolah: String(row[idxSekolah] || "").trim(),
      parentName: String(row[idxParent] || "").trim(),
    });
  }

  return dedupeByNickname(out);
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
  if (!rows || rows.length === 0) return [];

  const header = (rows[0] || []).map((x) => String(x || "").trim().toLowerCase());
  const idxTanggal = header.findIndex((h) => h.includes("tanggal") || h.includes("date"));
  const start = idxTanggal >= 0 ? 1 : 0;

  const set = new Set();
  for (let i = start; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const raw = String(idxTanggal >= 0 ? row[idxTanggal] : row[0] || "").trim();
    if (!raw) continue;
    if (isValidIsoDate(raw)) set.add(raw);
  }

  return [...set].sort();
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

function parseDateInput(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
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
  const saveButtons = [
    el.btnCsvSaveStudents,
    el.btnCsvSavePricing,
    el.btnCsvSaveDiscount,
    el.btnCsvSaveBank,
    el.btnCsvSaveHoliday,
    el.btnCsvSaveAttendance,
    el.btnCsvSaveTemplateAfter,
  ];
  saveButtons.forEach((btn) => {
    if (btn) btn.disabled = !ready;
  });
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

  await loadInvoiceHistory({ silent: true, forceServer });
}

function collectFirebaseSourcePayloads() {
  return FIREBASE_SOURCE_KINDS.map((kind) => {
    if (kind === "bank") {
      return { kind, csvText: state.sourceTexts.bank || serializeRowsToCsv(bankGuruToRows(state.bankGuru)) };
    }
    if (kind === "holiday") {
      return { kind, csvText: state.sourceTexts.holiday || String(el.holidayDates.value || "") };
    }
    return { kind, csvText: state.sourceTexts[kind] || "" };
  }).filter((item) => String(item.csvText || "").trim().length > 0);
}

async function firestoreGet(queryRef, { forceServer = false } = {}) {
  if (!forceServer) return queryRef.get();
  try {
    return await queryRef.get({ source: "server" });
  } catch {
    return queryRef.get();
  }
}

async function loadSourcesFromFirebase({ silent = false, forceServer = false } = {}) {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }

  const uid = state.firebase.user?.uid;
  if (!uid) throw new Error("User Firebase belum siap.");

  const snapshot = await firestoreGet(
    state.firebase.db.collection(FIREBASE_SOURCE_COLLECTION).where("ownerUid", "==", uid),
    { forceServer }
  );
  if (snapshot.empty) {
    const fallbackLoaded = await loadBundledFallbackSources();
    if (fallbackLoaded.length > 0) {
      setFirebaseStatus(`Firebase kosong. Fallback lokal dimuat: ${fallbackLoaded.join(", ")}.`, "ok");
      if (!silent) alert(`Firebase belum punya source. Fallback lokal dimuat: ${fallbackLoaded.join(", ")}`);
      refreshFirebaseButtons();
      return;
    }

    setFirebaseStatus("Firebase terhubung, tetapi belum ada data sumber yang tersimpan dan fallback lokal tidak ditemukan.", "warn");
    if (!silent) alert("Belum ada data sumber di Firebase, dan file fallback lokal juga tidak terbaca.");
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
  if (docsByKind.students?.csvText) {
    loadMasterStudentsCsv(docsByKind.students.csvText);
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
  if (payloads.length === 0) {
    throw new Error("Belum ada source data yang bisa disimpan ke Firebase.");
  }

  const uid = state.firebase.user?.uid;
  if (!uid) throw new Error("User Firebase belum siap.");

  const batch = state.firebase.db.batch();
  payloads.forEach((item) => {
    const ref = state.firebase.db.collection(FIREBASE_SOURCE_COLLECTION).doc(`${uid}__${item.kind}`);
    batch.set(
      ref,
      {
        kind: item.kind,
        csvText: item.csvText,
        ownerUid: uid,
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
  if (!FIREBASE_SOURCE_KINDS.includes(kind)) {
    throw new Error("Jenis CSV tidak valid.");
  }

  applyCsvFromEditor(kind);
  const uid = state.firebase.user?.uid;
  if (!uid) throw new Error("User Firebase belum siap.");

  const csvText = String(state.sourceTexts[kind] || "").trim();
  if (!csvText) throw new Error("CSV kosong. Isi data terlebih dahulu.");

  const ref = state.firebase.db.collection(FIREBASE_SOURCE_COLLECTION).doc(`${uid}__${kind}`);
  await ref.set(
    {
      kind,
      csvText,
      ownerUid: uid,
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

  const uid = state.firebase.user?.uid;
  if (!uid) throw new Error("User Firebase belum siap.");

  const record = {
    ...state.lastInvoiceRecord,
    ownerUid: uid,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  const docId = `${uid}__${sanitizeFileName(state.lastInvoiceRecord.invoiceNo || "INV")}`;
  await state.firebase.db.collection(FIREBASE_INVOICE_COLLECTION).doc(docId).set(record, { merge: true });
  if (!silent) setFirebaseStatus(`Invoice ${state.lastInvoiceRecord.invoiceNo} tersimpan ke Firebase.`, "ok");
}

async function loadInvoiceHistory({ silent = false, forceServer = false } = {}) {
  if (!state.firebase.ready || !state.firebase.db) {
    throw new Error("Firebase belum terhubung.");
  }

  const uid = state.firebase.user?.uid;
  if (!uid) throw new Error("User Firebase belum siap.");

  let snapshot;
  try {
    snapshot = await firestoreGet(
      state.firebase.db
        .collection(FIREBASE_INVOICE_COLLECTION)
        .where("ownerUid", "==", uid)
        .orderBy("updatedAt", "desc")
        .limit(50),
      { forceServer }
    );
  } catch {
    snapshot = await firestoreGet(
      state.firebase.db
        .collection(FIREBASE_INVOICE_COLLECTION)
        .where("ownerUid", "==", uid)
        .orderBy("createdAt", "desc")
        .limit(50),
      { forceServer }
    );
  }

  state.invoiceHistory = snapshot.docs.map((doc) => ({
    historyId: doc.id,
    invoiceNo: doc.data()?.invoiceNo || doc.id,
    ...doc.data(),
  }));

  renderInvoiceHistoryTable();
  if (el.invoiceHistoryStatus) {
    el.invoiceHistoryStatus.textContent = state.invoiceHistory.length
      ? `Menampilkan ${state.invoiceHistory.length} invoice terbaru.`
      : "Belum ada riwayat invoice di Firebase untuk akun ini.";
  }

  if (!silent && state.invoiceHistory.length > 0) {
    setFirebaseStatus(`Riwayat invoice dimuat (${state.invoiceHistory.length} data).`, "ok");
  }
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
      const invoiceDate = item.invoiceDate && isValidIsoDate(item.invoiceDate) ? item.invoiceDate : "-";
      const paymentDeadline = item.paymentDeadline && isValidIsoDate(item.paymentDeadline) ? item.paymentDeadline : "-";
      return `
      <tr>
        <td>${escapeHtml(item.invoiceNo || "-")}</td>
        <td>${invoiceDate === "-" ? "-" : escapeHtml(formatTanggal(new Date(invoiceDate)))}</td>
        <td>${paymentDeadline === "-" ? "-" : escapeHtml(formatTanggal(new Date(paymentDeadline)))}</td>
        <td>${escapeHtml(item.student || "-")}</td>
        <td>${escapeHtml(item.mode || "-")}</td>
        <td>${formatRupiah(grandTotal)}</td>
        <td>
          <button type="button" class="btn" data-history-id="${escapeHtml(item.historyId || "")}" data-history-action="view">Lihat</button>
          <button type="button" class="btn" data-history-id="${escapeHtml(item.historyId || "")}" data-history-action="download">Download PNG</button>
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

  el.invoiceHistoryPreview.classList.remove("hidden");
  el.invoiceHistoryPreview.innerHTML = `
    <h4>${escapeHtml(item.invoiceNo || "Invoice")}</h4>
    <div><strong>Siswa:</strong> ${escapeHtml(item.student || "-")}</div>
    <div><strong>Tanggal:</strong> ${escapeHtml(item.invoiceDate || "-")}</div>
    <div><strong>Deadline Pembayaran:</strong> ${escapeHtml(item.paymentDeadline || item.invoiceDate || "-")}</div>
    <div><strong>Mode:</strong> ${escapeHtml(item.mode || "-")}</div>
    <div><strong>Pengajar:</strong> ${escapeHtml(teacherList || "-")}</div>
    <div><strong>Porsi Pengajar:</strong> ${escapeHtml(teacherPortionLines || "-")}</div>
    <div><strong>Total:</strong> ${formatRupiah(Number(item?.totals?.grandTotal || 0))}</div>
    <div><strong>Rincian Sesi:</strong></div>
    <ol class="history-items">${htmlItems || "<li>Tidak ada rincian sesi.</li>"}</ol>
  `;
}

function redownloadInvoiceFromHistory(item) {
  const items = Array.isArray(item.items) ? item.items : [];
  const detail = item.studentDetail || {};
  const teachers = Array.isArray(item.teachers) ? item.teachers : [];
  const totals = item.totals || { baseTotal: 0, totalDurasi: 0, diskonPersen: 0, diskonNominal: 0, grandTotal: 0 };
  const teacherPortions = Array.isArray(item.teacherPortions)
    ? item.teacherPortions
    : calculateTeacherPortions(items, totals);
  const paymentDeadline = String(item.paymentDeadline || item.invoiceDate || "").trim();
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
        <div class="print-header-logo"><img src="Logo.png" alt="Logo" /></div>
      </div>

      <div class="invoice-top">
        <div class="invoice-left">
          <div class="invoice-title-box"><div class="invoice-title">${escapeHtml(item.title || "INVOICE")}</div></div>
          <div class="badge">
            <div><strong>No:</strong> ${escapeHtml(invoiceNo)}</div>
            <div><strong>Tanggal:</strong> ${formatTanggalPanjang(invoiceDate)}</div>
          </div>
        </div>
        <div class="invoice-right">
          <div class="invoice-logo" aria-label="Logo Rumah Belajar Pak Gun">
            <img src="Logo.png" alt="Logo Rumah Belajar Pak Gun" onload="this.nextElementSibling.style.display='none';" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
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
            <input id="invoiceDeadline" type="date" value="${escapeHtml(paymentDeadline)}" disabled />
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
        <span class="page-count"></span>
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
