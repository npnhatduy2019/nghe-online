/**
 * Format seconds to "M:SS" or "H:MM:SS" string.
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';

  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/**
 * Format seconds to a human-readable duration string.
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} giờ ${m} phút`;
  return `${m} phút`;
}
