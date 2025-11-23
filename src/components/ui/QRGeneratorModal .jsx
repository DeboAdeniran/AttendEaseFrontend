import React, { useState, useEffect } from "react";
import { QrCode, Clock, Users, X, CheckCircle, Loader } from "lucide-react";
import { useQRAttendance } from "../../hooks/qr";

const QRGeneratorModal = ({ classData, onClose }) => {
  const { generateQR, getScanLogs, deactivateSession, loading } =
    useQRAttendance();

  const [qrData, setQrData] = useState(null);
  const [validityMinutes, setValidityMinutes] = useState(15);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [scanLogs, setScanLogs] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [error, setError] = useState(null);

  // Fetch scan logs periodically
  useEffect(() => {
    if (qrData?.sessionId) {
      fetchScanLogs();
      const interval = setInterval(fetchScanLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [qrData]);

  // Update countdown timer
  useEffect(() => {
    if (qrData?.expiresAt) {
      const updateTimer = () => {
        const now = new Date();
        const expires = new Date(qrData.expiresAt);
        const diff = expires - now;

        if (diff <= 0) {
          setTimeRemaining("Expired");
          return;
        }

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [qrData]);

  const fetchScanLogs = async () => {
    if (!qrData?.sessionId) return;

    const result = await getScanLogs(qrData.sessionId);
    if (result.success) {
      setScanLogs(result.data || []);
    }
  };

  const handleGenerateQR = async () => {
    setError(null);
    const result = await generateQR(
      classData.id,
      attendanceDate,
      validityMinutes
    );

    if (result.success) {
      setQrData(result.data);
    } else {
      setError(result.error);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate this QR session?"))
      return;

    const result = await deactivateSession(qrData.sessionId);
    if (result.success) {
      alert("QR session deactivated successfully");
      setQrData(null);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background-grey rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-text-grey">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-text-grey">
          <div>
            <h2 className="text-2xl font-bold text-white">QR Attendance</h2>
            <p className="text-text-grey mt-1">
              {classData.course_code} - {classData.class_code}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-grey" />
          </button>
        </div>

        <div className="p-6">
          {!qrData ? (
            // Generation Form
            <div className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-grey mb-2">
                  Attendance Date
                </label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full bg-bg-secondary border border-text-grey rounded-lg px-4 py-2 text-white outline-0 focus:border-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-grey mb-2">
                  Validity Duration (minutes)
                </label>
                <select
                  value={validityMinutes}
                  onChange={(e) => setValidityMinutes(parseInt(e.target.value))}
                  className="w-full bg-bg-secondary border border-text-grey rounded-lg px-4 py-2 text-white outline-0 focus:border-blue"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <button
                onClick={handleGenerateQR}
                disabled={loading}
                className="w-full bg-blue hover:bg-blue/80 disabled:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    Generate QR Code
                  </>
                )}
              </button>
            </div>
          ) : (
            // QR Display
            <div className="grid md:grid-cols-2 gap-6">
              {/* QR Code Section */}
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg">
                  <img
                    src={qrData.qrCodeDataURL}
                    alt="QR Code"
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border border-text-grey">
                    <span className="text-text-grey flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time Remaining
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        timeRemaining === "Expired"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {timeRemaining || "Loading..."}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border border-text-grey">
                    <span className="text-text-grey flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Students Scanned
                    </span>
                    <span className="font-bold text-blue">
                      {scanLogs.length}
                    </span>
                  </div>

                  <button
                    onClick={handleDeactivate}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Deactivate Session
                  </button>
                </div>
              </div>

              {/* Scan Logs Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Recent Scans
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {scanLogs.length === 0 ? (
                    <div className="text-center py-8 text-text-grey">
                      No scans yet
                    </div>
                  ) : (
                    scanLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg border border-text-grey"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {log.first_name} {log.last_name}
                          </p>
                          <p className="text-sm text-text-grey">
                            {log.matric_no}
                          </p>
                        </div>
                        <div className="text-right">
                          <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
                          <p className="text-xs text-text-grey">
                            {new Date(log.scan_time).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGeneratorModal;
