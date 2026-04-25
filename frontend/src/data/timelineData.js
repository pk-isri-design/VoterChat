const DATA = {
  'en-IN': {
    modeTitle: 'Indian Election Timeline',
    modeSubtitle: 'Click any phase to explore it in depth.',
    phases: [
      {
        id: 1, icon: '📢', color: '#f59e0b',
        title: 'Announcement of Elections',
        subtitle: 'The starting gun of democracy',
        keyFact: 'The Model Code of Conduct kicks in the moment ECI announces the schedule.',
        sections: [
          { heading: '🗓️ What Happens', content: 'The Election Commission of India (ECI) announces the official election schedule, including dates for nominations, scrutiny, withdrawal, polling, and counting. The moment the schedule is announced, the Model Code of Conduct (MCC) comes into force automatically.' },
          { heading: '👥 Key Authorities', content: 'Chief Election Commissioner (CEC) leads the ECI and makes the announcement. State Chief Electoral Officers (CEOs) coordinate with the Centre.' },
          { heading: '📋 Important Rules', items: ['No new welfare schemes by ruling government', 'No transfers of senior civil servants without ECI approval', 'All political ads must be pre-certified'] }
        ]
      },
      {
        id: 2, icon: '📝', color: '#3b82f6',
        title: 'Filing of Nominations',
        subtitle: 'Candidates formally enter the race',
        keyFact: 'A security deposit of ₹25,000 is required for Lok Sabha candidates.',
        sections: [
          { heading: '🗓️ What Happens', content: 'Any eligible citizen can file a nomination. The candidate fills out Nomination Form and submits it to the Returning Officer (RO) along with an affidavit declaring assets and criminal record.' },
          { heading: '📋 Requirements', items: ['Registered voter in India', 'At least 25 years old for Lok Sabha', 'Security deposit payment'] }
        ]
      },
      {
        id: 3, icon: '🔍', color: '#8b5cf6',
        title: 'Scrutiny of Nominations',
        subtitle: 'Checking eligibility',
        keyFact: 'The RO can reject nominations if they are incomplete or ineligible.',
        sections: [
          { heading: '🗓️ What Happens', content: 'The Returning Officer examines all nomination papers. Candidates and agents may be present to raise or answer objections.' }
        ]
      },
      {
        id: 4, icon: '📣', color: '#ec4899',
        title: 'Campaign Period',
        subtitle: 'Candidates make their case',
        keyFact: 'Campaigning must stop 48 hours before polling (Silent Period).',
        sections: [
          { heading: '🗓️ What Happens', content: 'Candidates hold rallies and door-to-door campaigns. ECI Flying Squads monitor cash and freebies.' }
        ]
      },
      {
        id: 5, icon: '🗳️', color: '#10b981',
        title: 'Polling Day',
        subtitle: 'The day democracy speaks',
        keyFact: 'Polling stations must be within 2 km of every voter.',
        sections: [
          { heading: '🗓️ What Happens', content: 'Voters visit booths, verify ID, get ink on finger, and vote on EVM + VVPAT.' }
        ]
      },
      {
        id: 6, icon: '🔢', color: '#f97316',
        title: 'Vote Counting',
        subtitle: 'Every vote is tallied',
        keyFact: 'Counting happens at a centralised venue with multi-layer security.',
        sections: [
          { heading: '🗓️ What Happens', content: 'EVMs are opened table-by-table. Postal ballots are counted first.' }
        ]
      },
      {
        id: 7, icon: '🏆', color: '#06b6d4',
        title: 'Result Declaration',
        subtitle: 'The verdict becomes law',
        keyFact: 'Winning candidate receives a Certificate of Election from the RO.',
        sections: [
          { heading: '🗓️ What Happens', content: 'RO formally declares the result. The majority party is invited to form the government.' }
        ]
      }
    ]
  },
  'hi-IN': {
    modeTitle: 'भारतीय चुनाव समयरेखा',
    modeSubtitle: 'गहराई से जानने के लिए किसी भी चरण पर क्लिक करें।',
    phases: [
      {
        id: 1, icon: '📢', color: '#f59e0b',
        title: 'चुनावों की घोषणा',
        subtitle: 'लोकतंत्र की शुरुआत',
        keyFact: 'ECI द्वारा कार्यक्रम घोषित होते ही आदर्श आचार संहिता लागू हो जाती है।',
        sections: [
          { heading: '🗓️ क्या होता है', content: 'भारत निर्वाचन आयोग (ECI) नामांकन, जांच, नाम वापसी, मतदान और गिनती की तारीखों सहित आधिकारिक चुनाव कार्यक्रम की घोषणा करता है। घोषणा के साथ ही आदर्श आचार संहिता (MCC) स्वतः लागू हो जाती है।' },
          { heading: '👥 प्रमुख अधिकारी', content: 'मुख्य चुनाव आयुक्त (CEC) ECI का नेतृत्व करते हैं। राज्य के मुख्य निर्वाचन अधिकारी (CEO) केंद्र के साथ समन्वय करते हैं।' },
          { heading: '📋 महत्वपूर्ण नियम', items: ['सत्तारूढ़ सरकार द्वारा कोई नई कल्याणकारी योजना नहीं', 'ECI की मंजूरी के बिना वरिष्ठ अधिकारियों का स्थानांतरण नहीं', 'सभी राजनीतिक विज्ञापनों का पूर्व-प्रमाणन अनिवार्य'] }
        ]
      },
      {
        id: 2, icon: '📝', color: '#3b82f6',
        title: 'नामांकन दाखिल करना',
        subtitle: 'उम्मीदवार आधिकारिक तौर पर दौड़ में शामिल होते हैं',
        keyFact: 'लोकसभा उम्मीदवारों के लिए ₹25,000 की सुरक्षा राशि आवश्यक है।',
        sections: [
          { heading: '🗓️ क्या होता है', content: 'कोई भी पात्र नागरिक नामांकन दाखिल कर सकता है। उम्मीदवार नामांकन पत्र भरता है और संपत्तियों और आपराधिक रिकॉर्ड की घोषणा करने वाले हलफनामे के साथ रिटर्निंग ऑफिसर (RO) को जमा करता है।' },
          { heading: '📋 आवश्यकताएं', items: ['भारत में पंजीकृत मतदाता', 'लोकसभा के लिए कम से कम 25 वर्ष की आयु', 'सुरक्षा राशि का भुगतान'] }
        ]
      },
      {
        id: 3, icon: '🔍', color: '#8b5cf6',
        title: 'नामांकन की जांच',
        subtitle: 'पात्रता की जांच',
        keyFact: 'यदि नामांकन अधूरा या अपात्र है तो RO उसे खारिज कर सकता है।',
        sections: [
          { heading: '🗓️ क्या होता है', content: 'रिटर्निंग ऑफिसर सभी नामांकन पत्रों की जांच करता है। आपत्तियां उठाने या जवाब देने के लिए उम्मीदवार और एजेंट मौजूद रह सकते हैं।' }
        ]
      },
      {
        id: 4, icon: '📣', color: '#ec4899',
        title: 'प्रचार अवधि',
        subtitle: 'उम्मीदवार अपना पक्ष रखते हैं',
        keyFact: 'मतदान से 48 घंटे पहले प्रचार बंद होना चाहिए (मौन अवधि)।',
        sections: [
          { heading: '🗓️ क्या होता है', content: 'उम्मीदवार रैलियां और घर-घर जाकर प्रचार करते हैं। ECI उड़न दस्ते नकदी और मुफ्त उपहारों की निगरानी करते हैं।' }
        ]
      },
      {
        id: 5, icon: '🗳️', color: '#10b981',
        title: 'मतदान का दिन',
        subtitle: 'लोकतंत्र के बोलने का दिन',
        keyFact: 'मतदान केंद्र प्रत्येक मतदाता के 2 किमी के दायरे में होने चाहिए।',
        sections: [
          { heading: '🗓️ क्या होता है', content: 'मतदाता बूथों पर जाते हैं, आईडी सत्यापित करते हैं, उंगली पर स्याही लगवाते हैं और EVM + VVPAT पर वोट देते हैं।' }
        ]
      },
      {
        id: 6, icon: '🔢', color: '#f97316',
        title: 'मतों की गिनती',
        subtitle: 'हर वोट गिना जाता है',
        keyFact: 'गिनती बहुस्तरीय सुरक्षा वाले केंद्रीकृत स्थान पर होती है।',
        sections: [
          { heading: '🗓️ क्या होता है', content: 'EVM को टेबल-दर-टेबल खोला जाता है। डाक मतपत्रों की गिनती पहले की जाती है।' }
        ]
      },
      {
        id: 7, icon: '🏆', color: '#06b6d4',
        title: 'परिणाम की घोषणा',
        subtitle: 'फैसला कानून बन जाता है',
        keyFact: 'विजेता उम्मीदवार को RO से चुनाव का प्रमाण पत्र प्राप्त होता है।',
        sections: [
          { heading: '🗓️ क्या होता है', content: 'RO औपचारिक रूप से परिणाम घोषित करता है। बहुमत वाले दल को सरकार बनाने के लिए आमंत्रित किया जाता है।' }
        ]
      }
    ]
  },
  'bn-IN': {
    modeTitle: 'ভারতীয় নির্বাচন সময়রেখা',
    modeSubtitle: 'বিস্তারিত জানতে যেকোনো ধাপে ক্লিক করুন।',
    phases: [
      { id: 1, title: 'নির্বাচন ঘোষণা', subtitle: 'গণতন্ত্রের সূচনা', keyFact: 'ঘোষণার সাথে সাথেই আচরণবিধি লাগু হয়।', sections: [{ heading: '🗓️ কি হয়', content: 'নির্বাচন কমিশন সময়সূচী ঘোষণা করে।' }] },
      { id: 2, title: 'মনোনয়ন জমা', subtitle: 'প্রার্থীরা দৌড়ে শামিল হন', keyFact: 'নিরাপত্তা আমানত আবশ্যক।', sections: [{ heading: '🗓️ কি হয়', content: 'প্রার্থীরা রিটার্নিং অফিসারের কাছে ফর্ম জমা দেন।' }] },
      { id: 3, title: 'মনোনয়ন যাচাই', subtitle: 'যোগ্যতা পরীক্ষা', keyFact: 'অসম্পূর্ণ মনোনয়ন বাতিল হতে পারে।', sections: [{ heading: '🗓️ কি হয়', content: 'অফিসার সমস্ত নথি পরীক্ষা করেন।' }] },
      { id: 4, title: 'প্রচার অভিযান', subtitle: 'প্রার্থীরা বক্তব্য রাখেন', keyFact: 'ভোটের ৪৮ ঘণ্টা আগে প্রচার বন্ধ হয়।', sections: [{ heading: '🗓️ কি হয়', content: 'র‍্যালি ও বাড়ি বাড়ি প্রচার চলে।' }] },
      { id: 5, title: 'ভোটের দিন', subtitle: 'গণতন্ত্রের রায়', keyFact: 'বুথ ২ কিমি-র মধ্যে হতে হবে।', sections: [{ heading: '🗓️ কি হয়', content: 'ভোটাররা ইভিএম-এ ভোট দেন।' }] },
      { id: 6, title: 'ভোট গণনা', subtitle: 'প্রতিটি ভোট গণনা হয়', keyFact: 'কড়া নিরাপত্তায় গণনা চলে।', sections: [{ heading: '🗓️ কি হয়', content: 'ইভিএম টেবিল অনুযায়ী খোলা হয়।' }] },
      { id: 7, title: 'ফল ঘোষণা', subtitle: 'জনগণের রায়', keyFact: 'জয়ী প্রার্থী শংসাপত্র পান।', sections: [{ heading: '🗓️ কি হয়', content: 'রিটার্নিং অফিসার ফল ঘোষণা করেন।' }] }
    ]
  },
  'ta-IN': {
    modeTitle: 'இந்திய தேர்தல் காலவரிசை',
    modeSubtitle: 'ஆழமாக ஆராய எந்த கட்டத்தையும் கிளிக் செய்யவும்.',
    phases: [
      { id: 1, title: 'தேர்தல் அறிவிப்பு', subtitle: 'ஜனநாயகத்தின் ஆரம்பம்', keyFact: 'அறிவிக்கப்பட்டவுடன் நடத்தை விதிமுறைகள் அமலுக்கு வரும்.', sections: [{ heading: '🗓️ என்ன நடக்கும்', content: 'தேர்தல் ஆணையம் அட்டவணையை அறிவிக்கும்.' }] },
      { id: 2, title: 'வேட்புமனு தாக்கல்', subtitle: 'வேட்பாளர்கள் அதிகாரப்பூர்வமாக நுழைகிறார்கள்', keyFact: 'வைப்புத்தொகை அவசியம்.', sections: [{ heading: '🗓️ என்ன நடக்கும்', content: 'வேட்பாளர்கள் படிவங்களை சமர்ப்பிக்கிறார்கள்.' }] },
      { id: 3, title: 'வேட்புமனு பரிசீலனை', subtitle: 'தகுதி சரிபார்ப்பு', keyFact: 'குறைபாடுகள் இருந்தால் மனு தள்ளுபடி செய்யப்படும்.', sections: [{ heading: '🗓️ என்ன நடக்கும்', content: 'அதிகாரி மனுக்களை ஆய்வு செய்கிறார்.' }] },
      { id: 4, title: 'தேர்தல் பிரச்சாரம்', subtitle: 'வேட்பாளர்கள் ஆதரவு திரட்டுகிறார்கள்', keyFact: 'வாக்கெடுப்புக்கு 48 மணி நேரத்திற்கு முன் பிரச்சாரம் நிறுத்தப்பட வேண்டும்.', sections: [{ heading: '🗓️ என்ன நடக்கும்', content: 'பேரணிகள் மற்றும் வீடு வீடாக பிரச்சாரம் நடக்கும்.' }] },
      { id: 5, title: 'வாக்குப்பதிவு நாள்', subtitle: 'ஜனநாயகம் பேசும் நாள்', keyFact: 'வாக்குச்சாவடிகள் 2 கிமீ தொலைவிற்குள் இருக்க வேண்டும்.', sections: [{ heading: '🗓️ என்ன நடக்கும்', content: 'வாக்காளர்கள் இவிஎம்-இல் வாக்களிக்கிறார்கள்.' }] },
      { id: 6, title: 'வாக்கு எண்ணிக்கை', subtitle: 'ஒவ்வொரு வாக்கும் கணக்கிடப்படுகிறது', keyFact: 'பலத்த பாதுகாப்பில் எண்ணிக்கை நடக்கும்.', sections: [{ heading: '🗓️ என்ன நடக்கும்', content: 'பெட்டிகள் திறக்கப்பட்டு எண்ணப்படும்.' }] },
      { id: 7, title: 'முடிவு அறிவிப்பு', subtitle: 'மக்களின் தீர்ப்பு', keyFact: 'வெற்றி பெற்றவர் சான்றிதழ் பெறுவார்.', sections: [{ heading: '🗓️ என்ன நடக்கும்', content: 'முடிவுகள் அதிகாரப்பூர்வமாக அறிவிக்கப்படும்.' }] }
    ]
  },
  'te-IN': {
    modeTitle: 'భారత ఎన్నికల కాలక్రమం',
    modeSubtitle: 'లోతుగా అన్వేషించడానికి ఏదైనా దశపై క్లిక్ చేయండి.',
    phases: [
      { id: 1, title: 'ఎన్నికల ప్రకటన', subtitle: 'ప్రజాస్వామ్యానికి నాంది', keyFact: 'ప్రకటన వెలువడిన వెంటనే కోడ్ అమలులోకి వస్తుంది.', sections: [{ heading: '🗓️ ఏం జరుగుతుంది', content: 'ఎన్నికల సంఘం షెడ్యూల్‌ను ప్రకటిస్తుంది.' }] },
      { id: 2, title: 'నామినేషన్ల దాఖలు', subtitle: 'అభ్యర్థులు అధికారికంగా పోటీలోకి వస్తారు', keyFact: 'డిపాజిట్ తప్పనిసరి.', sections: [{ heading: '🗓️ ఏం జరుగుతుంది', content: 'అభ్యర్థులు పత్రాలను సమర్పిస్తారు.' }] },
      { id: 3, title: 'నామినేషన్ల పరిశీలన', subtitle: 'అర్హత తనిఖీ', keyFact: 'లోపాలు ఉంటే నామినేషన్ తిరస్కరించబడుతుంది.', sections: [{ heading: '🗓️ ఏం జరుగుతుంది', content: 'అధికారి పత్రాలను పరిశీలిస్తారు.' }] },
      { id: 4, title: 'ఎన్నికల ప్రచారం', subtitle: 'అభ్యర్థులు ఓట్లను అభ్యర్థిస్తారు', keyFact: 'పోలింగ్‌కు 48 గంటల ముందు ప్రచారం ముగియాలి.', sections: [{ heading: '🗓️ ఏం జరుగుతుంది', content: 'ర్యాలీలు మరియు ప్రచారం జరుగుతాయి.' }] },
      { id: 5, title: 'పోలింగ్ రోజు', subtitle: 'ప్రజాస్వామ్య తీర్పు రోజు', keyFact: 'పోలింగ్ కేంద్రాలు 2 కిమీ లోపే ఉండాలి.', sections: [{ heading: '🗓️ ఏం జరుగుతుంది', content: 'ఓటర్లు ఈవీఎం ద్వారా ఓటు వేస్తారు.' }] },
      { id: 6, title: 'ఓట్ల లెక్కింపు', subtitle: 'ప్రతి ఓటు లెక్కించబడుతుంది', keyFact: 'భారీ భద్రత మధ్య లెక్కింపు జరుగుతుంది.', sections: [{ heading: '🗓️ ఏం జరుగుతుంది', content: 'ఈవీఎంలను తెరిచి లెక్కిస్తారు.' }] },
      { id: 7, title: 'ఫలితాల ప్రకటన', subtitle: 'ప్రజల తీర్పు', keyFact: 'విజేత అభ్యర్థి ధృవీకరణ పత్రాన్ని అందుకుంటారు.', sections: [{ heading: '🗓️ ఏం జరుగుతుంది', content: 'ఫలితాలు అధికారికంగా ప్రకటించబడతాయి.' }] }
    ]
  },
  'mr-IN': {
    modeTitle: 'भारतीय निवडणूक कालक्रमानुसार',
    modeSubtitle: 'सखोल माहितीसाठी कोणत्याही टप्प्यावर क्लिक करा.',
    phases: [
      { id: 1, title: 'निवडणुकीची घोषणा', subtitle: 'लोकशाहीची सुरुवात', keyFact: 'घोषणा होताच आचारसंहिता लागू होते.', sections: [{ heading: '🗓️ काय होते', content: 'निवडणूक आयोग वेळापत्रक जाहीर करतो.' }] },
      { id: 2, title: 'नामनिर्देशन पत्र भरणे', subtitle: 'उमेदवार अधिकृतपणे रिंगणात', keyFact: 'अनामत रक्कम भरणे आवश्यक.', sections: [{ heading: '🗓️ काय होते', content: 'उमेदवार अर्ज सादर करतात.' }] },
      { id: 3, title: 'छाननी', subtitle: 'पात्रता तपासणी', keyFact: 'त्रुटी असल्यास अर्ज बाद होऊ शकतो.', sections: [{ heading: '🗓️ काय होते', content: 'अधिकारी अर्जांची तपासणी करतात.' }] },
      { id: 4, title: 'निवडणूक प्रचार', subtitle: 'उमेदवार मते मागतात', keyFact: 'मतदानापूर्वी ४८ तास प्रचार थांबवावा लागतो.', sections: [{ heading: '🗓️ काय होते', content: 'रॅली आणि प्रचार सभा होतात.' }] },
      { id: 5, title: 'मतदानाचा दिवस', subtitle: 'लोकशाहीचा दिवस', keyFact: 'मतदान केंद्र २ किमीच्या आत असावे.', sections: [{ heading: '🗓️ काय होते', content: 'मतदार ईव्हीएमवर मतदान करतात.' }] },
      { id: 6, title: 'मतमोजणी', subtitle: 'प्रत्येक मत मोजले जाते', keyFact: 'कडक सुरक्षेत मोजणी होते.', sections: [{ heading: '🗓️ काय होते', content: 'ईव्हीएम मशिन उघडून मोजणी केली जाते.' }] },
      { id: 7, title: 'निकाल घोषणा', subtitle: 'जनतेचा कौल', keyFact: 'विजयी उमेदवाराला प्रमाणपत्र मिळते.', sections: [{ heading: '🗓️ काय होते', content: 'निकाल अधिकृतपणे जाहीर केला जातो.' }] }
    ]
  },
  'gu-IN': {
    modeTitle: 'ભારતીય ચૂંટણી સમયરેખા',
    modeSubtitle: 'ઊંડાણપૂર્વક જાણવા માટે કોઈપણ તબક્કા પર ક્લિક કરો.',
    phases: [
      { id: 1, title: 'ચૂંટણીની જાહેરાત', subtitle: 'લોકશાહીની શરૂઆત', keyFact: 'જાહેરાત થતાની સાથે જ આચારસંહિતા લાગુ પડે છે.', sections: [{ heading: '🗓️ શું થાય છે', content: 'ચૂંટણી પંચ સમયપત્રક જાહેર કરે છે.' }] },
      { id: 2, title: 'ઉમેદવારી પત્ર ભરવું', subtitle: 'ઉમેદવારો સત્તાવાર રીતે મેદાનમાં', keyFact: 'ડિપોઝિટ ભરવી જરૂરી છે.', sections: [{ heading: '🗓️ શું થાય છે', content: 'ઉમેદવારો ફોર્મ સબમિટ કરે છે.' }] },
      { id: 3, title: 'ચકાસણી', subtitle: 'પાત્રતાની તપાસ', keyFact: 'અધૂરી વિગતો હોય તો ફોર્મ રદ થઈ શકે.', sections: [{ heading: '🗓️ શું થાય છે', content: 'અધિકારી ફોર્મની તપાસ કરે છે.' }] },
      { id: 4, title: 'ચૂંટણી પ્રચાર', subtitle: 'ઉમેદવારો મત માંગે છે', keyFact: 'મતદાનના 48 કલાક પહેલા પ્રચાર બંધ કરવો પડે.', sections: [{ heading: '🗓️ શું થાય છે', content: 'રેલીઓ અને સભાઓ યોજાય છે.' }] },
      { id: 5, title: 'મતદાનનો દિવસ', subtitle: 'લોકશાહીનો દિવસ', keyFact: 'મતદાન મથક 2 કિમીની અંદર હોવું જોઈએ.', sections: [{ heading: '🗓️ શું થાય છે', content: 'મતદારો ઈવીએમ પર મત આપે છે.' }] },
      { id: 6, title: 'મતગણતરી', subtitle: 'દરેક મતની ગણતરી', keyFact: 'ચુસ્ત સુરક્ષા વચ્ચે ગણતરી થાય છે.', sections: [{ heading: '🗓️ શું થાય છે', content: 'ઈવીએમ ખોલીને ગણતરી કરવામાં આવે છે.' }] },
      { id: 7, title: 'પરિણામની જાહેરાત', subtitle: 'જનતાનો ચુકાદો', keyFact: 'વિજેતા ઉમેદવારને પ્રમાણપત્ર મળે છે.', sections: [{ heading: '🗓️ શું થાય છે', content: 'પરિણામ સત્તાવાર રીતે જાહેર કરવામાં આવે છે.' }] }
    ]
  }
};

// Fallback logic for missing languages
export const getTimelinePhases = (lang) => {
  const data = DATA[lang] || DATA['en-IN'];
  return data.phases.map(p => ({
    ...p,
    modeTitle: data.modeTitle,
    modeSubtitle: data.modeSubtitle
  }));
};
