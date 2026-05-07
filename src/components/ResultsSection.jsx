import {
    Activity,
    MapPin,
    Car,
    Navigation,
} from "lucide-react";

function ResultsSection({ result }) {
    return (
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
                                    <Activity className="w-3 h-3" />
                                    Hybrid System Analysis:
                                </p>

                                <p className="text-slate-600">
                                    {result.analysis.validation}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Doctors */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Nearest Specialists
                </h3>

                {result.doctors.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">

                        {result.doctors.map((doc) => (
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
                                                    <Car className="w-3 h-3" />
                                                    {doc.drivingTimeMins} min drive
                                                </span>

                                                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                    <Navigation className="w-3 h-3" />
                                                    {doc.drivingDistanceKm} km
                                                </span>

                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="text-center p-8 bg-white rounded-xl border border-slate-200 border-dashed text-slate-500">
                        No doctors found nearby for this specialty.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResultsSection;