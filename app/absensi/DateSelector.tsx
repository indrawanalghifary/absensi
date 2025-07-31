
'use client';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDateLabel = (date: string) => {
    const dateObj = new Date(date);
    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    if (date === todayStr) return 'Hari Ini';
    if (date === yesterdayStr) return 'Kemarin';

    return dateObj.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const quickDates = [
    { value: formatDate(yesterday), label: 'Kemarin' },
    { value: formatDate(today), label: 'Hari Ini' },
    { value: formatDate(tomorrow), label: 'Besok' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 space-y-2 lg:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900">Pilih Tanggal</h3>
        <div className="text-sm text-gray-500">
          {getDateLabel(selectedDate)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Tanggal Khusus
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Cepat
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {quickDates.map((date) => (
              <button
                key={date.value}
                onClick={() => onDateChange(date.value)}
                className={`p-2 text-sm font-medium rounded-lg cursor-pointer whitespace-nowrap ${
                  selectedDate === date.value
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {date.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-information-line text-blue-600"></i>
          </div>
          <p className="text-sm text-blue-700">
            Anda dapat memasukkan absensi untuk tanggal yang dipilih. Data akan tersimpan otomatis.
          </p>
        </div>
      </div>
    </div>
  );
}
