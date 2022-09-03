const sdk = require('microsoft-cognitiveservices-speech-sdk');
const fs = require('fs');

const SUBSCRIPTION_KEY = '4a32b850b0be46909c878eaf766199c0';
const LOCATION = 'japaneast';

const audioFilePath = './api/pronunciation/aaa.wav';
const script = 'should be burning in hell.';

function main() {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    SUBSCRIPTION_KEY,
    LOCATION
  );

  const audioFile = fs.readFileSync(audioFilePath);
  const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);
  const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
    script,
    sdk.PronunciationAssessmentGradingSystem.HundredMark,
    sdk.PronunciationAssessmentGranularity.Phoneme
  );
  pronunciationConfig.phonemeAlphabet = 'IPA';
  pronunciationConfig.nbestPhonemeCount = 3;
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  pronunciationConfig.applyTo(recognizer);

  recognizer.recognizeOnceAsync(
    (speechRecognitionResult) => {
      const result = speechRecognitionResult.properties.getProperty(
        sdk.PropertyId.SpeechServiceResponse_JsonResult
      );
      console.log(result);
    },
    (err) => console.log(err)
  );
}
main();
