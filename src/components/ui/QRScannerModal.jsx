import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  QrCode,
  StopCircle,
} from "lucide-react";
import { useQRAttendance } from "../../hooks/qr";
import jsQR from "jsqr";

const QRScannerModal = ({ onClose, onSuccess }) => {
  const { validateQR, scanQR, loading } = useQRAttendance();

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [manualToken, setManualToken] = useState("");
  const [scanMethod, setScanMethod] = useState("manual");
  const [cameraActive, setCameraActive] = useState(false);
  const [scanningStatus, setScanningStatus] = useState("idle"); // 'idle', 'scanning', 'processing'

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setScanningStatus("scanning");
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);

        // Start scanning for QR codes
        scanIntervalRef.current = setInterval(scanForQRCode, 300);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError(
        "Unable to access camera. Please check permissions or use manual entry."
      );
      setScanningStatus("idle");
    }
  };

  const stopCamera = () => {
    // Stop the video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Stop video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Clear scan interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    setCameraActive(false);
    setScanningStatus("idle");
  };

  const scanForQRCode = () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      scanningStatus === "processing"
    ) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Check if video is ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data from canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Scan for QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      console.log("QR Code detected:", code.data);
      handleQRCodeDetected(code.data);
    }
  };

  const handleQRCodeDetected = async (qrData) => {
    // Stop scanning while processing
    setScanningStatus("processing");
    stopCamera();

    try {
      // Parse QR code data
      const parsedData = JSON.parse(qrData);

      if (parsedData.type !== "attendance") {
        setError("Invalid QR code. This is not an attendance QR code.");
        setScanningStatus("idle");
        return;
      }

      // Mark attendance using the session token
      await markAttendanceWithToken(parsedData.sessionToken);
    } catch (err) {
      console.error("QR parse error:", err);
      setError("Invalid QR code format. Please try again or use manual entry.");
      setScanningStatus("idle");
    }
  };

  const markAttendanceWithToken = async (sessionToken) => {
    setError(null);

    try {
      // First validate
      const validateResult = await validateQR(sessionToken);

      if (!validateResult.success) {
        setError(validateResult.error);
        setScanningStatus("idle");
        return;
      }

      // Then scan
      const scanResult = await scanQR(sessionToken);

      if (scanResult.success) {
        setResult({
          success: true,
          data: scanResult.data,
          courseInfo: validateResult.data,
        });

        if (onSuccess) {
          setTimeout(() => onSuccess(scanResult.data), 2000);
        }
      } else {
        setError(scanResult.error);
        setScanningStatus("idle");
      }
    } catch (err) {
      setError("An error occurred while marking attendance", err);
      setScanningStatus("idle");
    }
  };

  const handleManualScan = async () => {
    if (!manualToken.trim()) {
      setError("Please enter a session token");
      return;
    }

    await markAttendanceWithToken(manualToken.trim());
  };

  const toggleScanMethod = (method) => {
    if (method === scanMethod) return;

    // Stop camera if switching away from camera mode
    if (scanMethod === "camera" && cameraActive) {
      stopCamera();
    }

    setScanMethod(method);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background-grey rounded-lg max-w-2xl w-full border border-text-grey">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-text-grey">
          <h2 className="text-2xl font-bold text-white">Scan QR Code</h2>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-grey" />
          </button>
        </div>

        <div className="p-6">
          {!result ? (
            <>
              {/* Method Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => toggleScanMethod("manual")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm transition ${
                    scanMethod === "manual"
                      ? "bg-blue text-white"
                      : "bg-bg-secondary text-text-grey border border-text-grey"
                  }`}
                >
                  Enter Code
                </button>
                <button
                  onClick={() => toggleScanMethod("camera")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm transition ${
                    scanMethod === "camera"
                      ? "bg-blue text-white"
                      : "bg-bg-secondary text-text-grey border border-text-grey"
                  }`}
                >
                  Use Camera
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {scanMethod === "manual" ? (
                // Manual Entry
                <div className="space-y-4">
                  <div>
                    <label className="block text-text-grey text-sm font-semibold mb-2">
                      Session Token
                    </label>
                    <input
                      type="text"
                      value={manualToken}
                      onChange={(e) => {
                        setManualToken(e.target.value);
                        setError(null);
                      }}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleManualScan()
                      }
                      placeholder="Enter the token from QR code"
                      disabled={loading}
                      className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50"
                    />
                    <p className="text-xs text-text-grey mt-2">
                      Ask your lecturer for the session token if QR scanner
                      isn't working
                    </p>
                  </div>

                  <button
                    onClick={handleManualScan}
                    disabled={loading || !manualToken.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Marking Attendance...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              ) : (
                // Camera Scanning
                <div className="space-y-4">
                  {/* Camera Preview */}
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    {cameraActive ? (
                      <>
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          playsInline
                          muted
                        />
                        {/* Scanning Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="relative w-64 h-64">
                            {/* Corner Brackets */}
                            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue"></div>
                            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue"></div>
                            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue"></div>
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue"></div>

                            {/* Scanning Line */}
                            {scanningStatus === "scanning" && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-1 bg-blue animate-pulse"></div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full">
                          <p className="text-white text-sm flex items-center gap-2">
                            {scanningStatus === "scanning" && (
                              <>
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Scanning for QR code...
                              </>
                            )}
                            {scanningStatus === "processing" && (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Processing...
                              </>
                            )}
                          </p>
                        </div>

                        {/* Processing Overlay */}
                        {(loading || scanningStatus === "processing") && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera className="w-16 h-16 text-text-grey" />
                      </div>
                    )}

                    {/* Hidden canvas for QR processing */}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {/* Camera Controls */}
                  {!cameraActive ? (
                    <button
                      onClick={startCamera}
                      disabled={loading}
                      className="w-full bg-blue hover:bg-blue/80 disabled:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Start Camera
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <StopCircle className="w-5 h-5" />
                      Stop Camera
                    </button>
                  )}

                  {/* Help Text */}
                  <div className="bg-blue/10 border border-blue/30 rounded-lg p-3">
                    <p className="text-blue text-xs">
                      💡 <strong>Tips:</strong>
                      <br />• Hold your device steady and point at the QR code
                      <br />• Make sure the QR code is well-lit and in focus
                      <br />• The camera will automatically detect and scan the
                      code
                      <br />• If scanning fails, try manual entry or ask your
                      lecturer for help
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Success Display
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Attendance Marked!
              </h3>
              <p className="text-text-grey mb-6">
                Your attendance has been recorded successfully
              </p>

              <div className="bg-bg-secondary border border-text-grey rounded-lg p-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-grey">Course:</span>
                  <span className="text-white font-medium">
                    {result.courseInfo.courseCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-grey">Class:</span>
                  <span className="text-white font-medium">
                    {result.courseInfo.classCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-grey">Date:</span>
                  <span className="text-white font-medium">
                    {new Date(result.data.attendance_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-grey">Status:</span>
                  <span className="text-green-500 font-medium">
                    {result.data.status}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-6 bg-blue hover:bg-blue/80 text-white font-medium py-2 px-8 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;
