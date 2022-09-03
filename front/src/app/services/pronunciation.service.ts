import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class PronunciationService {
  constructor() {}
  private socket?: Socket;

  connect() {
    this.socket = io('http://localhost:8081');
  }

  emit(name: string, data?: any) {
    this.socket?.emit(name, data);
  }

  on(name: string) {
    const observable = new Observable<PronunciationResult>((observer) => {
      this.socket?.on(name, (data) => {
        observer.next(data);
      });
      return () => {
        this.socket?.disconnect();
      };
    });
    return observable;
  }
}

export type PronunciationResult = {
  Id: string;
  RecognitionStatus: string;
  Offset: number;
  Duration: number;
  DisplayText: string;
  SNR: number;
  NBest?: NBestEntity[] | null;
};
export interface NBestEntity {
  Confidence: number;
  Lexical: string;
  ITN: string;
  MaskedITN: string;
  Display: string;
  PronunciationAssessment: PronunciationAssessment;
  Words?: WordsEntity[] | null;
}
export interface PronunciationAssessment {
  AccuracyScore: number;
  FluencyScore: number;
  CompletenessScore: number;
  PronScore: number;
}
export interface WordsEntity {
  Word: string;
  Offset: number;
  Duration: number;
  PronunciationAssessment: PronunciationAssessment1;
  Syllables?: SyllablesEntity[] | null;
  Phonemes?: PhonemesEntity[] | null;
}
export interface PronunciationAssessment1 {
  AccuracyScore: number;
  ErrorType: string;
}
export interface SyllablesEntity {
  Syllable: string;
  PronunciationAssessment: PronunciationAssessment2;
  Offset: number;
  Duration: number;
}
export interface PronunciationAssessment2 {
  AccuracyScore: number;
}
export interface PhonemesEntity {
  Phoneme: string;
  PronunciationAssessment: PronunciationAssessment3;
  Offset: number;
  Duration: number;
}
export interface PronunciationAssessment3 {
  AccuracyScore: number;
  NBestPhonemes?: NBestPhonemesEntity[] | null;
}
export interface NBestPhonemesEntity {
  Phoneme: string;
  Score: number;
}
