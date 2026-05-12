'use client';

export default function Error({ error, reset }) {
  return (
    <div className="error-state" style={{ minHeight: '60vh' }}>
      <span className="error-state__icon">💥</span>
      <h2 className="error-state__title">Đã xảy ra lỗi</h2>
      <p className="error-state__desc">
        {error?.message || 'Có gì đó không ổn. Vui lòng thử lại.'}
      </p>
      <button className="error-state__retry" onClick={reset}>
        Thử lại
      </button>
    </div>
  );
}
