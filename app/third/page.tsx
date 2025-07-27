"use client";
import { useRouter } from 'next/navigation';
import { useAppData } from "../context/AppDataContext";

export default function ThirdPage() {
  const router = useRouter();
  const { messages } = useAppData();

  // 找到最近一次用户输入的 body condition（JSON 格式）
  function getLastBodyCondition() {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === 'user') {
        try {
          const obj = JSON.parse(msg.content);
          if (typeof obj === 'object' && obj !== null) {
            return obj;
          }
        } catch {}
      }
    }
    return null;
  }
  const bodyCondition = getLastBodyCondition();

  // 分组展示
  const ppg = bodyCondition ? {
    "Heart Rate": bodyCondition.heartRate,
    "Respiratory Rate": bodyCondition.respiratoryRate,
    "Blood Oxygen Content": bodyCondition.bloodOxygenContent,
  } : {};
  const imu = bodyCondition ? {
    "Movement & Orientation": bodyCondition.movementAndOrientation,
  } : {};
  const temp = bodyCondition ? {
    "Body Temp": bodyCondition.bodyTemp,
  } : {};
  const maybes = bodyCondition ? {
    "Cuff-less BP": bodyCondition.cufflessBP,
    "Single Electrode ECG": bodyCondition.singleElectrodeECG,
  } : {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#222' }}>
      <h1 className="text-3xl font-bold mb-4 drop-shadow-lg">Detailed Body Condition</h1>
      <div className="w-full max-w-2xl rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur-md">
        {!bodyCondition && <div className="text-gray-400">No body condition data found.</div>}
        {bodyCondition && (
          <>
            <div className="mb-6">
              <div className="flex items-center mb-2"><span className="w-2 h-6 bg-pink-400 rounded mr-2"></span><b className="text-lg">PPG</b></div>
              <ul className="mb-4 ml-6 list-disc">
                {Object.entries(ppg).map(([k, v]) => (
                  <li key={k} className="mb-1">
                    <span className="font-semibold">{k}</span>
                    {v !== undefined && v !== null && v !== "" ? <>: <span className="text-pink-600 font-bold">{typeof v === 'object' && v !== null && 'value' in v ? `${v.value} ${v.unit || ''}`.trim() : v}</span></> : null}
                  </li>
                ))}
              </ul>
              <div className="flex items-center mb-2"><span className="w-2 h-6 bg-blue-400 rounded mr-2"></span><b className="text-lg">IMU</b></div>
              <ul className="mb-4 ml-6 list-disc">
                {Object.entries(imu).map(([k, v]) => (
                  <li key={k} className="mb-1">
                    <span className="font-semibold">{k}</span>
                    {v !== undefined && v !== null && v !== "" ? <>: <span className="text-blue-600 font-bold">{typeof v === 'object' && v !== null && 'value' in v ? `${v.value} ${v.unit || ''}`.trim() : v}</span></> : null}
                  </li>
                ))}
              </ul>
              <div className="flex items-center mb-2"><span className="w-2 h-6 bg-yellow-400 rounded mr-2"></span><b className="text-lg">Temperature Sensor</b></div>
              <ul className="mb-4 ml-6 list-disc">
                {Object.entries(temp).map(([k, v]) => (
                  <li key={k} className="mb-1">
                    <span className="font-semibold">{k}</span>
                    {v !== undefined && v !== null && v !== "" ? <>: <span className="text-yellow-600 font-bold">{typeof v === 'object' && v !== null && 'value' in v ? `${v.value} ${v.unit || ''}`.trim() : v}</span></> : null}
                  </li>
                ))}
              </ul>
              <div className="flex items-center mb-2"><span className="w-2 h-6 bg-green-400 rounded mr-2"></span><b className="text-lg">Maybes</b></div>
              <ul className="mb-4 ml-6 list-disc">
                {Object.entries(maybes).map(([k, v]) => (
                  <li key={k} className="mb-1">
                    <span className="font-semibold">{k}</span>
                    {v !== undefined && v !== null && v !== "" ? <>: <span className="text-green-600 font-bold">{typeof v === 'object' && v !== null && 'value' in v ? `${v.value} ${v.unit || ''}`.trim() : v}</span></> : null}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-4 mt-8">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow-lg"
          onClick={() => router.push('/second')}
        >
          Previous Page
        </button>
      </div>
    </div>
  );
} 