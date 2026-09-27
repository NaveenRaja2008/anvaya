import { NextResponse } from 'next/server';
import { ChatMessageSchema } from '../schemas';
import { stateStore } from '@/storage/state-store';
import { SupportedLanguageCode } from '@/i18n/languages';

/**
 * Detect script / language of input text
 */
function detectScriptLanguage(text: string): SupportedLanguageCode | null {
  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  // Kannada
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
  // Bengali
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  // Gujarati
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu';
  // Punjabi (Gurmukhi)
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa';
  // Odia
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or';
  // Devanagari (Hindi or Marathi)
  if (/[\u0900-\u097F]/.test(text)) {
    if (text.includes('माझ') || text.includes('आहे') || text.includes('करावे') || text.includes('करायचे') || text.includes('नाही')) {
      return 'mr';
    }
    return 'hi';
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validated = ChatMessageSchema.parse(json);
    const userQuery = validated.message.trim();
    const lowerQuery = userQuery.toLowerCase();

    // 1. Language Resolution
    const detectedLang = detectScriptLanguage(userQuery);
    let targetLang: SupportedLanguageCode = validated.language || 'en';

    if (validated.languagePreference === 'auto_detect' && detectedLang) {
      targetLang = detectedLang;
    } else if (validated.languagePreference === 'same_as_interface') {
      targetLang = validated.language || 'en';
    } else if (detectedLang) {
      targetLang = detectedLang;
    }

    const state = stateStore.getState();
    const profile = state.profile;
    const selectedOpp =
      state.opportunities.find((o) => o.id === state.selectedOpportunityId) ||
      state.opportunities[0];
    const twin = state.digitalTwin;
    const stress = state.stressResult;
    const failure = stress.firstFailureCondition;
    const debt = state.debtCapacity;
    const decision = state.finalDecision;
    const validation = state.validationExperiment;

    let reply = '';
    const toolContextUsed: string[] = [];

    // Identify intent across languages
    const isWhatToStart =
      lowerQuery.includes('what should i start') ||
      lowerQuery.includes('what business') ||
      lowerQuery.includes('which business') ||
      userQuery.includes('कौन सा व्यवसाय') ||
      userQuery.includes('क्या शुरू करूं') ||
      userQuery.includes('தொழில்') ||
      userQuery.includes('ವ್ಯಾಪಾರ') ||
      userQuery.includes('వ్యాపారం') ||
      userQuery.includes('ബിസിനസ്') ||
      userQuery.includes('कोणता व्यवसाय') ||
      userQuery.includes('ব্যবসা') ||
      userQuery.includes('ધંધો') ||
      userQuery.includes('ਕਿਹੜਾ ਕੰਮ') ||
      userQuery.includes('କେଉଁ ବ୍ୟବସାୟ');

    const isWhyThis =
      lowerQuery.includes('why this business') ||
      lowerQuery.includes('why millet') ||
      lowerQuery.includes('why fits') ||
      userQuery.includes('यही व्यवसाय क्यों') ||
      userQuery.includes('বাজরা কেন') ||
      userQuery.includes('ஏன் இந்த தொழில்');

    const isStressOrBreak =
      lowerQuery.includes('demand fall') ||
      lowerQuery.includes('break') ||
      lowerQuery.includes('stress') ||
      lowerQuery.includes('shock') ||
      lowerQuery.includes('fail') ||
      userQuery.includes('विफलता') ||
      userQuery.includes('घाटा') ||
      userQuery.includes('नुकसान') ||
      userQuery.includes('தோல்வி') ||
      userQuery.includes('నష్టం') ||
      userQuery.includes('ಅಪಾಯ');

    const isEligibleVsSustainable =
      (lowerQuery.includes('eligible') && lowerQuery.includes('sustainable')) ||
      lowerQuery.includes('why is my eligible loan higher') ||
      lowerQuery.includes('gap') ||
      userQuery.includes('पात्रता') ||
      userQuery.includes('தகுதி') ||
      userQuery.includes('అర్హత');

    const isLoanAfford =
      lowerQuery.includes('afford') ||
      lowerQuery.includes('loan') ||
      lowerQuery.includes('emi') ||
      lowerQuery.includes('repayment') ||
      lowerQuery.includes('borrow') ||
      userQuery.includes('ऋण') ||
      userQuery.includes('कर्ज') ||
      userQuery.includes('கடன்') ||
      userQuery.includes('రుణం') ||
      userQuery.includes('ಸಾಲ') ||
      userQuery.includes('കിസ്തി') ||
      userQuery.includes('लोन');

    // 2. Generate Deterministic Grounded Content in Target Language
    // NOTE: All numbers (₹ amounts, DSCR, % values) remain 100% invariant
    if (isWhatToStart) {
      toolContextUsed.push('Opportunity Engine (Fit Breakdown)', 'Local Economic DNA');
      if (targetLang === 'hi') {
        reply = `आपकी प्रोफ़ाइल (${profile.name}, उपलब्ध पूंजी ₹${profile.capitalAvailable.toLocaleString('en-IN')}, घरेलू शेड/कार्यस्थान और खाद्य प्रसंस्करण में अनुभव) के आधार पर अन्वय ने **${state.opportunities.length} व्यावसायिक अवसर परिकल्पनाएं** तैयार की हैं।

सर्वोच्च फिट परिकल्पना **${selectedOpp.title}** है (फिट स्कोर: **${selectedOpp.fitBreakdown.compositeScore}/100**):
- **कौशल अनुकूलता**: ${selectedOpp.fitBreakdown.skillFit}/100 (अनाज सफाई व घरेलू रेसिपी का सीधा मेल)
- **पूंजी अनुकूलता**: ${selectedOpp.fitBreakdown.capitalFit}/100 (कुल परियोजना लागत ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')} आपकी बचत ₹${profile.capitalAvailable.toLocaleString('en-IN')} के अनुकूल है)
- **स्थानीय मांग**: ${selectedOpp.fitBreakdown.demandSignal}/100 (कोप्पल बाजरा का प्रमुख क्षेत्र है, जहां स्थानीय किराना दुकानों में 500 ग्राम ब्रांडेड पैकेट का अभाव है)

*सूचना: यह एक अवसर परिकल्पना (Hypothesis) है, कोई झूठी गारंटी नहीं।*`;
      } else if (targetLang === 'ta') {
        reply = `உங்கள் விவரக்குறிப்பு (${profile.name}, சொந்த சேமிப்பு ₹${profile.capitalAvailable.toLocaleString('en-IN')}, வீட்டுப் பணியிடம் மற்றும் உணவு தயாரிப்பு திறன்) அடிப்படையில் அன்வயா **${state.opportunities.length} வணிக வாய்ப்புகளைக்** கண்டறிந்துள்ளது.

மிகவும் பொருத்தமான வாய்ப்பு: **${selectedOpp.title}** (பொருத்த மதிப்பெண்: **${selectedOpp.fitBreakdown.compositeScore}/100**):
- **திறன் பொருத்தம்**: ${selectedOpp.fitBreakdown.skillFit}/100
- **முதலீட்டுப் பொருத்தம்**: ${selectedOpp.fitBreakdown.capitalFit}/100 (திட்டச் செலவு ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')} உங்கள் முதலீடு ₹${profile.capitalAvailable.toLocaleString('en-IN')} உடன் பொருந்துகிறது)
- **உள்ளூர் தேவை**: ${selectedOpp.fitBreakdown.demandSignal}/100 (உள்ளூர் கடைகளில் பேக்கிங் செய்யப்பட்ட தினை உணவுகளுக்கான அதிக தேவை)

*குறிப்பு: இது ஒரு வணிக வாய்ப்புக் கருதுகோள், தவறான உத்தரவாதம் அல்ல.*`;
      } else if (targetLang === 'te') {
        reply = `మీ ప్రొఫైల్ (${profile.name}, అందుబాటులో ఉన్న పెట్టుబడి ₹${profile.capitalAvailable.toLocaleString('en-IN')}, ఇంటి వద్ద స్థలం మరియు ఆహార తయారీ అనుభవం) ఆధారంగా అన్వయ **${state.opportunities.length} వ్యాపార అవకాశాలను** విశ్లేషించింది.

అత్యుత్తమ అవకాశం: **${selectedOpp.title}** (సరిపోలిక స్కోరు: **${selectedOpp.fitBreakdown.compositeScore}/100**):
- **నైపుణ్య సరిపోలిక**: ${selectedOpp.fitBreakdown.skillFit}/100
- **పెట్టుబడి సరిపోలిక**: ${selectedOpp.fitBreakdown.capitalFit}/100 (మొత్తం ఖర్చు ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')})
- **స్థానిక డిమాండ్**: ${selectedOpp.fitBreakdown.demandSignal}/100

*గమనిక: ఇది అవకాశ పరికల్పన మాత్రమే, గ్యారెంటీ కాదు.*`;
      } else if (targetLang === 'kn') {
        reply = `ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ (${profile.name}, ಲಭ್ಯವಿರುವ ಉಳಿತಾಯ ₹${profile.capitalAvailable.toLocaleString('en-IN')}, ಮನೆಯ ಶೆಡ್ ಮತ್ತು ಆಹಾರ ಸಂಸ್ಕರಣಾ ಅನುಭವ) ಆಧರಿಸಿ ಅನ್ವಯ **${state.opportunities.length} ವ್ಯಾಪಾರ ಅವಕಾಶಗಳನ್ನು** ಗುರುತಿಸಿದೆ.

ಅತ್ಯುನ್ನತ ಹೊಂದಾಣಿಕೆಯ ಅವಕಾಶ: **${selectedOpp.title}** (ಸ್ಕೋರ್: **${selectedOpp.fitBreakdown.compositeScore}/100**):
- **ಕೌಶಲ್ಯ ಫಿಟ್**: ${selectedOpp.fitBreakdown.skillFit}/100
- **ಬಂಡವಾಳ ಫಿಟ್**: ${selectedOpp.fitBreakdown.capitalFit}/100 (ಯೋಜನಾ ವೆಚ್ಚ ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')})
- **ಸ್ಥಳೀಯ ಬೇಡಿಕೆ**: ${selectedOpp.fitBreakdown.demandSignal}/100`;
      } else if (targetLang === 'ml') {
        reply = `നിങ്ങളുടെ വിവരങ്ങൾ (${profile.name}, ലഭ്യമായ മൂലധനം ₹${profile.capitalAvailable.toLocaleString('en-IN')}, തൊഴിലിടം, ഭക്ഷ്യ സംസ്കരണ പരിചയം) അടിസ്ഥാനമാക്കി അന്വയ **${state.opportunities.length} സംരംഭ സാധ്യതകൾ** കണ്ടെത്തി.

ഏറ്റവും അനുയോജ്യമായ സംരംഭം: **${selectedOpp.title}** (സ്കോർ: **${selectedOpp.fitBreakdown.compositeScore}/100**):
- **നൈപുണ്യ യോജിപ്പ്**: ${selectedOpp.fitBreakdown.skillFit}/100
- **മൂലധന യോജിപ്പ്**: ${selectedOpp.fitBreakdown.capitalFit}/100 (പദ്ധതി ചെലവ് ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')})
- **പ്രാദേശിക ആവശ്യം**: ${selectedOpp.fitBreakdown.demandSignal}/100`;
      } else if (targetLang === 'mr') {
        reply = `तुमच्या प्रोफाइलच्या (${profile.name}, उपलब्ध भांडवल ₹${profile.capitalAvailable.toLocaleString('en-IN')}, घरातील शेड आणि खाद्य प्रक्रिया अनुभव) आधारे अन्वयने **${state.opportunities.length} व्यावसायिक संधी** शोधल्या आहेत.

सर्वात योग्य संधी: **${selectedOpp.title}** (सुसंगतता गुण: **${selectedOpp.fitBreakdown.compositeScore}/100**):
- **कौशल्य सुसंगतता**: ${selectedOpp.fitBreakdown.skillFit}/100
- **भांडवल सुसंगतता**: ${selectedOpp.fitBreakdown.capitalFit}/100 (प्रकल्प खर्च ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')})
- **स्थानिक मागणी**: ${selectedOpp.fitBreakdown.demandSignal}/100`;
      } else if (targetLang === 'bn') {
        reply = `আপনার প্রোফাইল (${profile.name}, নিজস্ব মূলধন ₹${profile.capitalAvailable.toLocaleString('en-IN')}, বাড়ির কাজের জায়গা এবং খাদ্য প্রস্তুতের অভিজ্ঞতা) অনুযায়ী অন্বয় **${state.opportunities.length}টি ব্যবসায়িক সুযোগের অনুমান** তৈরি করেছে।

শীর্ষ সুযোগ: **${selectedOpp.title}** (ফিট স্কোর: **${selectedOpp.fitBreakdown.compositeScore}/১০০**):
- **দক্ষতা উপযুক্ততা**: ${selectedOpp.fitBreakdown.skillFit}/১০০
- **মূলধন উপযুক্ততা**: ${selectedOpp.fitBreakdown.capitalFit}/১০০ (মোট ব্যয় ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')})
- **স্থানীয় চাহিদা**: ${selectedOpp.fitBreakdown.demandSignal}/১০০`;
      } else if (targetLang === 'gu') {
        reply = `તમારી પ્રોફાઇલ (${profile.name}, ઉપલબ્ધ બચત ₹${profile.capitalAvailable.toLocaleString('en-IN')}, ઘરની જગ્યા અને ખાદ્ય પ્રક્રિયા અનુભવ) આધારે અન્વયે **${state.opportunities.length} વ્યવસાયિક તકોની પૂર્વધારણા** તૈયાર કરી છે.

શ્રેષ્ઠ યોગ્ય તક: **${selectedOpp.title}** (ફિટ સ્કોર: **${selectedOpp.fitBreakdown.compositeScore}/100**):
- **કૌશલ્ય ફિટ**: ${selectedOpp.fitBreakdown.skillFit}/100
- **મૂડી ફિટ**: ${selectedOpp.fitBreakdown.capitalFit}/100 (પ્રોજેક્ટ ખર્ચ ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')})
- **સ્થાનિક માંગ**: ${selectedOpp.fitBreakdown.demandSignal}/100`;
      } else if (targetLang === 'pa') {
        reply = `ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ (${profile.name}, ਉਪਲਬਧ ਪੂੰਜੀ ₹${profile.capitalAvailable.toLocaleString('en-IN')}, ਘਰੇਲੂ ਵਰਕਸਪੇਸ ਅਤੇ ਫੂਡ ਪ੍ਰੋਸੈਸਿੰਗ ਅਨੁਭਵ) ਦੇ ਆਧਾਰ \'ਤੇ ਅਨਵਯ ਨੇ **${state.opportunities.length} ਕਾਰੋਬਾਰੀ ਮੌਕੇ** ਲੱਭੇ ਹਨ।

ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਮੌਕਾ: **${selectedOpp.title}** (ਫਿੱਟ ਸਕੋਰ: **${selectedOpp.fitBreakdown.compositeScore}/100**):
- **ਹੁਨਰ ਫਿੱਟ**: ${selectedOpp.fitBreakdown.skillFit}/100
- **ਪੂੰਜੀ ਫਿੱਟ**: ${selectedOpp.fitBreakdown.capitalFit}/100 (ਕੁੱਲ ਲਾਗਤ ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')})
- **ਸਥਾਨਕ ਮੰਗ**: ${selectedOpp.fitBreakdown.demandSignal}/100`;
      } else if (targetLang === 'or') {
        reply = `ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ (${profile.name}, ଉପଲବ୍ଧ ପୁଞ୍ଜି ₹${profile.capitalAvailable.toLocaleString('en-IN')}, ଘରୋଇ ଶେଡ୍ ଏବଂ ଖାଦ୍ୟ ପ୍ରକ୍ରିୟାକରଣ ଅଭିଜ୍ଞତା) ଆଧାରରେ ଅନ୍ୱୟ **${state.opportunities.length}ଟି ବ୍ୟବସାୟିକ ସୁଯୋଗ** ଚିହ୍ନଟ କରିଛି।

ସର୍ବୋତ୍ତମ ସୁଯୋଗ: **${selectedOpp.title}** (ଫିଟ୍ ସ୍କୋର: **${selectedOpp.fitBreakdown.compositeScore}/୧୦୦**):
- **ଦକ୍ଷତା ଫିଟ୍**: ${selectedOpp.fitBreakdown.skillFit}/୧୦୦
- **ପୁଞ୍ଜି ଫିଟ୍**: ${selectedOpp.fitBreakdown.capitalFit}/୧୦୦ (ପ୍ରକଳ୍ପ ଖର୍ଚ୍ଚ ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')})
- **ସ୍ଥାନୀୟ ଚାହିଦା**: ${selectedOpp.fitBreakdown.demandSignal}/୧୦୦`;
      } else {
        reply = `Based on your profile (${profile.name}, ₹${profile.capitalAvailable.toLocaleString('en-IN')} capital, home workspace, and 3 years in food prep), ANVAYA generated **${state.opportunities.length} Opportunity Hypotheses**. 

The highest-fit hypothesis is **${selectedOpp.title}** (Fit Score: **${selectedOpp.fitBreakdown.compositeScore}/100**).
- **Skill Fit**: ${selectedOpp.fitBreakdown.skillFit}/100 (matches grain sorting and kitchen recipe skills)
- **Capital Fit**: ${selectedOpp.fitBreakdown.capitalFit}/100 (total project cost ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')} fits available ₹${profile.capitalAvailable.toLocaleString('en-IN')})
- **Location Demand**: ${selectedOpp.fitBreakdown.demandSignal}/100 (Koppal is a prime millet cluster with high local demand).

*Note: This is an Opportunity Hypothesis, not a guaranteed success.*`;
      }
    } else if (isStressOrBreak) {
      toolContextUsed.push('Failure Autopsy Engine', 'Stress Sensitivity Model');
      if (targetLang === 'hi') {
        reply = `**तनाव परीक्षण एवं विफलता विश्लेषण (Failure Autopsy):**
जब हमने **${Math.abs(state.stressShocks.demandChangePercent)}% मांग में गिरावट** और **${state.stressShocks.rawMaterialCostChangePercent}% कच्चे माल की लागत वृद्धि** का अनुकरण किया:
- **सामान्य मासिक बचत**: ₹${twin.monthlySurplus.toLocaleString('en-IN')}/माह
- **तनाव की स्थिति में बचत**: ₹${stress.stressCase.monthlySurplus.toLocaleString('en-IN')}/माह
- **प्रथम विफलता स्थिति**: ${failure ? failure.impactDescription : 'व्यवसाय का ब्रेक-ईवन ' + twin.breakEvenUnits + ' पैकेट/माह है।'}
- **मुख्य चेतावनी**: यदि दुकानदार 21 दिनों से अधिक उधारी रखते हैं, तो कार्यशील पूंजी अटकने से नकदी का संकट तुरंत पैदा होगा।`;
      } else if (targetLang === 'ta') {
        reply = `**வணிக அழுத்த சோதனை & தோல்வி ஆய்வு (Failure Autopsy):**
**${Math.abs(state.stressShocks.demandChangePercent)}% தேவை வீழ்ச்சி** மற்றும் **${state.stressShocks.rawMaterialCostChangePercent}% மூலப்பொருள் விலை உயர்வு** சோதிக்கப்பட்டது:
- **இயல்பு நிலை உபரி**: ₹${twin.monthlySurplus.toLocaleString('en-IN')}/மாதம்
- **அழுத்த நிலை உபரி**: ₹${stress.stressCase.monthlySurplus.toLocaleString('en-IN')}/மாதம்
- **முதல் முறிவு நிபந்தனை**: ${failure ? failure.impactDescription : 'மாதத்திற்கு ' + twin.breakEvenUnits + ' யூனிட்கள் விற்பனையாக வேண்டும்.'}
- **எச்சரிக்கை**: வாடிக்கையாளர்கள் பணம் தர 21 நாட்களுக்கு மேல் தாமதித்தால் பணப்பற்றாக்குறை ஏற்படும்.`;
      } else {
        reply = `**Stress Test & Failure Autopsy Simulation:**
When we tested a **${Math.abs(state.stressShocks.demandChangePercent)}% demand drop** combined with a **${state.stressShocks.rawMaterialCostChangePercent}% raw material price surge**:
- **Base Case Surplus**: ₹${twin.monthlySurplus.toLocaleString('en-IN')}/mo
- **Stressed Surplus**: ₹${stress.stressCase.monthlySurplus.toLocaleString('en-IN')}/mo
- **First Failure Condition**: ${failure ? failure.impactDescription : 'The business breaks even at ' + twin.breakEvenUnits + ' units/month.'}
- **Earliest Failure Pathway**: ${stress.earliestFailureCategory || 'Demand'} Shock. The model warns that extending customer credit beyond 21 days rapidly causes a cash-flow lockup.`;
      }
    } else if (isEligibleVsSustainable || isLoanAfford) {
      toolContextUsed.push('Debt Capacity Engine', 'Statutory Scheme Router');
      if (targetLang === 'hi') {
        reply = `**अन्वय का मुख्य वित्तीय सिद्धांत: ELIGIBLE ≠ SUSTAINABLE (पात्रता ≠ स्थिरता)**

- **सरकारी योजना अनुसार अधिकतम पात्र ऋण**: **₹${debt.maximumEligibleLoan.toLocaleString('en-IN')}** (योजना अनुसार 90% तक)
- **व्यवसाय की वास्तविक संधारणीय ऋण क्षमता**: **₹${debt.modelledSustainableLoan.toLocaleString('en-IN')}**
- **सुरक्षा अंतर (Gap)**: **₹${debt.eligibleVsSustainableGap.toLocaleString('en-IN')}**

**यह अंतर क्यों जरूरी है?**
सरकारी योजनाएं केवल परियोजना लागत पर कर्ज तय करती हैं, जबकि **अन्वय वास्तविक नकद प्रवाह और ग्रामीण मूल्य झटकों** की गणना करता है।
यदि आप अधिकतम ₹${debt.maximumEligibleLoan.toLocaleString('en-IN')} का कर्ज लेते हैं, तो मासिक किश्त (EMI) ₹${state.repaymentSchedule.monthlyEmiDuringRepayment.toLocaleString('en-IN')} होगी, जिससे किसी भी आर्थिक झटके में ऋण डिफ़ॉल्ट का गंभीर खतरा होगा।
अतः अन्वय केवल **₹${debt.modelledSustainableLoan.toLocaleString('en-IN')}** तक ही सुरक्षित ऋण लेने की सलाह देता है।
- **मासिक सुरक्षित EMI**: ₹${state.repaymentSchedule.monthlyEmiDuringRepayment.toLocaleString('en-IN')}
- **ऋण सेवा कवरेज अनुपात (DSCR)**: **${debt.baseCaseDscr}x** (सुरक्षित मानक >1.5x)`;
      } else if (targetLang === 'ta') {
        reply = `**அன்வயாவின் முக்கிய நிதிப் பார்வை: தகுதி ≠ தாங்கும் திறன் (ELIGIBLE ≠ SUSTAINABLE)**

- **அரசுத் திட்டப்படி அதிகபட்ச தகுதி கடன்**: **₹${debt.maximumEligibleLoan.toLocaleString('en-IN')}** (90% வரை)
- **பரிந்துரைக்கப்பட்ட பாதுகாப்பான கடன் வரம்பு**: **₹${debt.modelledSustainableLoan.toLocaleString('en-IN')}**
- **பாதுகாப்பு இடைவெளி**: **₹${debt.eligibleVsSustainableGap.toLocaleString('en-IN')}**

**காரணம்:**
அரசுத் திட்டங்கள் திட்டச் செலவை மட்டுமே பார்க்கின்றன. ஆனால் **அன்வயா பணப்புழக்கத்தை அடிப்படையாகக் கொண்டு கணக்கிடுகிறது**.
அதிகபட்ச கடன் வாங்கினால் மாதாந்திர EMI ₹${state.repaymentSchedule.monthlyEmiDuringRepayment.toLocaleString('en-IN')} ஆக உயர்ந்து, விற்பனை குறையும் போது கடன் கட்ட முடியாமல் போகும்.
எனவே அன்வயா **₹${debt.modelledSustainableLoan.toLocaleString('en-IN')}** வரை மட்டுமே கடன் வாங்கப் பரிந்துரைக்கிறது.`;
      } else if (targetLang === 'te') {
        reply = `**అన్వయ ముఖ్య ఆర్థిక అంతర్దృష్టి: అర్హత ≠ స్థిరత్వం (ELIGIBLE ≠ SUSTAINABLE)**

- **ప్రభుత్వ పథకం ప్రకారం గరిష్ట అర్హత రుణం**: **₹${debt.maximumEligibleLoan.toLocaleString('en-IN')}**
- **నమూనా సురక్షిత స్థిరమైన రుణం**: **₹${debt.modelledSustainableLoan.toLocaleString('en-IN')}**
- **భద్రతా వ్యత్యాసం**: **₹${debt.eligibleVsSustainableGap.toLocaleString('en-IN')}**

గరిష్ట అర్హత ఉన్నంత మాత్రాన అధిక రుణం తీసుకుంటే నెలవారీ EMI ₹${state.repaymentSchedule.monthlyEmiDuringRepayment.toLocaleString('en-IN')} భారం అవుతుంది. అందువల్ల అన్వయ సురక్షితమైన **₹${debt.modelledSustainableLoan.toLocaleString('en-IN')}** మాత్రమే సిఫార్సు చేస్తోంది.`;
      } else {
        reply = `**Core ANVAYA Insight: ELIGIBLE ≠ SUSTAINABLE**

- **Statutory Eligible Loan**: **₹${debt.maximumEligibleLoan.toLocaleString('en-IN')}** (Under Micro Finance scheme, banks can legally fund up to 90% of project cost).
- **Modelled Sustainable Loan**: **₹${debt.modelledSustainableLoan.toLocaleString('en-IN')}**
- **The Gap**: **₹${debt.eligibleVsSustainableGap.toLocaleString('en-IN')}**

**Why the difference?**
The government scheme calculates eligibility solely from project cost caps. But **ANVAYA simulates cash flow under stress**. 
If you borrow ₹${debt.maximumEligibleLoan.toLocaleString('en-IN')}, your monthly EMI is ₹${state.repaymentSchedule.monthlyEmiDuringRepayment.toLocaleString('en-IN')}. Under rural price shocks, your net surplus drops, causing a **debt default**. 

Therefore, ANVAYA caps your safe borrowing at ₹${debt.modelledSustainableLoan.toLocaleString('en-IN')}.
- **Monthly EMI**: ₹${state.repaymentSchedule.monthlyEmiDuringRepayment.toLocaleString('en-IN')}
- **Debt Service Coverage (Base DSCR)**: **${debt.baseCaseDscr}x** (Safe threshold >1.5x)`;
      }
    } else {
      toolContextUsed.push('Deterministic State Store (10 Engines)');
      if (targetLang === 'hi') {
        reply = `अन्वय प्रणाली आपके व्यवसाय मॉडल (${selectedOpp.title}) की निगरानी कर रही है।
- **उपलब्ध अपनी पूंजी**: ₹${profile.capitalAvailable.toLocaleString('en-IN')}
- **परियोजना लागत**: ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')}
- **सुरक्षित ऋण सीमा**: ₹${debt.modelledSustainableLoan.toLocaleString('en-IN')}
- **मासिक नकद अधिशेष**: ₹${twin.monthlySurplus.toLocaleString('en-IN')}/माह

आप मुझसे अवसरों की खोज, मांग सत्यापन, डिजिटल ट्विन, तनाव परीक्षण अथवा ऋण क्षमता के संबंध में कोई भी प्रश्न पूछ सकते हैं।`;
      } else if (targetLang === 'ta') {
        reply = `அன்வயா உங்கள் வணிக மாதிரியை (${selectedOpp.title}) தொடர்ந்து கண்காணிக்கிறது.
- **சொந்த முதலீடு**: ₹${profile.capitalAvailable.toLocaleString('en-IN')}
- **திட்டச் செலவு**: ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')}
- **பாதுகாப்பான கடன்**: ₹${debt.modelledSustainableLoan.toLocaleString('en-IN')}
- **மாதாந்திர நிகர உபரி**: ₹${twin.monthlySurplus.toLocaleString('en-IN')}

வணிக வாய்ப்புகள், களச் சான்றுகள், மாதிரி கணக்கீடுகள் மற்றும் கடன் தாங்கும் திறன் குறித்து எப்போது வேண்டுமானாலும் கேட்கலாம்.`;
      } else {
        reply = `ANVAYA is monitoring your active business model (${selectedOpp.title}).
- **Available Capital**: ₹${profile.capitalAvailable.toLocaleString('en-IN')}
- **Total Project Cost**: ₹${selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')}
- **Recommended Loan Cap**: ₹${debt.modelledSustainableLoan.toLocaleString('en-IN')}
- **Base Monthly Surplus**: ₹${twin.monthlySurplus.toLocaleString('en-IN')}/mo

You can ask about Reverse Discovery, Micro-Market Validation, Digital Twin Unit Economics, Failure Stress Testing, or Debt Structure.`;
      }
    }

    return NextResponse.json({
      success: true,
      reply,
      language: targetLang,
      detectedLanguage: detectedLang,
      toolContextUsed,
      groundedEvidence: {
        capitalAvailable: profile.capitalAvailable,
        totalProjectCost: selectedOpp.capitalRequirement.totalProjectCost,
        modelledSustainableLoan: debt.modelledSustainableLoan,
        maximumEligibleLoan: debt.maximumEligibleLoan,
        monthlyEmi: state.repaymentSchedule.monthlyEmiDuringRepayment,
        baseDscr: debt.baseCaseDscr,
        stressDscr: debt.stressCaseDscr
      }
    });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Chat service failed' },
      { status: 400 }
    );
  }
}
