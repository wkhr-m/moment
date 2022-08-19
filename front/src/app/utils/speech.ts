export const speechWord = (
  word: string,
  rate: number = 1,
  lang: string = 'en-US'
): void => {
  window.speechSynthesis.cancel();
  const uttr = new SpeechSynthesisUtterance();
  uttr.text = word;
  uttr.lang = lang;
  uttr.voice = window.speechSynthesis
    .getVoices()
    .filter((item) => item.lang === lang)[0];
  uttr.rate = rate;
  window.speechSynthesis.speak(uttr);
};
