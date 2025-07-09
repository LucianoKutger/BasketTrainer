import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Spacer from '../../components/Spacer';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import { useUser } from '../../hooks/useUser';
import { useObjectModel } from '../../ml/useObjectModel';
import { useYOLOFrameProcessor } from '../../ml/useYOLOFrameProcessor';
import { postStat } from '../../service/supabaseService';
// Rechtecks-Overlap (true, wenn sich zwei Boxen schneiden)
const intersects = (a: any, b: any) =>
  a.x < b.x + b.w &&
  a.x + a.w > b.x &&
  a.y < b.y + b.h &&
  a.y + a.h > b.y;

// Debug-Flag
const DEBUG_TRAINING = false;

export default function Training() {
  const device = useCameraDevice('back');
  const modelHook = useObjectModel();
  const camRef = useRef<Camera>(null);
  const router = useRouter()

  /* UI-States */
  const [score, setScore] = useState(0);   // Treffer
  const [attempts, setAttempts] = useState(0);   // Versuche
  const [training, setTraining] = useState(false);
  const { user } = useUser()

  /* interne FSM-States */
  const [prevOverlap, setPrevOverlap] = useState(false);
  const [scoredThisAttempt, setScoredThisAttempt] = useState(false);

  /* Schwellen */
  const MIN_BALL = 0.98;
  const MIN_NET = 0.98;

  const pickBest = (boxes: any[], label: string, minScore: number) =>
    boxes
      .filter(b => b.label === label && b.score >= minScore)
      .sort((a, b) => b.score - a.score)[0];

  const onBoxes = useCallback(
    (boxes: any[]) => {
      if (!training) return;               // Training pausiert

      const ball = pickBest(boxes, 'Basketball', MIN_BALL);
      const net = pickBest(boxes, 'Net', MIN_NET);
      if (!ball || !net) {
        setPrevOverlap(false);
        setScoredThisAttempt(false);
        return;
      }

      const overlap = intersects(ball, net);

      /* 1️⃣  Neues Overlap ⇒ Shot-Attempt */
      if (overlap && !prevOverlap) {
        setAttempts(a => a + 1);
        setScoredThisAttempt(false);       // Reset fürs evtl. kommende Tor
      }

      /* 2️⃣  Treffer-Heuristik: Ball-Center unter Netz-Box */
      const ballCenterY = ball.y + ball.h / 2;
      const netBottomY = net.y + net.h * 0.3; // 30 % unterhalb des Netzes
      const madeShot = overlap && !scoredThisAttempt && ballCenterY > netBottomY;

      if (madeShot) {
        setScore(s => s + 1);
        setScoredThisAttempt(true);
      }

      /* 3️⃣  FSM-State updaten */
      setPrevOverlap(overlap);

      /* Debug-Log */
      if (DEBUG_TRAINING && (madeShot || overlap)) {
        console.log(
          `🔄 Attempt=${attempts + (overlap && !prevOverlap ? 1 : 0)}, ` +
          `Score=${score + (madeShot ? 1 : 0)}, ` +
          `overlap=${overlap}, ` +
          `ballY=${ballCenterY.toFixed(2)}, netBottom=${netBottomY.toFixed(2)}`
        );
      }
    },
    [training, prevOverlap, scoredThisAttempt, attempts, score]
  );

  /* Frame-Processor (immer registrieren, intern per Flag gestoppt) */
  const fp = useYOLOFrameProcessor(modelHook, onBoxes, training);

  /* UI-Handler */
  const toggleTraining = () => {
    if (!training) {
      // Wir starten gleich erst – also Zähler & FSM-States zurücksetzen
      setScore(0);
      setAttempts(0);
      setPrevOverlap(false);
      setScoredThisAttempt(false);
    }
    setTraining(t => !t);   // danach eigentlichen Toggle ausführen
  };

  const saveStats = async () => {
    await postStat({
      attempts: attempts,
      madeShots: score,
      userId: user.id
    })

    setScore(0);
    setAttempts(0);
    setPrevOverlap(false);
    setScoredThisAttempt(false);

    router.replace('/stats')
  }

  if (!device) return null;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.camWrap}>
        <Camera
          ref={camRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          {...(fp ? { frameProcessor: fp } : {})}
        />
      </ThemedView>

      <ThemedView style={styles.scoreWrap}>
        <ThemedText style={styles.text}>
          Treffer: {score}{"\n"}Versuche: {attempts}
        </ThemedText>
      </ThemedView>
      <Spacer />
      <ThemedView style={styles.buttonContainer}>
        <ThemedButton onPress={toggleTraining}>
          <ThemedText style={{ color: '#f2f2f2' }}>
            {training ? 'Training stoppen' : 'Training starten'}
          </ThemedText>
        </ThemedButton>
        <ThemedButton onPress={saveStats} disabled={attempts === 0 || training === true}>
          <ThemedText style={{ color: '#f2f2f2' }}>
            Training Speichern
          </ThemedText>
        </ThemedButton>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camWrap: { flex: 2 },
  scoreWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  text: { fontSize: 32, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row'
  }
});
