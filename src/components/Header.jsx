import { Stethoscope } from "lucide-react";

function Header() {
    return (
        <header className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full shadow-lg mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
                A Hybrid AI and Geospatial Navigation System for
                Automated Patient Triage
            </h1>

            <p className="text-slate-500">
                Describe your symptoms to find the right specialist nearby.
            </p>
        </header>
    );
}

export default Header;