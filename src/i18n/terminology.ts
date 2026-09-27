import { SupportedLanguageCode } from './languages';
import { EvidenceType } from '../types/domain';

export interface TerminologyItem {
  key: string;
  english: string;
  translations: Record<SupportedLanguageCode, string>;
  explanation: string;
}

export const DOMAIN_TERMINOLOGY: Record<string, TerminologyItem> = {
  discover: {
    key: 'discover',
    english: 'Discover',
    translations: {
      en: 'Discover',
      hi: 'खोज (Discover)',
      ta: 'கண்டறிதல் (Discover)',
      te: 'కనుగొను (Discover)',
      kn: 'ಅನ್ವೇಷಿಸಿ (Discover)',
      ml: 'കണ്ടെത്തുക (Discover)',
      mr: 'शोध (Discover)',
      bn: 'আবিষ্কার (Discover)',
      gu: 'શોધ (Discover)',
      pa: 'ਖੋਜ (Discover)',
      or: 'ଆବିଷ୍କାର (Discover)'
    },
    explanation: 'Reverse discovery of opportunities fitting the person and location.'
  },
  prove: {
    key: 'prove',
    english: 'Prove',
    translations: {
      en: 'Prove',
      hi: 'प्रमाण (Prove)',
      ta: 'மெய்ப்பித்தல் (Prove)',
      te: 'నిరూపించు (Prove)',
      kn: 'ಸಾಬೀತುಪಡಿಸಿ (Prove)',
      ml: 'തെളിയിക്കുക (Prove)',
      mr: 'पुरावा (Prove)',
      bn: 'প্রমাণ করুন (Prove)',
      gu: 'સાબિત કરો (Prove)',
      pa: 'ਸਾਬਤ ਕਰੋ (Prove)',
      or: 'ପ୍ରମାଣ କରନ୍ତୁ (Prove)'
    },
    explanation: 'Micro-market validation of customer demand before borrowing.'
  },
  simulate: {
    key: 'simulate',
    english: 'Simulate',
    translations: {
      en: 'Simulate',
      hi: 'सिमुलेट / मॉडल (Simulate)',
      ta: 'மாதிரி உருவகப்படுத்துதல் (Simulate)',
      te: 'సిమ్యులేట్ (Simulate)',
      kn: 'ಅನುಕರಿಸಿ / ಸಿಮ್ಯುಲೇಟ್ (Simulate)',
      ml: 'മാതൃകയാക്കുക (Simulate)',
      mr: 'सिम्युलेट करा (Simulate)',
      bn: 'অনুকরণ / সিমুলেট (Simulate)',
      gu: 'સિમ્યુલેટ કરો (Simulate)',
      pa: 'ਮਾਡਲ ਬਣਾਓ (Simulate)',
      or: 'ମଡେଲ ପ୍ରସ୍ତୁତ କରନ୍ତୁ (Simulate)'
    },
    explanation: 'Deterministic digital twin of business unit economics and cash flow.'
  },
  break: {
    key: 'break',
    english: 'Break',
    translations: {
      en: 'Break the Business',
      hi: 'बिज़नेस ब्रेक / तनाव परीक्षण (Break the Business)',
      ta: 'வணிக அழுத்த சோதனை (Break the Business)',
      te: 'వ్యాపార ఒత్తిడి పరీక్ష (Break the Business)',
      kn: 'ವ್ಯವಹಾರ ಒತ್ತಡ ಪರೀಕ್ಷೆ (Break the Business)',
      ml: 'ബിസിനസ്സ് സമ്മർദ്ദ പരിശോധന (Break the Business)',
      mr: 'व्यवसाय ताण चाचणी (Break the Business)',
      bn: 'ব্যবসায়িক চাপ পরীক্ষা (Break the Business)',
      gu: 'બિઝનેસ તણાવ પરીક્ષણ (Break the Business)',
      pa: 'ਵਪਾਰਕ ਦਬਾਅ ਟੈਸਟ (Break the Business)',
      or: 'ବ୍ୟବସାୟ ଚାପ ପରୀକ୍ଷା (Break the Business)'
    },
    explanation: 'Stress-testing the enterprise to identify the first failure condition.'
  },
  structure: {
    key: 'structure',
    english: 'Structure the Debt',
    translations: {
      en: 'Structure the Debt',
      hi: 'ऋण संरचना (Structure the Debt)',
      ta: 'கடன் கட்டமைப்பு (Structure the Debt)',
      te: 'రుణ నిర్మాణం (Structure the Debt)',
      kn: 'ಸಾಲ ರಚನೆ (Structure the Debt)',
      ml: 'കടം ഘടനാപരമാക്കുക (Structure the Debt)',
      mr: 'कर्ज रचना (Structure the Debt)',
      bn: 'ঋণ কাঠামো (Structure the Debt)',
      gu: 'દેવાની રચના (Structure the Debt)',
      pa: 'ਕਰਜ਼ੇ ਦਾ ਢਾਂਚਾ (Structure the Debt)',
      or: 'ଋଣ ସଂରଚନା (Structure the Debt)'
    },
    explanation: 'Structuring debt around sustainable cash capacity rather than maximum borrowing.'
  },
  act: {
    key: 'act',
    english: 'Act',
    translations: {
      en: 'Act & Execute',
      hi: 'कार्य योजना ও क्रियान्वयन (Act)',
      ta: 'செயல்படுத்துதல் (Act)',
      te: 'చర్య & అమలు (Act)',
      kn: 'ಕಾರ್ಯಗತಗೊಳಿಸಿ (Act)',
      ml: 'നടപ്പിലാക്കുക (Act)',
      mr: 'अंमलबजावणी करा (Act)',
      bn: 'বাস্তবায়ন করুন (Act)',
      gu: 'અમલમાં મૂકો (Act)',
      pa: 'ਅਮਲ ਕਰੋ (Act)',
      or: 'କାର୍ଯ୍ୟକାରୀ କରନ୍ତୁ (Act)'
    },
    explanation: 'Final recommendation and 7/30/90-day phased execution roadmap.'
  },
  reverseDiscovery: {
    key: 'reverseDiscovery',
    english: 'Reverse Business Discovery',
    translations: {
      en: 'Reverse Business Discovery',
      hi: 'रिवर्स बिज़नेस खोज (Reverse Business Discovery)',
      ta: 'பின்னோக்கு வணிகக் கண்டறிதல் (Reverse Discovery)',
      te: 'రివర్స్ బిజినెస్ డిస్కవరీ (Reverse Discovery)',
      kn: 'ರಿವರ್ಸ್ ಬಿಸಿನೆಸ್ ಅನ್ವೇಷಣೆ (Reverse Discovery)',
      ml: 'റിവേഴ്സ് ബിസിനസ്സ് കണ്ടെത്തൽ (Reverse Discovery)',
      mr: 'रिव्हर्स बिझनेस शोध (Reverse Discovery)',
      bn: 'রিভার্স বিজনেস আবিষ্কার (Reverse Discovery)',
      gu: 'રિવર્સ બિઝનેસ ડિસ્કવરી (Reverse Discovery)',
      pa: 'ਰਿਵਰਸ ਬਿਜ਼ਨਸ ਖੋਜ (Reverse Discovery)',
      or: 'ରିଭର୍ସ ବ୍ୟବସାୟ ଆବିଷ୍କାର (Reverse Discovery)'
    },
    explanation: 'Discovering business hypotheses from individual skills and local geography rather than ideas.'
  },
  proveBeforeBorrow: {
    key: 'proveBeforeBorrow',
    english: 'Prove Before You Borrow',
    translations: {
      en: 'Prove Before You Borrow',
      hi: 'कर्ज लेने से पहले साबित करें (Prove Before You Borrow)',
      ta: 'கடன் வாங்கும் முன் நிரூபியுங்கள் (Prove Before You Borrow)',
      te: 'రుణం తీసుకునే ముందే నిరూపించండి (Prove Before You Borrow)',
      kn: 'ಸಾಲ ಪಡೆಯುವ ಮುನ್ನ ಸಾಬೀತುಪಡಿಸಿ (Prove Before You Borrow)',
      ml: 'കടമെടുക്കുന്നതിന് മുൻപ് തെളിയിക്കുക (Prove Before You Borrow)',
      mr: 'कर्ज घेण्यापूर्वी सिद्ध करा (Prove Before You Borrow)',
      bn: 'ঋণ নেওয়ার আগে প্রমাণ করুন (Prove Before You Borrow)',
      gu: 'લોન લેતા પહેલા સાબિત કરો (Prove Before You Borrow)',
      pa: 'ਕਰਜ਼ਾ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਸਾਬਤ ਕਰੋ (Prove Before You Borrow)',
      or: 'ଋଣ ନେବା ପୂର୍ବରୁ ପ୍ରମାଣ କରନ୍ତୁ (Prove Before You Borrow)'
    },
    explanation: 'Empirical micro-market customer validation of willingness-to-pay.'
  },
  digitalTwin: {
    key: 'digitalTwin',
    english: 'Business Digital Twin',
    translations: {
      en: 'Business Digital Twin',
      hi: 'बिज़नेस डिजिटल ट्विन (Business Digital Twin)',
      ta: 'வணிக டிஜிட்டல் இரட்டை (Digital Twin)',
      te: 'బిజినెస్ డిజిటల్ ట్విన్ (Digital Twin)',
      kn: 'ವ್ಯವಹಾರ ಡಿಜಿಟಲ್ ಟ್ವಿನ್ (Digital Twin)',
      ml: 'ബിസിനസ്സ് ഡിജിറ്റൽ ട്വിൻ (Digital Twin)',
      mr: 'व्यवसाय डिजिटल ट्विन (Digital Twin)',
      bn: 'ব্যবসায়িক ডিজিটাল টুইন (Digital Twin)',
      gu: 'બિઝનેસ ડિજિટલ ટ્વિન (Digital Twin)',
      pa: 'ਕਾਰੋਬਾਰੀ ਡਿਜੀਟਲ ਟਵਿਨ (Digital Twin)',
      or: 'ବ୍ୟବସାୟ ଡିଜିଟାଲ୍ ଟ୍ୱିନ୍ (Digital Twin)'
    },
    explanation: 'Mathematical unit economics simulation model.'
  },
  evidenceEngine: {
    key: 'evidenceEngine',
    english: 'Evidence Engine',
    translations: {
      en: 'Evidence Engine',
      hi: 'साक्ष्य इंजन (Evidence Engine)',
      ta: 'சான்று எஞ்சின் (Evidence Engine)',
      te: 'సాక్ష్యాల ఇంజిన్ (Evidence Engine)',
      kn: 'ಸಾಕ್ಷ್ಯಾಧಾರ ಇಂಜಿನ್ (Evidence Engine)',
      ml: 'തെളിവ് എഞ്ചിൻ (Evidence Engine)',
      mr: 'पुरावा इंजिन (Evidence Engine)',
      bn: 'প্রমাণ ইঞ্জিন (Evidence Engine)',
      gu: 'પુરાવા એન્જિન (Evidence Engine)',
      pa: 'ਸਬੂਤ ਇੰਜਣ (Evidence Engine)',
      or: 'ପ୍ରମାଣ ଇଞ୍ଜିନ୍ (Evidence Engine)'
    },
    explanation: 'Tagging all metrics with empirical provenance and confidence.'
  },
  opportunityRadar: {
    key: 'opportunityRadar',
    english: 'Opportunity Radar',
    translations: {
      en: 'Opportunity Radar',
      hi: 'अवसर रडार (Opportunity Radar)',
      ta: 'வாய்ப்பு ரேடார் (Opportunity Radar)',
      te: 'అవకాశాల రాడార్ (Opportunity Radar)',
      kn: 'ಅವಕಾಶಗಳ ರಾಡಾರ್ (Opportunity Radar)',
      ml: 'അവസര റഡാർ (Opportunity Radar)',
      mr: 'संधी रडार (Opportunity Radar)',
      bn: 'সুযোগের রাডার (Opportunity Radar)',
      gu: 'તક રડાર (Opportunity Radar)',
      pa: 'ਮੌਕਾ ਰਾਡਾਰ (Opportunity Radar)',
      or: 'ସୁଯୋଗ ରାଡାର୍ (Opportunity Radar)'
    },
    explanation: 'Radar comparison of candidate business hypotheses.'
  },
  capitalSandbox: {
    key: 'capitalSandbox',
    english: 'Capital Sandbox',
    translations: {
      en: 'Capital Sandbox',
      hi: 'पूंजी सैंडबॉक्स (Capital Sandbox)',
      ta: 'மூலதன சாண்ட்பாக்ஸ் (Capital Sandbox)',
      te: 'క్యాపిటల్ శాండ్‌బాక్స్ (Capital Sandbox)',
      kn: 'ಬಂಡವಾಳ ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್ (Capital Sandbox)',
      ml: 'ക്യാപിറ്റൽ സാൻഡ്ബോക്സ് (Capital Sandbox)',
      mr: 'भांडवल सँडबॉक्स (Capital Sandbox)',
      bn: 'ক্যাপিটাল স্যান্ডবক্স (Capital Sandbox)',
      gu: 'કેપિટલ સેન્ડબોક્સ (Capital Sandbox)',
      pa: 'ਕੈਪੀਟਲ ਸੈਂਡਬਾਕਸ (Capital Sandbox)',
      or: 'କ୍ୟାପିଟାଲ୍ ସ୍ୟାଣ୍ଡବକ୍ସ (Capital Sandbox)'
    },
    explanation: 'Interactive co-financing architecture comparing self-finance, grant, and debt routes.'
  },
  schemeRouter: {
    key: 'schemeRouter',
    english: 'Scheme Router',
    translations: {
      en: 'Scheme Router',
      hi: 'सरकारी योजना चयनकर्ता (Scheme Router)',
      ta: 'திட்ட வழிகாட்டி (Scheme Router)',
      te: 'పథకాల రూటర్ (Scheme Router)',
      kn: 'ಯೋಜನೆಗಳ ರೂಟರ್ (Scheme Router)',
      ml: 'പദ്ധതി റൂട്ടർ (Scheme Router)',
      mr: 'योजना मार्गदर्शक (Scheme Router)',
      bn: 'স্কিম রাউটার (Scheme Router)',
      gu: 'યોજના રાઉટર (Scheme Router)',
      pa: 'ਸਕੀਮ ਰਾਊਟਰ (Scheme Router)',
      or: 'ଯୋଜନା ରାଉଟର୍ (Scheme Router)'
    },
    explanation: 'Deterministic statutory eligibility engine.'
  },
  eligible: {
    key: 'eligible',
    english: 'Eligible',
    translations: {
      en: 'Eligible',
      hi: 'पात्र (Eligible)',
      ta: 'தகுதி (Eligible)',
      te: 'అర్హత (Eligible)',
      kn: 'ಅರ್ಹತೆ (Eligible)',
      ml: 'അർഹത (Eligible)',
      mr: 'पात्र (Eligible)',
      bn: 'যোগ্য (Eligible)',
      gu: 'પાત્ર (Eligible)',
      pa: 'ਯੋਗ (Eligible)',
      or: 'ଯୋଗ୍ୟ (Eligible)'
    },
    explanation: 'Statutory scheme loan ceiling.'
  },
  affordable: {
    key: 'affordable',
    english: 'Affordable',
    translations: {
      en: 'Affordable',
      hi: 'वहनीय (Affordable)',
      ta: 'மலிவு / வாங்கும் திறன் (Affordable)',
      te: 'స్థోమత (Affordable)',
      kn: 'ಕೈಗೆಟುಕುವಿಕೆ (Affordable)',
      ml: 'താങ്ങാനാവുന്നത് (Affordable)',
      mr: 'परवडणारे (Affordable)',
      bn: 'সাধ্যের মধ্যে (Affordable)',
      gu: 'પોષાય તેવું (Affordable)',
      pa: 'ਪਹੁੰਚ ਵਿੱਚ (Affordable)',
      or: 'ସୁଲଭ (Affordable)'
    },
    explanation: 'Loan that base-case DSCR > 1.5x allows.'
  },
  sustainable: {
    key: 'sustainable',
    english: 'Sustainable',
    translations: {
      en: 'Sustainable',
      hi: 'संधारणीय / सुरक्षित (Sustainable)',
      ta: 'தாங்கக்கூடியது (Sustainable)',
      te: 'స్థిరమైనది (Sustainable)',
      kn: 'ಸುಸ್ಥಿರ (Sustainable)',
      ml: 'സുസ്ഥിരം (Sustainable)',
      mr: 'शाश्वत (Sustainable)',
      bn: 'টেকসই (Sustainable)',
      gu: 'ટકાઉ (Sustainable)',
      pa: 'ਟਿਕਾਊ (Sustainable)',
      or: 'ସ୍ଥାୟୀ (Sustainable)'
    },
    explanation: 'Loan that survives economic and pricing shocks without debt default.'
  },
  eligibleAffordableSustainable: {
    key: 'eligibleAffordableSustainable',
    english: 'ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE',
    translations: {
      en: 'ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE',
      hi: 'पात्रता ≠ सामर्थ्य ≠ स्थिरता (ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE)',
      ta: 'தகுதி ≠ வாங்கும் திறன் ≠ தாங்கும் திறன் (ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE)',
      te: 'అర్హత ≠ స్థోమత ≠ స్థిరత్వం (ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE)',
      kn: 'ಅರ್ಹತೆ ≠ ಕೈಗೆಟುಕುವಿಕೆ ≠ ಸುಸ್ಥಿರತೆ (ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE)',
      ml: 'അർഹത ≠ താങ്ങാനുള്ള ശേഷി ≠ സുസ്ഥിരത (ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE)',
      mr: 'पात्रता ≠ परवडणे ≠ शाश्वतता (ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE)',
      bn: 'যোগ্যতা ≠ সাধ্য ≠ টেকসই (ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE)',
      gu: 'પાત્રતા ≠ પોષાય તેવું ≠ ટકાઉ (ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE)',
      pa: 'ਯੋਗਤਾ ≠ ਸਮਰੱਥਾ ≠ ਟਿਕਾਊਪਣ (ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE)',
      or: 'ଯୋଗ୍ୟତା ≠ ସୁଲଭତା ≠ ସ୍ଥାୟୀତ୍ୱ (ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE)'
    },
    explanation: 'Statutory scheme eligibility does not equal cash-flow affordability or shock sustainability.'
  },
  failureAutopsy: {
    key: 'failureAutopsy',
    english: 'Failure Autopsy',
    translations: {
      en: 'Failure Autopsy',
      hi: 'विफलता विश्लेषण / पोस्टमार्टम (Failure Autopsy)',
      ta: 'தோல்வி ஆய்வு (Failure Autopsy)',
      te: 'వైఫల్య విశ్లేషణ (Failure Autopsy)',
      kn: 'ವೈಫಲ್ಯ ವಿಶ್ಲೇಷಣೆ (Failure Autopsy)',
      ml: 'പരാജയ വിശകലനം (Failure Autopsy)',
      mr: 'अपयश विश्लेषण (Failure Autopsy)',
      bn: 'ব্যর্থতা বিশ্লেষণ (Failure Autopsy)',
      gu: 'નિષ્ફળતા વિશ્લેષણ (Failure Autopsy)',
      pa: 'ਅਸਫਲਤਾ ਵਿਸ਼ਲੇਸ਼ਣ (Failure Autopsy)',
      or: 'ବିଫଳତା ବିଶ୍ଳେଷଣ (Failure Autopsy)'
    },
    explanation: 'Identifying the exact mathematical condition where cash surplus turns negative.'
  },
  resilienceEnvelope: {
    key: 'resilienceEnvelope',
    english: 'Resilience Envelope',
    translations: {
      en: 'Resilience Envelope',
      hi: 'सुरक्षा दायरा / लचीलापन लिफाफा (Resilience Envelope)',
      ta: 'தாங்குதிறன் எல்லை (Resilience Envelope)',
      te: 'స్థితిస్థాపకత పరిధి (Resilience Envelope)',
      kn: 'ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ ವ್ಯಾಪ್ತಿ (Resilience Envelope)',
      ml: 'പ്രതിരോധ പരിധി (Resilience Envelope)',
      mr: 'लवचिकता मर्यादा (Resilience Envelope)',
      bn: 'সহনশীলতার সীমা (Resilience Envelope)',
      gu: 'સ્થિતિસ્થાપકતા મર્યાદા (Resilience Envelope)',
      pa: 'ਲਚਕੀਲਾਪਣ ਦਾ ਘੇਰਾ (Resilience Envelope)',
      or: 'ସହନଶୀଳତା ସୀମା (Resilience Envelope)'
    },
    explanation: 'The safe operating parameter boundary for demand, prices, and costs.'
  },
  debtCapacity: {
    key: 'debtCapacity',
    english: 'Debt Capacity',
    translations: {
      en: 'Debt Capacity',
      hi: 'ऋण वहन क्षमता (Debt Capacity)',
      ta: 'கடன் தாங்கும் திறன் (Debt Capacity)',
      te: 'రుణ మోసే సామర్థ్యం (Debt Capacity)',
      kn: 'ಸಾಲ ಹೊರುವ ಸಾಮರ್ಥ್ಯ (Debt Capacity)',
      ml: 'കടം വഹിക്കാനുള്ള ശേഷി (Debt Capacity)',
      mr: 'कर्ज वहन क्षमता (Debt Capacity)',
      bn: 'ঋণ বহনের ক্ষমতা (Debt Capacity)',
      gu: 'દેવું વહન કરવાની ક્ષમતા (Debt Capacity)',
      pa: 'ਕਰਜ਼ ਚੁੱਕਣ ਦੀ ਸਮਰੱਥਾ (Debt Capacity)',
      or: 'ଋଣ ସହିବା କ୍ଷମତା (Debt Capacity)'
    },
    explanation: 'The maximum debt a business can service safely under stressed conditions.'
  }
};

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, Record<SupportedLanguageCode, string>> = {
  OBSERVED: {
    en: 'OBSERVED',
    hi: 'प्रत्यक्ष अवलोकित (OBSERVED)',
    ta: 'நேரடி அவதானிப்பு',
    te: 'ప్రత్యక్ష పరిశీలన',
    kn: 'ನೇರ ವೀಕ್ಷಣೆ',
    ml: 'നേരിട്ട് നിരീക്ഷിച്ചത്',
    mr: 'प्रत्यक्ष निरीक्षण',
    bn: 'সরাসরি পর্যবেক্ষণ',
    gu: 'પ્રત્યક્ષ અવલોકન',
    pa: 'ਸਿੱਧਾ ਨਿਰੀਖਣ',
    or: 'ପ୍ରତ୍ୟକ୍ଷ ଅବଲୋକନ'
  },
  INFERRED: {
    en: 'INFERRED',
    hi: 'अनुमानित संकेत (INFERRED)',
    ta: 'ஊகிக்கப்பட்ட தகவல்',
    te: 'ఊహించిన సంకేతం',
    kn: 'ಊಹಿಸಿದ ಮಾಹಿತಿ',
    ml: 'അനുമാനിച്ച വിവരങ്ങൾ',
    mr: 'अनुमानित माहिती',
    bn: 'অনুমানকৃত সংকেত',
    gu: 'અનુમાનિત સંકેત',
    pa: 'ਅਨੁਮਾਨਿਤ ਸੰਕੇਤ',
    or: 'ଅନୁମାନିତ ସଙ୍କେତ'
  },
  VALIDATED: {
    en: 'VALIDATED',
    hi: 'सत्यापित मांग (VALIDATED)',
    ta: 'களத்தில் சரிபார்க்கப்பட்டது',
    te: 'క్షేత్ర ధృవీకరణ',
    kn: 'ಸಾಬೀತಾದ ಬೇಡಿಕೆ',
    ml: 'സ്ഥിരീകരിച്ച ആവശ്യം',
    mr: 'सत्यापित मागणी',
    bn: 'যাচাইকৃত চাহিদা',
    gu: 'ચકાસાયેલ માંગ',
    pa: 'ਤਸਦੀਕ ਕੀਤੀ ਮੰਗ',
    or: 'ଯାଞ୍ଚ ହୋଇଥିବା ଚାହିଦା'
  },
  SIMULATED: {
    en: 'SIMULATED',
    hi: 'सिमुलेटेड मॉडल (SIMULATED)',
    ta: 'மாதிரி கணக்கீடு',
    te: 'సిమ్యులేటెడ్ మోడల్',
    kn: 'ಮಾದರಿ ಲೆಕ್ಕಾಚಾರ',
    ml: 'സിമുലേഷൻ മാതൃക',
    mr: 'सिम्युलेटेड मॉडेल',
    bn: 'সিমুলেটেড মডেল',
    gu: 'સિમ્યુલેટેડ મોડલ',
    pa: 'ਸਿਮੂਲੇਟਿਡ ਮਾਡਲ',
    or: 'ସିମୁଲେଟେଡ୍ ମଡେଲ୍'
  },
  USER_PROVIDED: {
    en: 'USER PROVIDED',
    hi: 'उद्यमी द्वारा प्रदत्त (USER PROVIDED)',
    ta: 'தொழில்முனைவோர் வழங்கியது',
    te: 'వినియోగదారు అందించినది',
    kn: 'ಉದ್ಯಮಿ ಒದಗಿಸಿದ ಮಾಹಿತಿ',
    ml: 'സംരംഭകൻ നൽകിയത്',
    mr: 'उद्योजकाने दिलेली माहिती',
    bn: 'উদ্যোক্তার প্রদত্ত তথ্য',
    gu: 'ઉદ્યોગસાહસિક દ્વારા આપેલ',
    pa: 'ਉੱਦਮੀ ਵੱਲੋਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ',
    or: 'ଉଦ୍ୟୋଗୀ ପ୍ରଦାନ କରିଥିବା'
  },
  DEMO_DATA: {
    en: 'DEMO DATA',
    hi: 'डेमो डेटा (DEMO DATA)',
    ta: 'மாதிரி தரவு (DEMO DATA)',
    te: 'డెమో డేటా (DEMO DATA)',
    kn: 'ಡೆಮೊ ಮಾಹಿತಿ (DEMO DATA)',
    ml: 'ഡെമോ ഡാറ്റ (DEMO DATA)',
    mr: 'डेमो डेटा (DEMO DATA)',
    bn: 'ডেমো ডেটা (DEMO DATA)',
    gu: 'ડેમો ડેટા (DEMO DATA)',
    pa: 'ਡੈਮੋ ਡਾਟਾ (DEMO DATA)',
    or: 'ଡେମୋ ଡାଟା (DEMO DATA)'
  }
};
