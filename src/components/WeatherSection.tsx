import { getTranslations } from 'next-intl/server';

const LAT = 23.1227066;
const LNG = -82.3888396;

type WeatherCurrent = {
  time?: string;
  temperature_2m?: number;
  apparent_temperature?: number;
  relative_humidity_2m?: number;
  wind_speed_10m?: number;
  weather_code?: number;
};

type WeatherDaily = {
  time?: string[];
  weather_code?: number[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  precipitation_probability_max?: (number | null)[];
  uv_index_max?: (number | null)[];
  wind_speed_max?: (number | null)[];
};

type WeatherAlert = {
  event?: string;
  description?: string;
};

type WeatherPayload = {
  current?: WeatherCurrent;
  daily?: WeatherDaily;
  alerts?: WeatherAlert[];
};

const WMO_GROUPS: Record<string, string> = {
  '0': 'clear',
  '1': 'clear',
  '2': 'partly',
  '3': 'cloudy',
  '45': 'fog',
  '48': 'fog',
  '51': 'drizzle',
  '53': 'drizzle',
  '55': 'drizzle',
  '56': 'drizzle',
  '57': 'drizzle',
  '61': 'rain',
  '63': 'rain',
  '65': 'rain',
  '66': 'rain',
  '67': 'rain',
  '71': 'snow',
  '73': 'snow',
  '75': 'snow',
  '77': 'snow',
  '80': 'showers',
  '81': 'showers',
  '82': 'showers',
  '85': 'snow',
  '86': 'snow',
  '95': 'thunder',
  '96': 'thunder',
  '99': 'thunder',
};

function groupOf(code: number): string {
  return WMO_GROUPS[String(code)] || 'partly';
}

const GROUP_EMOJI: Record<string, string> = {
  clear: '☀️',
  partly: '⛅',
  cloudy: '☁️',
  fog: '🌫️',
  drizzle: '🌦️',
  rain: '🌧️',
  snow: '🌨️',
  showers: '⛈️',
  thunder: '🌩️',
};

// 中到大雨（WMO 63/65/66/67 连续雨，81/82 强阵雨）
const HEAVY_RAIN = new Set([63, 65, 66, 67, 81, 82]);
// 小雨/毛毛雨/一般阵雨（61、80、51-57）
const isHeavy = (code: number) => HEAVY_RAIN.has(code);
const isLightRainGroup = (code: number) => {
  const g = groupOf(code);
  return g === 'rain' || g === 'drizzle' || g === 'showers';
};
const isRainGroup = (code: number) => groupOf(code) === 'rain' || groupOf(code) === 'drizzle' || groupOf(code) === 'showers';

async function getWeather(): Promise<WeatherPayload | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_max&timezone=America%2FHavana&forecast_days=7&wind_speed_unit=kmh&temperature_unit=celsius&alerts=true`;
  try {
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) return null;
    return (await res.json()) as WeatherPayload;
  } catch {
    return null;
  }
}

export default async function WeatherSection() {
  const t = await getTranslations('weather');
  const data = await getWeather();

  if (!data?.current || !data?.daily) {
    return (
      <section className="section-padding">
        <div className="max-w-4xl mx-auto text-center py-10" style={{ color: 'var(--text-muted)' }}>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            {t('title')}
          </h2>
          <p>{t('unavailable')}</p>
        </div>
      </section>
    );
  }

  const current = data.current;
  const daily = data.daily;
  const now = current.time ? current.time.slice(11, 16) : '';

  const codeNow = current.weather_code ?? 0;
  const codeToday = daily.weather_code?.[0] ?? codeNow;
  const kindNow = groupOf(codeNow);
  const kindToday = groupOf(codeToday);
  const heavyNow = isHeavy(codeNow);
  const heavyToday = isHeavy(codeToday);
  const thunderNow = kindNow === 'thunder';
  const thunderToday = kindToday === 'thunder';
  const snowNow = kindNow === 'snow';
  const snowToday = kindToday === 'snow';
  const fogNow = kindNow === 'fog';
  const fogToday = kindToday === 'fog';

  const heavyCond = heavyNow || heavyToday;
  const thunderCond = thunderNow || thunderToday;
  const snowCond = snowNow || snowToday;
  const rainDayCond = isRainGroup(codeNow) || isRainGroup(codeToday);
  const lightCond = rainDayCond && !heavyCond;

  const curTemp = current.temperature_2m ?? null;
  const feels = current.apparent_temperature ?? null;
  const max0 = daily.temperature_2m_max?.[0] ?? null;
  const min0 = daily.temperature_2m_min?.[0] ?? null;
  const prob0 = daily.precipitation_probability_max?.[0] ?? null;
  const uv0 = daily.uv_index_max?.[0] ?? null;
  const windNow = current.wind_speed_10m ?? 0;
  const windMax0 = daily.wind_speed_max?.[0] ?? 0;

  const heat = (curTemp !== null && curTemp >= 32) || (feels !== null && feels >= 33) || (max0 !== null && max0 >= 32);
  const cold = max0 !== null && max0 <= 10;
  const bigDiff = max0 !== null && min0 !== null && max0 - min0 > 8;
  const gale = windNow >= 50 || windMax0 >= 50;
  const rainChance = prob0 !== null && prob0 >= 60;

  // ---- 出行穿搭（单条，按优先级）----
  let dressKey: string | null = null;
  if (heavyCond) dressKey = 'dHeavy';
  else if (snowCond) dressKey = 'dSnow';
  else if (heat) dressKey = 'dHot';
  else if (cold) dressKey = 'dCold';
  else if (bigDiff) dressKey = 'dLayers';

  // ---- 游玩安排（单条，按优先级）----
  let planKey: string | null = null;
  if (thunderCond) planKey = 'pThunder';
  else if (snowCond) planKey = 'pSnow';
  else if (heavyCond) planKey = 'pHeavy';
  else if (lightCond) planKey = 'pLight';
  else if (rainChance) planKey = 'pChance';
  else if (heat) planKey = 'pHot';
  else if (kindToday === 'cloudy') planKey = 'pOvercast';
  else if (kindToday === 'clear' || kindToday === 'partly') planKey = 'pClear';

  // ---- 随身物品（可叠加多条）----
  const gearKeys: string[] = [];
  if (heavyCond) gearKeys.push('gHeavy');
  else if (lightCond || rainChance) gearKeys.push('gUmbrella');
  if (snowCond) gearKeys.push('gWarm');
  else if (cold) gearKeys.push('gWarm');
  if (uv0 !== null && uv0 >= 5) gearKeys.push('gUv');
  if (heat) gearKeys.push('gWater');

  // ---- 风险提醒（有才显示）----
  const riskItems: { tKey: string; values?: Record<string, string> }[] = [];
  const alerts = (data.alerts ?? []).filter((a) => a.event).slice(0, 3);
  for (const a of alerts) {
    riskItems.push({ tKey: 'riskAlert', values: { event: a.event as string } });
  }
  if (thunderCond) riskItems.push({ tKey: 'rThunder' });
  if (heavyCond) riskItems.push({ tKey: 'rHeavy' });
  if (gale) riskItems.push({ tKey: 'rGale' });
  if (fogNow || fogToday) riskItems.push({ tKey: 'rFog' });

  const hasAdvice = dressKey !== null || planKey !== null || gearKeys.length > 0;
  const groupNow = groupOf(codeNow);

  const sectionLabel = (emoji: string, label: string) => (
    <p className="flex items-center gap-2 font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
      <span>{emoji}</span>
      {label}
    </p>
  );

  return (
    <section id="weather" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-4" style={{ background: 'var(--accent)' }} />
        <p className="mb-8 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('subtitle')}
        </p>

        {/* 实况卡 */}
        <div
          className="rounded-2xl p-6 sm:p-8 mb-6"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-5">
              <span className="text-6xl leading-none">{GROUP_EMOJI[groupNow]}</span>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {curTemp !== null ? Math.round(curTemp) : '—'}
                  </span>
                  <span className="text-2xl" style={{ color: 'var(--text-secondary)' }}>°C</span>
                </div>
                <p className="mt-1 font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t(`groups.${groupNow}`)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 sm:pl-6 sm:border-l" style={{ borderColor: 'var(--border-color)' }}>
              {[
                { label: t('feels'), value: feels !== null ? `${Math.round(feels)}°` : '—' },
                { label: t('humidity'), value: `${current.relative_humidity_2m ?? '—'}%` },
                { label: t('wind'), value: `${Math.round(windNow)} km/h` },
                { label: t('uv'), value: uv0 !== null ? String(Math.round(uv0)) : '—' },
                { label: t('precipProb'), value: prob0 !== null ? `${prob0}%` : '—' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg px-3 py-2" style={{ background: 'var(--bg-card, var(--bg-secondary))' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                  <p className="font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          {now && (
            <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              {t('updated')} {now}
            </p>
          )}
        </div>

        {/* 智能出行建议 */}
        {(hasAdvice || riskItems.length > 0) && (
          <div
            className="rounded-2xl p-6 sm:p-7 mb-6"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            {riskItems.length > 0 && (
              <div
                className="rounded-xl px-4 py-3 mb-5"
                style={{ background: 'rgba(220, 38, 38, 0.07)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
              >
                <p className="flex items-center gap-2 font-bold text-sm mb-1.5" style={{ color: '#b91c1c' }}>
                  <span>⚠️</span>
                  {t('advice.riskLabel')}
                </p>
                <ul className="space-y-1.5 text-sm" style={{ color: '#9b1c1c' }}>
                  {riskItems.map((item, idx) => (
                    <li key={idx}>
                      {item.values ? t(`advice.${item.tKey}`, item.values) : t(`advice.${item.tKey}`)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-3">
              {dressKey && (
                <div className="rounded-xl px-4 py-4" style={{ background: 'var(--bg-card, var(--bg-secondary))' }}>
                  {sectionLabel('🧥', t('advice.dressLabel'))}
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {t(`advice.${dressKey}`)}
                  </p>
                </div>
              )}
              {planKey && (
                <div className="rounded-xl px-4 py-4" style={{ background: 'var(--bg-card, var(--bg-secondary))' }}>
                  {sectionLabel('🗺️', t('advice.planLabel'))}
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {t(`advice.${planKey}`)}
                  </p>
                </div>
              )}
              {gearKeys.length > 0 && (
                <div className="rounded-xl px-4 py-4" style={{ background: 'var(--bg-card, var(--bg-secondary))' }}>
                  {sectionLabel('🎒', t('advice.gearLabel'))}
                  <ul className="space-y-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {gearKeys.map((key) => (
                      <li key={key} className="flex gap-2">
                        <span className="shrink-0" style={{ color: 'var(--accent)' }}>·</span>
                        <span>{t(`advice.${key}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {!hasAdvice && riskItems.length === 0 && (
          <p className="text-center text-sm py-2 mb-6" style={{ color: 'var(--text-muted)' }}>
            {t('advice.empty')}
          </p>
        )}

        {/* 7 日预报 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {(daily.time ?? []).map((day, i) => {
            const max = daily.temperature_2m_max?.[i];
            const min = daily.temperature_2m_min?.[i];
            const prob = daily.precipitation_probability_max?.[i];
            const group = groupOf(daily.weather_code?.[i] ?? 0);
            const dow = new Date(`${day}T00:00:00Z`).getUTCDay();
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
            return (
              <div
                key={day}
                className="rounded-xl p-3 sm:p-4 text-center"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              >
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  {i === 0 ? t('today') : t(`days.${days[dow]}`)}
                </p>
                <div className="my-2.5 text-2xl sm:text-3xl">{GROUP_EMOJI[group]}</div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {max != null ? `${Math.round(max)}°` : '—'}
                  <span style={{ color: 'var(--text-muted)' }}> / {min != null ? `${Math.round(min)}°` : '—'}</span>
                </p>
                {prob != null && (
                  <p className="mt-1.5 text-xs" style={{ color: prob >= 60 ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {t('precipProb')} {prob}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
