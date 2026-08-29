(() => {
  "use strict";

  const zh = {
    availability: "可合作 — 台中",
    localTime: "當地時間：",
    skipContent: "跳到主要內容",
    navJourney: "旅程",
    navProjects: "專案",
    navLife: "生活",
    navSkills: "技能",
    homeHeroKicker: "AI × WEB × PRODUCT",
    homeHeroIntro: "我設計邏輯，再運用 AI、Web 與 API 把它做出來。",
    homeHeroCta: "查看作品",
    homeAboutLabel: "01 — 關於我",
    homeAboutTitle: "我把真實問題，變成<br><em>人們能夠使用的產品。</em>",
    homeAboutBody: "AI 幫助我理解問題；邏輯、結構與決策仍由我負責。",
    homeAboutMore: "更多關於我",
    selectedWorkLabel: "02 — 精選作品",
    selectedWorkIntro: "兩個作品，都從一個真實問題開始。",
    homeAiHeading: "一個駕駛情境。<br><em>少一點切換。</em>",
    homeAiLede: "一個五人專題，把導航、停車、交通資料、語音與 AI 整合在同一個體驗。",
    homeAiExit: "完整案例會說明我的角色、API 流程、模型限制，以及如果重做我會改進什麼。",
    homeJinhongLede: "我第一次為真實企業製作的網站，讓食品機械品牌與產品更容易被找到。",
    homeJinhongNote: "技術支援真實企業需求，但技術本身不是故事。",
    homeContactTitle: "一起讓<br><em>下一個想法成真。</em>",
    homeContactBody: "我對 AI 應用、Web 產品，以及從真實使用者問題開始的工作感興趣。",
    landscapeCaption: "一個值得記住的景色 — 紐西蘭。",
    storyHeroLine: "把想法做成真正有用的數位產品。",
    storyHeroIntro: "我從問題出發，整理邏輯，再運用 AI、Web 與 API，把它做成真正有人能使用的產品。",
    heroProofAi: "團隊組長 · 五人團隊",
    heroProofClient: "真實客戶 · 已上線網站",
    heroProofUsa: "打工旅遊 · 帶回勇氣",
    exploreProjects: "探索作品",
    startStory: "從故事開始",
    currentlyLearning: "正在學習",
    currentlyBuilding: "正在打造",
    currentlyWeb: "網頁體驗",
    currentlyExploring: "正在探索",
    currentlyBased: "所在地",
    journeyHeading: "電腦一直讓我感到有趣。<br><em>但 Coding 並沒有。</em>",
    journey2021Title: "因為從小喜歡電腦，我選擇了資訊管理。",
    journey2021Body: "然後我真正接觸了程式。我常常知道自己想做什麼，卻不知道怎麼把想法變成程式碼。在感受到創造之前，Coding 先讓我感到挫折。",
    journey2022Title: "一個球鞋網站，改變了這種感覺。",
    journey2022Body: "大二第一次上網頁設計課，我做出第一個屬於自己的網站。那是我第一次看見程式碼變成一個能看到、能操作，也讓我感到驕傲的東西。",
    journeyLost: "當時沒有留下備份，網站已經遺失。因此這裡保持誠實：沒有重製的截圖，只留下第一次創造它的記憶。",
    gptChangedTitle: "後來，GPT 改變了我學習的方式。",
    gptChangedBody: "很多以前不知道怎麼問、甚至不敢問的問題，終於可以被一步一步拆開。AI 讓我有方法進入問題。",
    gptPrinciple: "AI 沒有取代思考。<br>它幫助我理解。",
    gptResponsibility: "需求、資料流、邏輯邊界、架構與最後決策，仍然必須由我負責。",
    aiStoryHeading: "一個我每天都會遇到的<br><em>問題。</em>",
    aiStoryLede: "每天上下課的塞車，加上不斷看見台灣交通事故內容，成為五人畢業專題的起點。",
    teamLabel: "團隊",
    aiStepProblemTitle: "有用的資訊，分散在太多地方。",
    aiStepProblemBody: "每一次切換都增加摩擦，而注意力本來應該留在道路上。",
    aiStepIdeaTitle: "把真正有用的部分，整合成一個行車助手。",
    aiStepIdeaBody: "導航、停車、路況、車輛位置、GPT 與語音共享同一個情境。",
    aiStepNavigationTitle: "讓路線與需要的情境留在一起。",
    aiStepNavigationBody: "路線與所需資訊留在同一個體驗，不必再開啟另一個 App。",
    aiStepParkingTitle: "用自然語言詢問附近停車位。",
    aiStepParkingBody: "語音需求轉成結構化查詢，再連接政府停車開放資料。",
    aiStepTrafficTitle: "把交通開放資料變成快速決策。",
    aiStepTrafficBody: "TDX 資料與攝影機畫面協助快速理解道路狀況。",
    aiStepAiTitle: "只有連接到系統時，對話才真正有用。",
    aiStepAiBody: "GPT、語音轉文字與文字轉語音成為操作介面。",
    aiStepModelTitle: "使用 ResNet-18 分類六種交通流量等級。",
    aiStepModelBody: "結果約 70–80%，中間車流等級仍較弱。",
    prototypeTitle: "駕駛提出停車需求後，系統發生什麼事？",
    prototypeBody: "這個原型示範預期的系統流程，不會呼叫即時 API。",
    prototypeButton: "尋找附近停車位",
    prototypeVoice: "駕駛提出需求",
    prototypeStt: "語音轉成文字",
    prototypeGpt: "理解使用意圖",
    prototypeTdx: "查詢開放資料",
    prototypeData: "取得剩餘車位",
    prototypeResponse: "回覆查詢結果",
    modelRealityTitle: "困難的不是讓模型跑起來。<br><em>而是讓整個系統對同一件事有一致理解。</em>",
    failureDatasetTitle: "資料集不夠大",
    failureDatasetBody: "模型沒有看過足夠多樣的道路、天候、距離與攝影機畫質。",
    failureMiddleTitle: "中間等級辨識較弱",
    failureMiddleBody: "相鄰車流等級看起來很接近，因此模型容易混淆介於明顯暢通與明顯壅塞之間的類別。",
    failureConversionTitle: "轉換流程改變了結果",
    failureConversionBody: ".pth 模型必須透過 ONNX 與 TensorFlow Lite 進入 Android，同時 PyTorch 與 Android 的 normalization 也必須一致。",
    fixNormalization: "訓練端與 Android 使用同一套 normalization 定義。",
    fixDataset: "增加、清理並重新平衡資料集。",
    fixMetrics: "分析 Precision、Recall 與 confusion matrix，而不只看 accuracy。",
    rebuildDataset: "更大且更平衡的資料集",
    rebuildUx: "更清楚的交通資訊體驗",
    rebuildAccident: "事故通知",
    rebuildCamera: "測速資訊",
    rebuildAi: "更流暢、更理解情境的 AI 互動",
    openFullCase: "閱讀完整案例",
    jinhongStoryHeading: "我的第一個真實客戶，<br><em>來自一位朋友。</em>",
    jinhongStoryLede: "朋友家中經營食品機械工廠。當他準備承接家業，希望有一個網站能增加品牌曝光，也讓產品目錄更容易被看見。",
    clientBeforeTitle: "一家擁有專業產品的真實企業，卻沒有清楚的數位入口。",
    clientGoalTitle: "讓品牌被看見，也讓產品目錄更容易理解。",
    clientResearchTitle: "先研究產業，再決定網站結構。",
    clientResearchBody: "我研究同產業網站、產品分類、規格，以及採購者在做決定前需要回答的問題。",
    clientDesignTitle: "把大量機械整理成可以理解與瀏覽的資訊架構。",
    clientBuildBody: "我負責介面設計、前端開發、部署，並持續維護這個網站。",
    clientNextBody: "這些是下一步計畫，不會被描述成已完成的工作。",
    usaHeading: "我離開了自己的<br><em>舒適圈。</em>",
    usaSubheading: "我的英文並不好。<br>這正是我想去的原因。",
    usaPhotoStory: "這五張照片從 South Dakota 的遼闊開始，慢慢走近工作、願意理解我的人，以及我帶回家的勇氣。",
    usaPhotoOne: "South Dakota／一個新地方的尺度",
    usaPhotoTwo: "地標／陌生的地方開始變得真實",
    usaPhotoThree: "耐心／英文／被理解",
    usaPhotoFour: "文化／朋友／歸屬感",
    usaPhotoFive: "繼續探索的勇氣",
    usaArrivalTitle: "食物很重口味、很鹹也很甜，水甚至可能比汽水貴。",
    usaArrivalBody: "這些小細節讓我明確感覺自己離家很遠。我必須學會陌生文化的節奏，而不是期待它立刻讓我感到舒服。",
    usaSsnTitle: "申請 SSN 時，我幾乎聽不懂櫃台在說什麼。",
    usaSsnBody: "困難的不只是英文。我甚至不知道該怎麼提出正確問題。最後在 employer 的協助下，我完成了流程。",
    usaWorkTitle: "Hospitality 的工作，代表每天都必須用英文溝通。",
    usaWorkBody: "Kaytlin 很有耐心理解我要表達的意思，也會糾正我的英文。她的善意改變了這段經驗，我一直很感激。",
    courageStatement: "我回到家時，<br><em>帶回了更多勇氣。</em>",
    outsideHeading: "那些讓我保持<br><em>好奇與行動的事。</em>",
    natureMemory: "一段至今仍留在心裡的記憶",
    natureBody: "服完兵役後，我和朋友到紐西蘭旅行。那裡的尺度與自然景色一直留在我心裡。我特別喜歡那些能讓人以最好的方式感覺自己很渺小的地方。",
    natureQuote: "如果有一個景色值得被記住，<br><em>我大概會想親自站在那裡。</em>",
    natureImpression: "我希望朋友看見一個值得探索的地方時，會想到：「洪戎一定會喜歡這裡。」",
    skillsStoryHeading: "工具真正重要的時候，<br><em>是它幫助解決對的問題。</em>",
    skillEvidenceLabel: "使用於",
    nextDirection: "我希望往 AI 應用與產品開發前進，尤其是那些從真實使用者問題開始的產品。",
    nextUnderstand: "理解使用者",
    nextLogic: "設計邏輯",
    nextBuild: "運用 AI / Web / API 實作",
    nextUseful: "做出真正有用的產品",
    usefulCta: "一起打造<br><em>真正有用的產品。</em>",
    contactEndCopy: "我目前開放 Web、AI 應用與產品相關機會，也樂意聊聊一個值得解決的問題。",
    contactFormLink: "聯絡表單 ↗",
    footerStoryLine: "AI × Web × Product — 從好奇、問題與持續學習的勇氣開始。",
    backToStory: "← 回到故事",
    projectOriginLabel: "專案起點",
    myRoleLabel: "我的角色",
    aiDeepLede: "一個從日常問題開始的五人專題：交通資訊很有用，卻分散在太多不同工具裡。",
    aiOriginTitle: "這個想法不是從 AI 開始，而是從每天上課的道路開始。",
    aiOriginP1: "我每天都會遇到塞車，也常看到台灣道路事故的內容。我開始思考：駕駛本來就需要的資訊，能不能被整理成一個更清楚的體驗？",
    aiOriginP2: "目標不是再增加一個儀表板，而是減少在導航、路況、停車與搜尋之間切換，同時保留駕駛當下的任務情境。",
    aiRoleIntro: "我帶領團隊，也處理資料、模型、Android 與成員之間必須彼此一致的交界處。",
    aiRoleTeam: "規劃、任務負責、進度追蹤，以及五人團隊的協調。",
    aiRoleApi: "研究 TDX 開放資料、用 Postman 測試 token 與 API，並整理回傳資料。",
    aiRoleData: "蒐集、清理並準備六個交通等級的路況攝影機圖片。",
    aiRoleModel: "模型訓練、評估、類別分析與轉換問題排查。",
    aiRoleAndroid: "把模型與資料服務連接到 Android 的使用體驗。",
    aiSystemTitle: "一個需求，必須跨過多個系統，才會真正變得有用。",
    aiSystemBody: "語音只是入口。當需求被轉成結構化意圖、送到正確資料來源，再以清楚方式回覆時，產品價值才真正出現。",
    experimentRange: "實驗結果區間",
    accuracyContext: "這是專題中的約略結果，不是正式產品宣稱。比起單一數字，我更在意各個類別的實際表現。",
    middleClassNote: "中間的交通等級更容易彼此混淆。",
    conversionProblem: "模型在 PyTorch 可以運作，但 Android 需要另一條轉換路徑，而且前處理必須完全一致。",
    whatWeChanged: "我們調整了什麼",
    rebuildQuestion: "什麼能讓這個原型，成為更好的產品？",
    jinhongDeepLede: "我第一次為真實企業製作的網站——協助一位準備承接家中食品機械事業的朋友。",
    jinhongOriginTitle: "我的第一個真實客戶，來自一位朋友。",
    jinhongOriginP1: "朋友家中經營食品機械工廠。當他準備承接家業時，希望透過網站增加品牌曝光，也讓客戶能更清楚理解機械產品。",
    jinhongOriginP2: "這改變了工作的責任。我不再只是在完成課堂題目；網站結構、內容與維護決策，都必須對真實企業與真實使用者有意義。",
    beforeInterface: "在介面之前",
    clientResearchDeepTitle: "先理解產業如何描述產品，以及採購者如何尋找產品。",
    researchPeers: "研究同產業公司與產品分類方式",
    researchContent: "整理產品型號、規格與服務內容",
    researchPath: "定義從探索產品到提出詢價的清楚路徑",
    clientDecisionBody: "視覺只有在訪客能從大分類找到正確機械、比較細節，並知道如何詢問時才真正有用。",
    jinhongBuildDeepTitle: "技術支援企業需求，但技術本身不是故事。",
    jinhongBuildDeepBody: "我使用 React 與 TypeScript 建立可重用的產品呈現、響應式版面與更清楚的維護邊界，再部署到 Cloudflare 並持續維護。",
    buildReusable: "可重用、由資料驅動的產品呈現",
    buildResponsive: "響應式版面與無障礙互動",
    buildDeploy: "Cloudflare 部署與維護",
    honestRoadmap: "誠實的後續路線",
    clientSeoTitle: "網站已經上線，下一步是讓真正需要的人找到它。",
    navHome: "首頁",
    navAbout: "關於我",
    navWork: "作品",
    navContact: "聯絡",
    heroEyebrow: "網頁開發者 — 台灣",
    heroHello: "嗨，我是 HongRong。",
    heroTitle: "打造清晰、有個性的",
    heroTitleEm: "數位體驗。",
    heroIntro: "來自台灣的網頁開發者，專注於響應式網站與細膩互動。",
    flipHint: "翻面看看",
    flipRole: "網頁開發者",
    flipBack: "回到正面",
    letsTalk: "聊聊合作",
    seeWork: "看看我的作品",
    heroStat: "資訊管理學系<br>畢業",
    toolkit: "我的工具箱",
    whatIDo: "我能做什麼",
    capabilitiesLabel: "專業能力 — 2026",
    capabilitiesTitle: "專業能力",
    capWebTitle: "網頁開發",
    capWebBody: "打造快速、響應式的網站，兼顧清楚結構、細緻互動與可維護的程式碼。",
    capAiTitle: "AI 與 API 整合",
    capAiBody: "將產品連接到實用的 AI、開放資料與外部服務，同時維持系統簡單、清楚。",
    capAppTitle: "應用程式開發",
    capAppBody: "整合即時資訊、實用功能與直覺流程，打造易於操作的行動體驗。",
    capUxTitle: "UI / UX 思考",
    capUxBody: "透過資訊層級、操作回饋與有意識的視覺決策，讓複雜內容更容易理解。",
    aboutKicker: "作品背後",
    aboutLabel: "關於 HongRong — 2026",
    aboutTitle: "保持好奇，<br>務實地設計。",
    aboutCardCaption: "用好奇心持續打造",
    aboutStatement: "我喜歡把混亂的需求，整理成清楚、好用的系統。",
    aboutBody: "我畢業於世新大學資訊管理學系，曾擔任 AI 行車助手專題組長，也透過美國打工旅遊培養跨文化溝通與適應能力。",
    factOneTitle: "跨領域整合",
    factOneBody: "網頁、App、AI 與數位工具",
    factTwoTitle: "重視團隊",
    factTwoBody: "清楚溝通並主動負責",
    factThreeTitle: "持續學習",
    factThreeBody: "保持好奇、彈性與動手實作",
    moreAbout: "更多關於我",
    inPractice: "實際作品",
    caseStudiesLabel: "精選作品 — 2026",
    selectedWork: "精選作品",
    jinhongTitle: "金虹食品",
    jinhongSummary: "為台灣食品機械公司打造的多頁式產品形象網站。",
    aiDriverTitle: "AI 行車助手",
    aiDriverSummary: "整合導航、語音 AI、停車資料與即時路況的大學專題。",
    viewAllWork: "查看所有作品",
    methodKicker: "方法",
    processLabel: "我的流程 — 2026",
    processTitle: "我的工作方式",
    processOneTime: "從情境開始",
    processOneTitle: "探索與定義",
    processOneBody: "理解受眾、真正的問題，以及成功的體驗應該是什麼樣子。",
    processTwoTime: "建立系統",
    processTwoTitle: "設計與開發",
    processTwoBody: "建立視覺語言，並將它轉化為響應式、容易維護的程式碼。",
    processThreeTime: "持續變好",
    processThreeTitle: "測試與優化",
    processThreeBody: "檢查真實使用體驗、修正細節，並持續改善真正重要的部分。",
    ctaEyebrow: "心中有一個想法嗎？",
    ctaTitle: "一起打造清楚、<br><em>令人記得的作品。</em>",
    startConversation: "開始聊聊",
    footerLine: "位於台中、台灣的網頁開發者。",
    backToTop: "回到頂端 ↑",

    aboutPageEyebrow: "關於我 — HongRong",
    aboutPageTitle: "快速學習，<br><em>用心打造。</em>",
    aboutPageIntro: "我喜歡把設計、技術與真實需求連結起來，做成使用者真的能夠使用的數位體驗。",
    portraitCaption: "HongRong — 網頁開發者",
    myStory: "我的故事",
    fromCuriosity: "從好奇走向專業",
    manifestoTitle: "我喜歡複雜的想法逐漸變得簡單、實用，而且真實可用的那一刻。",
    manifestoP1: "我畢業於世新大學資訊管理學系。我的實作橫跨前端開發、Android 應用程式、AI 服務、API 串接與介面設計。",
    manifestoP2: "擔任 AI 行車助手專題組長時，我規劃里程碑、協調團隊，並參與整合導航、交通開放資料、語音互動與 GPT 對話。",
    manifestoP3: "在南達科他州的打工旅遊經驗，讓我學會跨文化溝通、快速適應，也更能在陌生環境中保持可靠。",
    timelineTitle: "經歷與學歷",
    deadwoodPlace: "The Lodge at Deadwood",
    deadwoodRole: "房務團隊成員 — 美國",
    deadwoodBody: "在南達科他州與國際團隊合作，每天使用英文溝通，並強化適應力、時間管理與責任感。",
    capstonePlace: "大學畢業專題",
    capstoneRole: "AI 行車助手 — 專題組長",
    capstoneBody: "帶領專案規劃與團隊協作，並參與 Android 開發、AI 對話、地圖服務、開放資料 API 與 UI / UX。",
    universityPlace: "世新大學",
    universityRole: "資訊管理學系學士",
    universityBody: "建立軟體開發、資料、數位工具、專案協作與商業思考的跨領域基礎。",
    skillsKicker: "技能與工具",
    whatIBring: "我的能力 — 2026",
    skillsTitle: "務實且持續成長的工具箱",
    matrixWeb: "網頁",
    matrixApp: "應用程式",
    matrixAi: "AI 與資料",
    matrixPeople: "工作方式",
    matrixPeopleBody: "專案規劃 · 團隊合作 · 快速學習 · 跨文化溝通",
    certTitle: "專業認證",
    nextChapter: "下一個篇章",
    aboutCtaTitle: "準備好學習、貢獻，<br><em>並做出好作品。</em>",
    getInTouch: "與我聯絡",
    exploreWork: "瀏覽我的作品",

    workPageEyebrow: "精選作品 — 2026",
    workPageTitle: "從真實需求出發的<br><em>作品。</em>",
    workPageIntro: "這是一組持續增加的網站與應用程式作品，我在其中將實用功能與清楚、有質感的體驗結合。",
    featuredProject: "精選專案",
    jinhongLongSummary: "為台灣食品機械公司打造的完整產品與企業網站，讓大量技術產品更容易瀏覽、比較與詢價。",
    viewCaseStudy: "查看案例",
    liveWebsite: "瀏覽網站",
    sourceCode: "查看原始碼",
    capstoneProject: "大學畢業專題",
    aiDriverLongSummary: "將導航、語音對話、即時路況與停車位資訊整合到單一駕駛介面的 Android 應用程式。",
    throughTheWork: "作品中的原則",
    principlesLabel: "設計原則 — 2026",
    principlesTitle: "每個作品都應該做到的事",
    principleOneTitle: "解決真實問題",
    principleOneBody: "科技有價值，是因為它讓一件真實任務變得更清楚、更快速或更實用。",
    principleTwoTitle: "尊重使用者",
    principleTwoBody: "清楚的結構與可預期的互動是產品的一部分，而不只是裝飾。",
    principleThreeTitle: "經得起實際使用",
    principleThreeBody: "響應式版面、可維護程式碼與仔細測試，讓作品能夠持續發揮作用。",
    nextProject: "下一個專案",
    workCtaTitle: "有一個值得打造的<br><em>問題嗎？</em>",

    backToWork: "← 回到作品",
    jinhongCaseLabel: "企業網站 / 2026",
    jinhongCaseLede: "把龐大的工業產品目錄，轉化為清楚、現代，並支援搜尋、比較與詢價的網站。",
    roleLabel: "角色",
    jinhongRole: "設計與開發",
    stackLabel: "技術",
    outputLabel: "成果",
    jinhongOutput: "多頁式響應網站",
    visitLiveSite: "瀏覽正式網站",
    briefLabel: "專案需求",
    jinhongBriefTitle: "讓深度技術內容，也能輕鬆瀏覽。",
    jinhongBriefP1: "金虹食品需要的不只是一頁公司介紹。網站必須呈現大量機械、型號、規格與服務內容，同時避免讓訪客迷失。",
    jinhongBriefP2: "解法是一套有結構的產品體驗：清楚分類、強而有力的導覽、聚焦的詳細頁，以及從桌機到手機都好用的詢價工具。",
    solutionLabel: "解決方案",
    jinhongFeaturesTitle: "以產品決策為核心的設計",
    megaMenuTitle: "大型選單",
    megaMenuBody: "讓大量產品分類保持可見，並且容易快速掃描。",
    detailPagesTitle: "產品詳細頁",
    detailPagesBody: "每台機械都有獨立頁面，整合圖片、規格與不同型號。",
    compareTitle: "型號比較",
    compareBody: "幫助訪客更快速理解不同設備配置之間的差異。",
    lightboxTitle: "圖片放大",
    lightboxBody: "訪客可以仔細查看設備照片，同時保留瀏覽情境。",
    inquiryTitle: "詢價清單",
    inquiryBody: "訪客可先在瀏覽器收集產品，再一次提出詢價。",
    serviceTitle: "維修服務與地圖",
    serviceBody: "維修實績、服務範圍與地點資訊共同建立信任。",
    buildLabel: "技術實作",
    jinhongBuildTitle: "使用現代技術，同時保持容易維護。",
    jinhongBuildBody: "專案使用 React 與 TypeScript，搭配相容 Next.js App Router 的架構、Vinext / Vite 建置、響應式 CSS 與 Cloudflare Worker 輸出。產品資料與介面分離，讓目錄能持續成長，不必重寫頁面結構。",
    nextCase: "下一個案例",

    aiCaseLabel: "Android 應用程式 / 畢業專題",
    aiCaseLede: "把導航、語音 AI、路況與停車資訊整合到單一介面，打造更專注於駕駛安全的體驗。",
    aiRole: "專題組長 / 開發 / UI UX",
    aiOutput: "可操作的 Android 原型",
    challengeLabel: "挑戰",
    aiChallengeTitle: "減少駕駛分心，同時保留有用資訊。",
    aiChallengeP1: "駕駛常在地圖、路況攝影機、停車 App 與搜尋之間切換。這種碎片化體驗，會在最需要專注道路的時候增加認知負擔。",
    aiChallengeP2: "我們的專題探索如何透過語音互動與整合介面，把最實用的行車資訊集中到一個 Android 應用程式。",
    systemLabel: "系統",
    aiFeaturesTitle: "四項彼此連接的行車工具",
    navigationTitle: "智慧導航",
    navigationBody: "以 Google Maps 為基礎的路線搜尋與 App 內導航情境。",
    voiceTitle: "GPT 語音對話",
    voiceBody: "透過語音轉文字與文字轉語音，讓駕駛以自然語言取得協助。",
    parkingTitle: "停車位資訊",
    parkingBody: "使用政府開放資料，尋找停車場及剩餘車位。",
    trafficTitle: "即時路況",
    trafficBody: "以路況攝影機畫面與道路資訊，協助做出更安全的路線決策。",
    myContributionLabel: "我的貢獻",
    aiContributionTitle: "帶領團隊，同時把系統各部分連接起來。",
    aiContributionBody: "身為專題組長，我協助訂定計畫、分配責任並推動開發；同時參與 Android 實作、外部 API 串接、GPT 對話，以及主要駕駛任務的 UI / UX 流程。",
    aiContributionOne: "專案規劃與團隊協調",
    aiContributionTwo: "Android 介面與操作流程",
    aiContributionThree: "GPT、語音、地圖與開放資料整合",
    aiContributionFour: "系統測試與成果發表",
    keyLearning: "關鍵學習",
    learningQuote: "「一個實用的 AI 產品，不只有模型，更包含它周圍完整的系統：情境、資料、互動與信任。」",
    previousCase: "上一個案例",

    contactLabel: "聯絡 — 2026",
    contactTitle: "一起打造讓人<br><em>記得的作品。</em>",
    contactIntro: "我目前開放網頁開發職缺、接案合作，以及和正在打造實用數位產品的團隊交流。",
    basedIn: "所在地",
    findMeOnline: "社群連結",
    contactNote: "只要是一個好想法、一個認真的團隊，或值得解決的問題，我通常都很樂意聊聊。",
    formName: "你的名字",
    formEmail: "電子郵件",
    formSubject: "想和我聊什麼？",
    subjectJob: "工作機會",
    subjectFreelance: "接案專案",
    subjectCollab: "合作提案",
    subjectHello: "單純打個招呼",
    formMessage: "告訴我更多",
    sendEmail: "建立 Email",
    formNote: "送出後會開啟你的 Email 軟體並填入內容；本網站不會儲存任何資料。"
  };

  const elements = [...document.querySelectorAll("[data-i18n]")];
  elements.forEach((element) => {
    element.dataset.enHtml = element.innerHTML;
  });

  const safeStorage = {
    get(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* local file privacy mode */ }
    }
  };

  const splitScrubText = (language) => {
    document.querySelectorAll("[data-scrub-en]").forEach((element) => {
      const text = language === "zh" ? element.dataset.scrubZh : element.dataset.scrubEn;
      const pieces = language === "zh" ? Array.from(text) : text.split(" ");
      element.innerHTML = pieces
        .filter((piece) => piece !== " ")
        .map((piece) => `<span class="scrub-word">${piece}</span>`)
        .join("");
    });
  };

  const updatePortraitFlipLabel = (button, language) => {
    const flipped = button.classList.contains("is-flipped");
    const label = language === "zh"
      ? (flipped ? "將名片翻回照片正面" : "翻轉照片查看個人名片")
      : (flipped ? "Flip back to portrait" : "Flip portrait to view profile card");
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", String(flipped));
    button.querySelector(".portrait-front")?.setAttribute("aria-hidden", String(flipped));
    button.querySelector(".portrait-back")?.setAttribute("aria-hidden", String(!flipped));
  };

  const applyLanguage = (language) => {
    const resolved = language === "zh" ? "zh" : "en";
    document.documentElement.lang = resolved === "zh" ? "zh-Hant" : "en";
    document.body.dataset.lang = resolved;

    elements.forEach((element) => {
      const key = element.dataset.i18n;
      if (resolved === "zh" && zh[key]) element.innerHTML = zh[key];
      if (resolved === "en") element.innerHTML = element.dataset.enHtml;
    });

    document.querySelectorAll(".language-toggle").forEach((button) => {
      button.textContent = resolved === "zh" ? "EN" : "中文";
      button.setAttribute("aria-label", resolved === "zh" ? "Switch to English" : "切換至繁體中文");
    });
    document.querySelectorAll("[data-portrait-flip]").forEach((button) => updatePortraitFlipLabel(button, resolved));

    const message = document.querySelector('textarea[name="message"]');
    const name = document.querySelector('input[name="name"]');
    if (message) message.placeholder = resolved === "zh" ? "專案、職缺、時間或想法⋯" : "Project, role, timeline, or idea...";
    if (name) name.placeholder = resolved === "zh" ? "名字" : "Name";

    splitScrubText(resolved);
    safeStorage.set("hongrong-language", resolved);
    updateScrub();
    window.requestAnimationFrame(() => window.ScrollTrigger?.refresh());
  };

  document.querySelectorAll(".language-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(document.body.dataset.lang === "zh" ? "en" : "zh");
    });
  });

  function updateScrub() {
    document.querySelectorAll(".scroll-story").forEach((section) => {
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(distance, 1)));
      const words = [...section.querySelectorAll(".scrub-word")];
      words.forEach((word, index) => {
        const start = index / Math.max(words.length, 1);
        const local = Math.max(0, Math.min(1, (progress - start * .72) / .16));
        word.style.opacity = String(.16 + local * .84);
      });
    });
  }

  const menuButton = document.querySelector(".menu-toggle");
  const menuPanel = document.querySelector(".menu-panel");
  menuPanel?.setAttribute("inert", "");
  const setMenu = (open) => {
    if (!menuButton || !menuPanel) return;
    document.body.classList.toggle("menu-open", open);
    menuPanel.classList.toggle("is-open", open);
    menuPanel.setAttribute("aria-hidden", String(!open));
    menuPanel.toggleAttribute("inert", !open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.querySelector("main")?.toggleAttribute("inert", open);
    document.querySelector("footer")?.toggleAttribute("inert", open);
    if (open) window.setTimeout(() => menuPanel.querySelector("a")?.focus(), 40);
  };
  menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  menuPanel?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuButton.focus();
    }
    if (event.key === "Tab" && menuButton?.getAttribute("aria-expanded") === "true") {
      const focusable = [...document.querySelectorAll(".site-header a, .site-header button, .menu-panel a, .menu-panel button")]
        .filter((element) => !element.hasAttribute("disabled") && element.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const localTimeElements = document.querySelectorAll(".local-time");
  const updateTime = () => {
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Taipei",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());
    localTimeElements.forEach((element) => { element.textContent = time; });
  };
  updateTime();
  window.setInterval(updateTime, 1000);

  document.querySelectorAll(".current-year").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const currentPage = document.body.dataset.page;
  document.querySelectorAll("[data-nav-page]").forEach((link) => {
    if (link.dataset.navPage === currentPage) link.classList.add("is-active");
  });

  const scrollNavLinks = [...document.querySelectorAll("[data-scroll-nav]")];
  const scrollSections = [...document.querySelectorAll("[data-scroll-section]")];
  const updateActiveScrollNav = () => {
    if (!scrollNavLinks.length || !scrollSections.length) return;
    const marker = window.scrollY + window.innerHeight * .38;
    let active = "";
    scrollSections.forEach((section) => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      if (top <= marker) active = section.dataset.scrollSection || "";
    });
    scrollNavLinks.forEach((link) => {
      const selected = link.dataset.scrollNav === active;
      link.classList.toggle("is-active", selected);
      if (selected) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: "0px 0px -6%" });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  document.querySelectorAll(".accordion-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".accordion-item");
      const list = item.parentElement;
      list.querySelectorAll(".accordion-item").forEach((other) => {
        const open = other === item ? !other.classList.contains("is-open") : false;
        other.classList.toggle("is-open", open);
        other.querySelector(".accordion-trigger").setAttribute("aria-expanded", String(open));
      });
    });
  });

  const header = document.querySelector(".site-header");
  const finePointer = window.matchMedia("(pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const growthRoute = document.querySelector(".growth-route");
  const growthPath = document.querySelector("[data-growth-path]");
  const growthStart = document.querySelector("[data-story-spine-start]");
  const growthEnd = document.querySelector("[data-story-spine-end]");
  const growthLeaves = [...document.querySelectorAll("[data-growth-threshold]")];
  let growthLength = 0;
  if (growthPath) {
    growthLength = growthPath.getTotalLength();
    growthPath.style.strokeDasharray = String(growthLength);
    growthPath.style.strokeDashoffset = String(growthLength);
  }

  const updateGrowthRoute = () => {
    if (!growthRoute || !growthPath || !growthStart || !growthEnd) return;
    const sequence = growthStart.closest("[data-scene-sequence]");
    const start = sequence
      ? sequence.getBoundingClientRect().top + window.scrollY + window.innerHeight * .55
      : growthStart.getBoundingClientRect().top + window.scrollY;
    const end = growthEnd.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
    const progress = reducedMotion.matches ? 1 : Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(end - start, 1)));
    growthPath.style.strokeDashoffset = String(growthLength * (1 - progress));
    growthRoute.classList.toggle("is-active", window.scrollY >= start - window.innerHeight * .35 && window.scrollY <= end + window.innerHeight * .65);
    growthLeaves.forEach((leaf) => leaf.classList.toggle("is-grown", progress >= Number(leaf.dataset.growthThreshold || 0)));
  };

  const aiSteps = [...document.querySelectorAll("[data-ai-step]")];
  const aiPanels = [...document.querySelectorAll("[data-ai-panel]")];
  const phoneState = document.querySelector("[data-phone-state]");
  const aiVinePath = document.querySelector("[data-ai-vine-path]");
  const aiVineLeaves = [...document.querySelectorAll("[data-ai-leaf]")];
  let aiVineLength = 0;
  if (aiVinePath) {
    aiVineLength = aiVinePath.getTotalLength();
    aiVinePath.style.strokeDasharray = String(aiVineLength);
    aiVinePath.style.strokeDashoffset = String(aiVineLength);
  }
  const aiStateNames = ["Problem", "Idea", "Navigation", "Parking", "Traffic", "AI", "Model"];
  const setAiState = (index) => {
    aiSteps.forEach((step) => step.classList.toggle("is-active", Number(step.dataset.aiStep) === index));
    aiPanels.forEach((panel) => panel.classList.toggle("is-active", Number(panel.dataset.aiPanel) === index));
    if (phoneState) phoneState.textContent = aiStateNames[index] || aiStateNames[0];
    if (aiVinePath) {
      const progress = reducedMotion.matches ? 1 : Math.max(.06, index / Math.max(aiSteps.length - 1, 1));
      aiVinePath.style.strokeDashoffset = String(aiVineLength * (1 - progress));
    }
    aiVineLeaves.forEach((leaf) => {
      leaf.classList.toggle("is-grown", reducedMotion.matches || index >= Number(leaf.dataset.aiLeaf || 0));
    });
  };
  if (aiSteps.length) {
    const aiObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setAiState(Number(visible.target.dataset.aiStep));
    }, { threshold: [.28, .48, .7], rootMargin: "-25% 0px -35%" });
    aiSteps.forEach((step) => aiObserver.observe(step));
    setAiState(0);
  }

  const initFathomMotion = () => {
    const sequence = document.querySelector("[data-scene-sequence]");
    if (!sequence || !window.gsap || !window.ScrollTrigger) return;

    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    const motion = gsap.matchMedia();

    motion.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const hero = sequence.querySelector('[data-scene-panel="hero"]');
      const about = sequence.querySelector('[data-scene-panel="about"]');
      const work = sequence.querySelector('[data-scene-panel="work"]');
      const heroCopy = hero?.querySelector("[data-scene-copy]");
      const heroVisual = hero?.querySelector("[data-scene-visual]");
      const heroMeta = hero?.querySelector("[data-scene-meta]");
      const aboutCopy = about?.querySelector("[data-scene-copy]");
      const aboutVisual = about?.querySelector("[data-scene-visual]");
      const workCopy = work?.querySelector("[data-scene-copy]");
      const workVisual = work?.querySelector("[data-scene-visual]");

      gsap.set([about, work], { yPercent: 100 });
      const sceneTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sequence,
          start: "top top",
          end: "bottom bottom",
          scrub: .9,
          invalidateOnRefresh: true
        }
      });

      sceneTimeline
        .to(heroCopy, { yPercent: -13, duration: 1 }, 0)
        .to(heroVisual, { yPercent: -8, scale: .985, duration: 1 }, 0)
        .to(heroMeta, { yPercent: -18, duration: 1 }, 0)
        .to(about, { yPercent: 0, duration: 1 }, .18)
        .fromTo(aboutCopy, { yPercent: 5 }, { yPercent: -7, duration: 1.22 }, .35)
        .to(aboutVisual, { yPercent: -4, duration: 1.05 }, .53)
        .to(about, { yPercent: -16, duration: 1 }, 1.18)
        .to(work, { yPercent: 0, duration: 1 }, 1.18)
        .fromTo(workCopy, { yPercent: 5 }, { yPercent: -4, duration: 1 }, 1.2)
        .fromTo(workVisual, { yPercent: 7 }, { yPercent: -2, duration: 1 }, 1.25);

      const landscape = document.querySelector("[data-landscape-scene]");
      if (landscape) {
        const landscapeImages = landscape.querySelectorAll(".landscape-base, .landscape-foreground img");
        gsap.fromTo(landscapeImages, { scale: 1.07 }, {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: landscape, start: "top bottom", end: "bottom bottom", scrub: .9 }
        });
        gsap.fromTo(landscape.querySelector(".landscape-word"), { yPercent: 24 }, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: landscape, start: "top bottom", end: "bottom bottom", scrub: .9 }
        });
      }

      return () => {
        sceneTimeline.scrollTrigger?.kill();
        sceneTimeline.kill();
        gsap.set([hero, about, work, heroCopy, heroVisual, heroMeta, aboutCopy, aboutVisual, workCopy, workVisual], { clearProps: "transform" });
      };
    });

    window.ScrollTrigger.refresh();
  };

  const prototypeButton = document.querySelector("[data-prototype-start]");
  const prototypeFlow = document.querySelector(".prototype-flow");
  const prototypeNodes = [...document.querySelectorAll(".prototype-flow li")];
  let prototypeRun = 0;
  prototypeButton?.addEventListener("click", () => {
    prototypeRun += 1;
    const run = prototypeRun;
    prototypeNodes.forEach((node) => node.classList.remove("is-active"));
    prototypeButton.disabled = true;
    prototypeFlow?.setAttribute("aria-busy", "true");
    prototypeNodes.forEach((node, index) => {
      const delay = reducedMotion.matches ? 0 : index * 300;
      window.setTimeout(() => {
        if (run !== prototypeRun) return;
        node.classList.add("is-active");
        if (index === prototypeNodes.length - 1) {
          prototypeButton.disabled = false;
          prototypeFlow?.setAttribute("aria-busy", "false");
        }
      }, delay);
    });
  });

  const skillEvidence = document.querySelector("[data-skill-evidence]");
  const skillButtons = [...document.querySelectorAll("[data-skill-project]")];
  const showSkillEvidence = (button) => {
    skillButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    if (skillEvidence) skillEvidence.textContent = button.dataset.skillProject;
  };
  skillButtons.forEach((button) => {
    button.addEventListener("pointerenter", () => showSkillEvidence(button));
    button.addEventListener("focus", () => showSkillEvidence(button));
    button.addEventListener("click", () => showSkillEvidence(button));
  });

  if (finePointer.matches && !reducedMotion.matches) {
    document.querySelectorAll(".magnetic-button").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * .04;
        const y = (event.clientY - rect.top - rect.height / 2) * .05;
        button.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      button.addEventListener("pointerleave", () => { button.style.transform = ""; });
    });
  }
  if (header && finePointer.matches) {
    header.addEventListener("pointermove", (event) => {
      const rect = header.getBoundingClientRect();
      header.style.setProperty("--glass-x", `${event.clientX - rect.left}px`);
      header.style.setProperty("--glass-y", `${event.clientY - rect.top}px`);
    });
    header.addEventListener("pointerleave", () => {
      header.style.setProperty("--glass-x", "72%");
      header.style.setProperty("--glass-y", "0%");
    });
  }

  if (finePointer.matches && !reducedMotion.matches) {
    document.querySelectorAll("[data-tilt-card]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        card.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
        card.style.setProperty("--tilt-y", `${(x - 0.5) * 6}deg`);
        card.style.setProperty("--shine-x", `${x * 100}%`);
        card.style.setProperty("--shine-y", `${y * 100}%`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
        card.style.setProperty("--shine-x", "62%");
        card.style.setProperty("--shine-y", "20%");
      });
    });
  }

  document.querySelectorAll("[data-portrait-flip]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-flipped");
      updatePortraitFlipLabel(button, document.body.dataset.lang);
    });
  });

  const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
  let ticking = false;
  const updateScrollEffects = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
    updateActiveScrollNav();
    updateScrub();
    updateGrowthRoute();
    parallaxItems.forEach((element) => {
      if (!finePointer.matches || reducedMotion.matches) {
        element.style.transform = "";
        return;
      }
      const speed = Number(element.dataset.parallax || .05);
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;
      const rawOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      const offset = Math.max(-22, Math.min(22, rawOffset));
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateScrollEffects, { passive: true });
  reducedMotion.addEventListener?.("change", updateScrollEffects);
  finePointer.addEventListener?.("change", updateScrollEffects);
  updateScrollEffects();
  initFathomMotion();

  document.querySelectorAll(".back-to-top").forEach((button) => {
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  });

  const contactForm = document.querySelector("#contact-form");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const language = document.body.dataset.lang;
    const subject = `${data.get("subject")} — ${data.get("name")}`;
    const body = language === "zh"
      ? `你好 HongRong，\n\n${data.get("message")}\n\n聯絡人：${data.get("name")}\nEmail：${data.get("email")}`
      : `Hi HongRong,\n\n${data.get("message")}\n\nFrom: ${data.get("name")}\nEmail: ${data.get("email")}`;
    window.location.href = `mailto:zxc1031777@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  document.querySelectorAll("a.transition-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);
      if (link.target === "_blank" || url.origin !== window.location.origin || url.hash) return;
      event.preventDefault();
      setMenu(false);
      document.body.classList.add("page-leaving");
      window.setTimeout(() => { window.location.href = link.href; }, 260);
    });
  });

  const storedLanguage = safeStorage.get("hongrong-language") || "en";
  applyLanguage(storedLanguage);

  const loader = document.querySelector(".loader");
  let visited = false;
  try {
    visited = sessionStorage.getItem("hongrong-visited") === "yes";
    sessionStorage.setItem("hongrong-visited", "yes");
  } catch { /* file protocol privacy mode */ }

  const finishOpening = () => {
    loader?.classList.add("is-hidden");
    document.body.classList.remove("opening-active");
    window.ScrollTrigger?.refresh();
  };

  if (loader?.matches("[data-opening]") && window.gsap && !reducedMotion.matches) {
    const gsap = window.gsap;
    const mark = loader.querySelector("[data-opening-mark]");
    const titleLines = document.querySelectorAll("[data-opening-line]");
    const portraitLine = document.querySelector("[data-portrait-draw]");
    document.body.classList.add("opening-active");
    gsap.set(titleLines, { yPercent: 112 });
    if (portraitLine) {
      const portraitLength = portraitLine.getTotalLength();
      gsap.set(portraitLine, { strokeDasharray: portraitLength, strokeDashoffset: portraitLength });
    }

    if (visited) {
      gsap.timeline({ onComplete: finishOpening })
        .to(loader, { yPercent: -100, duration: .62, ease: "power3.inOut" }, .08)
        .to(titleLines, { yPercent: 0, duration: .68, stagger: .045, ease: "power3.out" }, .2)
        .to(portraitLine, { strokeDashoffset: 0, duration: .85, ease: "power2.out" }, .24);
    } else {
      gsap.timeline({ onComplete: finishOpening })
        .fromTo(mark, { autoAlpha: 0, y: 22, filter: "blur(9px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: .78, ease: "power3.out" })
        .to(mark, { autoAlpha: 0, y: -18, duration: .42, ease: "power2.in" }, "+=.55")
        .to(loader, { yPercent: -100, duration: .92, ease: "power3.inOut" }, "-=.18")
        .to(titleLines, { yPercent: 0, duration: .82, stagger: .07, ease: "power3.out" }, "-=.64")
        .to(portraitLine, { strokeDashoffset: 0, duration: 1.05, ease: "power2.out" }, "-=.82");
    }
  } else {
    document.querySelectorAll("[data-opening-line]").forEach((line) => { line.style.transform = "none"; });
    if (loader) window.setTimeout(finishOpening, reducedMotion.matches ? 0 : 420);
  }
})();
