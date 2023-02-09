let voices: SpeechSynthesisVoice[] = [];

// SpeechSynthesisVoiceの読み込みは非同期なので最初に読み込む必要がある。
const allVoicesObtained = new Promise<SpeechSynthesisVoice[]>(function (
  resolve,
  reject
) {
  let voices = window.speechSynthesis.getVoices().filter(
    // eloqunceはsafariにある合成音声の種類。これを使うと余計な文章まで読まれるので除外する
    (item) => item.lang.includes('en') && !item.lang.includes('eloquence')
  );
  if (voices.length !== 0) {
    resolve(voices);
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', function () {
      voices = window.speechSynthesis
        .getVoices()
        .filter(
          (item) => item.lang.includes('en') && !item.lang.includes('eloquence')
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
  if (!voiceURI) {
    uttr.voice = voices[0];
    uttr.lang = voices[0].lang;
  } else {
    const voice = voices.find((item) => item.voiceURI === voiceURI);
    if (!!voice) {
      uttr.voice = voice;
      uttr.lang = voice.lang;
    } else {
      uttr.voice = voices[0];
      uttr.lang = voices[0].lang;
    }
  }
  uttr.rate = rate;
  window.speechSynthesis.speak(uttr);
};
