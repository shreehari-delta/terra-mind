import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';
import GeoMap from '../components/GeoMap';
import { 
  Globe2, Activity, Satellite, AlertTriangle, 
  LogOut, Map as MapIcon, Settings, Layers,
  UploadCloud, Loader2, FileCheck
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  // Upload & Analysis State
  const [_file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // The api client automatically attaches the JWT token from Zustand
      const { data } = await api.post('/ai/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setResults(data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.details || 'Analysis failed. Is the Python engine running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <Globe2 className="w-8 h-8 text-teal-500" />
          <span className="text-xl font-bold text-slate-100 tracking-wide">TerraMind</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20">
            <Activity className="w-5 h-5" /> Overview
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors">
            <MapIcon className="w-5 h-5" /> Map Viewer
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors">
            <Layers className="w-5 h-5" /> Pipelines
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="px-4 py-3 mb-2 rounded-lg bg-slate-900 border border-slate-800">
            <p className="text-sm font-medium text-slate-200">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Disconnect
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center px-8 justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Intelligence Overview</h1>
            <p className="text-sm text-slate-400">Secure connection to Node.js & Python Engine established</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              AI Engine Online
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                  <Satellite className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Scans</p>
                  <h3 className="text-2xl font-bold text-slate-100">{results ? '1,249' : '1,248'}</h3>
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 w-3/4 h-full"></div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-lg">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Engine Status</p>
                  <h3 className="text-2xl font-bold text-slate-100">{loading ? 'Processing...' : 'Standby'}</h3>
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${loading ? 'bg-teal-400 w-full animate-pulse' : 'bg-teal-600 w-1/2'}`}></div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-500/10 text-orange-400 rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Anomalies Detected</p>
                  <h3 className="text-2xl font-bold text-slate-100">0</h3>
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 w-0 h-full"></div>
              </div>
            </div>
          </div>

          {/* Analysis Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Uploader Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
              <input 
                type="file" 
                accept=".tif,.tiff" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
                  <p className="text-slate-300">Extracting geospatial matrices...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">Upload GeoTIFF</h3>
                  <p className="text-slate-400 text-sm max-w-sm mb-6">
                    Securely stream satellite imagery through the Node.js gateway to the Python AI engine for localized geospatial processing.
                  </p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-teal-600 hover:bg-teal-500 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
                  >
                    Select Satellite Image
                  </button>
                </>
              )}
              
              {error && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg text-sm w-full">
                  {error}
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">
                Analysis Telemetry
              </h3>
              
              {results ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-teal-400 bg-teal-500/10 p-3 rounded-lg border border-teal-500/20">
                    <FileCheck className="w-5 h-5" />
                    <span className="font-medium">Analysis Complete</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Target Source</p>
                      <p className="text-slate-200 font-medium truncate">{results.filename}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Spatial Resolution</p>
                      <p className="text-slate-200 font-medium">{results.width} x {results.height} px</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Coordinate Ref System</p>
                      <p className="text-slate-200 font-medium">{results.crs}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Mean Pixel Density</p>
                      <p className="text-slate-200 font-medium">{results.mean_pixel_value?.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-slate-500 text-sm mb-2">Geospatial Bounds</p>
                    <div className="bg-slate-950 rounded-lg p-3 text-xs text-slate-400 font-mono">
                      N: {results.bounds.top.toFixed(4)} | S: {results.bounds.bottom.toFixed(4)}<br/>
                      E: {results.bounds.right.toFixed(4)} | W: {results.bounds.left.toFixed(4)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[250px] flex items-center justify-center">
                  <p className="text-slate-500 text-sm">Awaiting data stream...</p>
                </div>
              )}

              {results && (
            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4">Geospatial Footprint</h3>
              <GeoMap boundsData={results.bounds} />
            </div>
          )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}