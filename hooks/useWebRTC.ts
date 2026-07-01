"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, onSnapshot, deleteDoc, getDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";

interface CallState {
  isCalling: boolean;
  isReceiving: boolean;
  isInCall: boolean;
  remoteUserId: string | null;
  remoteStream: MediaStream | null;
  localStream: MediaStream | null;
  callId: string | null;
}

export function useWebRTC(userId?: string) {
  const [callState, setCallState] = useState<CallState>({
    isCalling: false,
    isReceiving: false,
    isInCall: false,
    remoteUserId: null,
    remoteStream: null,
    localStream: null,
    callId: null,
  });

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Configuration ICE (serveurs STUN/TURN gratuits)
  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // ⭐ Initialiser la connexion peer
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(iceServers);
    
    pc.onicecandidate = async (event) => {
      if (event.candidate && callState.callId) {
        await addDoc(collection(db, "calls", callState.callId, "candidates"), {
          candidate: event.candidate.toJSON(),
          senderId: userId,
          createdAt: serverTimestamp(),
        });
      }
    };

    pc.ontrack = (event) => {
      setCallState((prev) => ({
        ...prev,
        remoteStream: event.streams[0],
      }));
    };

    return pc;
  }, [userId, callState.callId]);

  // ⭐ Démarrer un appel
  const startCall = useCallback(async (targetUserId: string) => {
    if (!userId) return;

    try {
      // Obtenir le stream local (caméra + micro)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;

      // Créer l'offre
      const pc = createPeerConnection();
      peerConnection.current = pc;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Créer le document d'appel
      const callDoc = await addDoc(collection(db, "calls"), {
        callerId: userId,
        receiverId: targetUserId,
        offer: { type: offer.type, sdp: offer.sdp },
        status: "calling",
        createdAt: serverTimestamp(),
      });

      setCallState({
        isCalling: true,
        isReceiving: false,
        isInCall: false,
        remoteUserId: targetUserId,
        remoteStream: null,
        localStream: stream,
        callId: callDoc.id,
      });

      // Écouter la réponse
      const unsubscribe = onSnapshot(doc(db, "calls", callDoc.id), async (snapshot) => {
        const data = snapshot.data();
        if (!data) return;

        if (data.status === "accepted" && data.answer) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          setCallState((prev) => ({ ...prev, isInCall: true, isCalling: false }));
        }

        if (data.status === "rejected") {
          endCall();
        }
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Start call error:", e);
      alert("Impossible d'accéder à la caméra. Vérifiez les permissions.");
    }
  }, [userId, createPeerConnection]);

  // ⭐ Répondre à un appel
  const answerCall = useCallback(async (callId: string) => {
    if (!userId) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;

      const callDoc = await getDoc(doc(db, "calls", callId));
      const callData = callDoc.data();
      if (!callData) return;

      const pc = createPeerConnection();
      peerConnection.current = pc;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await updateDoc(doc(db, "calls", callId), {
        answer: { type: answer.type, sdp: answer.sdp },
        status: "accepted",
        acceptedAt: serverTimestamp(),
      });

      setCallState({
        isCalling: false,
        isReceiving: false,
        isInCall: true,
        remoteUserId: callData.callerId,
        remoteStream: null,
        localStream: stream,
        callId,
      });

      // Écouter les candidats ICE
      const q = collection(db, "calls", callId, "candidates");
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            if (data.senderId !== userId) {
              pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
          }
        });
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Answer call error:", e);
    }
  }, [userId, createPeerConnection]);

  // ⭐ Rejeter un appel
  const rejectCall = useCallback(async (callId: string) => {
    await updateDoc(doc(db, "calls", callId), {
      status: "rejected",
      rejectedAt: serverTimestamp(),
    });
    endCall();
  }, []);

  // ⭐ Terminer l'appel
  const endCall = useCallback(async () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerConnection.current?.close();
    
    if (callState.callId) {
      await deleteDoc(doc(db, "calls", callState.callId));
    }

    setCallState({
      isCalling: false,
      isReceiving: false,
      isInCall: false,
      remoteUserId: null,
      remoteStream: null,
      localStream: null,
      callId: null,
    });
  }, [callState.callId]);

  // ⭐ Écouter les appels entrants
  useEffect(() => {
    if (!userId) return;

    const q = collection(db, "calls");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          if (data.receiverId === userId && data.status === "calling") {
            setCallState((prev) => ({
              ...prev,
              isReceiving: true,
              remoteUserId: data.callerId,
              callId: change.doc.id,
            }));
          }
        }
      });
    });

    return () => unsubscribe();
  }, [userId]);

  return {
    ...callState,
    startCall,
    answerCall,
    rejectCall,
    endCall,
  };
}