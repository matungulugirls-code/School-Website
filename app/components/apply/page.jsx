'use client';
import { FiRefreshCw, FiArrowRight, FiTrendingUp, FiFileText, FiCheckCircle } from 'react-icons/fi';

const PortalHeader = ({
  stats = null,
  refreshing = false,
  fetchEvents = () => {},
  handleNewEvent = () => {},
}) => {
  const handleRefresh = () => {
    if (refreshing) return;
    fetchEvents(true);
  };

  const showTodayCount = stats && typeof stats.today === 'number';

  return (
    <header className="w-full font-sans">
      <div className="relative bg-white border-b border-[#e8dfd3]">
        {/* Left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-b from-[#172033] via-[#214760] to-[#f2c357]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-7 lg:py-9">
          
          {/* Mobile: Stack everything */}
          <div className="flex flex-col gap-5">
            
            {/* Title Section */}
            <div className="flex-1">
              {/* Tag row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#fcfaf6] border border-[#e8dfd3] rounded-md">
                  <FiFileText className="w-3 h-3 text-[#9a5b1f]" />
                  <span className="text-[10px] font-bold text-[#172033] uppercase tracking-wide">
                    Admissions Portal
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e8dfd3] rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#214760]">Open</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                Matungulu Girls
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#172033] to-[#214760]">
                  Senior School
                </span>
              </h1>

              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Secure digital gateway for student applications &amp; admission coordination.
              </p>

              {/* Motto & Social Proof - Horizontal scroll on mobile */}
              <div className="mt-3 flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg shrink-0">
                  <span className="text-sm">🦅</span>
                  <span className="text-[11px] font-bold text-gray-600">Strive to Excel</span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="w-6 h-6 rounded-full border border-white bg-gray-200 overflow-hidden">
                        <img src={`/demo/${n}.jpg`} alt={`Student ${n}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border border-white bg-[#172033] flex items-center justify-center">
                      <span className="text-[8px] font-black text-white">400+</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-700 flex items-center gap-1">
                    400+ Enrolled
                    <FiTrendingUp className="w-3 h-3 text-[#10b981]" />
                  </p>
                </div>
              </div>
            </div>

            {/* Stats & Actions - Stacked vertically on mobile */}
            <div className="flex flex-col gap-3">
              
              {/* Stats Card */}
              {showTodayCount && (
                <div className="w-full bg-[#fcfaf6] border border-[#e8dfd3] rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#172033] flex items-center justify-center">
                    <FiCheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Today's Applications</p>
                    <p className="text-xl font-black text-[#172033] leading-none">{stats.today}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons - Side by side on mobile */}
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex-1 p-2.5 rounded-xl border border-[#e8dfd3] text-slate-500 hover:text-[#172033] transition active:scale-95 disabled:opacity-30"
                >
                  <FiRefreshCw className={`w-4 h-4 mx-auto ${refreshing ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleNewEvent}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#172033] text-white rounded-xl font-semibold text-xs hover:bg-black transition active:scale-[0.97]"
                >
                  Start Application
                  <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;