const DATA = {
  'en-IN': [
    { situation: "Ramesh moved from Delhi to Mumbai and wants to vote in Mumbai.", question: "What should Ramesh do?", options: ["Form 8 in Delhi", "Form 6 in Mumbai", "Nothing, it's automatic", "Form 8A in Delhi"], correct: 1, explanation: "Use Form 6 for fresh enrollment in a new constituency." },
    { situation: "Priya's name is missing from the voter list just before elections.", question: "What should she do immediately?", options: ["Police complaint", "Contact MLA", "Fill Form 6", "Wait for revision"], correct: 2, explanation: "Apply for inclusion using Form 6." },
    { situation: "Anil moved within the same constituency.", question: "Which form should he fill?", options: ["Form 6", "Form 7", "Form 8", "Form 8A"], correct: 2, explanation: "Form 8 is now used for shifting within the same constituency (formerly 8A)." },
    { situation: "Sunita notices a spelling error in her name on her voter ID.", question: "Which form to use?", options: ["Form 6", "Form 7", "Form 8", "Form 8A"], correct: 2, explanation: "Form 8 is for correction of particulars." },
    { situation: "Rajesh is a first-time voter at the booth.", question: "What must he carry?", options: ["Only Aadhaar", "EPIC or approved ID", "PAN and bill", "School certificate"], correct: 1, explanation: "EPIC or any of the 12 approved photo IDs." },
    { situation: "A candidate is giving out freebies in your neighborhood.", question: "Where should you report this?", options: ["WhatsApp group", "C-VIGIL App", "Wait till election", "Newspaper"], correct: 1, explanation: "Use ECI's C-VIGIL app to report MCC violations in real-time." },
    { situation: "You want to check your polling booth location from home.", question: "Which is the easiest way?", options: ["Visit local school", "Voter Helpline App", "Wait for post", "Ask neighbor"], correct: 1, explanation: "Use the Voter Helpline App or voters.eci.gov.in." },
    { situation: "An 85-year-old voter wants to vote from home.", question: "Is this possible?", options: ["No, must visit booth", "Yes, using Form 12D", "Only if bedridden", "Yes, on WhatsApp"], correct: 1, explanation: "Form 12D allows voters 85+ and PwD to vote from home." },
    { situation: "You just turned 18 on February 1st.", question: "When can you apply for a Voter ID?", options: ["Wait for next year", "Immediately", "Only in January", "After turning 21"], correct: 1, explanation: "ECI now has 4 qualifying dates: Jan 1, Apr 1, Jul 1, and Oct 1." },
    { situation: "You lost your Voter ID card.", question: "How to get a replacement?", options: ["Form 6", "Form 8 (Replacement)", "Police station", "New application"], correct: 1, explanation: "Form 8 is used for 'Replacement of EPIC without correction'." },
    { situation: "You want to see a candidate's criminal record and assets.", question: "Which app provides this?", options: ["Google Search", "KYC (Know Your Candidate)", "C-VIGIL", "Social Media"], correct: 1, explanation: "The KYC app lets you view candidate affidavits and records." },
    { situation: "When does the campaign period end before voting?", options: ["24 hours before", "48 hours before", "1 hour before", "No time limit"], correct: 1, explanation: "Campaigning stops 48 hours before the end of poll (Silent Period)." },
    { situation: "You don't want to vote for any candidate.", question: "What is your option?", options: ["Leave booth", "Select NOTA", "Tear ballot", "Submit blank paper"], correct: 1, explanation: "NOTA (None of the Above) is a valid choice on the EVM." },
    { situation: "The EVM recorded your vote, but you want to verify it.", question: "What should you check?", options: ["Ink on finger", "VVPAT slip window", "Wait for SMS", "Ask the officer"], correct: 1, explanation: "The VVPAT shows a slip for 7 seconds to confirm your choice." },
    { situation: "You are an NRI living in London.", question: "Can you register to vote?", options: ["No", "Yes, using Form 6A", "Only if present in India", "By post only"], correct: 1, explanation: "NRIs can register as 'Overseas Voters' using Form 6A." },
    { situation: "You want to delete a deceased relative's name from the list.", question: "Which form?", options: ["Form 6", "Form 7", "Form 8", "Form 9"], correct: 1, explanation: "Form 7 is for objection or deletion of an entry." },
    { situation: "A visually impaired voter visits the booth.", question: "How can they vote?", options: ["Can't vote", "With a companion", "Braille on EVM", "Both B and C"], correct: 3, explanation: "EVMs have Braille, and they can also bring a companion (Form 49A)." },
    { situation: "Someone has already voted in your name.", question: "What can you do?", options: ["Go home", "Tendered Vote", "Police complaint", "Vote again normally"], correct: 1, explanation: "Ask for a 'Tendered Ballot Paper' to record your vote manually." },
    { situation: "You changed your address within the same city/constituency.", question: "Which form?", options: ["Form 6", "Form 8", "Form 7", "Form 8A"], correct: 1, explanation: "Form 8 covers all shifting, including within the constituency." },
    { situation: "You want to download your Voter ID on your phone.", question: "What is it called?", options: ["Digi-ID", "e-EPIC", "Voter-PDF", "m-Card"], correct: 1, explanation: "e-EPIC is the secure portable document version of the EPIC." },
    { situation: "Which finger is marked with indelible ink in India?", options: ["Right index", "Left index", "Left thumb", "Any finger"], correct: 1, explanation: "Indelible ink is applied to the left forefinger." },
    { situation: "You are a student living in a hostel in a different city.", question: "Can you vote there?", options: ["No, only at home", "Yes, as a resident", "Only if 25+", "No, students can't vote"], correct: 1, explanation: "Students can register at their place of residence (hostel) using Form 6." },
    { situation: "What is the security deposit for a Lok Sabha candidate?", options: ["₹10,000", "₹25,000", "₹5,000", "₹50,000"], correct: 1, explanation: "General candidates pay ₹25,000; SC/ST pay ₹12,500." },
    { situation: "What is the maximum limit for a candidate's expense in a large state (Lok Sabha)?", options: ["₹50 Lakh", "₹95 Lakh", "₹1 Crore", "₹20 Lakh"], correct: 1, explanation: "The limit for large states is ₹95 Lakh (as of recent updates)." },
    { situation: "How many photo IDs are approved by ECI for voting besides EPIC?", options: ["5", "12", "All IDs", "Only Aadhaar"], correct: 1, explanation: "ECI accepts 12 alternative photo identity documents." },
    { situation: "Which body conducts elections for the President of India?", options: ["Supreme Court", "ECI", "Parliament", "State Gov"], correct: 1, explanation: "The Election Commission of India (ECI) conducts Presidential elections." },
    { situation: "You want to find your name in the Voter List online.", question: "Which portal to use?", options: ["Google Search", "ECI Search Portal", "Aadhaar Portal", "Statesman"], correct: 1, explanation: "Search your name at 'electoralsearch.eci.gov.in'." },
    { situation: "Can a person with a criminal record vote?", options: ["Yes, if not in prison", "No, never", "Only if acquitted", "Yes, even in prison"], correct: 0, explanation: "Anyone not currently serving a prison sentence or under lawful custody can vote." },
    { situation: "Who is the Chief Election Commissioner (as of early 2026)?", options: ["Rajiv Kumar", "T.N. Seshan", "Om Prakash Rawat", "Sushil Chandra"], correct: 0, explanation: "Rajiv Kumar is the CEC (check ECI portal for the most current updates)." },
    { situation: "What is the minimum age to be a Member of Parliament (Lok Sabha)?", options: ["18", "21", "25", "30"], correct: 2, explanation: "The minimum age is 25 years." }
  ],
  'hi-IN': [
    { situation: "रमेश दिल्ली से मुंबई स्थानांतरित हो गए हैं और मुंबई में मतदान करना चाहते हैं।", question: "रमेश को क्या करना चाहिए?", options: ["दिल्ली में फॉर्म 8", "मुंबई में फॉर्म 6", "कुछ नहीं, यह स्वचालित है", "दिल्ली में फॉर्म 8A"], correct: 1, explanation: "नए निर्वाचन क्षेत्र में नए नामांकन के लिए फॉर्म 6 का उपयोग करें।" },
    { situation: "चुनाव से ठीक पहले प्रिया का नाम मतदाता सूची से गायब है।", question: "उसे तुरंत क्या करना चाहिए?", options: ["पुलिस शिकायत", "विधायक से संपर्क", "फॉर्म 6 भरें", "संशोधन की प्रतीक्षा करें"], correct: 2, explanation: "फॉर्म 6 का उपयोग करके शामिल करने के लिए आवेदन करें।" },
    { situation: "अनिल एक ही निर्वाचन क्षेत्र के भीतर स्थानांतरित हो गया है।", question: "उसे कौन सा फॉर्म भरना चाहिए?", options: ["फॉर्म 6", "फॉर्म 7", "फॉर्म 8", "फॉर्म 8A"], correct: 2, explanation: "फॉर्म 8 का उपयोग अब निर्वाचन क्षेत्र के भीतर स्थानांतरण के लिए किया जाता है।" },
    { situation: "सुनीता ने अपने वोटर आईडी पर अपने नाम की वर्तनी में गलती देखी।", question: "किस फॉर्म का उपयोग करें?", options: ["फॉर्म 6", "फॉर्म 7", "फॉर्म 8", "फॉर्म 8A"], correct: 2, explanation: "फॉर्म 8 विवरणों के सुधार के लिए है।" },
    { situation: "राजेश पहली बार मतदाता के रूप में बूथ पर है।", question: "उसे क्या साथ ले जाना चाहिए?", options: ["केवल आधार", "EPIC या स्वीकृत आईडी", "पैन और बिल", "स्कूल प्रमाण पत्र"], correct: 1, explanation: "EPIC या 12 स्वीकृत फोटो आईडी में से कोई भी।" },
    { situation: "एक उम्मीदवार आपके पड़ोस में मुफ्त उपहार बांट रहा है।", question: "आपको इसकी सूचना कहां देनी चाहिए?", options: ["व्हाट्सएप ग्रुप", "C-VIGIL ऐप", "चुनाव तक रुकें", "समाचार पत्र"], correct: 1, explanation: "MCC उल्लंघन की रिपोर्ट करने के लिए ECI के C-VIGIL ऐप का उपयोग करें।" },
    { situation: "एक 85 वर्षीय मतदाता घर से वोट देना चाहता है।", question: "क्या यह संभव है?", options: ["नहीं", "हाँ, फॉर्म 12D का उपयोग करके", "केवल अगर बीमार हो", "हाँ, व्हाट्सएप पर"], correct: 1, explanation: "फॉर्म 12D 85+ और PwD मतदाताओं को घर से वोट देने की अनुमति देता है।" },
    { situation: "आप अभी 1 फरवरी को 18 साल के हुए हैं।", question: "आप वोटर आईडी के लिए कब आवेदन कर सकते हैं?", options: ["अगले साल", "तुरंत", "केवल जनवरी में", "21 साल के बाद"], correct: 1, explanation: "ECI की अब 4 योग्यता तिथियां हैं: 1 जनवरी, 1 अप्रैल, 1 जुलाई और 1 अक्टूबर।" },
    { situation: "आप अपना वोटर आईडी कार्ड खो चुके हैं।", question: "नया कार्ड कैसे प्राप्त करें?", options: ["फॉर्म 6", "फॉर्म 8 (प्रतिस्थापन)", "पुलिस स्टेशन", "नया आवेदन"], correct: 1, explanation: "फॉर्म 8 का उपयोग 'बिना सुधार के EPIC के प्रतिस्थापन' के लिए किया जाता है।" },
    { situation: "वोट देने से पहले प्रचार अवधि कब समाप्त होती है?", options: ["24 घंटे पहले", "48 घंटे पहले", "1 घंटे पहले", "कोई समय सीमा नहीं"], correct: 1, explanation: "प्रचार मतदान समाप्त होने से 48 घंटे पहले रुक जाता है।" },
    { situation: "आप किसी भी उम्मीदवार को वोट नहीं देना चाहते।", question: "आपका विकल्प क्या है?", options: ["बूथ छोड़ें", "NOTA चुनें", "बैलट फाड़ें", "खाली कागज जमा करें"], correct: 1, explanation: "EVM पर NOTA (उपरोक्त में से कोई नहीं) एक वैध विकल्प है।" },
    { situation: "EVM ने आपका वोट दर्ज किया, लेकिन आप इसे सत्यापित करना चाहते हैं।", question: "आपको क्या जांचना चाहिए?", options: ["उंगली पर स्याही", "VVPAT पर्ची", "एसएमएस का इंतजार", "अधिकारी से पूछें"], correct: 1, explanation: "VVPAT आपकी पसंद की पुष्टि करने के लिए 7 सेकंड के लिए एक पर्ची दिखाता है।" },
    { situation: "आप लंदन में रहने वाले एक NRI हैं।", question: "क्या आप वोट देने के लिए पंजीकरण कर सकते हैं?", options: ["नहीं", "हाँ, फॉर्म 6A का उपयोग करके", "केवल भारत में", "केवल डाक द्वारा"], correct: 1, explanation: "NRI फॉर्म 6A का उपयोग करके 'प्रवासी मतदाता' के रूप में पंजीकरण कर सकते हैं।" },
    { situation: "आप सूची से एक मृत रिश्तेदार का नाम हटाना चाहते हैं।", question: "कौन सा फॉर्म?", options: ["फॉर्म 6", "फॉर्म 7", "फॉर्म 8", "फॉर्म 9"], correct: 1, explanation: "फॉर्म 7 नाम हटाने के लिए है।" },
    { situation: "भारत में किस उंगली पर अमिट स्याही लगाई जाती है?", options: ["दाहिनी तर्जनी", "बाईं तर्जनी", "बायां अंगूठा", "कोई भी उंगली"], correct: 1, explanation: "अमिट स्याही बाईं तर्जनी (forefinger) पर लगाई जाती है।" },
    { situation: "लोकसभा उम्मीदवार के लिए सुरक्षा राशि क्या है?", options: ["₹10,000", "₹25,000", "₹5,000", "₹50,000"], correct: 1, explanation: "सामान्य उम्मीदवारों के लिए ₹25,000; SC/ST के लिए ₹12,500।" },
    { situation: "मतदान के लिए EPIC के अलावा ECI द्वारा कितने फोटो आईडी स्वीकृत हैं?", options: ["5", "12", "सभी आईडी", "केवल आधार"], correct: 1, explanation: "ECI 12 वैकल्पिक फोटो पहचान दस्तावेजों को स्वीकार करता है।" },
    { situation: "भारत के राष्ट्रपति का चुनाव कौन सी संस्था कराती है?", options: ["सुप्रीम कोर्ट", "ECI", "संसद", "राज्य सरकार"], correct: 1, explanation: "भारत निर्वाचन आयोग (ECI) राष्ट्रपति चुनाव कराता है।" },
    { situation: "क्या आपराधिक रिकॉर्ड वाला व्यक्ति वोट दे सकता है?", options: ["हाँ, यदि जेल में नहीं है", "नहीं, कभी नहीं", "केवल बरी होने पर", "हाँ, जेल में भी"], correct: 0, explanation: "कोई भी व्यक्ति जो वर्तमान में जेल में नहीं है या हिरासत में नहीं है, वोट दे सकता है।" },
    { situation: "लोकसभा सदस्य (सांसद) बनने के लिए न्यूनतम आयु क्या है?", options: ["18", "21", "25", "30"], correct: 2, explanation: "न्यूनतम आयु 25 वर्ष है।" }
  ],
  'bn-IN': [
    { situation: "রমেশ দিল্লি থেকে মুম্বাইয়ে গিয়ে মুম্বাইয়ে ভোট দিতে চান।", question: "রমেশের কি করা উচিত?", options: ["দিল্লিতে ফর্ম ৮", "মুম্বাইয়ে ফর্ম ৬", "কিছুই না", "দিল্লিতে ফর্ম ৮এ"], correct: 1, explanation: "নতুন এলাকায় নাম তুলতে ফর্ম ৬ ব্যবহার করুন।" },
    { situation: "প্রিয়ার নাম ভোটার তালিকা থেকে উধাও।", question: "তার কি করা উচিত?", options: ["পুলিশে ডায়েরি", "এমএলএ-কে জানানো", "ফর্ম ৬ পূরণ", "অপেক্ষা"], correct: 2, explanation: "নাম তুলতে ফর্ম ৬ পূরণ করুন।" },
    { situation: "আপনি আপনার ভোটার আইডি সংশোধন করতে চান।", question: "কোন ফর্ম?", options: ["ফর্ম ৬", "ফর্ম ৭", "ফর্ম ৮", "ফর্ম ৮এ"], correct: 2, explanation: "সংশোধনের জন্য ফর্ম ৮ ব্যবহার করুন।" },
    { situation: "একজন ৮৫ বছর বয়সী ভোটার বাড়ি থেকে ভোট দিতে চান।", question: "এটি কি সম্ভব?", options: ["না", "হ্যাঁ, ফর্ম ১২ডি ব্যবহার করে", "শুধুমাত্র অসুস্থ হলে", "হ্যাঁ, হোয়াটসঅ্যাপে"], correct: 1, explanation: "ফর্ম ১২ডি ব্যবহার করে বয়স্করা বাড়ি থেকে ভোট দিতে পারেন।" },
    { situation: "ভোটের কতক্ষণ আগে প্রচার বন্ধ হয়?", options: ["২৪ ঘণ্টা", "৪৮ ঘণ্টা", "১ ঘণ্টা", "কোনো সীমা নেই"], correct: 1, explanation: "ভোট শেষ হওয়ার ৪৮ ঘণ্টা আগে প্রচার বন্ধ হয়।" }
  ],
  'ta-IN': [
    { situation: "ரமேஷ் டெல்லியில் இருந்து மும்பைக்கு குடிபெயர்ந்தார், அங்கு வாக்களிக்க விரும்புகிறார்.", question: "அவர் என்ன செய்ய வேண்டும்?", options: ["டெல்லியில் படிவம் 8", "மும்பையில் படிவம் 6", "தானாகவே நடக்கும்", "டெல்லியில் படிவம் 8A"], correct: 1, explanation: "புதிய தொகுதியில் சேர படிவம் 6-ஐப் பயன்படுத்தவும்." },
    { situation: "85 வயது முதியவர் வீட்டிலிருந்தே வாக்களிக்க முடியுமா?", options: ["முடியாது", "ஆம், படிவம் 12D மூலம்", "உடல்நிலை சரியில்லை என்றால் மட்டும்", "வாட்ஸ்அப் மூலம்"], correct: 1, explanation: "85+ முதியவர்கள் படிவம் 12D மூலம் வீட்டிலிருந்தே வாக்களிக்கலாம்." }
  ],
  'te-IN': [
    { situation: "రమేష్ ఢిల్లీ నుండి ముంబైకి మారారు, అక్కడ ఓటు వేయాలనుకుంటున్నారు.", question: "అతను ఏమి చేయాలి?", options: ["ఢిల్లీలో ఫారమ్ 8", "ముంబైలో ఫారమ్ 6", "ఏమీ అవసరం లేదు", "ఢిల్లీలో ఫారమ్ 8A"], correct: 1, explanation: "కొత్త నియోజకవర్గంలో పేరు నమోదుకు ఫారమ్ 6 వాడాలి." },
    { situation: "ఓటు వేయడానికి కనీస వయస్సు ఎంత?", options: ["16", "18", "21", "25"], correct: 1, explanation: "భారతదేశంలో ఓటు వేయడానికి కనీస వయస్సు 18 ఏళ్లు." }
  ],
  'mr-IN': [
    { situation: "रमेश दिल्लीहून मुंबईला गेले असून त्यांना मुंबईत मतदान करायचे आहे.", question: "रमेशने काय करावे?", options: ["दिल्लीत फॉर्म ८", "मुंबईत फॉर्म ६", "काहीही नाही", "दिल्लीत फॉर्म ८A"], correct: 1, explanation: "नवीन मतदारसंघात नाव नोंदवण्यासाठी फॉर्म ६ वापरा." },
    { situation: "मतदान करण्यासाठी किमान वय किती आहे?", options: ["१८", "२১", "२५", "३०"], correct: 0, explanation: "भारतात मतदान करण्यासाठी किमान वय १८ वर्षे आहे." }
  ],
  'gu-IN': [
    { situation: "રમેશ દિલ્હીથી મુંબઈ રહેવા ગયા અને મુંબઈમાં મત આપવા માંગે છે.", question: "રમેશે શું કરવું જોઈએ?", options: ["દિલ્હીમાં ફોર્મ 8", "મુંબઈમાં ફોર્મ 6", "કંઈ નહીં", "દિલ્હીમાં ફોર્મ 8A"], correct: 1, explanation: "નવા મતવિસ્તારમાં નોંધણી માટે ફોર્મ 6 નો ઉપયોગ કરો." },
    { situation: "મતદાન માટે લઘુત્તમ વય કેટલી છે?", options: ["18", "21", "25", "30"], correct: 0, explanation: "ભારતમાં મતદાન માટે લઘુત્તમ વય 18 વર્ષ છે." }
  ]
};

export const getQuizQuestions = (lang) => {
  return DATA[lang] || DATA['en-IN'];
};
