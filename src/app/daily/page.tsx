"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Star, RefreshCw } from "lucide-react";

const zodiacSigns = [
  { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire" },
  { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth" },
  { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20", element: "Air" },
  { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water" },
  { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire" },
  { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth" },
  { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air" },
  { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water" },
  { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21", element: "Fire" },
  { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19", element: "Earth" },
  { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air" },
  { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water" },
];

const horoscopes: Record<string, string[]> = {
  Aries: [
    "Today brings a surge of energy that pushes you toward new beginnings. Trust your instincts and take that bold step you've been considering. A surprise encounter may spark an exciting opportunity.",
    "Your natural leadership shines bright today. Others are looking to you for direction, so don't hesitate to take charge. Romance is in the air this evening.",
    "A creative burst hits you out of nowhere. Channel this energy into a passion project. Financial matters look favorable — trust your gut on that investment decision.",
  ],
  Taurus: [
    "Stability is your superpower today. While others rush, your patient approach wins the day. A friend may need your practical wisdom — be there for them.",
    "Your senses are heightened today. Enjoy the finer things — a good meal, beautiful music, nature. Love blooms in unexpected places.",
    "Financial surprises are coming your way. Stay grounded but open to new possibilities. Your persistence is about to pay off in a big way.",
  ],
  Gemini: [
    "Your communication skills are at their peak. Important conversations lead to breakthroughs. A social gathering brings exciting news.",
    "Curiosity leads you down a fascinating path today. Don't be afraid to explore new ideas. A sibling or close friend has news that changes your perspective.",
    "Your wit and charm are irresistible today. Network, mingle, and share your ideas. An unexpected connection becomes valuable.",
  ],
  Cancer: [
    "Home and family take center stage today. A cozy evening with loved ones recharges your spirit. Trust your intuition about a domestic matter.",
    "Your nurturing nature draws people to you. A friend needs your emotional support. Don't forget to care for yourself too — you deserve it.",
    "Memories from the past surface, bringing clarity to a current situation. Your home environment could use a refresh — small changes bring big joy.",
  ],
  Leo: [
    "The spotlight finds you naturally today. Your confidence inspires others, but remember to share the stage. A creative project gains momentum.",
    "Your generosity comes back tenfold. A kind gesture today creates ripples of goodwill. Romance is passionate and intense tonight.",
    "Leadership opportunities arise unexpectedly. Your warmth and enthusiasm win hearts. Treat yourself to something special — you've earned it.",
  ],
  Virgo: [
    "Your attention to detail catches something others missed. This could be a game-changer at work. Health improvements start with small, consistent steps.",
    "Organization is your superpower today. Tackle that project you've been putting off. A health routine you start today becomes a lifelong habit.",
    "Your analytical mind solves a complex problem. Help someone who's struggling — your practical advice is exactly what they need. Self-care is essential.",
  ],
  Libra: [
    "Balance returns to your relationships today. A conversation clears the air and brings harmony. Your aesthetic eye identifies a beautiful opportunity.",
    "Diplomacy is your strength — use it to resolve a tense situation. Art and beauty inspire you deeply. Love is sweet and harmonious.",
    "Partnerships flourish today. Your ability to see all sides makes you invaluable. A creative collaboration leads to something extraordinary.",
  ],
  Scorpio: [
    "Your intensity is magnetic today. People are drawn to your depth and passion. A secret or hidden truth comes to light — embrace the revelation.",
    "Transformation is your theme today. Let go of what no longer serves you. Your investigative nature uncovers something valuable.",
    "Your intuition is razor-sharp. Trust those gut feelings — they're guiding you right. A deep conversation strengthens a bond.",
  ],
  Sagittarius: [
    "Adventure calls! Say yes to new experiences today. Your optimism opens doors that seemed closed. A philosophical insight changes your outlook.",
    "Your adventurous spirit is at its peak. Plan a trip or explore a new interest. A foreign connection brings exciting possibilities.",
    "Freedom is essential today. Break free from routines that constrain you. Your enthusiasm is contagious — spread joy wherever you go.",
  ],
  Capricorn: [
    "Your ambition pays off today. A career milestone is within reach — keep pushing. Your discipline inspires someone younger or less experienced.",
    "Hard work yields tangible results. A financial goal is closer than you think. Don't be afraid to delegate — you don't have to do everything alone.",
    "Your mountain-climbing spirit reaches new heights. A mentor appears when you need one most. Celebrate your achievements, no matter how small.",
  ],
  Aquarius: [
    "Your innovative ideas are ahead of their time. Share them boldly — the world is ready. A group project leads to an unexpected friendship.",
    "Technology and progress align with your vision today. Your humanitarian heart is touched by a cause. Break a rule that no longer makes sense.",
    "Your uniqueness is your greatest asset. An unconventional approach solves a problem. Community and friendship bring deep fulfillment.",
  ],
  Pisces: [
    "Your imagination is especially vivid today. Creative projects flow effortlessly. A dream or intuition carries an important message — pay attention.",
    "Your empathy connects you deeply with others. A spiritual insight brings peace. Music and art speak to your soul in profound ways.",
    "Your psychic abilities are heightened. Trust your dreams and visions. A compassionate act today creates beautiful karma.",
  ],
};

const elementColors: Record<string, string> = {
  Fire: "from-red-400 to-orange-400",
  Earth: "from-green-400 to-emerald-400",
  Air: "from-sky-400 to-blue-400",
  Water: "from-blue-400 to-indigo-400",
};

const elementBg: Record<string, string> = {
  Fire: "bg-red-50 border-red-200",
  Earth: "bg-green-50 border-green-200",
  Air: "bg-sky-50 border-sky-200",
  Water: "bg-blue-50 border-blue-200",
};

export default function DailyPage() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [horoscopeIndex, setHoroscopeIndex] = useState(0);
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    setToday(
      now.toLocaleDateString("en-AU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
    // Use date as seed for consistent daily horoscope
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
    );
    setHoroscopeIndex(dayOfYear % 3);
  }, []);

  const refreshHoroscope = () => {
    setHoroscopeIndex((prev) => (prev + 1) % 3);
  };

  const selectedData = zodiacSigns.find((s) => s.name === selectedSign);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4 transition"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">✨</span>
                Daily
              </h1>
              <p className="text-gray-500 mt-1">
                Your daily dose of cosmic guidance and inspiration
              </p>
            </div>
            <div className="text-sm text-gray-400 bg-white px-4 py-2 rounded-full border border-gray-100">
              {today}
            </div>
          </div>
        </div>

        {/* Zodiac Selection */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="text-yellow-500" size={22} />
            Choose Your Zodiac Sign
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.name}
                onClick={() => setSelectedSign(sign.name)}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-center group ${
                  selectedSign === sign.name
                    ? `bg-gradient-to-br ${elementColors[sign.element]} text-white border-transparent shadow-lg scale-105`
                    : `${elementBg[sign.element]} hover:shadow-md hover:scale-102 border-transparent`
                }`}
              >
                <div className="text-3xl mb-1">{sign.symbol}</div>
                <div
                  className={`text-sm font-bold ${
                    selectedSign === sign.name ? "text-white" : "text-gray-800"
                  }`}
                >
                  {sign.name}
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    selectedSign === sign.name
                      ? "text-white/80"
                      : "text-gray-400"
                  }`}
                >
                  {sign.dates}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Horoscope Display */}
        {selectedSign && selectedData && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              {/* Horoscope Header */}
              <div
                className={`bg-gradient-to-r ${elementColors[selectedData.element]} p-8 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{selectedData.symbol}</div>
                    <div>
                      <h2 className="text-3xl font-bold">{selectedData.name}</h2>
                      <p className="text-white/80">
                        {selectedData.dates} • {selectedData.element} Sign
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={refreshHoroscope}
                    className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition"
                    title="Get another reading"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              </div>

              {/* Horoscope Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-yellow-500" size={20} />
                  <h3 className="text-lg font-bold text-gray-900">
                    Today&apos;s Reading
                  </h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {horoscopes[selectedSign]?.[horoscopeIndex]}
                </p>

                {/* Lucky Details */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="bg-yellow-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-1">🍀</div>
                    <div className="text-xs text-gray-500 font-medium">
                      Lucky Number
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {(selectedSign.charCodeAt(0) + horoscopeIndex * 7) % 9 + 1}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-1">🎨</div>
                    <div className="text-xs text-gray-500 font-medium">
                      Lucky Color
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {["Gold", "Crimson", "Silver", "Emerald", "Ruby", "Sapphire"][
                        (selectedSign.charCodeAt(0) + horoscopeIndex) % 6
                      ]}
                    </div>
                  </div>
                  <div className="bg-pink-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-1">💕</div>
                    <div className="text-xs text-gray-500 font-medium">
                      Compatibility
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {zodiacSigns[
                        (zodiacSigns.findIndex((s) => s.name === selectedSign) +
                          horoscopeIndex +
                          3) %
                          12
                      ]?.name}
                    </div>
                  </div>
                </div>

                {/* Motivational CTA */}
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-yellow-50 rounded-2xl p-6 border border-purple-100">
                  <h4 className="font-bold text-gray-900 mb-2">
                    ✍️ Turn Your Insight Into a Story
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Feeling inspired? Share your cosmic journey with the WebSQ
                    community.
                  </p>
                  <Link
                    href="/write"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition"
                  >
                    Write Your Post
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedSign && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔮</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Select Your Sign Above
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Choose your zodiac sign to receive today&apos;s personalized horoscope
              and cosmic guidance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
