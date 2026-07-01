"use client";
import { useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useWebRTC } from "@/hooks/useWebRTC";

interface VideoCallProps {
  userId: string;
  otherUserId: string;
  otherUserName: string;
  onClose: () => void;
}

export function VideoCall({ userId, otherUserId, otherUserName, onClose }: VideoCallProps) {
  const {
    isCalling,
    isReceiving,
    isInCall,
    localStream,
    remoteStream,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    callId,
  } = useWebRTC(userId);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Démarrer l'appel automatiquement si on est l'appelant
  useEffect(() => {
    if (!isCalling && !isReceiving && !isInCall) {
      startCall(otherUserId);
    }
  }, []);

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  // Écran d'appel en cours (sonnerie)
  if (isCalling) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-primary-600/20 flex items-center justify-center mb-6 animate-pulse">
          <Video className="w-12 h-12 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Appel en cours...</h2>
        <p className="text-gray-400 mb-8">{otherUserName}</p>
        <button
          onClick={handleEndCall}
          className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition"
        >
          <PhoneOff className="w-8 h-8 text-white" />
        </button>
      </div>
    );
  }

  // Écran d'appel entrant
  if (isReceiving && callId) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-primary-600/20 flex items-center justify-center mb-6 animate-pulse">
          <Video className="w-12 h-12 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Appel vidéo entrant</h2>
        <p className="text-gray-400 mb-8">{otherUserName}</p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              rejectCall(callId);
              onClose();
            }}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={() => answerCall(callId)}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition"
          >
            <Phone className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    );
  }

  // Écran d'appel en cours
  if (isInCall) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
        {/* Vidéo distante (plein écran) */}
        <div className="flex-1 relative">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">En attente de connexion...</p>
            </div>
          )}
          
          {/* Vidéo locale (picture-in-picture) */}
          <div className="absolute bottom-4 right-4 w-32 h-24 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Contrôles */}
        <div className="bg-gray-900/90 backdrop-blur p-4 flex items-center justify-center gap-6">
          <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition">
            <Mic className="w-6 h-6 text-white" />
          </button>
          <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition">
            <Video className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleEndCall}
            className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}