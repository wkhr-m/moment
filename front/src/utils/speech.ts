const LANG_EN = 'en-US';
const LANG_EN_FOR_ANDROID = 'en_US';

let voices: SpeechSynthesisVoice[] = [];

// SpeechSynthesisVoiceの読み込みは非同期なので最初に読み込む必要がある。
const allVoicesObtained = new Promise<SpeechSynthesisVoice[]>(function (
  resolve,
  reject
) {
  let voices = window.speechSynthesis
    .getVoices()
    .filter(
      (item) => item.lang === LANG_EN || item.lang === LANG_EN_FOR_ANDROID
    );
  if (voices.length !== 0) {
    resolve(voices);
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', function () {
      voices = window.speechSynthesis
        .getVoices()
        .filter(
          (item) => item.lang === LANG_EN || item.lang === LANG_EN_FOR_ANDROID
        );
      resolve(voices);
    });
  }
});

export const initVoices = () => {
  allVoicesObtained.then((voice) => {
    voices = voice;
  });
};

export const getVoices = () => {
  return voices;
};

export const speechWord = (
  word: string,
  rate: number,
  voiceURI?: string
): void => {
  window.speechSynthesis.cancel();
  const uttr = new SpeechSynthesisUtterance();
  uttr.text = word;
  uttr.lang = LANG_EN;
  if (!voiceURI) {
    uttr.voice = voices[0];
  } else {
    const voice = voices.find((item) => item.voiceURI === voiceURI);
    if (!!voice) {
      uttr.voice = voice;
    } else {
      uttr.voice = voices[0];
    }
  }
  uttr.rate = rate;
  window.speechSynthesis.speak(uttr);
};
