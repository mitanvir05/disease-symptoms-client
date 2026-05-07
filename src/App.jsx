import { useState, useRef } from "react";
import axios from "axios";

import Header from "./components/Header";
import SymptomForm from "./components/SymptomForm";
import ResultsSection from "./components/ResultsSection";

function App() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Not shared");

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

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

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please use Google Chrome."
      );
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!symptoms.trim()) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/analyze",
        {
          symptoms,
          userLocation: location,
        }
      );

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

        <Header />

        <SymptomForm
          symptoms={symptoms}
          setSymptoms={setSymptoms}
          loading={loading}
          isListening={isListening}
          toggleVoiceInput={toggleVoiceInput}
          handleGetLocation={handleGetLocation}
          location={location}
          locationStatus={locationStatus}
          handleSubmit={handleSubmit}
        />

        {result && <ResultsSection result={result} />}

      </div>
    </div>
  );
}

export default App;