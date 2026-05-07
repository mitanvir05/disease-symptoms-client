import {
    MapPin,
    Activity,
    Loader2,
    Mic,
    MicOff,
} from "lucide-react";

function SymptomForm({
    symptoms,
    setSymptoms,
    loading,
    isListening,
    toggleVoiceInput,
    handleGetLocation,
    location,
    locationStatus,
    handleSubmit,
}) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-4">

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

                        <button
                            type="button"
                            onClick={toggleVoiceInput}
                            className={`absolute bottom-3 right-3 p-2.5 rounded-full transition-all duration-200 ${isListening
                                ? "bg-red-500 text-white hover:bg-red-600 shadow-md animate-pulse"
                                : "bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600"
                                }`}
                        >
                            {isListening ? (
                                <MicOff className="w-5 h-5" />
                            ) : (
                                <Mic className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

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
    );
}

export default SymptomForm;