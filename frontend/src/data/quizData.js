const DATA = {
  'en-IN': [
    {
      situation: "Ramesh moved from Delhi to Mumbai and wants to vote in Mumbai.",
      question: "What should Ramesh do?",
      options: ["Form 8 in Delhi", "Form 6 in Mumbai", "Nothing, it's automatic", "Form 8A in Delhi"],
      correct: 1,
      explanation: "Use Form 6 for fresh enrollment in a new constituency."
    },
    {
      situation: "Priya's name is missing from the voter list just before elections.",
      question: "What should she do immediately?",
      options: ["Police complaint", "Contact MLA", "Fill Form 6", "Wait for revision"],
      correct: 2,
      explanation: "Apply for inclusion using Form 6."
    },
    {
      situation: "Anil moved within the same constituency.",
      question: "Which form should he fill?",
      options: ["Form 6", "Form 7", "Form 8", "Form 8A"],
      correct: 3,
      explanation: "Form 8A is for shifting within the same constituency."
    },
    {
      situation: "Sunita notices a spelling error in her name on her voter ID.",
      question: "Which form to use?",
      options: ["Form 6", "Form 7", "Form 8", "Form 8A"],
      correct: 2,
      explanation: "Form 8 is for correction of particulars."
    },
    {
      situation: "Rajesh is a first-time voter at the booth.",
      question: "What must he carry?",
      options: ["Only Aadhaar", "EPIC or approved ID", "PAN and bill", "School certificate"],
      correct: 1,
      explanation: "EPIC or any of the 12 approved photo IDs."
    }
    // ... I will provide a condensed 30 question list for all languages in chunks
  ],
  'hi-IN': [
    {
      situation: "रमेश दिल्ली से मुंबई स्थानांतरित हो गए हैं और मुंबई में मतदान करना चाहते हैं।",
      question: "रमेश को क्या करना चाहिए?",
      options: ["दिल्ली में फॉर्म 8", "मुंबई में फॉर्म 6", "कुछ नहीं, यह स्वचालित है", "दिल्ली में फॉर्म 8A"],
      correct: 1,
      explanation: "नए निर्वाचन क्षेत्र में नए नामांकन के लिए फॉर्म 6 का उपयोग करें।"
    },
    {
      situation: "चुनाव से ठीक पहले प्रिया का नाम मतदाता सूची से गायब है।",
      question: "उसे तुरंत क्या करना चाहिए?",
      options: ["पुलिस शिकायत", "विधायक से संपर्क", "फॉर्म 6 भरें", "संशोधन की प्रतीक्षा करें"],
      correct: 2,
      explanation: "फॉर्म 6 का उपयोग करके शामिल करने के लिए आवेदन करें।"
    },
    {
      situation: "अनिल एक ही निर्वाचन क्षेत्र के भीतर स्थानांतरित हो गया है।",
      question: "उसे कौन सा फॉर्म भरना चाहिए?",
      options: ["फॉर्म 6", "फॉर्म 7", "फॉर्म 8", "फॉर्म 8A"],
      correct: 3,
      explanation: "फॉर्म 8A एक ही निर्वाचन क्षेत्र के भीतर स्थानांतरित होने के लिए है।"
    },
    {
      situation: "सुनीता ने अपने वोटर आईडी पर अपने नाम की वर्तनी में गलती देखी।",
      question: "किस फॉर्म का उपयोग करें?",
      options: ["फॉर्म 6", "फॉर्म 7", "फॉर्म 8", "फॉर्म 8A"],
      correct: 2,
      explanation: "फॉर्म 8 विवरणों के सुधार के लिए है।"
    },
    {
      situation: "राजेश पहली बार मतदाता के रूप में बूथ पर है।",
      question: "उसे क्या साथ ले जाना चाहिए?",
      options: ["केवल आधार", "EPIC या स्वीकृत आईडी", "पैन और बिल", "स्कूल प्रमाण पत्र"],
      correct: 1,
      explanation: "EPIC या 12 स्वीकृत फोटो आईडी में से कोई भी।"
    }
  ],
  'bn-IN': [
    { situation: "রমেশ দিল্লি থেকে মুম্বাইয়ে গিয়ে মুম্বাইয়ে ভোট দিতে চান।", question: "রমেশের কি করা উচিত?", options: ["দিল্লিতে ফর্ম ৮", "মুম্বাইয়ে ফর্ম ৬", "কিছুই না", "দিল্লিতে ফর্ম ৮এ"], correct: 1, explanation: "নতুন এলাকায় নাম তুলতে ফর্ম ৬ ব্যবহার করুন।" },
    { situation: "প্রিয়ার নাম ভোটার তালিকা থেকে উধাও।", question: "তার কি করা উচিত?", options: ["পুলিশে ডায়েরি", "এমএলএ-কে জানানো", "ফর্ম ৬ পূরণ", "অপেক্ষা"], correct: 2, explanation: "নাম তুলতে ফর্ম ৬ পূরণ করুন।" }
  ],
  'ta-IN': [
    { situation: "ரமேஷ் டெல்லியில் இருந்து மும்பைக்கு குடிபெயர்ந்தார், அங்கு வாக்களிக்க விரும்புகிறார்.", question: "அவர் என்ன செய்ய வேண்டும்?", options: ["டெல்லியில் படிவம் 8", "மும்பையில் படிவம் 6", "தானாகவே நடக்கும்", "டெல்லியில் படிவம் 8A"], correct: 1, explanation: "புதிய தொகுதியில் சேர படிவம் 6-ஐப் பயன்படுத்தவும்." }
  ],
  'te-IN': [
    { situation: "రమేష్ ఢిల్లీ నుండి ముంబైకి మారారు, అక్కడ ఓటు వేయాలనుకుంటున్నారు.", question: "అతను ఏమి చేయాలి?", options: ["ఢిల్లీలో ఫారమ్ 8", "ముంబైలో ఫారమ్ 6", "ఏమీ అవసరం లేదు", "ఢిల్లీలో ఫారమ్ 8A"], correct: 1, explanation: "కొత్త నియోజకవర్గంలో పేరు నమోదుకు ఫారమ్ 6 వాడాలి." }
  ],
  'mr-IN': [
    { situation: "रमेश दिल्लीहून मुंबईला गेले असून त्यांना मुंबईत मतदान करायचे आहे.", question: "रमेशने काय करावे?", options: ["दिल्लीत फॉर्म ८", "मुंबईत फॉर्म ६", "काहीही नाही", "दिल्लीत फॉर्म ८A"], correct: 1, explanation: "नवीन मतदारसंघात नाव नोंदवण्यासाठी फॉर्म ६ वापरा." }
  ],
  'gu-IN': [
    { situation: "રમેશ દિલ્હીથી મુંબઈ રહેવા ગયા અને મુંબઈમાં મત આપવા માંગે છે.", question: "રમેશે શું કરવું જોઈએ?", options: ["દિલ્હીમાં ફોર્મ 8", "મુંબઈમાં ફોર્મ 6", "કંઈ નહીં", "દિલ્હીમાં ફોર્મ 8A"], correct: 1, explanation: "નવા મતવિસ્તારમાં નોંધણી માટે ફોર્મ 6 નો ઉપયોગ કરો." }
  ]
};

export const getQuizQuestions = (lang) => {
  return DATA[lang] || DATA['en-IN'];
};
