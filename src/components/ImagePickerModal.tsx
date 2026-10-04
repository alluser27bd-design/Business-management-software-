import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, Trash2, X, RefreshCw, Check } from 'lucide-react';
import { compressImage } from '../utils/imageUtils';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  onImageSelected: (base64: string | undefined) => void;
  title?: string;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  currentImage,
  onImageSelected,
  title = 'ছবি নির্বাচন ও ক্যামেরা',
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(currentImage);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPreviewImage(currentImage);
      setIsCameraActive(false);
      setCameraError(null);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, currentImage]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('আপনার ব্রাউজারে সরাসরি ক্যামেরা সাপোর্ট নেই');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setFacingMode(mode);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      // Fallback: trigger native camera input
      setCameraError('সরাসরি ক্যামেরা ওপেন করা যায়নি। অনুগ্রহ করে নিচের ডিভাইস ক্যামেরা বাটন চাপুন।');
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    }
  };

  const handleCaptureSnapshot = async () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPreviewImage(dataUrl);
        stopCamera();
      }
    } catch (e) {
      console.error('Error capturing snapshot:', e);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 480, 480, 0.82);
      setPreviewImage(compressed);
      stopCamera();
    } catch (err) {
      console.error('Error reading image file:', err);
    }
    e.target.value = '';
  };

  const handleConfirm = () => {
    onImageSelected(previewImage);
    stopCamera();
    onClose();
  };

  const handleRemove = () => {
    setPreviewImage(undefined);
    onImageSelected(undefined);
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Main Visual Display Area */}
          <div className="w-full h-56 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative">
            {isCameraActive ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Switch facing camera button */}
                <button
                  type="button"
                  onClick={() => startCamera(facingMode === 'user' ? 'environment' : 'user')}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors"
                  title="ক্যামেরা পরিবর্তন"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            ) : previewImage ? (
              <div className="w-full h-full relative group flex items-center justify-center bg-slate-900/5">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-contain p-2"
                />
              </div>
            ) : (
              <div className="text-center p-4 text-slate-400 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-200/80 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold">কোনো ছবি নির্বাচিত নেই</p>
                <p className="text-[11px] text-slate-400">
                  গ্যালারি থেকে সিলেক্ট করুন অথবা সরাসরি ক্যামেরা দিয়ে ছবি তুলুন
                </p>
              </div>
            )}
          </div>

          {/* Camera Error Alert if any */}
          {cameraError && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              {cameraError}
            </div>
          )}

          {/* Action Options Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Gallery Button */}
            <button
              type="button"
              onClick={() => {
                stopCamera();
                galleryInputRef.current?.click();
              }}
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>গ্যালারি / ফাইল</span>
            </button>

            {/* Camera Button */}
            {isCameraActive ? (
              <button
                type="button"
                onClick={handleCaptureSnapshot}
                className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs animate-pulse"
              >
                <Camera className="w-4 h-4" />
                <span>ছবি তুলুন (Capture)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => startCamera('user')}
                className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4 text-blue-600" />
                <span>ক্যামেরা দিয়ে ছবি</span>
              </button>
            )}
          </div>

          {/* Native File Inputs */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {previewImage && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ছবি মুছুন</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>নিশ্চিত করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
