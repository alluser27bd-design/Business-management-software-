import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Barcode,
  Camera,
  X,
  Upload,
  Volume2,
  VolumeX,
  Search,
  Sparkles,
  AlertTriangle,
  PackagePlus,
  Plus,
  Flashlight,
  RefreshCw,
  Play,
  RotateCw,
  CameraIcon,
  CheckCircle2,
  Boxes,
  Tag,
  DollarSign,
} from 'lucide-react';
import { QuickAddProductModal } from './QuickAddProductModal';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductScanned: (product: Product, rawBarcode?: string) => void;
  title?: string;
  subtitle?: string;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onProductScanned,
  title = 'বারকোড স্ক্যানার (Barcode Scanner)',
  subtitle = 'মোবাইল ক্যামেরা বা স্ক্যানার গান দিয়ে পণ্যের বারকোড স্ক্যান করুন',
}) => {
  const { products, getProductStock, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isContinuous, setIsContinuous] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [hasTorchSupport, setHasTorchSupport] = useState<boolean>(false);
  const [lastScannedProduct, setLastScannedProduct] = useState<{
    product: Product;
    time: string;
    count: number;
  } | null>(null);
  const [manualCode, setManualCode] = useState<string>('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false);
  const [unrecognizedBarcode, setUnrecognizedBarcode] = useState<string | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isProcessingSnapshot, setIsProcessingSnapshot] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastScannedCodeRef = useRef<{ code: string; timestamp: number } | null>(null);
  const barcodeDetectorRef = useRef<any>(null);

  // Play Beep sound on scan
  const playBeepSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1050, audioCtx.currentTime); // High pitch crisp beep
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  // Find product by scanned barcode / SKU / ID from Product Master
  const resolveProductFromBarcode = (rawBarcode: string): Product | null => {
    const trimmed = rawBarcode.trim();
    if (!trimmed) return null;

    // 1. Match exact barcode
    const matchBarcode = products.find((p) => !p.deletedAt && p.barcode.trim() === trimmed);
    if (matchBarcode) return matchBarcode;

    // 2. Match SKU (case-insensitive)
    const matchSku = products.find(
      (p) => !p.deletedAt && p.sku.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (matchSku) return matchSku;

    // 3. Match Product ID
    const matchId = products.find((p) => !p.deletedAt && p.id === trimmed);
    if (matchId) return matchId;

    // 4. Match numeric barcode with leading zero variations or partial match
    const matchPartial = products.find(
      (p) =>
        !p.deletedAt &&
        (p.barcode.includes(trimmed) ||
          trimmed.includes(p.barcode) ||
          p.barcode.replace(/^0+/, '') === trimmed.replace(/^0+/, ''))
    );
    if (matchPartial) return matchPartial;

    return null;
  };

  const handleSuccessfulScan = (decodedText: string) => {
    const now = Date.now();
    if (
      lastScannedCodeRef.current &&
      lastScannedCodeRef.current.code === decodedText &&
      now - lastScannedCodeRef.current.timestamp < 1000
    ) {
      return;
    }
    lastScannedCodeRef.current = { code: decodedText, timestamp: now };

    playBeepSound();
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([40, 30, 40]);
      } catch (e) {}
    }

    const matchedProduct = resolveProductFromBarcode(decodedText);

    if (matchedProduct) {
      setScanError(null);
      setUnrecognizedBarcode(null);
      setLastScannedProduct((prev) => ({
        product: matchedProduct,
        time: new Date().toLocaleTimeString(),
        count: prev && prev.product.id === matchedProduct.id ? prev.count + 1 : 1,
      }));

      onProductScanned(matchedProduct, decodedText);
      showToast(`'${matchedProduct.name}' বারকোড স্ক্যান সফল!`);

      if (!isContinuous) {
        stopCamera();
        onClose();
      }
    } else {
      setScanError(null);
      setUnrecognizedBarcode(decodedText);
      showToast(`⚠️ পণ্য পাওয়া যায়নি (বারকোড: ${decodedText})`);
    }
  };

  // Toggle Torch / Flashlight on mobile phones
  const toggleTorch = async () => {
    const stream = streamRef.current;
    if (!stream) return;
    try {
      const track = stream.getVideoTracks()[0];
      if (track) {
        const nextState = !isTorchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setIsTorchOn(nextState);
        showToast(nextState ? 'ফ্ল্যাশলাইট চালু হয়েছে' : 'ফ্ল্যাশলাইট বন্ধ হয়েছে');
      }
    } catch (e) {
      showToast('ফ্ল্যাশলাইট টগল করা যায়নি');
    }
  };

  // Flip Camera between back and front
  const toggleCameraFlip = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Start Real Mobile Camera Stream
  const startCamera = async (currentFacingMode = facingMode) => {
    try {
      setScanError(null);
      setIsPermissionDenied(false);
      stopCamera();

      // Check for native BarcodeDetector API (Android Chrome & modern browsers)
      if ('BarcodeDetector' in window) {
        try {
          barcodeDetectorRef.current = new (window as any).BarcodeDetector({
            formats: [
              'ean_13',
              'ean_8',
              'code_128',
              'code_39',
              'code_93',
              'upc_a',
              'upc_e',
              'itf',
              'codabar',
              'qr_code',
              'data_matrix',
            ],
          });
        } catch (e) {
          barcodeDetectorRef.current = null;
        }
      }

      let stream: MediaStream | null = null;

      // Strategy 1: Ideal environment facing mode with high resolution
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: currentFacingMode === 'environment' ? { ideal: 'environment' } : 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (err1: any) {
        if (err1?.name === 'NotAllowedError' || err1?.name === 'PermissionDeniedError') {
          throw err1;
        }
        // Strategy 2: Fallback with exact or simple video constraints
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacingMode },
            audio: false,
          });
        } catch (err2: any) {
          if (err2?.name === 'NotAllowedError' || err2?.name === 'PermissionDeniedError') {
            throw err2;
          }
          // Strategy 3: Universal fallback (any available camera)
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      if (!stream) {
        throw new Error('No camera stream received');
      }

      streamRef.current = stream;

      // Check flashlight capabilities
      try {
        const track = stream.getVideoTracks()[0];
        const capabilities = (track.getCapabilities?.() as any) || {};
        setHasTorchSupport(Boolean(capabilities.torch));
      } catch (e) {
        setHasTorchSupport(false);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      setIsScanning(true);
      setIsTorchOn(false);

      // Start Detection Loop
      startDetectionLoop();
    } catch (err: any) {
      setIsScanning(false);
      const isDenied =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        err?.message?.toLowerCase().includes('permission') ||
        err?.message?.toLowerCase().includes('denied');

      if (isDenied) {
        setIsPermissionDenied(true);
        setScanError('আইফ্রেম/ব্রাউজারে লাইভ ক্যামেরা বন্ধ। নিচের "ছবি তুলে স্ক্যান" চাপুন।');
      } else {
        setScanError('ক্যামেরা চালু করা যায়নি। নিচের "ছবি তুলে স্ক্যান" বোতামটি ব্যবহার করুন।');
      }
    }
  };

  // Continuous Barcode Scanning Detection Loop
  const startDetectionLoop = () => {
    let isProcessing = false;

    const scanFrame = async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || video.paused || video.ended) {
        animationFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      if (isProcessing) {
        animationFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      isProcessing = true;

      try {
        // Method 1: Ultra-fast native Android Chrome BarcodeDetector
        if (barcodeDetectorRef.current) {
          const barcodes = await barcodeDetectorRef.current.detect(video);
          if (barcodes && barcodes.length > 0) {
            const code = barcodes[0].rawValue;
            if (code) {
              handleSuccessfulScan(code);
            }
          }
        }
      } catch (e) {
        // frame skip
      } finally {
        isProcessing = false;
      }

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  // Stop Camera and all MediaTracks
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setIsTorchOn(false);
  };

  // Lifecycle on modal open/close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    if (activeTab === 'camera') {
      const timer = setTimeout(() => {
        startCamera();
      }, 150);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen, activeTab]);

  // Handle Tab Switch
  const handleTabChange = (tab: 'camera' | 'upload' | 'manual') => {
    setActiveTab(tab);
    setScanError(null);
    setUnrecognizedBarcode(null);
    if (tab === 'camera') {
      setTimeout(() => {
        startCamera();
      }, 150);
    } else {
      stopCamera();
    }
  };

  // Handle File Upload Scanner or Native Camera Snapshot
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingSnapshot(true);
    setScanError(null);

    try {
      // Try BarcodeDetector with ImageBitmap
      if ('BarcodeDetector' in window) {
        try {
          const detector =
            barcodeDetectorRef.current ||
            new (window as any).BarcodeDetector({
              formats: [
                'ean_13',
                'ean_8',
                'code_128',
                'code_39',
                'code_93',
                'upc_a',
                'upc_e',
                'itf',
                'codabar',
                'qr_code',
                'data_matrix',
              ],
            });
          const imageBitmap = await createImageBitmap(file);
          const barcodes = await detector.detect(imageBitmap);
          if (barcodes && barcodes.length > 0) {
            handleSuccessfulScan(barcodes[0].rawValue);
            setIsProcessingSnapshot(false);
            return;
          }
        } catch (e) {}
      }

      // Fallback with Html5Qrcode file scan
      const html5QrCode = new Html5Qrcode('barcode-file-decoder-temp', { verbose: false });
      const decoded = await html5QrCode.scanFile(file, true);
      html5QrCode.clear();
      handleSuccessfulScan(decoded);
    } catch (err) {
      setScanError('ছবিতে কোনো স্পষ্ট ১ডি বারকোড শনাক্ত করা যায়নি। অনুগ্রহ করে পরিষ্কার ছবি দিন।');
    } finally {
      setIsProcessingSnapshot(false);
      e.target.value = '';
    }
  };

  // Handle Manual Input Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleSuccessfulScan(manualCode.trim());
    setManualCode('');
  };

  if (!isOpen) return null;

  // Real-time stock for last scanned product
  const lastScannedStockInfo = lastScannedProduct
    ? getProductStock(lastScannedProduct.product.id)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      {/* Hidden container for temp file decoding */}
      <div id="barcode-file-decoder-temp" className="hidden"></div>

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <Barcode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-emerald-500/30 text-emerald-300 text-[10px] font-bold rounded uppercase tracking-wider font-mono">
                  BARCODE SCANNER
                </span>
                <h3 className="text-xs font-bold text-slate-100">{title}</h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab & Controls Bar */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => handleTabChange('camera')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>ক্যামেরা স্ক্যান</span>
            </button>
            <button
              onClick={() => handleTabChange('upload')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>ছবি আপলোড</span>
            </button>
            <button
              onClick={() => handleTabChange('manual')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>কোড লিখুন</span>
            </button>
          </div>

          {/* Camera Settings / Helpers */}
          <div className="flex items-center gap-2">
            {activeTab === 'camera' && isScanning && (
              <>
                {hasTorchSupport && (
                  <button
                    onClick={toggleTorch}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                      isTorchOn
                        ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="মোবাইল ফ্ল্যাশলাইট (Torch)"
                  >
                    <Flashlight className="w-4 h-4" />
                    <span className="hidden sm:inline text-[11px]">{isTorchOn ? 'ফ্ল্যাশ চালু' : 'ফ্ল্যাশ'}</span>
                  </button>
                )}

                <button
                  onClick={toggleCameraFlip}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="ক্যামেরা ফ্লিপ (পেছন / সামনে)"
                >
                  <RefreshCw className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline text-[11px]">ক্যামেরা ফ্লিপ</span>
                </button>
              </>
            )}

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-200 text-slate-500 border-slate-300'
              }`}
              title={soundEnabled ? 'সাউন্ড বিপ চালু' : 'সাউন্ড বন্ধ'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer bg-white px-2 py-1.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={isContinuous}
                onChange={(e) => setIsContinuous(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-600 rounded"
              />
              <span className="text-[11px]">একটানা স্ক্যান</span>
            </label>
          </div>
        </div>

        {/* Viewport Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center min-h-[320px] bg-slate-950 text-white relative">
          {activeTab === 'camera' && (
            <div className="w-full flex flex-col items-center">
              {/* Horizontal Barcode Viewport Box */}
              <div className="relative w-full max-w-sm aspect-4/3 rounded-3xl overflow-hidden border-2 border-emerald-500/60 shadow-2xl bg-black flex items-center justify-center">
                {/* Real Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isScanning ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Laser Barcode Scan Guide Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-72 h-36 border-2 border-dashed border-emerald-400/90 rounded-xl relative flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                      {/* Horizontal Animated Red Laser */}
                      <div className="w-full h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse"></div>
                    </div>
                  </div>
                )}

                {/* If Camera is stopped or Permission is restricted in Preview Iframe */}
                {!isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-950/95 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <Camera className="w-6 h-6 animate-pulse" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">মোবাইল ক্যামেরা স্ক্যান</h4>
                      <p className="text-[11px] text-slate-300 max-w-xs">
                        নিচের <span className="text-emerald-400 font-bold">"ছবি তুলে স্ক্যান"</span> চাপলে সরাসরি আপনার মোবাইলের ক্যামেরা খুলবে
                      </p>
                    </div>

                    {/* Direct Native Touch Label - 100% Guaranteed to open Mobile Camera Shutter */}
                    <div className="w-full max-w-xs space-y-2 pt-1">
                      <label
                        htmlFor="direct-camera-scan-input"
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/50 cursor-pointer active:scale-95 transition-all border border-emerald-400/40"
                      >
                        <CameraIcon className="w-4 h-4" />
                        <span>📸 ক্যামেরা দিয়ে ছবি তুলে স্ক্যান করুন</span>
                        <input
                          id="direct-camera-scan-input"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>

                      <button
                        onClick={() => startCamera()}
                        className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer active:scale-95 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-300" />
                        <span>লাইভ ভিডিও স্ক্যান চালু করুন</span>
                      </button>
                    </div>

                    {isProcessingSnapshot && (
                      <div className="text-[11px] font-bold text-emerald-400 animate-pulse flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ছবি থেকে বারকোড প্রসেস হচ্ছে...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>বারকোডটি ক্যামেরার সামনে সোজা করে ধরুন</span>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="w-full max-w-sm flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-900 text-center">
              <Upload className="w-10 h-10 text-emerald-400 mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">বারকোড ছবি আপলোড করুন</h4>
              <p className="text-xs text-slate-400 mb-4">গ্যালারি বা ফাইল থেকে ছবি সিলেক্ট করুন</p>
              <label className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs">
                ছবি নির্বাচন করুন
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="w-full max-w-sm p-4 bg-slate-900 rounded-3xl border border-slate-800">
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                <span>বারকোড বা SKU কোড লিখে এন্টার দিন</span>
              </h4>
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <input
                  type="text"
                  autoFocus
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="যেমন: 8941100523456"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono outline-hidden focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  কোড দিয়ে শনাক্ত করুন
                </button>
              </form>
            </div>
          )}

          {/* Product Not Found Banner & Quick Add Trigger */}
          {unrecognizedBarcode && (
            <div className="absolute bottom-3 left-4 right-4 bg-slate-900/98 border-2 border-amber-500/80 text-white px-4 py-3.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 z-20">
              <div className="min-w-0">
                <div className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>পণ্য পাওয়া যায়নি (Product Not Found)</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  বারকোড: <span className="font-mono font-black text-amber-300">{unrecognizedBarcode}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickAddOpen(true)}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer shrink-0 transition-all active:scale-95"
              >
                <PackagePlus className="w-4 h-4" />
                <span>নতুন পণ্য যোগ করুন (Add Product)</span>
              </button>
            </div>
          )}

          {scanError && !unrecognizedBarcode && (
            <div className="absolute bottom-3 left-4 right-4 bg-rose-950/90 border border-rose-800 text-rose-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in z-20">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="truncate flex-1">{scanError}</span>
              <label
                htmlFor="direct-camera-scan-input-err"
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shrink-0 cursor-pointer flex items-center gap-1"
              >
                <CameraIcon className="w-3 h-3" />
                <span>ছবি তুলুন</span>
                <input
                  id="direct-camera-scan-input-err"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>
            </div>
          )}
        </div>

        {/* Live Scanned Product Feedback Strip (Full Product Details) */}
        {lastScannedProduct && (
          <div className="bg-emerald-50 border-t border-emerald-200 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                ✓
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-emerald-950 truncate">
                    {lastScannedProduct.product.name}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-mono font-bold shadow-xs">
                    পরিমাণ: +{lastScannedProduct.count} {lastScannedProduct.product.unit}
                  </span>
                </div>

                {/* Product Metadata Details Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-emerald-200/70 text-[11px] font-semibold text-emerald-900">
                  <div className="flex items-center gap-1 bg-white/70 px-2 py-1 rounded-lg border border-emerald-200">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>বিক্রয়: ৳{lastScannedProduct.product.salePrice}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-white/70 px-2 py-1 rounded-lg border border-emerald-200">
                    <Tag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">SKU: {lastScannedProduct.product.sku}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-white/70 px-2 py-1 rounded-lg border border-emerald-200">
                    <Boxes className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>
                      মজুদ: {lastScannedStockInfo ? lastScannedStockInfo.currentStock : '—'}{' '}
                      {lastScannedProduct.product.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-white/70 px-2 py-1 rounded-lg border border-emerald-200">
                    <Barcode className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-mono truncate">{lastScannedProduct.product.barcode}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="self-end sm:self-center shrink-0">
              <span className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>যুক্ত হয়েছে</span>
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            USB / Bluetooth বারকোড স্ক্যানার গান সরাসরি সাপোর্টেড।
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            সম্পন্ন (Done)
          </button>
        </div>
      </div>

      {/* Quick Add Product Modal */}
      <QuickAddProductModal
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          setUnrecognizedBarcode(null);
        }}
        scannedBarcode={unrecognizedBarcode || ''}
        onProductCreatedAndAdded={(newProd) => {
          onProductScanned(newProd, newProd.barcode);
          setLastScannedProduct({
            product: newProd,
            time: new Date().toLocaleTimeString(),
            count: 1,
          });
          setUnrecognizedBarcode(null);
          setIsQuickAddOpen(false);
          if (!isContinuous) {
            stopCamera();
            onClose();
          }
        }}
      />
    </div>
  );
};
