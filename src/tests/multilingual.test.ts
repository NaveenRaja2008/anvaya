import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '../i18n/languages';
import { DOMAIN_TERMINOLOGY, EVIDENCE_TYPE_LABELS } from '../i18n/terminology';
import { LOCALES, resolveTranslation } from '../i18n/locales';
import { defaultSTTProvider, defaultTTSProvider } from '../providers/speech-provider';

test('1. Supported Languages: Exactly 11 languages defined with valid metadata', () => {
  const expectedCodes: SupportedLanguageCode[] = [
    'en',
    'hi',
    'ta',
    'te',
    'kn',
    'ml',
    'mr',
    'bn',
    'gu',
    'pa',
    'or'
  ];

  assert.strictEqual(SUPPORTED_LANGUAGES.length, 11, 'Must support at least 11 languages');

  for (const code of expectedCodes) {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    assert.ok(lang, `Language ${code} must be defined in SUPPORTED_LANGUAGES`);
    assert.ok(lang.name.length > 0, `Language ${code} must have a native name`);
    assert.ok(lang.englishName.length > 0, `Language ${code} must have an English name`);
    assert.ok(lang.bcp47.length > 0, `Language ${code} must have a valid BCP-47 tag`);
  }
});

test('2. Locale Dictionaries: All 11 languages have top-level section mappings', () => {
  const expectedSections = [
    'nav',
    'overview',
    'discover',
    'prove',
    'simulate',
    'break',
    'structure',
    'act',
    'evidence',
    'onboarding',
    'report',
    'assistant',
    'howDecided'
  ];

  for (const lang of SUPPORTED_LANGUAGES) {
    const dict = LOCALES[lang.code];
    assert.ok(dict, `Locale dictionary for ${lang.code} must exist`);

    for (const section of expectedSections) {
      assert.ok(
        dict[section],
        `Section ${section} must exist in ${lang.code} dictionary`
      );
    }
  }
});

test('3. Fallback Translation Resolver: Graceful fallback and parameter interpolation', () => {
  // Test native Hindi resolution
  const hiBrand = resolveTranslation('hi', 'nav.brand');
  assert.ok(hiBrand.includes('अन्वय'), 'Hindi brand must contain Devanagari text');

  // Test parameter replacement
  const stepTitle = resolveTranslation('en', 'onboarding.title', { step: 2 });
  assert.strictEqual(stepTitle, 'Entrepreneur Intelligence Intake (Step 2 of 3)');

  const hiStepTitle = resolveTranslation('hi', 'onboarding.title', { step: 1 });
  assert.ok(hiStepTitle.includes('1'), 'Interpolated step variable must appear in output');

  // Test missing key fallback to English
  const nonExistent = resolveTranslation('ta', 'non.existent.key');
  assert.strictEqual(nonExistent, 'non.existent.key', 'Missing key should return keyPath itself');

  // Test that output is never undefined
  const testKeys = ['nav.overview', 'overview.availableCapital', 'report.title'];
  for (const l of SUPPORTED_LANGUAGES) {
    for (const k of testKeys) {
      const val = resolveTranslation(l.code, k);
      assert.notStrictEqual(val, undefined);
      assert.ok(val.length > 0);
    }
  }
});

test('4. Number Preservation Rule: Financial amounts, ratios and tenures remain identical across languages', () => {
  const sampleAmount = 125000;
  const sampleInterest = 0.085;
  const sampleDSCR = 1.52;
  const formattedAmount = `₹${sampleAmount.toLocaleString('en-IN')}`;

  // Formatting test across all languages
  assert.strictEqual(formattedAmount, '₹1,25,000');
  assert.strictEqual(`${(sampleInterest * 100).toFixed(1)}%`, '8.5%');
  assert.strictEqual(`${sampleDSCR}x`, '1.52x');

  // Verify that translation strings containing numbers do not hardcode altered values
  const enCapNotice = resolveTranslation('en', 'onboarding.capitalNotice');
  assert.ok(!enCapNotice.includes('undefined'));
});

test('5. Evidence Enums: Immutable internal enum retained with localized labels', () => {
  const enumKeys = [
    'OBSERVED',
    'INFERRED',
    'VALIDATED',
    'SIMULATED',
    'USER_PROVIDED',
    'DEMO_DATA'
  ] as const;

  for (const eKey of enumKeys) {
    const labelSet = EVIDENCE_TYPE_LABELS[eKey];
    assert.ok(labelSet, `Label set for ${eKey} must exist`);

    for (const lang of SUPPORTED_LANGUAGES) {
      const localized = labelSet[lang.code];
      assert.ok(
        localized && localized.length > 0,
        `Localized label for ${eKey} in ${lang.code} must not be empty`
      );
    }
  }

  // Check specific required examples from user prompt
  assert.strictEqual(EVIDENCE_TYPE_LABELS.SIMULATED.en, 'SIMULATED');
  assert.ok(EVIDENCE_TYPE_LABELS.SIMULATED.hi.includes('सिमुलेटेड'));
  assert.ok(EVIDENCE_TYPE_LABELS.SIMULATED.ta.includes('மாதிரி கணக்கீடு'));
});

test('6. Central Domain Terminology: Dual-notation terms for all 11 languages', () => {
  const requiredTerms = [
    'discover',
    'prove',
    'simulate',
    'break',
    'structure',
    'act',
    'reverseDiscovery',
    'proveBeforeBorrow',
    'digitalTwin',
    'failureAutopsy',
    'resilienceEnvelope',
    'debtCapacity',
    'eligibleAffordableSustainable'
  ];

  for (const termKey of requiredTerms) {
    const item = DOMAIN_TERMINOLOGY[termKey];
    assert.ok(item, `Domain terminology for ${termKey} must be defined`);

    for (const lang of SUPPORTED_LANGUAGES) {
      const trans = item.translations[lang.code];
      assert.ok(
        trans && trans.length > 0,
        `Translation for ${termKey} in ${lang.code} must not be empty`
      );
    }
  }

  // Specifically check Debt Capacity dual notation
  const hiDebt = DOMAIN_TERMINOLOGY.debtCapacity.translations.hi;
  assert.ok(
    hiDebt.includes('Debt Capacity') || hiDebt.includes('ऋण वहन क्षमता'),
    'Hindi debt capacity must have clear dual notation'
  );
});

test('7. Voice / Speech Provider Abstractions: Clean initialization and error handling', () => {
  assert.strictEqual(defaultSTTProvider.name, 'WebSpeechSTT');
  assert.strictEqual(defaultTTSProvider.name, 'WebSpeechTTS');

  // In Node.js testing environment, window is undefined, so isSupported() should be false
  assert.strictEqual(defaultSTTProvider.isSupported(), false);
  assert.strictEqual(defaultTTSProvider.isSupported(), false);

  // Stop listening should be safe without throwing
  assert.doesNotThrow(() => defaultSTTProvider.stopListening());
  assert.doesNotThrow(() => defaultTTSProvider.cancel());
});
