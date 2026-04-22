import { useState, useRef } from "react";
import axios from "axios";
import {
  Stethoscope,
  MapPin,
  Activity,
  AlertCircle,
  Loader2,
  Navigation,
  Car,
  Mic,
  MicOff
} from "lucide-react";

function App() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Not shared");

  // --- NEW: Voice-to-Text State ---
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // 1. Function to get User's Location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocationStatus("Locating...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("Location Found ✅");
      },
      () => {
        setLocationStatus("Permission Denied ❌");
      }
    );
  };

  // --- NEW: Voice Recognition Function ---
  const toggleVoiceInput = () => {
    if (isListening) {
      // Stop listening if already active
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let currentTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setSymptoms(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // 2. Function to Submit Data to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    // Stop listening if user submits while mic is on
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/api/analyze", {
        symptoms,
        userLocation: location,
      });

      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze symptoms. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full shadow-lg mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            A Hybrid AI and Geospatial Routing System for
            Automated Patient Triage
          </h1>
          <p className="text-slate-500">
            Describe your symptoms to find the right specialist nearby.
          </p>
        </header>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/*  Textarea with embedded Mic Button --- */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  What are your symptoms?
                </label>
                {isListening && (
                  <span className="text-xs font-bold text-red-500 animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Listening...
                  </span>
                )}
              </div>

              <div className="relative">
                <textarea
                  className={`w-full p-4 pr-14 rounded-xl border transition h-32 resize-none ${isListening
                    ? "border-red-300 ring-4 ring-red-50 bg-red-50/10"
                    : "border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  placeholder="Ex: I have a severe headache on one side, sensitivity to light, and nausea..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />

                {/* Microphone Toggle Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`absolute bottom-3 right-3 p-2.5 rounded-full transition-all duration-200 ${isListening
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-md animate-pulse"
                    : "bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600"
                    }`}
                  title={isListening ? "Stop listening" : "Click to speak"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Location Button */}
              <button
                type="button"
                onClick={handleGetLocation}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${location
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                <MapPin className="w-4 h-4" />
                {locationStatus === "Not shared"
                  ? "Enable Location for Better Results"
                  : locationStatus}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !symptoms}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Symptoms
                    <Activity className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* AI Diagnosis Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg shadow-sm ${result.analysis.specialty === "General Medicine"
                    ? "bg-orange-100"
                    : "bg-blue-100"
                    }`}
                >
                  <Activity
                    className={`w-6 h-6 ${result.analysis.specialty === "General Medicine"
                      ? "text-orange-600"
                      : "text-blue-600"
                      }`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Recommended: {result.analysis.specialty}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wide">
                          Urgency: {result.analysis.urgency}
                        </span>

                        {result.analysis.validation && (
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${result.analysis.validation.includes("Consensus")
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }`}
                          >
                            {result.analysis.validation.includes("Consensus")
                              ? "✅ Verified"
                              : "⚠️ AI-ML Divergence"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 mt-3 leading-relaxed">
                    {result.analysis.reasoning}
                  </p>

                  {result.analysis.validation && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
                      <p className="font-semibold text-slate-700 mb-1 flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Hybrid System Analysis:
                      </p>
                      <p className="text-slate-600">
                        {result.analysis.validation}
                      </p> 
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Doctor List */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Nearest Specialists
              </h3>

              {result.doctors.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {result.doctors.map((doc) => {
                    return (
                      <div
                        key={doc._id}
                        className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-2">
                            <h4 className="font-bold text-slate-800">
                              {doc.name}
                            </h4>
                            <p className="text-sm text-blue-600 font-medium mb-1">
                              {doc.specialty}
                            </p>
                            <p className="text-sm text-slate-500 line-clamp-2">
                              {doc.hospital}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded whitespace-nowrap">
                              {doc.city}
                            </span>

                            {doc.drivingTimeMins && doc.drivingDistanceKm && (
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1 whitespace-nowrap">
                                  <Car className="w-3 h-3" /> {doc.drivingTimeMins} min drive
                                </span>
                                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                  <Navigation className="w-3 h-3" /> {doc.drivingDistanceKm} km
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-xl border border-slate-200 border-dashed text-slate-500">
                  No doctors found nearby for this specialty.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;